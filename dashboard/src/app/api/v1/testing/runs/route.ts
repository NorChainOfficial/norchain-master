import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('project_id')
  const suiteId = searchParams.get('suite_id')
  const limit = parseInt(searchParams.get('limit') || '50')

  // If project_id is provided, we need to join with test_suites
  let query = supabase
    .from('test_runs')
    .select('*, test_suites!inner(project_id)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (suiteId) {
    query = query.eq('suite_id', suiteId)
  }

  if (projectId) {
    query = query.eq('test_suites.project_id', projectId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform to remove nested test_suites
  const runs = data?.map(run => {
    const { test_suites, ...rest } = run as any
    return rest
  }) || []

  return NextResponse.json(runs)
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const body = await request.json()

  // Create a new test run in pending state
  const { data, error } = await supabase
    .from('test_runs')
    .insert({
      suite_id: body.suite_id,
      triggered_by: body.triggered_by || 'manual',
      status: 'pending',
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // In a real implementation, this would trigger actual test execution
  // For now, we'll simulate a quick test run
  setTimeout(async () => {
    const passed = Math.floor(Math.random() * 20) + 10
    const failed = Math.floor(Math.random() * 5)
    const skipped = Math.floor(Math.random() * 3)
    
    await supabase
      .from('test_runs')
      .update({
        status: failed > 0 ? 'failed' : 'passed',
        completed_at: new Date().toISOString(),
        duration_ms: Math.floor(Math.random() * 30000) + 5000,
        results: { passed, failed, skipped },
      } as any)
      .eq('id', data.id)
  }, 2000)

  return NextResponse.json(data, { status: 201 })
}

