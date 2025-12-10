'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ListTodo, 
  Layers, 
  GitBranch, 
  Shield, 
  Settings,
  FolderKanban,
  ChevronDown,
  Plus,
  Rocket,
  TestTube,
  Server,
  Bot,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { OrgSwitcher } from './OrgSwitcher'
import { ProjectSwitcher } from './ProjectSwitcher'
import { useProject } from '@/contexts/ProjectContext'
import { ThemeToggle } from '@/components/dashboard/ThemeToggle'

const mainNavItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: ListTodo },
  { href: '/phases', label: 'Phases', icon: Layers },
  { href: '/repos', label: 'Repositories', icon: GitBranch },
  { href: '/compliance', label: 'Compliance', icon: Shield },
]

const advancedNavItems = [
  { href: '/testing', label: 'Testing', icon: TestTube },
  { href: '/deployments', label: 'Deployments', icon: Server },
  { href: '/ai', label: 'AI Assistant', icon: Bot },
  { href: '/agents', label: 'Agents', icon: Sparkles },
]

const settingsNavItems = [
  { href: '/manage', label: 'Manage', icon: FolderKanban },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function WorkspaceSidebar() {
  const pathname = usePathname()
  const { currentProject, projects } = useProject()
  const [projectsOpen, setProjectsOpen] = React.useState(true)

  return (
    <div className="flex flex-col h-full w-72 border-r bg-card/50 backdrop-blur-sm">
      {/* Organization Switcher */}
      <div className="p-4 border-b">
        <OrgSwitcher />
      </div>

      {/* Project Switcher */}
      <div className="px-4 py-3 border-b">
        <ProjectSwitcher />
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        {/* Main Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Main
          </p>
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 h-11',
                    isActive && 'bg-primary/10 text-primary font-medium'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </div>

        {/* Advanced Features */}
        <div className="mt-6 space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Advanced
          </p>
          {advancedNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 h-11',
                    isActive && 'bg-primary/10 text-primary font-medium'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </div>

        {/* Projects List */}
        <Collapsible
          open={projectsOpen}
          onOpenChange={setProjectsOpen}
          className="mt-6"
        >
          <div className="flex items-center justify-between px-3 mb-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 h-7 px-2">
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    !projectsOpen && '-rotate-90'
                  )}
                />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Projects
                </span>
              </Button>
            </CollapsibleTrigger>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <CollapsibleContent className="space-y-1">
            {projects.map((project) => {
              const isActive = currentProject?.id === project.id
              return (
                <Button
                  key={project.id}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 h-10 pl-6',
                    isActive && 'bg-primary/10 text-primary font-medium'
                  )}
                  onClick={() => {
                    // Handle project switch
                  }}
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: project.color || '#8B5CF6' }}
                  />
                  <span className="truncate">{project.name}</span>
                </Button>
              )
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Settings */}
        <div className="mt-6 space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Settings
          </p>
          {settingsNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 h-11',
                    isActive && 'bg-primary/10 text-primary font-medium'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Rocket className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">NorChain PM</p>
              <p className="text-xs text-muted-foreground">v2.0.0</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

