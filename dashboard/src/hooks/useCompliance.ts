'use client'

import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { ComplianceItem, Token } from '@/types'

interface ComplianceData {
  checklist: ComplianceItem[]
  tokens: Token[]
}

async function fetchCompliance(): Promise<ComplianceData> {
  const res = await fetch('/api/v1/compliance')
  if (!res.ok) throw new Error('Failed to fetch compliance')
  return res.json()
}

async function updateComplianceItem(itemId: string, updates: Partial<ComplianceItem>): Promise<ComplianceItem> {
  const res = await fetch(`/api/v1/compliance/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error('Failed to update compliance item')
  return res.json()
}

export function useCompliance() {
  const queryClient = useQueryClient()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['compliance'],
    queryFn: fetchCompliance,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  })

  const checklist = useMemo(() => data?.checklist || [], [data?.checklist])
  const tokens = useMemo(() => data?.tokens || [], [data?.tokens])

  const updateMutation = useMutation({
    mutationFn: ({ itemId, updates }: { itemId: string; updates: Partial<ComplianceItem> }) =>
      updateComplianceItem(itemId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance'] })
    },
  })

  const checklistByCategory = useMemo(() => {
    const grouped: Record<string, ComplianceItem[]> = {}

    checklist.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = []
      }
      grouped[item.category].push(item)
    })

    return grouped
  }, [checklist])

  const complianceStats = useMemo(() => {
    const total = checklist.length
    if (total === 0) return { total: 0, complete: 0, inProgress: 0, pending: 0, completionRate: 0 }
    
    const complete = checklist.filter((c) => c.status === 'complete').length
    const inProgress = checklist.filter((c) => c.status === 'in_progress').length
    const pending = checklist.filter((c) => c.status === 'pending').length

    return {
      total,
      complete,
      inProgress,
      pending,
      completionRate: Math.round((complete / total) * 100),
    }
  }, [checklist])

  const utilityTokens = useMemo(() => {
    return tokens.filter((t) => t.type === 'utility')
  }, [tokens])

  const securityTokens = useMemo(() => {
    return tokens.filter((t) => t.type === 'security')
  }, [tokens])

  // Default strategy when loading
  const strategy = {
    approach: 'Private First — Regulated Later',
    domain: 'norchain.org',
  }

  return {
    tokens,
    checklist,
    strategy,
    checklistByCategory,
    complianceStats,
    utilityTokens,
    securityTokens,
    isLoading,
    error,
    refetch,
    updateItem: (itemId: string, updates: Partial<ComplianceItem>) =>
      updateMutation.mutate({ itemId, updates }),
    isUpdating: updateMutation.isPending,
  }
}
