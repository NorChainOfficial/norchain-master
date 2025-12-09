'use client'

import { TaskBoard } from '@/components/dashboard/TaskBoard'
import { useTasks } from '@/hooks/useTasks'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ListTodo, CheckCircle2, Clock, Layers } from 'lucide-react'

export default function TasksPage() {
  const { taskStats, tasksByRole } = useTasks()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Task Board</h1>
        <p className="text-muted-foreground">
          Kanban-style task management across all development phases
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <ListTodo className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{taskStats.total}</p>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="bg-success/10 p-2 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{taskStats.done}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500/10 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{taskStats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="bg-norchain-500/10 p-2 rounded-lg">
                <Layers className="h-5 w-5 text-norchain-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{taskStats.completionRate}%</p>
                <p className="text-xs text-muted-foreground">Complete</p>
              </div>
            </div>
            <Progress
              value={taskStats.completionRate}
              className="mt-2 h-1"
              indicatorClassName="bg-norchain-400"
            />
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      <Card>
        <CardContent className="py-4">
          <h3 className="font-medium mb-3">Tasks by Role</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(tasksByRole).map(([role, tasks]) => (
              <div
                key={role}
                className="flex items-center gap-2 rounded-md border px-3 py-1.5"
              >
                <span className="text-sm capitalize">
                  {role.replace('-', ' ')}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                  {tasks.length}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Task Board */}
      <TaskBoard />
    </div>
  )
}

