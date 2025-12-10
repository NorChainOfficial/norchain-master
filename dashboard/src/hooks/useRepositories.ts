'use client'

import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface Repository {
  id: string
  name: string
  description: string
  url: string
  visibility: 'public' | 'private'
  category: string
  phase_id: number
  language?: string
  stars?: number
  forks?: number
  open_issues?: number
  health?: 'healthy' | 'warning' | 'critical'
}

async function fetchRepositories(): Promise<Repository[]> {
  const res = await fetch('/api/v1/repositories')
  if (!res.ok) throw new Error('Failed to fetch repositories')
  return res.json()
}

async function updateRepository(name: string, updates: Partial<Repository>): Promise<Repository> {
  const res = await fetch(`/api/v1/repositories/${encodeURIComponent(name)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error('Failed to update repository')
  return res.json()
}

async function createRepository(repo: Partial<Repository>): Promise<Repository> {
  const res = await fetch('/api/v1/repositories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(repo),
  })
  if (!res.ok) throw new Error('Failed to create repository')
  return res.json()
}

async function deleteRepository(name: string): Promise<void> {
  const res = await fetch(`/api/v1/repositories/${encodeURIComponent(name)}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete repository')
}

export function useRepositories() {
  const queryClient = useQueryClient()

  const { data: repositories = [], isLoading, error, refetch } = useQuery({
    queryKey: ['repositories'],
    queryFn: fetchRepositories,
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: true,
  })

  const updateMutation = useMutation({
    mutationFn: ({ name, updates }: { name: string; updates: Partial<Repository> }) =>
      updateRepository(name, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] })
    },
  })

  const createMutation = useMutation({
    mutationFn: createRepository,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteRepository,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] })
    },
  })

  const reposByCategory = useMemo(() => {
    const grouped: Record<string, Repository[]> = {}
    repositories.forEach((repo) => {
      const category = repo.category || 'Other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(repo)
    })
    return grouped
  }, [repositories])

  const repoStats = useMemo(() => {
    return {
      total: repositories.length,
      public: repositories.filter((r) => r.visibility === 'public').length,
      private: repositories.filter((r) => r.visibility === 'private').length,
      healthy: repositories.filter((r) => r.health === 'healthy').length,
      warning: repositories.filter((r) => r.health === 'warning').length,
      critical: repositories.filter((r) => r.health === 'critical').length,
    }
  }, [repositories])

  const categories = useMemo(() => {
    return Array.from(new Set(repositories.map((r) => r.category || 'Other')))
  }, [repositories])

  return {
    repositories,
    reposByCategory,
    repoStats,
    categories,
    isLoading,
    error,
    refetch,
    updateRepository: (name: string, updates: Partial<Repository>) =>
      updateMutation.mutate({ name, updates }),
    createRepository: (repo: Partial<Repository>) => createMutation.mutate(repo),
    deleteRepository: (name: string) => deleteMutation.mutate(name),
    isUpdating: updateMutation.isPending,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

