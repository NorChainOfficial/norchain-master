'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Circle, Clock, ChevronRight } from 'lucide-react'
import type { Phase } from '@/types'

interface PhaseCardProps {
  phase: Phase
  isActive?: boolean
  onClick?: () => void
}

export function PhaseCard({ phase, isActive = false, onClick }: PhaseCardProps) {
  const StatusIcon = phase.status === 'complete'
    ? CheckCircle2
    : phase.status === 'active'
      ? Clock
      : Circle

  const statusColors = {
    complete: 'border-success/30 bg-success/5',
    active: 'border-norchain-500/30 bg-norchain-500/5',
    pending: 'border-border bg-card',
  }

  const completedDeliverables = phase.deliverables.filter(
    (d) => d.status === 'complete'
  ).length

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        statusColors[phase.status],
        isActive && 'ring-2 ring-norchain-500'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon
              className={cn(
                'h-4 w-4',
                phase.status === 'complete' && 'text-success',
                phase.status === 'active' && 'text-norchain-400',
                phase.status === 'pending' && 'text-muted-foreground'
              )}
            />
            <CardTitle className="text-sm font-medium">
              Phase {phase.id}
            </CardTitle>
          </div>
          <Badge
            variant={phase.status}
            className="text-xs"
          >
            {phase.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold mb-1">{phase.name}</h3>
        <p className="text-xs text-muted-foreground mb-3">{phase.focus}</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{phase.progress}%</span>
          </div>
          <Progress
            value={phase.progress}
            className="h-1.5"
            indicatorClassName={cn(
              phase.status === 'complete' && 'bg-success',
              phase.status === 'active' && 'bg-norchain-400',
              phase.status === 'pending' && 'bg-muted-foreground'
            )}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {completedDeliverables}/{phase.deliverables.length} deliverables
          </span>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{phase.duration}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center text-xs text-norchain-400">
          <span>View details</span>
          <ChevronRight className="h-3 w-3" />
        </div>
      </CardContent>
    </Card>
  )
}

// Grid of all phase cards
export function PhaseGrid() {
  // Import phases from hook
  const phasesData = require('@/data/phases.json') as Phase[]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {phasesData.map((phase) => (
        <PhaseCard
          key={phase.id}
          phase={phase}
          isActive={phase.status === 'active'}
        />
      ))}
    </div>
  )
}

