'use client'

import * as React from 'react'
import { TaskBoard } from '@/components/dashboard/TaskBoard'
import { useTasks } from '@/hooks/useTasks'
import { usePhases } from '@/hooks/usePhases'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ListTodo, CheckCircle2, Clock, Layers, Plus, Loader2, RefreshCw } from 'lucide-react'

const roleOptions = [
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'contract', label: 'Smart Contract' },
  { value: 'backend', label: 'Backend' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'mobile-ios', label: 'Mobile iOS' },
  { value: 'mobile-android', label: 'Mobile Android' },
  { value: 'devops', label: 'DevOps' },
]

const priorityOptions = [
  { value: 'critical', label: 'Critical', color: '#EF4444' },
  { value: 'high', label: 'High', color: '#F59E0B' },
  { value: 'medium', label: 'Medium', color: '#3B82F6' },
  { value: 'low', label: 'Low', color: '#6B7280' },
]

const statusOptions = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
]

export default function TasksPage() {
  const { taskStats, tasksByRole, refetch } = useTasks()
  const { phases } = usePhases()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [isCreating, setIsCreating] = React.useState(false)
  const [newTask, setNewTask] = React.useState({
    title: '',
    role: 'backend',
    phase_id: 1,
    priority: 'medium',
    status: 'backlog',
  })

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return
    
    setIsCreating(true)
    try {
      const taskId = `t${newTask.phase_id}-${Date.now()}`
      const response = await fetch('/api/v1/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: taskId,
          title: newTask.title.trim(),
          role: newTask.role,
          phase_id: newTask.phase_id,
          priority: newTask.priority,
          status: newTask.status,
        }),
      })
      
      if (response.ok) {
        setDialogOpen(false)
        setNewTask({ title: '', role: 'backend', phase_id: 1, priority: 'medium', status: 'backlog' })
        refetch()
      } else {
        const error = await response.json()
        alert(`Failed to create task: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error creating task:', error)
      alert('Failed to create task. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="flex flex-col h-full p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold">Task Board</h1>
          <p className="text-muted-foreground text-lg">
            Kanban-style task management across all development phases
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="lg" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button size="lg" onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 shrink-0">
        <Card>
          <CardContent className="py-5">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 p-3 rounded-xl">
                <ListTodo className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-3xl font-bold">{taskStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <div className="flex items-center gap-4">
              <div className="bg-success/10 p-3 rounded-xl">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-3xl font-bold">{taskStats.done}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500/10 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-3xl font-bold">{taskStats.inProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{taskStats.completionRate}%</p>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
            </div>
            <Progress
              value={taskStats.completionRate}
              className="mt-3 h-1.5"
              indicatorClassName="bg-primary"
            />
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      <Card className="shrink-0">
        <CardContent className="py-5">
          <h3 className="font-semibold text-lg mb-4">Tasks by Role</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(tasksByRole).map(([role, tasks]) => (
              <div
                key={role}
                className="flex items-center gap-3 rounded-xl border px-4 py-2.5"
              >
                <span className="text-base font-medium capitalize">
                  {role.replace('-', ' ')}
                </span>
                <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-bold">
                  {tasks.length}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task Board - Flex grow to fill remaining space */}
      <div className="flex-1 min-h-0">
        <TaskBoard />
      </div>

      {/* Add Task Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[540px] p-0 gap-0 overflow-hidden">
          {/* Header with gradient */}
          <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
            <div className="flex items-start gap-5">
              <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center shadow-lg">
                <ListTodo className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1 pt-1">
                <DialogHeader className="space-y-1 text-left">
                  <DialogTitle className="text-2xl font-bold">Add New Task</DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground">
                    Create a new task for the project
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 py-6 space-y-5">
            {/* Task Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">
                Task Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Implement user authentication"
                className="h-12 text-base bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl"
              />
            </div>

            {/* Role & Phase */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Role</Label>
                <Select
                  value={newTask.role}
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Phase</Label>
                <Select
                  value={String(newTask.phase_id)}
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, phase_id: parseInt(value) }))}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {phases.map((phase) => (
                      <SelectItem key={phase.id} value={String(phase.id)}>
                        Phase {phase.id}: {phase.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Priority & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-2.5 w-2.5 rounded-full" 
                            style={{ backgroundColor: priority.color }}
                          />
                          {priority.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Status</Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="px-8 py-5 bg-muted/30 border-t gap-3">
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              disabled={isCreating}
              className="h-11 px-6 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTask}
              disabled={!newTask.title.trim() || isCreating}
              className="h-11 px-6 rounded-xl"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
