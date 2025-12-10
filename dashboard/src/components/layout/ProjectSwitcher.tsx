'use client'

import * as React from 'react'
import { ChevronsUpDown, Plus, FolderKanban, Check, Rocket, Code, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useProject } from '@/contexts/ProjectContext'
import { Badge } from '@/components/ui/badge'

const projectIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  rocket: Rocket,
  code: Code,
  folder: FolderKanban,
  layers: Layers,
}

export function ProjectSwitcher() {
  const [open, setOpen] = React.useState(false)
  const { 
    currentProject, 
    currentWorkspace,
    projects, 
    workspaces,
    setCurrentProject,
    setCurrentWorkspace,
  } = useProject()

  const IconComponent = currentProject?.icon 
    ? projectIcons[currentProject.icon] || FolderKanban 
    : FolderKanban

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 px-3"
        >
          <div className="flex items-center gap-3">
            <div 
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${currentProject?.color || '#8B5CF6'}20` }}
            >
              <IconComponent 
                className="h-4 w-4" 
                style={{ color: currentProject?.color || '#8B5CF6' }}
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium text-sm truncate max-w-[140px]">
                {currentProject?.name || 'Select Project'}
              </span>
              <span className="text-xs text-muted-foreground">
                {currentWorkspace?.name || 'No workspace'}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search project or workspace..." />
          <CommandList>
            <CommandEmpty>No project found.</CommandEmpty>
            
            {/* Workspaces */}
            <CommandGroup heading="Workspaces">
              {workspaces.map((workspace) => (
                <CommandItem
                  key={workspace.id}
                  value={`workspace-${workspace.slug}`}
                  onSelect={() => {
                    setCurrentWorkspace(workspace)
                  }}
                  className="flex items-center gap-3 px-3 py-2"
                >
                  <div 
                    className="h-6 w-6 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: `${workspace.color || '#3B82F6'}20` }}
                  >
                    <Layers 
                      className="h-3 w-3" 
                      style={{ color: workspace.color || '#3B82F6' }}
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-medium">{workspace.name}</span>
                    <span className="text-xs text-muted-foreground">{workspace.description}</span>
                  </div>
                  {currentWorkspace?.id === workspace.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />
            
            {/* Projects in current workspace */}
            <CommandGroup heading={`Projects in ${currentWorkspace?.name || 'Workspace'}`}>
              {projects.map((project) => {
                const ProjectIcon = project.icon 
                  ? projectIcons[project.icon] || FolderKanban 
                  : FolderKanban
                return (
                  <CommandItem
                    key={project.id}
                    value={project.slug}
                    onSelect={() => {
                      setCurrentProject(project)
                      setOpen(false)
                    }}
                    className="flex items-center gap-3 px-3 py-2"
                  >
                    <div 
                      className="h-6 w-6 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: `${project.color || '#8B5CF6'}20` }}
                    >
                      <ProjectIcon 
                        className="h-3 w-3" 
                        style={{ color: project.color || '#8B5CF6' }}
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-sm font-medium">{project.name}</span>
                      {project.description && (
                        <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                          {project.description}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={project.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs capitalize"
                      >
                        {project.status}
                      </Badge>
                      {currentProject?.id === project.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>

            <CommandSeparator />
            
            <CommandGroup>
              <CommandItem className="flex items-center gap-2 px-3 py-2">
                <Plus className="h-4 w-4" />
                <span>Create New Project</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

