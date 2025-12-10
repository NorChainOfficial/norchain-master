'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { 
  Server, 
  Plus,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Loader2,
  Globe,
  AlertTriangle,
  ArrowUpRight,
  RotateCcw,
  Activity,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProject } from '@/contexts/ProjectContext'

interface Environment {
  id: string
  name: string
  type: string
  url: string | null
  status: string
  provider: string | null
  last_deploy_at: string | null
  project_id: string
}

interface Deployment {
  id: string
  environment_id: string
  version: string | null
  commit_sha: string | null
  commit_message: string | null
  branch: string | null
  status: string
  deployed_by: string | null
  started_at: string | null
  completed_at: string | null
  duration_ms: number | null
}

interface HealthCheck {
  id: string
  environment_id: string
  name: string
  endpoint: string
  status: string
  last_response_time_ms: number | null
  last_checked_at: string | null
  consecutive_failures: number
}

const envTypeColors: Record<string, string> = {
  development: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  staging: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  production: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  preview: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
}

const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  healthy: CheckCircle2,
  degraded: AlertTriangle,
  down: XCircle,
  unknown: Clock,
  deploying: Loader2,
  success: CheckCircle2,
  failed: XCircle,
  pending: Clock,
  queued: Clock,
  building: Loader2,
  cancelled: XCircle,
  rolled_back: RotateCcw,
}

const statusColors: Record<string, string> = {
  healthy: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  degraded: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  down: 'bg-red-500/15 text-red-600 dark:text-red-400',
  unknown: 'bg-slate-500/15 text-slate-600 dark:text-slate-400',
  deploying: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  failed: 'bg-red-500/15 text-red-600 dark:text-red-400',
  pending: 'bg-slate-500/15 text-slate-600 dark:text-slate-400',
  queued: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  building: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  cancelled: 'bg-slate-500/15 text-slate-600 dark:text-slate-400',
  rolled_back: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
}

export default function DeploymentsPage() {
  const [environments, setEnvironments] = useState<Environment[]>([])
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newEnvOpen, setNewEnvOpen] = useState(false)
  const [newEnv, setNewEnv] = useState({ name: '', type: 'development', url: '', provider: 'vercel' })
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
      const [envsRes, deploysRes, healthRes] = await Promise.all([
        fetch(`/api/v1/deployments/environments?project_id=${currentProject.id}`),
        fetch(`/api/v1/deployments?project_id=${currentProject.id}&limit=30`),
        fetch(`/api/v1/deployments/health-checks?project_id=${currentProject.id}`),
      ])

      if (envsRes.ok) {
        const data = await envsRes.json()
        setEnvironments(data)
      }

      if (deploysRes.ok) {
        const data = await deploysRes.json()
        setDeployments(data)
      }

      if (healthRes.ok) {
        const data = await healthRes.json()
        setHealthChecks(data)
      }
    } catch (error) {
      console.error('Failed to fetch deployment data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createEnvironment = async () => {
    if (!currentProject || !newEnv.name) return

    try {
      const response = await fetch('/api/v1/deployments/environments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEnv,
          project_id: currentProject.id,
        }),
      })

      if (response.ok) {
        setNewEnvOpen(false)
        setNewEnv({ name: '', type: 'development', url: '', provider: 'vercel' })
        fetchData()
      }
    } catch (error) {
      console.error('Failed to create environment:', error)
    }
  }

  const triggerDeploy = async (environmentId: string) => {
    try {
      const response = await fetch('/api/v1/deployments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          environment_id: environmentId,
          deployed_by: 'dashboard',
          branch: 'main',
        }),
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Failed to trigger deployment:', error)
    }
  }

  // Calculate stats
  const healthyEnvs = environments.filter(e => e.status === 'healthy').length
  const degradedEnvs = environments.filter(e => e.status === 'degraded').length
  const downEnvs = environments.filter(e => e.status === 'down').length
  const recentDeploys = deployments.slice(0, 10)

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Server className="h-5 w-5 text-primary-foreground" />
            </div>
            Deployments
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor environments and deployment status
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchData} variant="outline" disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Dialog open={newEnvOpen} onOpenChange={setNewEnvOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Environment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Environment</DialogTitle>
                <DialogDescription>
                  Add a new deployment environment
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newEnv.name}
                    onChange={(e) => setNewEnv(s => ({ ...s, name: e.target.value }))}
                    placeholder="e.g., Production API"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newEnv.type}
                    onValueChange={(value) => setNewEnv(s => ({ ...s, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="preview">Preview</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Select
                    value={newEnv.provider}
                    onValueChange={(value) => setNewEnv(s => ({ ...s, provider: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vercel">Vercel</SelectItem>
                      <SelectItem value="railway">Railway</SelectItem>
                      <SelectItem value="aws">AWS</SelectItem>
                      <SelectItem value="gcp">Google Cloud</SelectItem>
                      <SelectItem value="docker">Docker</SelectItem>
                      <SelectItem value="kubernetes">Kubernetes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={newEnv.url}
                    onChange={(e) => setNewEnv(s => ({ ...s, url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={createEnvironment}>Add Environment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{environments.length}</p>
                <p className="text-sm text-muted-foreground">Environments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{healthyEnvs}</p>
                <p className="text-sm text-muted-foreground">Healthy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{degradedEnvs}</p>
                <p className="text-sm text-muted-foreground">Degraded</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{downEnvs}</p>
                <p className="text-sm text-muted-foreground">Down</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Environments
          </CardTitle>
          <CardDescription>
            Monitor your deployment environments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {environments.map((env) => {
              const StatusIcon = statusIcons[env.status] || Clock
              const envHealthChecks = healthChecks.filter(h => h.environment_id === env.id)
              const envDeployments = deployments.filter(d => d.environment_id === env.id)
              const lastDeploy = envDeployments[0]

              return (
                <Card key={env.id} className="relative overflow-hidden">
                  <div className={cn(
                    "absolute top-0 left-0 right-0 h-1",
                    env.status === 'healthy' && 'bg-emerald-500',
                    env.status === 'degraded' && 'bg-amber-500',
                    env.status === 'down' && 'bg-red-500',
                    env.status === 'unknown' && 'bg-slate-400',
                    env.status === 'deploying' && 'bg-blue-500'
                  )} />
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center",
                          statusColors[env.status]
                        )}>
                          <StatusIcon className={cn(
                            "h-5 w-5",
                            (env.status === 'deploying') && "animate-spin"
                          )} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{env.name}</h3>
                          <Badge variant="outline" className={cn("text-xs capitalize", envTypeColors[env.type])}>
                            {env.type}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {env.url && (
                      <a
                        href={env.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline mb-3"
                      >
                        <span className="truncate">{env.url}</span>
                        <ArrowUpRight className="h-3 w-3 shrink-0" />
                      </a>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Provider</span>
                        <span className="capitalize">{env.provider || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Last Deploy</span>
                        <span>
                          {env.last_deploy_at 
                            ? new Date(env.last_deploy_at).toLocaleDateString()
                            : 'Never'
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Health Checks</span>
                        <span>{envHealthChecks.length}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => triggerDeploy(env.id)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Deploy
                      </Button>
                      {lastDeploy && lastDeploy.status === 'success' && (
                        <Button size="sm" variant="outline">
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Rollback
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {environments.length === 0 && !isLoading && (
              <div className="col-span-full text-center py-12">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Server className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium mb-1">No environments yet</p>
                <p className="text-sm text-muted-foreground">
                  Add your first environment to get started
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Deployments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Deployments
          </CardTitle>
          <CardDescription>
            Latest deployment activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {recentDeploys.map((deploy) => {
                const StatusIcon = statusIcons[deploy.status] || Clock
                const env = environments.find(e => e.id === deploy.environment_id)

                return (
                  <div
                    key={deploy.id}
                    className="p-4 rounded-xl border bg-card flex items-center gap-4"
                  >
                    <div className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                      statusColors[deploy.status]
                    )}>
                      <StatusIcon className={cn(
                        "h-5 w-5",
                        (deploy.status === 'building' || deploy.status === 'deploying') && "animate-spin"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">
                          {env?.name || 'Unknown Environment'}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn('text-xs capitalize', statusColors[deploy.status])}
                        >
                          {deploy.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {deploy.branch && (
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {deploy.branch}
                          </span>
                        )}
                        {deploy.commit_sha && (
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {deploy.commit_sha.slice(0, 7)}
                          </code>
                        )}
                        {deploy.deployed_by && (
                          <span>by {deploy.deployed_by}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm">
                        {deploy.started_at 
                          ? new Date(deploy.started_at).toLocaleDateString()
                          : '-'
                        }
                      </p>
                      {deploy.duration_ms && (
                        <p className="text-xs text-muted-foreground">
                          {(deploy.duration_ms / 1000).toFixed(1)}s
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}

              {deployments.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No deployments yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Deploy to an environment to see history here
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

