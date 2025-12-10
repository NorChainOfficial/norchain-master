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
  RefreshCw,
  Star,
  GitBranch,
} from 'lucide-react'
import type { Activity as ActivityType, Repository } from '@/types'

interface ActivityFeedProps {
  className?: string
  maxHeight?: string
}

export function ActivityFeed({ className, maxHeight }: ActivityFeedProps) {
  const repos = reposData as Repository[]
  const repoNames = repos.map((r) => r.name)
  const { data: activities, isLoading, refetch, isFetching } = useActivityFeed(repoNames, 30)

  return (
    <Card variant="glass" className={cn('flex flex-col', className)}>
      <CardHeader className="pb-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 shrink-0">
              <Activity className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex flex-col justify-center">
              <CardTitle className="text-xl leading-tight">Recent Activity</CardTitle>
              <p className="text-sm text-muted-foreground leading-tight mt-1">
                Live updates from all repositories
              </p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl border bg-muted/50',
              'hover:bg-muted hover:border-primary/30 transition-all duration-200',
              'disabled:opacity-50'
            )}
            title="Refresh activity"
          >
            <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className={cn('pr-4', maxHeight || 'h-full')} style={{ maxHeight: maxHeight || '100%' }}>
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
    commit: { 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10', 
      border: 'border-blue-500/20',
      label: 'Commit'
    },
    issue: { 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10', 
      border: 'border-amber-500/20',
      label: 'Issue'
    },
    pr: { 
      color: 'text-purple-500', 
      bg: 'bg-purple-500/10', 
      border: 'border-purple-500/20',
      label: 'PR'
    },
    release: { 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-500/20',
      label: 'Release'
    },
    milestone: { 
      color: 'text-primary', 
      bg: 'bg-primary/10', 
      border: 'border-primary/20',
      label: 'Event'
    },
  }

  const config = typeConfig[activity.type]

  return (
    <a
      href={activity.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group flex gap-4 rounded-xl border p-4 transition-all duration-200',
        'hover:bg-muted/50 hover:border-primary/20 hover:shadow-md',
        'animate-slide-up opacity-0'
      )}
      style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'forwards' }}
    >
      {/* Author Avatar */}
      {activity.authorAvatar ? (
        <img
          src={activity.authorAvatar}
          alt={activity.author}
          className="h-10 w-10 rounded-full ring-2 ring-background shrink-0"
        />
      ) : (
        <div className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border',
          config.bg, config.border
        )}>
          <TypeIcon className={cn('h-5 w-5', config.color)} />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-base font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {activity.title}
          </p>
          <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
        </div>
        
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {/* Activity type badge */}
          <Badge 
            variant="outline" 
            className={cn('text-xs px-2 py-0.5 gap-1', config.border, config.color)}
          >
            <TypeIcon className="h-3 w-3" />
            {config.label}
          </Badge>
          
          {/* Repository */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <GitBranch className="h-3 w-3" />
            <span className="font-medium">{activity.repo}</span>
          </div>
          
          {/* Author */}
          <span className="text-xs text-muted-foreground">
            by <span className="font-medium">{activity.author}</span>
          </span>
          
          {/* Timestamp */}
          <span className="text-xs text-muted-foreground/70">
            {formatRelativeTime(activity.timestamp)}
          </span>
        </div>
      </div>
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
      return Star
    default:
      return GitCommit
  }
}

function ActivityFeedSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-xl border p-4">
          <div className="h-10 w-10 rounded-full skeleton shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 skeleton rounded w-full" />
            <div className="h-4 skeleton rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyActivityState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
        <GitCommit className="h-7 w-7 text-muted-foreground" />
      </div>
      <p className="text-base font-semibold">No recent activity</p>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs">
        Activity from commits, pull requests, issues, and releases will appear here
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
      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary/50 to-border" />

      <div className="space-y-4">
        {activities?.slice(0, 5).map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 relative">
            <div
              className={cn(
                'relative z-10 h-8 w-8 rounded-full flex items-center justify-center border-2 border-background shrink-0',
                activity.type === 'commit' && 'bg-blue-500',
                activity.type === 'pr' && 'bg-purple-500',
                activity.type === 'issue' && 'bg-amber-500',
                activity.type === 'release' && 'bg-emerald-500',
                activity.type === 'milestone' && 'bg-primary'
              )}
            >
              {activity.type === 'commit' && (
                <GitCommit className="h-4 w-4 text-white" />
              )}
              {activity.type === 'pr' && (
                <GitPullRequest className="h-4 w-4 text-white" />
              )}
              {activity.type === 'issue' && (
                <AlertCircle className="h-4 w-4 text-white" />
              )}
              {activity.type === 'release' && (
                <Tag className="h-4 w-4 text-white" />
              )}
              {activity.type === 'milestone' && (
                <Star className="h-4 w-4 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <p className="text-sm font-medium truncate">{activity.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activity.repo} • {formatRelativeTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
