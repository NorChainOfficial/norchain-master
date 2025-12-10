'use client'

import * as React from 'react'
import { ChevronsUpDown, Plus, FolderKanban, Check, Rocket, Code, Layers, Loader2 } from 'lucide-react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProject } from '@/contexts/ProjectContext'
import { Badge } from '@/components/ui/badge'

const projectIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  rocket: Rocket,
  code: Code,
  folder: FolderKanban,
  layers: Layers,
}

const iconOptions = [
  { value: 'rocket', label: 'Rocket', icon: Rocket },
  { value: 'code', label: 'Code', icon: Code },
  { value: 'folder', label: 'Folder', icon: FolderKanban },
  { value: 'layers', label: 'Layers', icon: Layers },
]

const colorOptions = [
  { value: '#14B8A6', label: 'Teal' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#3B82F6', label: 'Blue' },
  { value: '#10B981', label: 'Emerald' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#EF4444', label: 'Red' },
  { value: '#EC4899', label: 'Pink' },
]

export function ProjectSwitcher() {
  const [open, setOpen] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [isCreating, setIsCreating] = React.useState(false)
  const [newProject, setNewProject] = React.useState({
    name: '',
    slug: '',
    description: '',
    icon: 'rocket',
    color: '#14B8A6',
  })
  
  const { 
    currentProject, 
    currentWorkspace,
    projects, 
    workspaces,
    setCurrentProject,
    setCurrentWorkspace,
    refreshProjects,
  } = useProject()

  const IconComponent = currentProject?.icon 
    ? projectIcons[currentProject.icon] || FolderKanban 
    : FolderKanban

  const handleCreateProject = async () => {
    if (!currentWorkspace || !newProject.name.trim()) return
    
    setIsCreating(true)
    try {
      const response = await fetch('/api/v1/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace_id: currentWorkspace.id,
          name: newProject.name.trim(),
          slug: newProject.slug.trim() || newProject.name.toLowerCase().replace(/\s+/g, '-'),
          description: newProject.description.trim(),
          icon: newProject.icon,
          color: newProject.color,
          status: 'active',
        }),
      })
      
      if (response.ok) {
        const createdProject = await response.json()
        await refreshProjects()
        setCurrentProject(createdProject)
        setDialogOpen(false)
        setOpen(false)
        setNewProject({ name: '', slug: '', description: '', icon: 'rocket', color: '#14B8A6' })
      } else {
        const error = await response.json()
        console.error('Failed to create project:', error)
        alert(`Failed to create project: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleNameChange = (name: string) => {
    setNewProject(prev => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    }))
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[320px] justify-between h-12 px-4"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${currentProject?.color || '#14B8A6'}20` }}
              >
                <IconComponent
                  className="h-4.5 w-4.5"
                  style={{ color: currentProject?.color || '#14B8A6' }}
                />
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="font-semibold text-sm truncate max-w-[200px]">
                  {currentProject?.name || 'Select Project'}
                </span>
                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {currentWorkspace?.name || 'No workspace'}
                </span>
              </div>
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
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
                        style={{ backgroundColor: `${project.color || '#14B8A6'}20` }}
                      >
                        <ProjectIcon 
                          className="h-3 w-3" 
                          style={{ color: project.color || '#14B8A6' }}
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-sm font-medium">{project.name}</span>
                        {project.description && (
                          <span className="text-xs text-muted-foreground truncate max-w-[250px]">
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
                <CommandItem 
                  onSelect={() => {
                    setDialogOpen(true)
                    setOpen(false)
                  }}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create New Project</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Create Project Dialog - Enhanced Design */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[540px] p-0 gap-0 overflow-hidden">
          {/* Header with gradient */}
          <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 flex gap-1.5">
              {colorOptions.slice(0, 4).map((c, i) => (
                <div 
                  key={c.value}
                  className="w-2 h-2 rounded-full opacity-60"
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
            
            <div className="flex items-start gap-5">
              {/* Dynamic icon preview */}
              <div 
                className="relative h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300"
                style={{ 
                  backgroundColor: `${newProject.color}20`,
                  boxShadow: `0 8px 32px -8px ${newProject.color}40`
                }}
              >
                {React.createElement(projectIcons[newProject.icon] || FolderKanban, {
                  className: 'h-8 w-8 transition-colors duration-300',
                  style: { color: newProject.color }
                })}
                <div 
                  className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-card flex items-center justify-center"
                  style={{ backgroundColor: newProject.color }}
                >
                  <Plus className="h-3 w-3 text-white" />
                </div>
              </div>
              
              <div className="flex-1 pt-1">
                <DialogHeader className="space-y-1 text-left">
                  <DialogTitle className="text-2xl font-bold">Create New Project</DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground">
                    Add a new project to <span className="text-foreground font-medium">{currentWorkspace?.name || 'your workspace'}</span>
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 py-6 space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-foreground">
                Project Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={newProject.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="My Awesome Project"
                className="h-12 text-base bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-sm font-semibold text-foreground">
                URL Slug
              </Label>
              <Input
                id="slug"
                value={newProject.slug}
                onChange={(e) => setNewProject(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="my-awesome-project"
                className="h-12 text-base font-mono bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all"
              />
              <p className="text-sm text-muted-foreground">
                Used in URLs and API references
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-foreground">
                Description
              </Label>
              <Input
                id="description"
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="A brief description of your project"
                className="h-12 text-base bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all"
              />
            </div>

            {/* Icon & Color Selection */}
            <div className="grid grid-cols-2 gap-6">
              {/* Icon Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">Icon</Label>
                <div className="flex gap-2">
                  {iconOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNewProject(prev => ({ ...prev, icon: option.value }))}
                      className={cn(
                        'h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-200',
                        newProject.icon === option.value
                          ? 'ring-2 ring-primary shadow-lg scale-105'
                          : 'bg-muted/50 hover:bg-muted hover:scale-105'
                      )}
                      style={newProject.icon === option.value ? { 
                        backgroundColor: `${newProject.color}20`,
                      } : undefined}
                    >
                      <option.icon 
                        className="h-5 w-5 transition-colors" 
                        style={{ color: newProject.icon === option.value ? newProject.color : undefined }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNewProject(prev => ({ ...prev, color: option.value }))}
                      className={cn(
                        'h-10 w-10 rounded-full transition-all duration-200 hover:scale-110',
                        newProject.color === option.value && 'ring-2 ring-offset-2 ring-offset-background scale-110'
                      )}
                      style={{ 
                        backgroundColor: option.value,
                        boxShadow: newProject.color === option.value ? `0 4px 12px -2px ${option.value}60` : undefined,
                      }}
                      title={option.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-muted/30 border-t flex items-center justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              disabled={isCreating}
              className="h-11 px-6 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateProject}
              disabled={!newProject.name.trim() || isCreating}
              className="h-11 px-6 rounded-xl text-base font-semibold shadow-lg transition-all hover:shadow-xl"
              style={{ 
                background: `linear-gradient(135deg, ${newProject.color}, ${newProject.color}dd)`,
                boxShadow: `0 4px 16px -4px ${newProject.color}60`
              }}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
