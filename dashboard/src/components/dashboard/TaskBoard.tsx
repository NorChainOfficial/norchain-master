'use client'

import { useTasks } from '@/hooks/useTasks'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
} from 'lucide-react'
import type { Task, TaskStatus, TaskRole } from '@/types'

const columns: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'bg-muted' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-blue-500/10' },
  { id: 'review', label: 'Review', color: 'bg-yellow-500/10' },
  { id: 'done', label: 'Done', color: 'bg-success/10' },
]

export function TaskBoard() {
  const { tasksByStatus, filters, setFilters, roles, taskStats } = useTasks()

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select
          value={filters.phase?.toString() || 'all'}
          onValueChange={(v) =>
            setFilters((f) => ({ ...f, phase: v === 'all' ? undefined : parseInt(v) }))
          }
        >
          <SelectTrigger className="w-[140px]">
            <Layers className="h-4 w-4 mr-2" />
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
          <SelectTrigger className="w-[160px]">
            <User className="h-4 w-4 mr-2" />
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
        <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
          <span>{taskStats.total} tasks</span>
          <span>{taskStats.completionRate}% complete</span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4">
        {columns.map((column) => (
          <TaskColumn
            key={column.id}
            column={column}
            tasks={tasksByStatus[column.id]}
          />
        ))}
      </div>
    </div>
  )
}

interface TaskColumnProps {
  column: { id: TaskStatus; label: string; color: string }
  tasks: Task[]
}

function TaskColumn({ column, tasks }: TaskColumnProps) {
  return (
    <div className={cn('rounded-lg p-3', column.color)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">{column.label}</h3>
        <Badge variant="outline" className="text-xs">
          {tasks.length}
        </Badge>
      </div>
      <ScrollArea className="h-[500px]">
        <div className="space-y-2 pr-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No tasks
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const PriorityIcon = task.priority === 'high'
    ? ArrowUp
    : task.priority === 'medium'
      ? ArrowRight
      : ArrowDown

  const priorityColors = {
    high: 'text-destructive',
    medium: 'text-warning',
    low: 'text-muted-foreground',
  }

  const roleVariants: Record<string, 'blockchain' | 'contract' | 'backend' | 'frontend' | 'mobile' | 'devops'> = {
    blockchain: 'blockchain',
    contract: 'contract',
    backend: 'backend',
    frontend: 'frontend',
    'mobile-ios': 'mobile',
    'mobile-android': 'mobile',
    devops: 'devops',
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-all">
      <CardContent className="p-3">
        <div className="flex items-start gap-2 mb-2">
          <PriorityIcon
            className={cn('h-4 w-4 shrink-0 mt-0.5', priorityColors[task.priority])}
          />
          <p className="text-sm leading-tight">{task.title}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={roleVariants[task.role] || 'secondary'} className="text-xs">
            {formatRole(task.role)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            P{task.phase}
          </Badge>
          {task.complexity === 'high' && (
            <Badge variant="destructive" className="text-xs">
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
  const { filteredTasks, taskStats } = useTasks()

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
        <span>{filteredTasks.length} tasks</span>
        <span>{taskStats.completionRate}% done</span>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="space-y-2 pr-4">
          {filteredTasks.slice(0, 20).map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-md border px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={cn(
                    'w-2 h-2 rounded-full shrink-0',
                    task.status === 'done' && 'bg-success',
                    task.status === 'in_progress' && 'bg-blue-500',
                    task.status === 'review' && 'bg-yellow-500',
                    task.status === 'backlog' && 'bg-muted-foreground'
                  )}
                />
                <span className="text-sm truncate">{task.title}</span>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">
                P{task.phase}
              </Badge>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

