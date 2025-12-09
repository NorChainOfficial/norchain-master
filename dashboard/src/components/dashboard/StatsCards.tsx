'use client'

import { usePhases } from '@/hooks/usePhases'
import { useTasks } from '@/hooks/useTasks'
import { useCompliance } from '@/hooks/useCompliance'
import reposData from '@/data/repos.json'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Layers,
  ListTodo,
  GitBranch,
  Shield,
  TrendingUp,
  Clock,
} from 'lucide-react'
import type { Repository } from '@/types'

export function StatsCards() {
  const { currentPhase, overallProgress, totalPhases } = usePhases()
  const { taskStats } = useTasks()
  const { complianceStats } = useCompliance()
  const repos = reposData as Repository[]

  const stats = [
    {
      label: 'Current Phase',
      value: `${currentPhase.id}/${totalPhases}`,
      subtext: currentPhase.name,
      icon: Layers,
      color: 'text-norchain-400',
      bgColor: 'bg-norchain-500/10',
      progress: (currentPhase.id / totalPhases) * 100,
    },
    {
      label: 'Tasks Complete',
      value: `${taskStats.done}/${taskStats.total}`,
      subtext: `${taskStats.completionRate}% done`,
      icon: ListTodo,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      progress: taskStats.completionRate,
    },
    {
      label: 'Repositories',
      value: repos.length.toString(),
      subtext: `${repos.filter((r) => r.visibility === 'public').length} public`,
      icon: GitBranch,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Compliance',
      value: `${complianceStats.completionRate}%`,
      subtext: `${complianceStats.pending} items pending`,
      icon: Shield,
      color: 'text-success',
      bgColor: 'bg-success/10',
      progress: complianceStats.completionRate,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  subtext: string
  icon: React.ElementType
  color: string
  bgColor: string
  progress?: number
}

function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  color,
  bgColor,
  progress,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
          </div>
          <div className={`${bgColor} rounded-lg p-2`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
        {progress !== undefined && (
          <Progress
            value={progress}
            className="mt-4 h-1.5"
            indicatorClassName={bgColor.replace('/10', '')}
          />
        )}
      </CardContent>
    </Card>
  )
}

// Mini stats row for header
export function MiniStats() {
  const { currentPhase, overallProgress } = usePhases()
  const { taskStats } = useTasks()

  return (
    <div className="flex items-center gap-6 text-sm">
      <div className="flex items-center gap-2">
        <Layers className="h-4 w-4 text-norchain-400" />
        <span className="text-muted-foreground">Phase</span>
        <span className="font-medium">{currentPhase.id}</span>
      </div>
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-success" />
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium">{overallProgress}%</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-blue-400" />
        <span className="text-muted-foreground">Active</span>
        <span className="font-medium">{taskStats.inProgress}</span>
      </div>
    </div>
  )
}

