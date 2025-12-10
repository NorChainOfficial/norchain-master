'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { 
  TestTube, 
  Plus,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Loader2,
  Shield,
  Zap,
  Box,
  Globe,
  Wand2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProject } from '@/contexts/ProjectContext'

interface TestSuite {
  id: string
  name: string
  description: string
  type: string
  status: string
  project_id: string
  created_at: string
}

interface TestRun {
  id: string
  suite_id: string
  status: string
  triggered_by: string
  started_at: string | null
  completed_at: string | null
  duration_ms: number | null
  results: {
    passed?: number
    failed?: number
    skipped?: number
  }
}

const testTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  unit: Box,
  integration: Zap,
  e2e: Globe,
  security: Shield,
  penetration: Shield,
  performance: Zap,
}

const testTypeColors: Record<string, string> = {
  unit: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  integration: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
  e2e: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  security: 'bg-red-500/15 text-red-600 dark:text-red-400',
  penetration: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  performance: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
}

const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  running: Loader2,
  passed: CheckCircle2,
  failed: XCircle,
}

const statusColors: Record<string, string> = {
  pending: 'bg-slate-500/15 text-slate-600 dark:text-slate-400',
  running: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  passed: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  failed: 'bg-red-500/15 text-red-600 dark:text-red-400',
}

export default function TestingPage() {
  const [suites, setSuites] = useState<TestSuite[]>([])
  const [runs, setRuns] = useState<TestRun[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newSuiteOpen, setNewSuiteOpen] = useState(false)
  const [newSuite, setNewSuite] = useState({ name: '', description: '', type: 'unit' })
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
      const [suitesRes, runsRes] = await Promise.all([
        fetch(`/api/v1/testing/suites?project_id=${currentProject.id}`),
        fetch(`/api/v1/testing/runs?project_id=${currentProject.id}&limit=20`),
      ])

      if (suitesRes.ok) {
        const data = await suitesRes.json()
        setSuites(data)
      }

      if (runsRes.ok) {
        const data = await runsRes.json()
        setRuns(data)
      }
    } catch (error) {
      console.error('Failed to fetch testing data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createSuite = async () => {
    if (!currentProject || !newSuite.name) return

    try {
      const response = await fetch('/api/v1/testing/suites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSuite,
          project_id: currentProject.id,
        }),
      })

      if (response.ok) {
        setNewSuiteOpen(false)
        setNewSuite({ name: '', description: '', type: 'unit' })
        fetchData()
      }
    } catch (error) {
      console.error('Failed to create suite:', error)
    }
  }

  const runSuite = async (suiteId: string) => {
    try {
      const response = await fetch('/api/v1/testing/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suite_id: suiteId,
          triggered_by: 'dashboard',
        }),
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Failed to run suite:', error)
    }
  }

  // Calculate stats
  const totalRuns = runs.length
  const passedRuns = runs.filter(r => r.status === 'passed').length
  const failedRuns = runs.filter(r => r.status === 'failed').length
  const passRate = totalRuns > 0 ? Math.round((passedRuns / totalRuns) * 100) : 0

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <TestTube className="h-5 w-5 text-primary-foreground" />
            </div>
            Testing
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage test suites and monitor test execution
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchData} variant="outline" disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Dialog open={newSuiteOpen} onOpenChange={setNewSuiteOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Test Suite
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Test Suite</DialogTitle>
                <DialogDescription>
                  Create a new test suite for your project
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newSuite.name}
                    onChange={(e) => setNewSuite(s => ({ ...s, name: e.target.value }))}
                    placeholder="e.g., Smart Contract Unit Tests"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newSuite.type}
                    onValueChange={(value) => setNewSuite(s => ({ ...s, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unit">Unit Tests</SelectItem>
                      <SelectItem value="integration">Integration Tests</SelectItem>
                      <SelectItem value="e2e">End-to-End Tests</SelectItem>
                      <SelectItem value="security">Security Tests</SelectItem>
                      <SelectItem value="penetration">Penetration Tests</SelectItem>
                      <SelectItem value="performance">Performance Tests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newSuite.description}
                    onChange={(e) => setNewSuite(s => ({ ...s, description: e.target.value }))}
                    placeholder="Describe what this test suite covers..."
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={createSuite}>Create Suite</Button>
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
                <TestTube className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{suites.length}</p>
                <p className="text-sm text-muted-foreground">Test Suites</p>
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
                <p className="text-2xl font-bold">{passedRuns}</p>
                <p className="text-sm text-muted-foreground">Passed Runs</p>
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
                <p className="text-2xl font-bold">{failedRuns}</p>
                <p className="text-sm text-muted-foreground">Failed Runs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{passRate}%</p>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Suites */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Test Suites
            </CardTitle>
            <CardDescription>
              Manage your project&apos;s test suites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {suites.map((suite) => {
                  const TypeIcon = testTypeIcons[suite.type] || TestTube
                  const suiteRuns = runs.filter(r => r.suite_id === suite.id)
                  const lastRun = suiteRuns[0]

                  return (
                    <div
                      key={suite.id}
                      className="p-4 rounded-xl border bg-card"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                          testTypeColors[suite.type]
                        )}>
                          <TypeIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium truncate">{suite.name}</span>
                            <Badge variant="outline" className="text-xs capitalize">
                              {suite.type}
                            </Badge>
                          </div>
                          {suite.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {suite.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            <Button
                              size="sm"
                              className="h-7"
                              onClick={() => runSuite(suite.id)}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Run
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7"
                            >
                              <Wand2 className="h-3 w-3 mr-1" />
                              Generate Tests
                            </Button>
                            {lastRun && (
                              <Badge
                                variant="outline"
                                className={cn('text-xs capitalize', statusColors[lastRun.status])}
                              >
                                Last: {lastRun.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {suites.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <TestTube className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium mb-1">No test suites yet</p>
                    <p className="text-sm text-muted-foreground">
                      Create your first test suite to get started
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Runs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Recent Test Runs
            </CardTitle>
            <CardDescription>
              Latest test execution results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {runs.map((run) => {
                  const StatusIcon = statusIcons[run.status] || Clock
                  const suite = suites.find(s => s.id === run.suite_id)
                  const total = (run.results?.passed || 0) + (run.results?.failed || 0) + (run.results?.skipped || 0)
                  const passPercent = total > 0 ? ((run.results?.passed || 0) / total) * 100 : 0

                  return (
                    <div
                      key={run.id}
                      className="p-4 rounded-xl border bg-card"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                          statusColors[run.status]
                        )}>
                          <StatusIcon className={cn(
                            "h-5 w-5",
                            run.status === 'running' && "animate-spin"
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium truncate">
                              {suite?.name || 'Unknown Suite'}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn('text-xs capitalize', statusColors[run.status])}
                            >
                              {run.status}
                            </Badge>
                          </div>
                          {total > 0 && (
                            <div className="space-y-1 mt-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                  {run.results?.passed || 0} passed, {run.results?.failed || 0} failed
                                </span>
                                <span className="font-medium">{Math.round(passPercent)}%</span>
                              </div>
                              <Progress value={passPercent} className="h-1.5" />
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>Triggered by {run.triggered_by}</span>
                            {run.duration_ms && (
                              <>
                                <span>•</span>
                                <span>{(run.duration_ms / 1000).toFixed(1)}s</span>
                              </>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {run.started_at ? new Date(run.started_at).toLocaleDateString() : '-'}
                        </span>
                      </div>
                    </div>
                  )
                })}

                {runs.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No test runs yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Run a test suite to see results here
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

