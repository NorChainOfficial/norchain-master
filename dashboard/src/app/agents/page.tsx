'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { 
  Sparkles, 
  Bot,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  RefreshCw,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProject } from '@/contexts/ProjectContext'

interface AgentConfig {
  id: string
  task_type: string
  autonomy_level: string
  requires_approval: boolean
  enabled: boolean
  allowed_actions: string[]
}

interface AgentTask {
  id: string
  type: string
  title: string
  description: string
  autonomy_level: string
  status: string
  created_at: string
  started_at: string | null
  completed_at: string | null
  error_message: string | null
}

const autonomyLevels = [
  { value: 'suggest', label: 'Suggest Only', description: 'AI suggests, you decide' },
  { value: 'supervised', label: 'Supervised', description: 'AI acts with confirmation' },
  { value: 'autonomous', label: 'Autonomous', description: 'AI acts independently' },
]

const taskTypeLabels: Record<string, string> = {
  create_task: 'Create Tasks',
  update_status: 'Update Status',
  create_issue: 'Create GitHub Issues',
  deploy: 'Trigger Deployments',
  run_tests: 'Run Tests',
  generate_report: 'Generate Reports',
}

const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  queued: Clock,
  awaiting_approval: AlertTriangle,
  running: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
  cancelled: XCircle,
}

const statusColors: Record<string, string> = {
  pending: 'bg-slate-500/15 text-slate-600 dark:text-slate-400',
  queued: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  awaiting_approval: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  running: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  completed: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  failed: 'bg-red-500/15 text-red-600 dark:text-red-400',
  cancelled: 'bg-slate-500/15 text-slate-600 dark:text-slate-400',
}

export default function AgentsPage() {
  const [configs, setConfigs] = useState<AgentConfig[]>([])
  const [tasks, setTasks] = useState<AgentTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { currentProject } = useProject()

  useEffect(() => {
    if (currentProject) {
      fetchData()
    }
  }, [currentProject?.id])

  const fetchData = async () => {
    if (!currentProject) return
    setIsLoading(true)
    
    try {
      const [configsRes, tasksRes] = await Promise.all([
        fetch(`/api/v1/agents/configs?project_id=${currentProject.id}`),
        fetch(`/api/v1/agents/tasks?project_id=${currentProject.id}&limit=50`),
      ])

      if (configsRes.ok) {
        const data = await configsRes.json()
        setConfigs(data)
      }

      if (tasksRes.ok) {
        const data = await tasksRes.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Failed to fetch agent data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateConfig = async (configId: string, updates: Partial<AgentConfig>) => {
    try {
      const response = await fetch(`/api/v1/agents/configs/${configId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        setConfigs(prev => 
          prev.map(c => c.id === configId ? { ...c, ...updates } : c)
        )
      }
    } catch (error) {
      console.error('Failed to update config:', error)
    }
  }

  const approveTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/v1/agents/tasks/${taskId}/approve`, {
        method: 'POST',
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Failed to approve task:', error)
    }
  }

  const pendingApprovals = tasks.filter(t => t.status === 'awaiting_approval')

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            AI Agents
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure autonomous AI agents for your project
          </p>
        </div>
        <Button onClick={fetchData} variant="outline" disabled={isLoading}>
          <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Pending Approvals Alert */}
      {pendingApprovals.length > 0 && (
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Pending Approvals</h3>
                  <p className="text-sm text-muted-foreground">
                    {pendingApprovals.length} agent task(s) waiting for your approval
                  </p>
                </div>
              </div>
              <Button>Review All</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Agent Configurations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Agent Configurations
            </CardTitle>
            <CardDescription>
              Configure autonomy levels for different task types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {configs.map((config) => (
                  <div
                    key={config.id}
                    className="p-4 rounded-xl border bg-card"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {taskTypeLabels[config.task_type] || config.task_type}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {config.requires_approval ? 'Requires approval' : 'No approval needed'}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={config.enabled}
                        onCheckedChange={(enabled) => updateConfig(config.id, { enabled })}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Select
                        value={config.autonomy_level}
                        onValueChange={(value) => updateConfig(config.id, { autonomy_level: value })}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {autonomyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <label className="flex items-center gap-2 text-sm">
                        <Switch
                          checked={config.requires_approval}
                          onCheckedChange={(requires_approval) => 
                            updateConfig(config.id, { requires_approval })
                          }
                        />
                        Require Approval
                      </label>
                    </div>
                  </div>
                ))}

                {configs.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No agent configurations found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select a project to view configurations
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Task History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Task History
            </CardTitle>
            <CardDescription>
              Recent agent task executions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {tasks.map((task) => {
                  const StatusIcon = statusIcons[task.status] || Clock
                  return (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl border bg-card"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                          statusColors[task.status]
                        )}>
                          <StatusIcon className={cn(
                            "h-5 w-5",
                            task.status === 'running' && "animate-spin"
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm truncate">
                              {task.title}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn('text-xs capitalize', statusColors[task.status])}
                            >
                              {task.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {taskTypeLabels[task.type] || task.type}
                          </p>
                          {task.error_message && (
                            <p className="text-xs text-destructive">
                              {task.error_message}
                            </p>
                          )}
                          {task.status === 'awaiting_approval' && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                className="h-7"
                                onClick={() => approveTask(task.id)}
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7"
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {new Date(task.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )
                })}

                {tasks.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No agent tasks found</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Agent tasks will appear here when executed
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

