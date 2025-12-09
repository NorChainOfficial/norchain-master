'use client'

import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { SearchCommand, useSearchCommand } from './SearchCommand'
import { Badge } from '@/components/ui/badge'
import { usePhases } from '@/hooks/usePhases'
import { useTasks } from '@/hooks/useTasks'
import {
  Layers,
  TrendingUp,
  Clock,
  Bell,
  Search,
  Command,
} from 'lucide-react'

const pageTitles: Record<string, { title: string; description: string }> = {
  '/': { title: 'Dashboard', description: 'Real-time ecosystem overview' },
  '/phases': { title: 'Development Phases', description: 'Track progress across all phases' },
  '/repos': { title: 'Repositories', description: 'NorChainOfficial organization' },
  '/tasks': { title: 'Task Board', description: 'Kanban-style task management' },
  '/compliance': { title: 'Compliance', description: 'MiCA-safe tokenization tracking' },
}

export function Header() {
  const pathname = usePathname()
  const { currentPhase, overallProgress } = usePhases()
  const { taskStats } = useTasks()
  const { open, setOpen } = useSearchCommand()
  
  const pageInfo = pageTitles[pathname] || { title: 'Dashboard', description: '' }

  return (
    <>
      <header className="sticky top-0 z-40 h-16 border-b bg-background/80 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-6 gap-4">
          {/* Left - Page Title */}
          <div className="flex items-center gap-4 shrink-0">
            <div>
              <h1 className="text-lg font-semibold">{pageInfo.title}</h1>
              <p className="text-xs text-muted-foreground">{pageInfo.description}</p>
            </div>
          </div>

          {/* Center - Search (Widened) */}
          <div className="flex-1 max-w-xl">
            <button
              onClick={() => setOpen(true)}
              className="flex w-full h-10 items-center gap-3 rounded-xl border bg-muted/50 px-4 text-sm text-muted-foreground hover:bg-muted hover:border-primary/20 transition-all duration-200"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Search phases, tasks, repos...</span>
              <kbd className="hidden md:inline-flex h-6 items-center gap-1 rounded-md border bg-background px-2 font-mono text-[10px] font-medium text-muted-foreground">
                <Command className="h-3 w-3" />
                <span>K</span>
              </kbd>
            </button>
          </div>

          {/* Right - Quick Stats & Actions */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Quick Stats - Hidden on smaller screens */}
            <div className="hidden xl:flex items-center gap-4">
              <QuickStat
                icon={Layers}
                label="Phase"
                value={currentPhase.id.toString()}
                color="text-primary"
              />
              <div className="h-6 w-px bg-border" />
              <QuickStat
                icon={TrendingUp}
                label="Progress"
                value={`${overallProgress}%`}
                color="text-emerald-500"
              />
              <div className="h-6 w-px bg-border" />
              <QuickStat
                icon={Clock}
                label="Active"
                value={taskStats.inProgress.toString()}
                color="text-amber-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border bg-muted/50 hover:bg-muted transition-all duration-200">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-lg shadow-primary/20">
                  3
                </span>
              </button>

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
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted shrink-0">
        <Icon className={`h-[18px] w-[18px] ${color}`} />
      </div>
      <div className="flex flex-col justify-center">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider leading-none">{label}</span>
        <span className="text-sm font-bold tabular-nums leading-tight mt-0.5">{value}</span>
      </div>
    </div>
  )
}
