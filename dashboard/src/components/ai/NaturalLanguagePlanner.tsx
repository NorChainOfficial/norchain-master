'use client'

import * as React from 'react'
import { useState } from 'react'
import { 
  Wand2, 
  Loader2, 
  Plus,
  Layers,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useProject } from '@/contexts/ProjectContext'
import type { Plan } from '@/lib/ai/claude'

const roleColors: Record<string, string> = {
  blockchain: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  contract: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
  backend: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  frontend: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  'mobile-ios': 'bg-pink-500/15 text-pink-600 dark:text-pink-400',
  'mobile-android': 'bg-green-500/15 text-green-600 dark:text-green-400',
  devops: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
}

interface NaturalLanguagePlannerProps {
  onPlanCreated?: (plan: Plan) => void
  className?: string
}

export function NaturalLanguagePlanner({ onPlanCreated, className }: NaturalLanguagePlannerProps) {
  const [prompt, setPrompt] = useState('')
  const [plan, setPlan] = useState<Plan | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([0]))
  const { currentProject } = useProject()

  const generatePlan = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/v1/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          projectContext: currentProject
            ? {
                name: currentProject.name,
                description: currentProject.description,
                aiContext: currentProject.ai_context,
              }
            : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate plan')
      }

      const data = await response.json()
      setPlan(data.plan)
      setExpandedPhases(new Set([0])) // Expand first phase by default
    } catch (error) {
      console.error('Failed to generate plan:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePhase = (index: number) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const applyPlan = () => {
    if (plan && onPlanCreated) {
      onPlanCreated(plan)
    }
    // TODO: Actually create phases and tasks in the database
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wand2 className="h-5 w-5 text-primary" />
          Natural Language Planner
        </CardTitle>
        <CardDescription>
          Describe what you want to build and let AI create a project plan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input */}
        <div className="space-y-3">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your feature or project... e.g., 'Create a wallet integration with support for NOR, PM-EQ, and NV-EQ tokens including transaction history and balance display'"
            className="min-h-[100px] resize-none"
          />
          <Button
            onClick={generatePlan}
            disabled={!prompt.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating Plan...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Plan
              </>
            )}
          </Button>
        </div>

        {/* Generated Plan */}
        {plan && plan.phases.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Generated Plan</h3>
              <Badge variant="outline">
                {plan.phases.length} phases, {plan.phases.reduce((acc, p) => acc + p.tasks.length, 0)} tasks
              </Badge>
            </div>

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {plan.phases.map((phase, phaseIndex) => (
                  <Collapsible
                    key={phaseIndex}
                    open={expandedPhases.has(phaseIndex)}
                    onOpenChange={() => togglePhase(phaseIndex)}
                  >
                    <div className="rounded-xl border bg-card">
                      <CollapsibleTrigger asChild>
                        <button className="w-full p-4 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors rounded-t-xl">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Layers className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{phase.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {phase.duration}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {phase.tasks.length} tasks
                            </p>
                          </div>
                          {expandedPhases.has(phaseIndex) ? (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-4 pb-4 space-y-2">
                          <p className="text-sm text-muted-foreground mb-3">
                            {phase.description}
                          </p>
                          {phase.tasks.map((task, taskIndex) => (
                            <div
                              key={taskIndex}
                              className="p-3 rounded-lg bg-muted/50 flex items-start gap-3"
                            >
                              <div className="h-6 w-6 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                                <Plus className="h-3 w-3" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium">
                                    {task.title}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      'text-xs capitalize',
                                      roleColors[task.role] || 'bg-slate-500/15'
                                    )}
                                  >
                                    {task.role}
                                  </Badge>
                                </div>
                                {task.description && (
                                  <p className="text-xs text-muted-foreground">
                                    {task.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Button onClick={applyPlan} className="flex-1">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Apply Plan to Project
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPlan(null)
                  setPrompt('')
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

