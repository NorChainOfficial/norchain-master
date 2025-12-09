import { NextResponse } from 'next/server'
import phasesData from '@/data/phases.json'
import tasksData from '@/data/tasks.json'
import complianceData from '@/data/compliance.json'
import reposData from '@/data/repos.json'

export async function GET() {
  const phases = phasesData
  const tasks = tasksData
  const compliance = complianceData
  const repos = reposData

  // Calculate stats
  const currentPhase = phases.find((p: { status: string }) => p.status === 'active') || phases[0]
  const overallProgress = Math.round(
    phases.reduce((acc: number, p: { progress: number }) => acc + p.progress, 0) / phases.length
  )

  const taskStats = {
    total: tasks.length,
    done: tasks.filter((t: { status: string }) => t.status === 'done').length,
    inProgress: tasks.filter((t: { status: string }) => t.status === 'in_progress').length,
    backlog: tasks.filter((t: { status: string }) => t.status === 'backlog').length,
  }

  const complianceStats = {
    total: compliance.checklist.length,
    complete: compliance.checklist.filter((c: { status: string }) => c.status === 'complete').length,
    inProgress: compliance.checklist.filter((c: { status: string }) => c.status === 'in_progress').length,
    pending: compliance.checklist.filter((c: { status: string }) => c.status === 'pending').length,
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    currentPhase: {
      id: currentPhase.id,
      name: currentPhase.name,
      progress: currentPhase.progress,
    },
    overallProgress,
    tasks: taskStats,
    compliance: complianceStats,
    repositories: {
      total: repos.length,
      public: repos.filter((r: { visibility: string }) => r.visibility === 'public').length,
      private: repos.filter((r: { visibility: string }) => r.visibility === 'private').length,
    },
  })
}

