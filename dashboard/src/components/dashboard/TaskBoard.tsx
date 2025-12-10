'use client'

import { useState, useCallback } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Layers,
  User,
  Sparkles,
  Loader2,
  GripVertical,
} from 'lucide-react'
import type { Task, TaskStatus, TaskRole } from '@/types'

const columns: { id: TaskStatus; label: string; color: string; gradient: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'text-muted-foreground', gradient: 'from-slate-500/10 to-slate-500/5' },
  { id: 'in_progress', label: 'In Progress', color: 'text-blue-500', gradient: 'from-blue-500/10 to-blue-500/5' },
  { id: 'review', label: 'Review', color: 'text-amber-500', gradient: 'from-amber-500/10 to-amber-500/5' },
  { id: 'done', label: 'Done', color: 'text-emerald-500', gradient: 'from-emerald-500/10 to-emerald-500/5' },
]

export function TaskBoard() {
  const { tasksByStatus, filters, setFilters, roles, taskStats, updateTask, isUpdating, isLoading } = useTasks()
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null)

  const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', task.id)
    // Add visual feedback
    const target = e.target as HTMLElement
    target.style.opacity = '0.5'
  }, [])

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const target = e.target as HTMLElement
    target.style.opacity = '1'
    setDraggedTask(null)
    setDragOverColumn(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(columnId)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault()
    setDragOverColumn(null)

    if (draggedTask && draggedTask.status !== targetStatus) {
      // Update task status in database
      updateTask(draggedTask.id, { status: targetStatus })
    }
    setDraggedTask(null)
  }, [draggedTask, updateTask])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select
          value={filters.phase?.toString() || 'all'}
          onValueChange={(v) =>
            setFilters((f) => ({ ...f, phase: v === 'all' ? undefined : parseInt(v) }))
          }
        >
          <SelectTrigger className="w-[150px] h-9 bg-muted/50">
            <Layers className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
            <SelectValue placeholder="All Phases" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Phases</SelectItem>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((phase) => (
              <SelectItem key={phase} value={phase.toString()}>
                Phase {phase}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.role || 'all'}
          onValueChange={(v) =>
            setFilters((f) => ({ ...f, role: v === 'all' ? undefined : (v as TaskRole) }))
          }
        >
          <SelectTrigger className="w-[160px] h-9 bg-muted/50">
            <User className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {formatRole(role)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Stats */}
        <div className="ml-auto flex items-center gap-4 text-sm">
          {isUpdating && (
            <div className="flex items-center gap-2 text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs">Saving...</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="tabular-nums font-medium text-foreground">{taskStats.total}</span>
            <span>tasks</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="tabular-nums font-medium text-emerald-500">{taskStats.completionRate}%</span>
            <span>complete</span>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4">
        {columns.map((column) => (
          <TaskColumn
            key={column.id}
            column={column}
            tasks={tasksByStatus[column.id]}
            isDragOver={dragOverColumn === column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  )
}

interface TaskColumnProps {
  column: { id: TaskStatus; label: string; color: string; gradient: string }
  tasks: Task[]
  isDragOver: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  onDragStart: (e: React.DragEvent, task: Task) => void
  onDragEnd: (e: React.DragEvent) => void
}

function TaskColumn({ column, tasks, isDragOver, onDragOver, onDragLeave, onDrop, onDragStart, onDragEnd }: TaskColumnProps) {
  return (
    <div 
      className={cn(
        'rounded-2xl p-4 bg-gradient-to-b border transition-all duration-200',
        column.gradient,
        isDragOver && 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.02]'
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={cn('h-2.5 w-2.5 rounded-full shrink-0', 
            column.id === 'backlog' && 'bg-slate-400',
            column.id === 'in_progress' && 'bg-blue-500',
            column.id === 'review' && 'bg-amber-500',
            column.id === 'done' && 'bg-emerald-500'
          )} />
          <h3 className="font-semibold leading-none">{column.label}</h3>
        </div>
        <Badge variant="outline" className="text-xs tabular-nums">
          {tasks.length}
        </Badge>
      </div>
      <ScrollArea className="h-[480px]">
        <div className="space-y-2.5 pr-2">
          {tasks.map((task, index) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              index={index}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
          {tasks.length === 0 && (
            <div className={cn(
              'flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl transition-colors',
              isDragOver ? 'border-primary bg-primary/5' : 'border-transparent'
            )}>
              <Sparkles className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-xs text-muted-foreground">
                {isDragOver ? 'Drop here' : 'No tasks'}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

interface TaskCardProps {
  task: Task
  index: number
  onDragStart: (e: React.DragEvent, task: Task) => void
  onDragEnd: (e: React.DragEvent) => void
}

export function TaskCard({ task, index, onDragStart, onDragEnd }: TaskCardProps) {
  const PriorityIcon = task.priority === 'high'
    ? ArrowUp
    : task.priority === 'medium'
      ? ArrowRight
      : ArrowDown

  const priorityConfig = {
    high: { color: 'text-red-500', bg: 'bg-red-500/10' },
    medium: { color: 'text-amber-500', bg: 'bg-amber-500/10' },
    low: { color: 'text-slate-400', bg: 'bg-slate-500/10' },
  }

  const roleConfig: Record<string, { color: string; bg: string }> = {
    blockchain: { color: 'text-orange-500', bg: 'bg-orange-500/10' },
    contract: { color: 'text-purple-500', bg: 'bg-purple-500/10' },
    backend: { color: 'text-blue-500', bg: 'bg-blue-500/10' },
    frontend: { color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    'mobile-ios': { color: 'text-pink-500', bg: 'bg-pink-500/10' },
    'mobile-android': { color: 'text-green-500', bg: 'bg-green-500/10' },
    devops: { color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  }

  const pConfig = priorityConfig[task.priority]
  const rConfig = roleConfig[task.role] || { color: 'text-muted-foreground', bg: 'bg-muted' }

  return (
    <Card 
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      className={cn(
        'cursor-grab active:cursor-grabbing transition-all duration-200',
        'hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20',
        'hover:-translate-y-0.5 hover:border-primary/20',
        'animate-scale-in opacity-0'
      )}
      style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'forwards' }}
    >
      <CardContent className="p-3.5">
        <div className="flex items-start gap-2.5 mb-3">
          <GripVertical className="h-4 w-4 text-muted-foreground/50 mt-0.5 shrink-0" />
          <div className={cn('p-1.5 rounded shrink-0', pConfig.bg)}>
            <PriorityIcon className={cn('h-4 w-4', pConfig.color)} />
          </div>
          <p className="leading-snug flex-1 text-sm">{task.title}</p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap ml-6">
          <div className={cn('flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium', rConfig.bg, rConfig.color)}>
            {formatRole(task.role)}
          </div>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            P{task.phase}
          </Badge>
          {task.complexity === 'high' && (
            <Badge className="text-[10px] px-1.5 py-0 bg-red-500/10 text-red-500 border-red-500/20">
              Complex
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
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

// Compact task list for smaller displays
export function TaskList() {
  const { filteredTasks, taskStats, isLoading } = useTasks()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">{filteredTasks.length}</span> tasks
        </span>
        <span className="text-emerald-500 font-semibold tabular-nums">{taskStats.completionRate}% done</span>
      </div>
      <ScrollArea className="h-[280px]">
        <div className="space-y-2 pr-4">
          {filteredTasks.slice(0, 15).map((task, index) => (
            <div
              key={task.id}
              className={cn(
                'flex items-center justify-between rounded-xl border px-3 py-2.5 transition-all duration-200',
                'hover:bg-muted/50 hover:border-primary/20',
                'animate-slide-up opacity-0'
              )}
              style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'forwards' }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={cn(
                    'w-2.5 h-2.5 rounded-full shrink-0',
                    task.status === 'done' && 'bg-emerald-500',
                    task.status === 'in_progress' && 'bg-blue-500',
                    task.status === 'review' && 'bg-amber-500',
                    task.status === 'backlog' && 'bg-muted-foreground'
                  )}
                />
                <span className="truncate leading-none">{task.title}</span>
              </div>
              <Badge variant="outline" className="text-xs shrink-0 ml-2">
                P{task.phase}
              </Badge>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
