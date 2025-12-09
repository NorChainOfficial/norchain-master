'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Layers,
  GitBranch,
  ListTodo,
  Shield,
  Activity,
  ExternalLink,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { usePhases } from '@/hooks/usePhases'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Phases',
    href: '/phases',
    icon: Layers,
  },
  {
    name: 'Repositories',
    href: '/repos',
    icon: GitBranch,
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: ListTodo,
  },
  {
    name: 'Compliance',
    href: '/compliance',
    icon: Shield,
  },
]

const externalLinks = [
  {
    name: 'GitHub Org',
    href: 'https://github.com/NorChainOfficial',
    icon: ExternalLink,
  },
  {
    name: 'Documentation',
    href: 'https://docs.norchain.org',
    icon: ExternalLink,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { currentPhase, overallProgress } = usePhases()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card/50 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20 shrink-0">
          <span className="text-lg font-bold text-white">N</span>
          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <span className="font-semibold tracking-tight leading-tight">NorChain</span>
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider leading-tight">PM Dashboard</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-all duration-200',
                  'animate-slide-up opacity-0',
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg transition-colors shrink-0',
                  isActive ? 'bg-primary/20' : 'bg-muted group-hover:bg-muted-foreground/10'
                )}>
                  <item.icon className="h-[18px] w-[18px]" />
                </div>
                <span className="leading-none">{item.name}</span>
                {isActive && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse-glow shrink-0" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Current Phase Card */}
        <div className="mt-6 rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-[18px] w-[18px] text-primary shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary leading-none">Current Phase</span>
          </div>
          <p className="font-semibold">{currentPhase.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{currentPhase.focus}</p>
          
          {/* Progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold tabular-nums">{currentPhase.progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-primary/20 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                style={{ width: `${currentPhase.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* External Links */}
        <div className="mt-6 space-y-1">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            External
          </p>
          {externalLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              <span className="leading-none">{item.name}</span>
            </a>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 px-3 py-3">
          <div className="relative shrink-0">
            <Activity className="h-5 w-5 text-emerald-500" />
            <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 status-dot status-dot-success" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-tight">System Status</p>
            <p className="text-xs text-muted-foreground leading-tight">All services operational</p>
          </div>
        </div>
      </div>
    </div>
  )
}
