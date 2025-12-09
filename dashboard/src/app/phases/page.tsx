'use client'

import { usePhases } from '@/hooks/usePhases'
import { PhaseCard } from '@/components/dashboard/PhaseCard'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PhasesPage() {
  const { phases, currentPhase, overallProgress, completedPhases, totalPhases } =
    usePhases()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Development Phases</h1>
          <p className="text-muted-foreground">
            Track progress across all 10 development phases
          </p>
        </div>
        <Badge variant="active" className="text-sm px-4 py-1">
          Phase {currentPhase.id}: {currentPhase.name}
        </Badge>
      </div>

      {/* Overall Progress Card */}
      <Card className="bg-gradient-to-r from-norchain-500/10 to-norchain-600/5 border-norchain-500/20">
        <CardContent className="py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Overall Progress</h2>
              <p className="text-sm text-muted-foreground">
                {completedPhases} of {totalPhases} phases completed
              </p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-bold text-norchain-400">
                {overallProgress}%
              </span>
            </div>
          </div>
          <Progress
            value={overallProgress}
            className="h-3"
            indicatorClassName="bg-norchain-500"
          />
        </CardContent>
      </Card>

      {/* Phase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {phases.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            isActive={phase.id === currentPhase.id}
          />
        ))}
      </div>

      {/* Current Phase Detail */}
      <Card>
        <CardHeader>
          <CardTitle>
            Phase {currentPhase.id}: {currentPhase.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{currentPhase.focus}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progress */}
            <div>
              <h3 className="font-medium mb-3">Progress</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Current</span>
                  <span className="font-medium">{currentPhase.progress}%</span>
                </div>
                <Progress
                  value={currentPhase.progress}
                  className="h-2"
                  indicatorClassName="bg-norchain-400"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Duration: {currentPhase.duration}
                </p>
              </div>
            </div>

            {/* Deliverables */}
            <div>
              <h3 className="font-medium mb-3">Deliverables</h3>
              <div className="space-y-2">
                {currentPhase.deliverables.map((deliverable) => (
                  <div
                    key={deliverable.name}
                    className="flex items-center justify-between rounded-md border px-3 py-2"
                  >
                    <span className="text-sm">{deliverable.name}</span>
                    <Badge
                      variant={
                        deliverable.status === 'complete'
                          ? 'success'
                          : deliverable.status === 'in_progress'
                            ? 'active'
                            : 'pending'
                      }
                      className="text-xs"
                    >
                      {deliverable.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

