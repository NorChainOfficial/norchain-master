'use client'

import { useQuery } from '@tanstack/react-query'
import {
  fetchOrgRepos,
  fetchRepoStats,
  fetchRepoCommits,
  fetchActivityFeed,
  fetchAllRepoStats,
} from '@/lib/github'
import type { GitHubRepo, RepositoryStats, Activity, GitHubCommit } from '@/types'

// Hook to fetch all organization repos
export function useOrgRepos() {
  return useQuery<GitHubRepo[]>({
    queryKey: ['github', 'repos'],
    queryFn: fetchOrgRepos,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

// Hook to fetch stats for a single repo
export function useRepoStats(repoName: string) {
  return useQuery<RepositoryStats | null>({
    queryKey: ['github', 'stats', repoName],
    queryFn: () => fetchRepoStats(repoName),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!repoName,
  })
}

// Hook to fetch commits for a repo
export function useRepoCommits(repoName: string, count = 10) {
  return useQuery<GitHubCommit[]>({
    queryKey: ['github', 'commits', repoName, count],
    queryFn: () => fetchRepoCommits(repoName, count),
    staleTime: 60 * 1000, // 1 minute
    enabled: !!repoName,
  })
}

// Hook to fetch activity feed
export function useActivityFeed(repoNames: string[], limit = 20) {
  return useQuery<Activity[]>({
    queryKey: ['github', 'activity', repoNames, limit],
    queryFn: () => fetchActivityFeed(repoNames, limit),
    staleTime: 60 * 1000, // 1 minute
    enabled: repoNames.length > 0,
  })
}

// Hook to fetch stats for all repos
export function useAllRepoStats(repoNames: string[]) {
  return useQuery<Map<string, RepositoryStats>>({
    queryKey: ['github', 'allStats', repoNames],
    queryFn: () => fetchAllRepoStats(repoNames),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: repoNames.length > 0,
  })
}

