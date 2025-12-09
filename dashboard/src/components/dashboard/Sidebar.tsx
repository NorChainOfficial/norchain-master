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
  Settings,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

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

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-norchain-500">
          <span className="text-lg font-bold text-white">N</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">NorChain</span>
          <span className="text-xs text-muted-foreground">PM Dashboard</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-norchain-500/10 text-norchain-500'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <Separator className="my-4" />

        {/* External Links */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-medium text-muted-foreground">
            External
          </p>
          {externalLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </a>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
          <Activity className="h-4 w-4 text-success" />
          <div className="flex-1">
            <p className="text-xs font-medium">System Status</p>
            <p className="text-xs text-muted-foreground">All services online</p>
          </div>
        </div>
      </div>
    </div>
  )
}

