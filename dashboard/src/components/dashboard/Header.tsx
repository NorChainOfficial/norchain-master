'use client'

import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { SearchCommand, useSearchCommand } from './SearchCommand'
import { Badge } from '@/components/ui/badge'
import { usePhases } from '@/hooks/usePhases'
import { useTasks } from '@/hooks/useTasks'
import { ProjectSwitcher } from '@/components/layout/ProjectSwitcher'
import { NotificationCenter } from '@/components/notifications/NotificationCenter'
import {
  Layers,
  TrendingUp,
  Clock,
  Search,
  Command,
  MessageSquare,
} from 'lucide-react'

const pageTitles: Record<string, { title: string; description: string }> = {
  '/': { title: 'Dashboard', description: 'Real-time ecosystem overview' },
  '/phases': { title: 'Development Phases', description: 'Track progress across all phases' },
  '/repos': { title: 'Repositories', description: 'NorChainOfficial organization' },
  '/tasks': { title: 'Task Board', description: 'Kanban-style task management' },
  '/compliance': { title: 'Compliance', description: 'MiCA-safe tokenization tracking' },
  '/manage': { title: 'Manage', description: 'Add, edit, and delete content' },
}

export function Header() {
  const pathname = usePathname()
  const { currentPhase, overallProgress } = usePhases()
  const { taskStats } = useTasks()
  const { open, setOpen } = useSearchCommand()
  
  const pageInfo = pageTitles[pathname] || { title: 'Dashboard', description: '' }

  return (
    <>
      <header className="sticky top-0 z-40 h-20 border-b bg-background/80 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-8 gap-6">
          {/* Left - Page Title */}
          <div className="flex items-center gap-4 shrink-0">
            <div>
              <h1 className="text-xl font-bold tracking-tight">{pageInfo.title}</h1>
              <p className="text-sm text-muted-foreground">{pageInfo.description}</p>
            </div>
          </div>

          {/* Center - Search (Widened) */}
          <div className="flex-1 max-w-2xl">
            <button
              onClick={() => setOpen(true)}
              className="flex w-full h-12 items-center gap-4 rounded-xl border bg-muted/50 px-5 text-base text-muted-foreground hover:bg-muted hover:border-primary/30 transition-all duration-200"
            >
              <Search className="h-5 w-5 shrink-0" />
              <span className="flex-1 text-left">Search phases, tasks, repos...</span>
              <kbd className="hidden md:inline-flex h-7 items-center gap-1.5 rounded-lg border bg-background px-3 font-mono text-xs font-medium text-muted-foreground">
                <Command className="h-3.5 w-3.5" />
                <span>K</span>
              </kbd>
            </button>
          </div>

          {/* Right - Project Switcher & Actions */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Project Switcher - Prominent */}
            <div className="hidden md:block">
              <ProjectSwitcher />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <NotificationCenter />

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Search Command Modal */}
      <SearchCommand open={open} onOpenChange={setOpen} />
    </>
  )
}

interface QuickStatProps {
  icon: React.ElementType
  label: string
  value: string
  color: string
}

function QuickStat({ icon: Icon, label, value, color }: QuickStatProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted shrink-0">
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div className="flex flex-col justify-center">
        <span className="text-xs text-muted-foreground uppercase tracking-widest leading-none font-medium">{label}</span>
        <span className="text-base font-bold tabular-nums leading-tight mt-1">{value}</span>
      </div>
    </div>
  )
}
