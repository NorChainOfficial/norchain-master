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
  Settings2,
  Bot,
  Sparkles,
  TestTube,
  Server,
  FolderKanban,
  Users,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { usePhases } from '@/hooks/usePhases'
import { useTasks } from '@/hooks/useTasks'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Project',
    href: '/project',
    icon: FolderKanban,
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: ListTodo,
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
    name: 'Compliance',
    href: '/compliance',
    icon: Shield,
  },
]

const advancedNavigation = [
  {
    name: 'Team',
    href: '/team',
    icon: Users,
  },
  {
    name: 'AI Assistant',
    href: '/ai',
    icon: Bot,
  },
  {
    name: 'Agents',
    href: '/agents',
    icon: Sparkles,
  },
  {
    name: 'Testing',
    href: '/testing',
    icon: TestTube,
  },
  {
    name: 'Deployments',
    href: '/deployments',
    icon: Server,
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
  const { currentPhase, overallProgress, phases } = usePhases()
  const { taskStats } = useTasks()

  return (
    <div className="flex h-full w-72 flex-col border-r bg-card/50 backdrop-blur-xl">
      {/* Logo - Using brand image, matched to header height */}
      <div className="flex h-20 items-center gap-4 border-b px-5">
        <div className="relative shrink-0">
          <img 
            src="/logo.png" 
            alt="NorChain" 
            className="h-14 w-14 object-contain drop-shadow-lg"
            onError={(e) => {
              // Fallback to text if image not found
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }}
          />
          <div className="hidden h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/25">
            <span className="text-2xl font-bold text-white font-display">N</span>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <span className="text-lg font-bold tracking-tight leading-tight font-display">NorChain</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest leading-tight">PM Dashboard</span>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="border-b p-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-center rounded-xl bg-primary/10 p-2.5">
            <span className="text-lg font-bold text-primary tabular-nums">{currentPhase.id}</span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Phase</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-emerald-500/10 p-2.5">
            <span className="text-lg font-bold text-emerald-500 tabular-nums">{overallProgress}%</span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Progress</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-amber-500/10 p-2.5">
            <span className="text-lg font-bold text-amber-500 tabular-nums">{taskStats.inProgress}</span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Active</span>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mt-2.5">
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary via-emerald-500 to-secondary transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] text-muted-foreground">{currentPhase.name}</span>
            <span className="text-[10px] text-muted-foreground">{taskStats.done}/{taskStats.total} tasks</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1.5">
          <p className="px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Main
          </p>
          {navigation.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-4 rounded-xl px-4 py-3 font-medium transition-all duration-200',
                  'animate-slide-up opacity-0',
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl transition-colors shrink-0',
                  isActive ? 'bg-primary/20' : 'bg-muted group-hover:bg-muted-foreground/10'
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-sm leading-none">{item.name}</span>
                {isActive && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse-glow shrink-0" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Advanced Navigation */}
        <nav className="flex flex-col gap-1.5 mt-6">
          <p className="px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Advanced
          </p>
          {advancedNavigation.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-4 rounded-xl px-4 py-3 font-medium transition-all duration-200',
                  'animate-slide-up opacity-0',
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                style={{ animationDelay: `${(navigation.length + index) * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl transition-colors shrink-0',
                  isActive ? 'bg-primary/20' : 'bg-muted group-hover:bg-muted-foreground/10'
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-sm leading-none">{item.name}</span>
                {isActive && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse-glow shrink-0" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* External Links */}
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
