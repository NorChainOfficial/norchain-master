'use client'

import { useActivityFeed } from '@/hooks/useGitHub'
import reposData from '@/data/repos.json'
import { cn, formatRelativeTime } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  GitCommit,
  GitPullRequest,
  AlertCircle,
  Tag,
  Target,
  ExternalLink,
  Activity,
} from 'lucide-react'
import type { Activity as ActivityType, Repository } from '@/types'

export function ActivityFeed() {
  const repos = reposData as Repository[]
  const repoNames = repos.map((r) => r.name)
  const { data: activities, isLoading } = useActivityFeed(repoNames, 20)

  return (
    <Card variant="glass" className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 shrink-0">
            <Activity className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex flex-col justify-center">
            <CardTitle className="text-lg leading-tight">Recent Activity</CardTitle>
            <p className="text-sm text-muted-foreground leading-tight mt-0.5">
              Across all repositories
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {isLoading ? (
              <ActivityFeedSkeleton />
            ) : activities && activities.length > 0 ? (
              activities.map((activity, index) => (
                <ActivityItem key={activity.id} activity={activity} index={index} />
              ))
            ) : (
              <EmptyActivityState />
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

interface ActivityItemProps {
  activity: ActivityType
  index: number
}

function ActivityItem({ activity, index }: ActivityItemProps) {
  const TypeIcon = getActivityIcon(activity.type)
  const typeConfig = {
    commit: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    issue: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    pr: { color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    release: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    milestone: { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
  }

  const config = typeConfig[activity.type]

  return (
    <a
      href={activity.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group flex gap-3 rounded-xl border p-3 transition-all duration-200',
        'hover:bg-muted/50 hover:border-primary/20 hover:shadow-md',
        'animate-slide-up opacity-0'
      )}
      style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'forwards' }}
    >
      {/* Icon */}
      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border', config.bg, config.border)}>
        <TypeIcon className={cn('h-4 w-4', config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {activity.title}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {activity.repo}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            {activity.author}
          </span>
          <span className="text-[10px] text-muted-foreground">
            • {formatRelativeTime(activity.timestamp)}
          </span>
        </div>
      </div>

      {/* External link indicator */}
      <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
    </a>
  )
}

function getActivityIcon(type: ActivityType['type']) {
  switch (type) {
    case 'commit':
      return GitCommit
    case 'pr':
      return GitPullRequest
    case 'issue':
      return AlertCircle
    case 'release':
      return Tag
    case 'milestone':
      return Target
    default:
      return GitCommit
  }
}

function ActivityFeedSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3 rounded-xl border p-3">
          <div className="h-9 w-9 rounded-lg skeleton shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 skeleton rounded w-full" />
            <div className="h-3 skeleton rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyActivityState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-3">
        <GitCommit className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium">No recent activity</p>
      <p className="text-xs text-muted-foreground mt-1">
        Activity from repositories will appear here
      </p>
    </div>
  )
}

// Compact activity timeline for smaller displays
export function ActivityTimeline() {
  const repos = reposData as Repository[]
  const repoNames = repos.map((r) => r.name)
  const { data: activities } = useActivityFeed(repoNames, 10)

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary/50 to-border" />

      <div className="space-y-3">
        {activities?.slice(0, 5).map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 relative">
            <div
              className={cn(
                'relative z-10 h-6 w-6 rounded-full flex items-center justify-center border-2 border-background',
                activity.type === 'commit' && 'bg-blue-500',
                activity.type === 'pr' && 'bg-purple-500',
                activity.type === 'issue' && 'bg-amber-500'
              )}
            >
              {activity.type === 'commit' && (
                <GitCommit className="h-3 w-3 text-white" />
              )}
              {activity.type === 'pr' && (
                <GitPullRequest className="h-3 w-3 text-white" />
              )}
              {activity.type === 'issue' && (
                <AlertCircle className="h-3 w-3 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-xs truncate">{activity.title}</p>
              <p className="text-[10px] text-muted-foreground">
                {activity.repo} • {formatRelativeTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
