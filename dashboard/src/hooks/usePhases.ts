'use client'

import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Phase } from '@/types'

async function fetchPhases(): Promise<Phase[]> {
  const res = await fetch('/api/v1/phases')
  if (!res.ok) throw new Error('Failed to fetch phases')
  const data = await res.json()
  // Map database fields to component fields
  return data.map((phase: any) => ({
    id: phase.id,
    name: phase.name,
    focus: phase.focus,
    duration: phase.duration,
    status: phase.status,
    progress: phase.progress || 0,
    deliverables: phase.deliverables?.map((d: any) => ({
      name: d.name,
      status: d.status,
    })) || [],
  }))
}

async function updatePhase(phaseId: number, updates: Partial<Phase>): Promise<Phase> {
  const res = await fetch(`/api/v1/phases/${phaseId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error('Failed to update phase')
  return res.json()
}

export function usePhases() {
  const queryClient = useQueryClient()

  const { data: phases = [], isLoading, error, refetch } = useQuery({
    queryKey: ['phases'],
    queryFn: fetchPhases,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  })

  const updateMutation = useMutation({
    mutationFn: ({ phaseId, updates }: { phaseId: number; updates: Partial<Phase> }) =>
      updatePhase(phaseId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases'] })
    },
  })

  const currentPhase = useMemo(() => {
    return phases.find((p) => p.status === 'active') || phases[0] || {
      id: 1,
      name: 'Foundation',
      focus: 'Core infrastructure setup',
      duration: '2-3 weeks',
      status: 'active' as const,
      progress: 0,
      deliverables: [],
    }
  }, [phases])

  const completedPhases = useMemo(() => {
    return phases.filter((p) => p.status === 'complete').length
  }, [phases])

  const overallProgress = useMemo(() => {
    if (phases.length === 0) return 0
    const totalProgress = phases.reduce((acc, p) => acc + (p.progress || 0), 0)
    return Math.round(totalProgress / phases.length)
  }, [phases])

  const getPhaseById = (id: number) => {
    return phases.find((p) => p.id === id)
  }

  return {
    phases,
    currentPhase,
    completedPhases,
    overallProgress,
    getPhaseById,
    totalPhases: phases.length,
    isLoading,
    error,
    refetch,
    updatePhase: (phaseId: number, updates: Partial<Phase>) =>
      updateMutation.mutate({ phaseId, updates }),
    isUpdating: updateMutation.isPending,
  }
}
