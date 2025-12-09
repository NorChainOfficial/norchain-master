'use client'

import { useMemo } from 'react'
import complianceData from '@/data/compliance.json'
import type { ComplianceData, ComplianceItem } from '@/types'

export function useCompliance() {
  const data = complianceData as ComplianceData
  
  const checklistByCategory = useMemo(() => {
    const grouped: Record<string, ComplianceItem[]> = {}
    
    data.checklist.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = []
      }
      grouped[item.category].push(item)
    })
    
    return grouped
  }, [data.checklist])
  
  const complianceStats = useMemo(() => {
    const total = data.checklist.length
    const complete = data.checklist.filter((c) => c.status === 'complete').length
    const inProgress = data.checklist.filter((c) => c.status === 'in_progress').length
    const pending = data.checklist.filter((c) => c.status === 'pending').length
    
    return {
      total,
      complete,
      inProgress,
      pending,
      completionRate: Math.round((complete / total) * 100),
    }
  }, [data.checklist])
  
  const utilityTokens = useMemo(() => {
    return data.tokens.filter((t) => t.type === 'utility')
  }, [data.tokens])
  
  const securityTokens = useMemo(() => {
    return data.tokens.filter((t) => t.type === 'security')
  }, [data.tokens])
  
  return {
    tokens: data.tokens,
    checklist: data.checklist,
    strategy: data.strategy,
    checklistByCategory,
    complianceStats,
    utilityTokens,
    securityTokens,
  }
}

