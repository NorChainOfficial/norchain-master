'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Pencil,
  Trash2,
  CheckSquare,
  Square,
  Loader2,
  X,
} from 'lucide-react'

interface Task {
  id: string
  title: string
  role: string
  phase_id: number
  priority: string
  complexity: string
  status: string
  assignee?: string
}

interface TaskManagerProps {
  tasks: Task[]
  onRefresh: () => void
}

const roles = ['blockchain', 'contract', 'backend', 'frontend', 'mobile-ios', 'mobile-android', 'devops']
const priorities = ['high', 'medium', 'low']
const complexities = ['high', 'medium', 'low']
const statuses = ['backlog', 'in_progress', 'review', 'done']

export function TaskManager({ tasks, onRefresh }: TaskManagerProps) {
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [bulkAction, setBulkAction] = useState<string>('')
  
  const queryClient = useQueryClient()

  // Add task mutation
  const addMutation = useMutation({
    mutationFn: async (task: Partial<Task>) => {
      const res = await fetch('/api/v1/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      })
      if (!res.ok) throw new Error('Failed to add task')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      onRefresh()
      setIsAddOpen(false)
    },
  })

  // Update task mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Task> & { id: string }) => {
      const res = await fetch(`/api/v1/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update task')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      onRefresh()
      setEditTask(null)
    },
  })

  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/v1/tasks/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete task')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      onRefresh()
    },
  })

  // Bulk update mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ ids, data }: { ids: string[]; data: Partial<Task> }) => {
      await Promise.all(
        ids.map((id) =>
          fetch(`/api/v1/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
        )
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      onRefresh()
      setSelectedTasks(new Set())
      setBulkAction('')
    },
  })

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => fetch(`/api/v1/tasks/${id}`, { method: 'DELETE' })))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      onRefresh()
      setSelectedTasks(new Set())
    },
  })

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedTasks)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedTasks(newSelected)
  }

  const selectAll = () => {
    if (selectedTasks.size === tasks.length) {
      setSelectedTasks(new Set())
    } else {
      setSelectedTasks(new Set(tasks.map((t) => t.id)))
    }
  }

  const handleBulkAction = () => {
    const ids = Array.from(selectedTasks)
    if (bulkAction === 'delete') {
      if (confirm(`Delete ${ids.length} tasks?`)) {
        bulkDeleteMutation.mutate(ids)
      }
    } else if (statuses.includes(bulkAction)) {
      bulkUpdateMutation.mutate({ ids, data: { status: bulkAction } })
    }
  }

  const isLoading = addMutation.isPending || updateMutation.isPending || 
    deleteMutation.isPending || bulkUpdateMutation.isPending || bulkDeleteMutation.isPending

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Task Manager</CardTitle>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Bulk Actions */}
        {selectedTasks.size > 0 && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">{selectedTasks.size} selected</span>
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="w-[160px] h-8">
                <SelectValue placeholder="Bulk action..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="backlog">→ Backlog</SelectItem>
                <SelectItem value="in_progress">→ In Progress</SelectItem>
                <SelectItem value="review">→ Review</SelectItem>
                <SelectItem value="done">→ Done</SelectItem>
                <SelectItem value="delete">🗑️ Delete</SelectItem>
              </SelectContent>
            </Select>
            <button
              onClick={handleBulkAction}
              disabled={!bulkAction || isLoading}
              className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
            </button>
            <button
              onClick={() => setSelectedTasks(new Set())}
              className="ml-auto text-sm text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          </div>
        )}

        {/* Task List */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-2 pr-4">
            {/* Header */}
            <div className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-muted-foreground border-b">
              <button onClick={selectAll} className="shrink-0">
                {selectedTasks.size === tasks.length ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
              </button>
              <span className="w-16">ID</span>
              <span className="flex-1">Title</span>
              <span className="w-24">Role</span>
              <span className="w-24">Status</span>
              <span className="w-20">Actions</span>
            </div>

            {/* Rows */}
            {tasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors',
                  selectedTasks.has(task.id) ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
                )}
              >
                <button onClick={() => toggleSelect(task.id)} className="shrink-0">
                  {selectedTasks.has(task.id) ? (
                    <CheckSquare className="h-4 w-4 text-primary" />
                  ) : (
                    <Square className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                <span className="w-16 text-xs font-mono text-muted-foreground">{task.id}</span>
                <span className="flex-1 text-sm truncate">{task.title}</span>
                <Badge variant="outline" className="w-24 justify-center text-xs">
                  {task.role}
                </Badge>
                <Badge
                  className={cn(
                    'w-24 justify-center text-xs',
                    task.status === 'done' && 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                    task.status === 'in_progress' && 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                    task.status === 'review' && 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                    task.status === 'backlog' && 'bg-muted text-muted-foreground'
                  )}
                >
                  {task.status.replace('_', ' ')}
                </Badge>
                <div className="w-20 flex items-center gap-1">
                  <button
                    onClick={() => setEditTask(task)}
                    className="p-1.5 rounded hover:bg-muted transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this task?')) {
                        deleteMutation.mutate(task.id)
                      }
                    }}
                    className="p-1.5 rounded hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Add Task Dialog */}
      <TaskFormDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={(data) => addMutation.mutate(data)}
        isLoading={addMutation.isPending}
        title="Add New Task"
      />

      {/* Edit Task Dialog */}
      <TaskFormDialog
        open={!!editTask}
        onOpenChange={(open) => !open && setEditTask(null)}
        onSubmit={(data) => editTask && updateMutation.mutate({ id: editTask.id, ...data })}
        isLoading={updateMutation.isPending}
        title="Edit Task"
        initialData={editTask || undefined}
      />
    </Card>
  )
}

// Task Form Dialog Component
interface TaskFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Partial<Task>) => void
  isLoading: boolean
  title: string
  initialData?: Partial<Task>
}

function TaskFormDialog({ open, onOpenChange, onSubmit, isLoading, title, initialData }: TaskFormDialogProps) {
  const [formData, setFormData] = useState<Partial<Task>>(
    initialData || {
      id: '',
      title: '',
      role: 'backend',
      phase_id: 1,
      priority: 'medium',
      complexity: 'medium',
      status: 'backlog',
    }
  )

  // Reset form when initialData changes
  useState(() => {
    if (initialData) {
      setFormData(initialData)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!initialData && (
            <div>
              <label className="text-sm font-medium">Task ID</label>
              <input
                type="text"
                value={formData.id || ''}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="e.g., t1-10"
                className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-sm"
                required
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Task title"
              className="w-full mt-1 px-3 py-2 rounded-lg border bg-background text-sm"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Role</label>
              <Select
                value={formData.role}
                onValueChange={(v) => setFormData({ ...formData, role: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Phase</label>
              <Select
                value={formData.phase_id?.toString()}
                onValueChange={(v) => setFormData({ ...formData, phase_id: parseInt(v) })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
                    <SelectItem key={p} value={p.toString()}>Phase {p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={formData.priority}
                onValueChange={(v) => setFormData({ ...formData, priority: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Complexity</label>
              <Select
                value={formData.complexity}
                onValueChange={(v) => setFormData({ ...formData, complexity: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {complexities.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm rounded-lg border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : initialData ? 'Save' : 'Add Task'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

