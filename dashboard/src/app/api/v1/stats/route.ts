import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/v1/stats - Get dashboard statistics
export async function GET() {
  try {
    const supabase = createServerClient()
    
    // Fetch all data in parallel
    const [phasesRes, tasksRes, reposRes, complianceRes] = await Promise.all([
      supabase.from('phases').select('*').order('sort_order'),
      supabase.from('tasks').select('*'),
      supabase.from('repositories').select('*'),
      supabase.from('compliance_items').select('*')
    ])
    
    if (phasesRes.error) throw phasesRes.error
    if (tasksRes.error) throw tasksRes.error
    if (reposRes.error) throw reposRes.error
    if (complianceRes.error) throw complianceRes.error
    
    const phases = phasesRes.data
    const tasks = tasksRes.data
    const repos = reposRes.data
    const compliance = complianceRes.data
    
    // Calculate stats
    const currentPhase = phases.find(p => p.status === 'active') || phases[0]
    const overallProgress = phases.length > 0
      ? Math.round(phases.reduce((acc, p) => acc + p.progress, 0) / phases.length)
      : 0
    
    const taskStats = {
      total: tasks.length,
      backlog: tasks.filter(t => t.status === 'backlog').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: tasks.filter(t => t.status === 'done').length,
      completionRate: tasks.length > 0
        ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100)
        : 0
    }
    
    const complianceStats = {
      total: compliance.length,
      complete: compliance.filter(c => c.status === 'complete').length,
      in_progress: compliance.filter(c => c.status === 'in_progress').length,
      pending: compliance.filter(c => c.status === 'pending').length,
      completionRate: compliance.length > 0
        ? Math.round((compliance.filter(c => c.status === 'complete').length / compliance.length) * 100)
        : 0
    }
    
    const repoStats = {
      total: repos.length,
      public: repos.filter(r => r.visibility === 'public').length,
      private: repos.filter(r => r.visibility === 'private').length,
      healthy: repos.filter(r => r.health === 'healthy').length,
      warning: repos.filter(r => r.health === 'warning').length,
      critical: repos.filter(r => r.health === 'critical').length
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      currentPhase: {
        id: currentPhase?.id,
        name: currentPhase?.name,
        progress: currentPhase?.progress,
        status: currentPhase?.status
      },
      overallProgress,
      phases: {
        total: phases.length,
        complete: phases.filter(p => p.status === 'complete').length,
        active: phases.filter(p => p.status === 'active').length,
        pending: phases.filter(p => p.status === 'pending').length
      },
      tasks: taskStats,
      repositories: repoStats,
      compliance: complianceStats
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

