'use client'

import { TaskBoard } from '@/components/dashboard/TaskBoard'
import { useTasks } from '@/hooks/useTasks'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ListTodo, CheckCircle2, Clock, Layers } from 'lucide-react'

export default function TasksPage() {
  const { taskStats, tasksByRole } = useTasks()

  return (
    <div className="flex flex-col h-full p-8 space-y-6">
      {/* Header */}
      <div className="shrink-0">
        <h1 className="text-3xl font-bold">Task Board</h1>
        <p className="text-muted-foreground text-lg">
          Kanban-style task management across all development phases
        </p>
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
    </div>
  )
}
