import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('project_id')
  const environmentId = searchParams.get('environment_id')

  let query = supabase
    .from('health_checks')
    .select('*, environments!inner(project_id)')
    .order('name')

  if (environmentId) {
    query = query.eq('environment_id', environmentId)
  }

  if (projectId) {
    query = query.eq('environments.project_id', projectId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform to remove nested environments
  const healthChecks = data?.map(check => {
    const { environments, ...rest } = check as any
    return rest
  }) || []

  return NextResponse.json(healthChecks)
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from('health_checks')
    .insert({
      environment_id: body.environment_id,
      name: body.name,
      endpoint: body.endpoint,
      method: body.method || 'GET',
      expected_status: body.expected_status || 200,
      timeout_ms: body.timeout_ms || 5000,
      interval_seconds: body.interval_seconds || 60,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

