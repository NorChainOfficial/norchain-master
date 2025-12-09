'use client'

import { useMemo } from 'react'
import reposData from '@/data/repos.json'
import { useOrgRepos } from '@/hooks/useGitHub'
import { cn, formatRelativeTime } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  GitBranch,
  Star,
  AlertCircle,
  Clock,
  ExternalLink,
  Lock,
  Globe,
  Folder,
} from 'lucide-react'
import type { Repository } from '@/types'

export function RepoGrid() {
  const { data: githubRepos, isLoading } = useOrgRepos()
  const repos = reposData as (Repository & { defaultBranch?: string })[]

  // Merge static repo data with GitHub API data
  const enrichedRepos = useMemo(() => {
    if (!githubRepos) return repos.map((r) => ({ ...r, stats: null }))

    return repos.map((repo) => {
      const ghRepo = githubRepos.find((gh) => gh.name === repo.name)
      return {
        ...repo,
        stats: ghRepo
          ? {
              stars: ghRepo.stargazers_count,
              issues: ghRepo.open_issues_count,
              forks: ghRepo.forks_count,
              updatedAt: ghRepo.updated_at,
              pushedAt: ghRepo.pushed_at,
              language: ghRepo.language,
            }
          : null,
      }
    })
  }, [repos, githubRepos])

  // Group repos by category
  const reposByCategory = useMemo(() => {
    const grouped: Record<string, typeof enrichedRepos> = {}
    enrichedRepos.forEach((repo) => {
      if (!grouped[repo.category]) {
        grouped[repo.category] = []
      }
      grouped[repo.category].push(repo)
    })
    return grouped
  }, [enrichedRepos])

  if (isLoading) {
    return <RepoGridSkeleton />
  }

  return (
    <div className="space-y-8">
      {Object.entries(reposByCategory).map(([category, categoryRepos]) => (
        <div key={category}>
        <div className="flex items-center gap-2.5 mb-4">
          <Folder className="h-5 w-5 text-muted-foreground shrink-0" />
          <h3 className="font-semibold leading-none">{category}</h3>
          <Badge variant="outline" className="text-xs">{categoryRepos.length}</Badge>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryRepos.map((repo, index) => (
              <RepoCard key={repo.name} repo={repo} index={index} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

interface RepoCardProps {
  repo: Repository & {
    stats?: {
      stars: number
      issues: number
      forks: number
      updatedAt: string
      pushedAt: string
      language: string | null
    } | null
  }
  index: number
}

export function RepoCard({ repo, index }: RepoCardProps) {
  const health = getRepoHealth(repo.stats)
  const healthConfig = {
    healthy: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Healthy' },
    warning: { color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Warning' },
    critical: { color: 'text-red-500', bg: 'bg-red-500/10', label: 'Critical' },
  }
  const config = healthConfig[health]

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group block rounded-xl border bg-card p-4 transition-all duration-300',
        'hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20',
        'hover:-translate-y-1 hover:border-primary/20',
        'animate-slide-up opacity-0'
      )}
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg shrink-0',
            repo.visibility === 'private' ? 'bg-amber-500/10' : 'bg-emerald-500/10'
          )}>
            {repo.visibility === 'private' ? (
              <Lock className="h-[18px] w-[18px] text-amber-500" />
            ) : (
              <Globe className="h-[18px] w-[18px] text-emerald-500" />
            )}
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            <p className="font-semibold truncate group-hover:text-primary transition-colors leading-tight">
              {repo.name}
            </p>
            <p className="text-xs text-muted-foreground leading-tight">Phase {repo.phase}</p>
          </div>
        </div>
        <div className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium', config.bg, config.color)}>
          <div className="h-1.5 w-1.5 rounded-full bg-current" />
          {config.label}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {repo.description}
      </p>

      {/* Stats */}
      {repo.stats && (
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            <span className="tabular-nums">{repo.stats.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span className="tabular-nums">{repo.stats.issues}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitBranch className="h-3 w-3" />
            <span className="tabular-nums">{repo.stats.forks}</span>
          </div>
          {repo.stats.language && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-auto">
              {repo.stats.language}
            </Badge>
          )}
        </div>
      )}

      {/* Last activity */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-3 border-t">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>
            {repo.stats?.pushedAt
              ? formatRelativeTime(repo.stats.pushedAt)
              : 'Unknown'}
          </span>
        </div>
        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </a>
  )
}

function getRepoHealth(
  stats?: {
    issues: number
    pushedAt: string
  } | null
): 'healthy' | 'warning' | 'critical' {
  if (!stats) return 'healthy'

  const daysSinceLastCommit = Math.floor(
    (Date.now() - new Date(stats.pushedAt).getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysSinceLastCommit > 30 || stats.issues > 20) return 'critical'
  if (daysSinceLastCommit > 14 || stats.issues > 10) return 'warning'
  return 'healthy'
}

function RepoGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg skeleton" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 skeleton rounded w-3/4" />
              <div className="h-3 skeleton rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 skeleton rounded w-full" />
            <div className="h-3 skeleton rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Compact list view
export function RepoList() {
  const repos = reposData as Repository[]
  const { data: githubRepos } = useOrgRepos()

  return (
    <ScrollArea className="h-[320px]">
      <div className="space-y-2 pr-4">
        {repos.map((repo, index) => {
          const ghRepo = githubRepos?.find((gh) => gh.name === repo.name)
          return (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'group flex items-center justify-between rounded-xl border px-3 py-2.5 transition-all duration-200',
                'hover:bg-muted/50 hover:border-primary/20',
                'animate-slide-up opacity-0'
              )}
              style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'forwards' }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg shrink-0',
                  repo.visibility === 'private' ? 'bg-amber-500/10' : 'bg-emerald-500/10'
                )}>
                  {repo.visibility === 'private' ? (
                    <Lock className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Globe className="h-4 w-4 text-emerald-500" />
                  )}
                </div>
                <span className="truncate group-hover:text-primary transition-colors leading-none">
                  {repo.name}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {ghRepo && (
                  <>
                    <span className="flex items-center gap-1 tabular-nums">
                      <Star className="h-3 w-3" />
                      {ghRepo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1 tabular-nums">
                      <AlertCircle className="h-3 w-3" />
                      {ghRepo.open_issues_count}
                    </span>
                  </>
                )}
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          )
        })}
      </div>
    </ScrollArea>
  )
}
