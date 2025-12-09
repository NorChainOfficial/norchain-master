'use client'

import { useMemo } from 'react'
import phasesData from '@/data/phases.json'
import type { Phase } from '@/types'

export function usePhases() {
  const phases = phasesData as Phase[]
  
  const currentPhase = useMemo(() => {
    return phases.find((p) => p.status === 'active') || phases[0]
  }, [phases])
  
  const completedPhases = useMemo(() => {
    return phases.filter((p) => p.status === 'complete').length
  }, [phases])
  
  const overallProgress = useMemo(() => {
    const totalProgress = phases.reduce((acc, p) => acc + p.progress, 0)
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
  }
}

