'use client'

import { usePhases } from '@/hooks/usePhases'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CheckCircle2, Circle, Clock } from 'lucide-react'

export function PhaseProgress() {
  const { phases, currentPhase, overallProgress } = usePhases()

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Development Progress</CardTitle>
          <Badge variant="active">Phase {currentPhase.id}: {currentPhase.name}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Overall Progress Bar */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Completion</span>
            <span className="font-medium">{overallProgress}%</span>
          </div>
          <Progress 
            value={overallProgress} 
            className="h-2"
            indicatorClassName="bg-norchain-500"
          />
        </div>

        {/* Phase Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-6 h-[calc(100%-48px)] w-0.5 bg-border" />

          {/* Phase Items */}
          <div className="space-y-4">
            {phases.map((phase) => (
              <PhaseItem key={phase.id} phase={phase} isActive={phase.id === currentPhase.id} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface PhaseItemProps {
  phase: {
    id: number
    name: string
    focus: string
    duration: string
    status: 'pending' | 'active' | 'complete'
    progress: number
    deliverables: Array<{ name: string; status: string; description?: string }>
  }
  isActive: boolean
}

function PhaseItem({ phase, isActive }: PhaseItemProps) {
  const StatusIcon = phase.status === 'complete' 
    ? CheckCircle2 
    : phase.status === 'active' 
      ? Clock 
      : Circle

  const statusColors = {
    complete: 'text-success bg-success/10 border-success/20',
    active: 'text-norchain-400 bg-norchain-500/10 border-norchain-500/20',
    pending: 'text-muted-foreground bg-muted border-border',
  }

  return (
    <div className={cn('relative flex gap-4', isActive && 'animate-in')}>
      {/* Status Icon */}
      <div
        className={cn(
          'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
          statusColors[phase.status]
        )}
      >
        <StatusIcon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            'text-sm font-medium',
            phase.status === 'pending' && 'text-muted-foreground'
          )}>
            Phase {phase.id}: {phase.name}
          </span>
          <Badge variant="outline" className="text-xs">
            {phase.duration}
          </Badge>
        </div>
        
        <p className="text-xs text-muted-foreground mb-2">{phase.focus}</p>

        {/* Progress for active phase */}
        {phase.status === 'active' && (
          <div className="mb-2">
            <Progress 
              value={phase.progress} 
              className="h-1.5"
              indicatorClassName="bg-norchain-400"
            />
          </div>
        )}

        {/* Deliverables Preview */}
        <div className="flex flex-wrap gap-1">
          {phase.deliverables.slice(0, 4).map((deliverable) => (
            <Tooltip key={deliverable.name}>
              <TooltipTrigger>
                <Badge
                  variant={
                    deliverable.status === 'complete'
                      ? 'success'
                      : deliverable.status === 'in_progress'
                        ? 'active'
                        : 'pending'
                  }
                  className="text-xs cursor-default"
                >
                  {deliverable.name}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{deliverable.description || deliverable.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          {phase.deliverables.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{phase.deliverables.length - 4} more
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

// Compact version for sidebar or smaller spaces
export function PhaseProgressCompact() {
  const { phases, currentPhase } = usePhases()

  return (
    <div className="space-y-2">
      {phases.map((phase) => {
        const isActive = phase.id === currentPhase.id
        const isComplete = phase.status === 'complete'

        return (
          <div
            key={phase.id}
            className={cn(
              'flex items-center gap-2 rounded-md px-2 py-1.5',
              isActive && 'bg-norchain-500/10',
              isComplete && 'opacity-60'
            )}
          >
            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium',
                isComplete && 'bg-success text-success-foreground',
                isActive && 'bg-norchain-500 text-white',
                !isComplete && !isActive && 'bg-muted text-muted-foreground'
              )}
            >
              {isComplete ? '✓' : phase.id}
            </div>
            <span
              className={cn(
                'text-sm truncate',
                isActive && 'font-medium text-norchain-400',
                !isActive && !isComplete && 'text-muted-foreground'
              )}
            >
              {phase.name}
            </span>
          </div>
        )
      })}
    </div>
  )
}

