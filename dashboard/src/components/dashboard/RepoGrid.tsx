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
  GitPullRequest,
  Clock,
  ExternalLink,
  Lock,
  Globe,
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
    <div className="space-y-6">
      {Object.entries(reposByCategory).map(([category, categoryRepos]) => (
        <div key={category}>
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">
            {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryRepos.map((repo) => (
              <RepoCard key={repo.name} repo={repo} />
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
}

export function RepoCard({ repo }: RepoCardProps) {
  const health = getRepoHealth(repo.stats)

  return (
    <Card className="group hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {repo.visibility === 'private' ? (
              <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
            ) : (
              <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <CardTitle className="text-sm font-medium truncate">
              {repo.name}
            </CardTitle>
          </div>
          <Badge
            variant={health === 'healthy' ? 'success' : health === 'warning' ? 'warning' : 'destructive'}
            className="text-xs shrink-0"
          >
            {health}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {repo.description}
        </p>

        {/* Stats */}
        {repo.stats && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>{repo.stats.stars}</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{repo.stats.issues}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              <span>{repo.stats.forks}</span>
            </div>
            {repo.stats.language && (
              <Badge variant="outline" className="text-xs">
                {repo.stats.language}
              </Badge>
            )}
          </div>
        )}

        {/* Last activity */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {repo.stats?.pushedAt
                ? formatRelativeTime(repo.stats.pushedAt)
                : 'Unknown'}
            </span>
          </div>
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-norchain-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <span>View</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Phase badge */}
        <div className="mt-3 pt-3 border-t">
          <Badge variant="outline" className="text-xs">
            Phase {repo.phase}
          </Badge>
        </div>
      </CardContent>
    </Card>
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
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-2">
            <div className="h-4 bg-muted rounded w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-2/3" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Compact list view
export function RepoList() {
  const repos = reposData as Repository[]
  const { data: githubRepos } = useOrgRepos()

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2 pr-4">
        {repos.map((repo) => {
          const ghRepo = githubRepos?.find((gh) => gh.name === repo.name)
          return (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                {repo.visibility === 'private' ? (
                  <Lock className="h-3 w-3 text-muted-foreground shrink-0" />
                ) : (
                  <Globe className="h-3 w-3 text-muted-foreground shrink-0" />
                )}
                <span className="text-sm truncate">{repo.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {ghRepo && (
                  <>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {ghRepo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {ghRepo.open_issues_count}
                    </span>
                  </>
                )}
                <ExternalLink className="h-3 w-3" />
              </div>
            </a>
          )
        })}
      </div>
    </ScrollArea>
  )
}

