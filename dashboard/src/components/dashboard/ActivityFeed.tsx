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
} from 'lucide-react'
import type { Activity, Repository } from '@/types'

export function ActivityFeed() {
  const repos = reposData as Repository[]
  const repoNames = repos.map((r) => r.name)
  const { data: activities, isLoading } = useActivityFeed(repoNames, 20)

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4 pr-4">
            {isLoading ? (
              <ActivityFeedSkeleton />
            ) : activities && activities.length > 0 ? (
              activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
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
  activity: Activity
}

function ActivityItem({ activity }: ActivityItemProps) {
  const TypeIcon = getActivityIcon(activity.type)
  const typeColors = {
    commit: 'text-blue-400 bg-blue-500/10',
    issue: 'text-yellow-400 bg-yellow-500/10',
    pr: 'text-purple-400 bg-purple-500/10',
    release: 'text-green-400 bg-green-500/10',
    milestone: 'text-norchain-400 bg-norchain-500/10',
  }

  return (
    <div className="flex gap-3 group">
      {/* Icon */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
          typeColors[activity.type]
        )}
      >
        <TypeIcon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm leading-tight truncate">{activity.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {activity.repo}
              </Badge>
              <span className="text-xs text-muted-foreground">
                by {activity.author}
              </span>
            </div>
          </div>
          <a
            href={activity.url}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          >
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </a>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {formatRelativeTime(activity.timestamp)}
        </p>
      </div>
    </div>
  )
}

function getActivityIcon(type: Activity['type']) {
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
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3 animate-pulse">
          <div className="h-8 w-8 rounded-lg bg-muted shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyActivityState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <GitCommit className="h-8 w-8 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">No recent activity</p>
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
      <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />

      <div className="space-y-3">
        {activities?.slice(0, 5).map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 relative">
            <div
              className={cn(
                'relative z-10 h-6 w-6 rounded-full flex items-center justify-center',
                activity.type === 'commit' && 'bg-blue-500/20',
                activity.type === 'pr' && 'bg-purple-500/20',
                activity.type === 'issue' && 'bg-yellow-500/20'
              )}
            >
              {activity.type === 'commit' && (
                <GitCommit className="h-3 w-3 text-blue-400" />
              )}
              {activity.type === 'pr' && (
                <GitPullRequest className="h-3 w-3 text-purple-400" />
              )}
              {activity.type === 'issue' && (
                <AlertCircle className="h-3 w-3 text-yellow-400" />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-xs truncate">{activity.title}</p>
              <p className="text-xs text-muted-foreground">
                {activity.repo} • {formatRelativeTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

