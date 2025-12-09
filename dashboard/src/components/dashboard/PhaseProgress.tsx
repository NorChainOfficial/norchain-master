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
import { CheckCircle2, Circle, Clock, Zap } from 'lucide-react'

export function PhaseProgress() {
  const { phases, currentPhase, overallProgress } = usePhases()

  return (
    <Card variant="glass">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 shrink-0">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col justify-center">
              <CardTitle className="text-lg leading-tight">Development Progress</CardTitle>
              <p className="text-sm text-muted-foreground leading-tight mt-0.5">
                Phase {currentPhase.id} of {phases.length}
              </p>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            {currentPhase.name}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Overall Progress Bar */}
        <div className="mb-6 p-4 rounded-xl bg-muted/50">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Completion</span>
            <span className="font-bold tabular-nums">{overallProgress}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-700 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Phase Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[18px] top-8 h-[calc(100%-64px)] w-0.5 bg-gradient-to-b from-primary/50 via-border to-border" />

          {/* Phase Items */}
          <div className="space-y-4">
            {phases.map((phase, index) => (
              <PhaseItem 
                key={phase.id} 
                phase={phase} 
                isActive={phase.id === currentPhase.id}
                index={index}
              />
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
  index: number
}

function PhaseItem({ phase, isActive, index }: PhaseItemProps) {
  const StatusIcon = phase.status === 'complete' 
    ? CheckCircle2 
    : phase.status === 'active' 
      ? Clock 
      : Circle

  return (
    <div 
      className={cn(
        'relative flex gap-4 animate-slide-up opacity-0',
        isActive && 'scale-[1.02]'
      )}
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
    >
      {/* Status Icon */}
      <div
        className={cn(
          'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-300',
          phase.status === 'complete' && 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
          phase.status === 'active' && 'bg-primary/10 border-primary/30 text-primary animate-pulse-glow',
          phase.status === 'pending' && 'bg-muted border-border text-muted-foreground'
        )}
      >
        <StatusIcon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className={cn(
        'flex-1 min-w-0 rounded-xl border p-4 transition-all duration-300',
        isActive ? 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5' : 'bg-card hover:bg-muted/50'
      )}>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-sm font-semibold',
              phase.status === 'pending' && 'text-muted-foreground'
            )}>
              Phase {phase.id}: {phase.name}
            </span>
            {isActive && (
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            )}
          </div>
          <Badge variant="outline" className="text-[10px] font-medium">
            {phase.duration}
          </Badge>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3">{phase.focus}</p>

        {/* Progress for active phase */}
        {phase.status === 'active' && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold tabular-nums">{phase.progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${phase.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Deliverables Preview */}
        <div className="flex flex-wrap gap-1.5">
          {phase.deliverables.slice(0, 4).map((deliverable) => (
            <Tooltip key={deliverable.name}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    'px-2 py-1 rounded-md text-[10px] font-medium cursor-default transition-colors',
                    deliverable.status === 'complete' && 'bg-emerald-500/10 text-emerald-500',
                    deliverable.status === 'in_progress' && 'bg-primary/10 text-primary',
                    deliverable.status === 'pending' && 'bg-muted text-muted-foreground'
                  )}
                >
                  {deliverable.name}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <p className="text-xs">{deliverable.description || deliverable.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          {phase.deliverables.length > 4 && (
            <div className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-[10px] font-medium">
              +{phase.deliverables.length - 4}
            </div>
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
              'flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all',
              isActive && 'bg-primary/10',
              isComplete && 'opacity-60'
            )}
          >
            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-md text-xs font-bold transition-colors',
                isComplete && 'bg-emerald-500 text-white',
                isActive && 'bg-primary text-white',
                !isComplete && !isActive && 'bg-muted text-muted-foreground'
              )}
            >
              {isComplete ? '✓' : phase.id}
            </div>
            <span
              className={cn(
                'text-sm truncate',
                isActive && 'font-medium text-primary',
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
