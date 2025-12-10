'use client'

import { usePhases } from '@/hooks/usePhases'
import { useTasks } from '@/hooks/useTasks'
import { useCompliance } from '@/hooks/useCompliance'
import reposData from '@/data/repos.json'
import { cn } from '@/lib/utils'
import {
  Layers,
  ListTodo,
  GitBranch,
  Shield,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
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
      value: currentPhase.name,
      subtext: `Phase ${currentPhase.id} of ${totalPhases}`,
      icon: Layers,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/10',
      textColor: 'text-indigo-500',
      trend: null,
    },
    {
      label: 'Overall Progress',
      value: `${overallProgress}%`,
      subtext: 'Across all phases',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-500',
      trend: { value: 5, positive: true },
    },
    {
      label: 'Tasks Complete',
      value: `${taskStats.done}/${taskStats.total}`,
      subtext: `${taskStats.completionRate}% completion rate`,
      icon: ListTodo,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-500',
      trend: { value: 12, positive: true },
    },
    {
      label: 'Repositories',
      value: repos.length.toString(),
      subtext: `${repos.filter((r) => r.visibility === 'public').length} public`,
      icon: GitBranch,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-500/10',
      textColor: 'text-violet-500',
      trend: null,
    },
    {
      label: 'Compliance',
      value: `${complianceStats.completionRate}%`,
      subtext: `${complianceStats.pending} items pending`,
      icon: Shield,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-500',
      trend: { value: 8, positive: true },
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} stat={stat} index={index} />
      ))}
    </div>
  )
}

interface StatCardProps {
  stat: {
    label: string
    value: string
    subtext: string
    icon: React.ElementType
    color: string
    bgColor: string
    textColor: string
    trend: { value: number; positive: boolean } | null
  }
  index: number
}

function StatCard({ stat, index }: StatCardProps) {
  const Icon = stat.icon

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all duration-300',
        'hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20',
        'hover:-translate-y-1 hover:border-primary/20',
        'animate-slide-up opacity-0'
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
    >
      {/* Background gradient */}
      <div className={cn(
        'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        'bg-gradient-to-br',
        stat.color
      )} style={{ opacity: 0.03 }} />

      {/* Content */}
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('rounded-xl p-3.5 shrink-0', stat.bgColor)}>
            <Icon className={cn('h-7 w-7', stat.textColor)} />
          </div>
          {stat.trend && (
            <div className={cn(
              'flex items-center gap-1 text-sm font-semibold',
              stat.trend.positive ? 'text-emerald-500' : 'text-red-500'
            )}>
              {stat.trend.positive ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              {stat.trend.value}%
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <p className="text-3xl font-bold tracking-tight tabular-nums leading-none">
            {stat.value}
          </p>
          <p className="text-base font-semibold text-muted-foreground leading-tight">
            {stat.label}
          </p>
          <p className="text-sm text-muted-foreground/70 leading-tight">
            {stat.subtext}
          </p>
        </div>
      </div>
    </div>
  )
}

// Mini stats row for header
export function MiniStats() {
  const { currentPhase, overallProgress } = usePhases()
  const { taskStats } = useTasks()

  return (
    <div className="flex items-center gap-8 text-base">
      <div className="flex items-center gap-3">
        <Layers className="h-5 w-5 text-primary" />
        <span className="text-muted-foreground">Phase</span>
        <span className="font-bold tabular-nums">{currentPhase.id}</span>
      </div>
      <div className="flex items-center gap-3">
        <TrendingUp className="h-5 w-5 text-emerald-500" />
        <span className="text-muted-foreground">Progress</span>
        <span className="font-bold tabular-nums">{overallProgress}%</span>
      </div>
      <div className="flex items-center gap-3">
        <ListTodo className="h-5 w-5 text-blue-500" />
        <span className="text-muted-foreground">Active</span>
        <span className="font-bold tabular-nums">{taskStats.inProgress}</span>
      </div>
    </div>
  )
}
