'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Layers,
  GitBranch,
  ListTodo,
  Shield,
  ArrowRight,
  CornerDownLeft,
  Hash,
  Loader2,
  Settings2,
} from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  subtitle: string
  category: 'phase' | 'task' | 'repo' | 'compliance' | 'page'
  href?: string
  icon: React.ElementType
}

const pages: SearchResult[] = [
  { id: 'dashboard', title: 'Dashboard', subtitle: 'Overview and stats', category: 'page', href: '/', icon: Layers },
  { id: 'phases', title: 'Phases', subtitle: 'Development phases', category: 'page', href: '/phases', icon: Layers },
  { id: 'repos', title: 'Repositories', subtitle: 'GitHub repositories', category: 'page', href: '/repos', icon: GitBranch },
  { id: 'tasks', title: 'Tasks', subtitle: 'Task board', category: 'page', href: '/tasks', icon: ListTodo },
  { id: 'compliance', title: 'Compliance', subtitle: 'Regulatory tracking', category: 'page', href: '/compliance', icon: Shield },
  { id: 'manage', title: 'Manage', subtitle: 'Add, edit, delete content', category: 'page', href: '/manage', icon: Settings2 },
]

// Fetch search data from API
async function fetchSearchData(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []

  const searchTerm = query.toLowerCase()
  const results: SearchResult[] = []

  // Fetch all data in parallel
  const [tasksRes, phasesRes, reposRes, complianceRes] = await Promise.all([
    fetch('/api/v1/tasks').then(r => r.json()).catch(() => []),
    fetch('/api/v1/phases').then(r => r.json()).catch(() => []),
    fetch('/api/v1/repositories').then(r => r.json()).catch(() => []),
    fetch('/api/v1/compliance').then(r => r.json()).catch(() => ({ checklist: [], tokens: [] })),
  ])

  // Search pages first
  pages.forEach((page) => {
    if (page.title.toLowerCase().includes(searchTerm) || 
        page.subtitle.toLowerCase().includes(searchTerm)) {
      results.push(page)
    }
  })

  // Search phases
  phasesRes.forEach((phase: any) => {
    if (phase.name?.toLowerCase().includes(searchTerm) ||
        phase.focus?.toLowerCase().includes(searchTerm)) {
      results.push({
        id: `phase-${phase.id}`,
        title: `Phase ${phase.id}: ${phase.name}`,
        subtitle: phase.focus || '',
        category: 'phase',
        href: '/phases',
        icon: Layers,
      })
    }
    // Search deliverables
    phase.deliverables?.forEach((d: any) => {
      if (d.name?.toLowerCase().includes(searchTerm)) {
        results.push({
          id: `deliverable-${phase.id}-${d.name}`,
          title: d.name,
          subtitle: `Phase ${phase.id} deliverable`,
          category: 'phase',
          href: '/phases',
          icon: Hash,
        })
      }
    })
  })

  // Search tasks
  tasksRes.forEach((task: any) => {
    if (task.title?.toLowerCase().includes(searchTerm) ||
        task.id?.toLowerCase().includes(searchTerm)) {
      results.push({
        id: `task-${task.id}`,
        title: `${task.id}: ${task.title}`,
        subtitle: `Phase ${task.phase_id} • ${formatRole(task.role)} • ${task.status}`,
        category: 'task',
        href: '/tasks',
        icon: ListTodo,
      })
    }
  })

  // Search repos
  reposRes.forEach((repo: any) => {
    if (repo.name?.toLowerCase().includes(searchTerm) ||
        repo.description?.toLowerCase().includes(searchTerm)) {
      results.push({
        id: `repo-${repo.name}`,
        title: repo.name,
        subtitle: repo.description || 'No description',
        category: 'repo',
        href: repo.url || '/repos',
        icon: GitBranch,
      })
    }
  })

  // Search compliance items
  complianceRes.checklist?.forEach((item: any) => {
    if (item.item?.toLowerCase().includes(searchTerm)) {
      results.push({
        id: `compliance-${item.id}`,
        title: item.item,
        subtitle: `${item.category} • ${item.status}`,
        category: 'compliance',
        href: '/compliance',
        icon: Shield,
      })
    }
  })

  // Search tokens
  complianceRes.tokens?.forEach((token: any) => {
    if (token.symbol?.toLowerCase().includes(searchTerm) ||
        token.name?.toLowerCase().includes(searchTerm)) {
      results.push({
        id: `token-${token.symbol}`,
        title: `${token.symbol} - ${token.name}`,
        subtitle: `${token.type} token • ${token.tradability}`,
        category: 'compliance',
        href: '/compliance',
        icon: Shield,
      })
    }
  })

  return results.slice(0, 20) // Limit results
}

interface SearchCommandProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Debounced search query
  const [debouncedQuery, setDebouncedQuery] = React.useState('')
  
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200)
    return () => clearTimeout(timer)
  }, [query])

  // Fetch search results
  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => fetchSearchData(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 30000,
  })

  // Combine pages (for empty query) with search results
  const results = query.trim() ? searchResults : pages

  // Reset selected index when results change
  React.useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  // Focus input when opened
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
    } else {
      setQuery('')
      setDebouncedQuery('')
      setSelectedIndex(0)
    }
  }, [open])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % results.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + results.length) % results.length)
        break
      case 'Enter':
        e.preventDefault()
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex])
        }
        break
      case 'Escape':
        onOpenChange(false)
        break
    }
  }

  const handleSelect = (result: SearchResult) => {
    onOpenChange(false)
    if (result.href) {
      if (result.href.startsWith('http')) {
        window.open(result.href, '_blank')
      } else {
        router.push(result.href)
      }
    }
  }

  const categoryColors = {
    page: 'bg-primary/10 text-primary border-primary/20',
    phase: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    task: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    repo: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    compliance: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl max-w-2xl">
        {/* Search Input */}
        <div className="flex items-center border-b px-4">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin shrink-0" />
          ) : (
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tasks, phases, repositories, compliance..."
            className="flex-1 bg-transparent px-4 py-4 text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <ScrollArea className="max-h-[400px]">
          <div className="p-2">
            {results.length === 0 && query ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No results found</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Try searching for tasks, phases, or repositories
                </p>
              </div>
            ) : (
              <>
                {!query && (
                  <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    Quick Navigation
                  </p>
                )}
                {query && (
                  <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {isLoading ? 'Searching...' : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
                  </p>
                )}
                <div className="space-y-1">
                  {results.map((result, index) => {
                    const Icon = result.icon
                    const isSelected = index === selectedIndex
                    
                    return (
                      <button
                        key={result.id}
                        onClick={() => handleSelect(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                          isSelected
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-muted'
                        )}
                      >
                        <div className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-lg shrink-0',
                          isSelected ? 'bg-primary/20' : 'bg-muted'
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{result.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {result.subtitle}
                          </p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn('text-[10px] shrink-0', categoryColors[result.category])}
                        >
                          {result.category}
                        </Badge>
                        {isSelected && (
                          <CornerDownLeft className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-4 py-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-muted px-1.5 py-0.5">↑</kbd>
              <kbd className="rounded border bg-muted px-1.5 py-0.5">↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border bg-muted px-1.5 py-0.5">↵</kbd>
              <span>Select</span>
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="rounded border bg-muted px-1.5 py-0.5">ESC</kbd>
            <span>Close</span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function formatRole(role: string): string {
  const roleNames: Record<string, string> = {
    blockchain: 'Blockchain',
    contract: 'Contract',
    backend: 'Backend',
    frontend: 'Frontend',
    'mobile-ios': 'iOS',
    'mobile-android': 'Android',
    devops: 'DevOps',
  }
  return roleNames[role] || role
}

// Global search trigger that can be used anywhere
export function useSearchCommand() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return { open, setOpen }
}
