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
  Settings2,
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
  {
    name: 'Manage',
    href: '/manage',
    icon: Settings2,
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
    <div className="flex h-full w-72 flex-col border-r bg-card/50 backdrop-blur-xl">
      {/* Logo - Larger */}
      <div className="flex h-20 items-center gap-4 border-b px-6">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/25 shrink-0">
          <span className="text-xl font-bold text-white font-display">N</span>
          <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-card bg-emerald-500" />
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <span className="text-lg font-bold tracking-tight leading-tight font-display">NorChain</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest leading-tight">PM Dashboard</span>
        </div>
      </div>

      {/* Navigation - Larger */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="flex flex-col gap-1.5">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-4 rounded-xl px-4 py-3.5 font-medium transition-all duration-200',
                  'animate-slide-up opacity-0',
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl transition-colors shrink-0',
                  isActive ? 'bg-primary/20' : 'bg-muted group-hover:bg-muted-foreground/10'
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-[15px] leading-none">{item.name}</span>
                {isActive && (
                  <div className="ml-auto h-2.5 w-2.5 rounded-full bg-primary animate-pulse-glow shrink-0" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Current Phase Card - Larger */}
        <div className="mt-8 rounded-2xl border bg-gradient-to-br from-primary/5 to-secondary/10 p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <Zap className="h-5 w-5 text-primary shrink-0" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary leading-none">Current Phase</span>
          </div>
          <p className="text-lg font-bold leading-tight">{currentPhase.name}</p>
          <p className="text-sm text-muted-foreground mt-1">{currentPhase.focus}</p>
          
          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-bold tabular-nums">{currentPhase.progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-primary/20 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${currentPhase.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* External Links - Larger */}
        <div className="mt-8 space-y-1.5">
          <p className="px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            External Links
          </p>
          {externalLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl px-4 py-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="text-[15px] leading-none">{item.name}</span>
            </a>
          ))}
        </div>
      </ScrollArea>

      {/* Footer - Larger */}
      <div className="border-t p-5">
        <div className="flex items-center gap-4 rounded-2xl bg-emerald-500/10 px-4 py-4">
          <div className="relative shrink-0">
            <Activity className="h-6 w-6 text-emerald-500" />
            <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 status-dot status-dot-success" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold leading-tight">System Status</p>
            <p className="text-sm text-muted-foreground leading-tight mt-0.5">All services operational</p>
          </div>
        </div>
      </div>
    </div>
  )
}
