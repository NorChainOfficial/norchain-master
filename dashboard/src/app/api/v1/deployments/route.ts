import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('project_id')
  const environmentId = searchParams.get('environment_id')
  const limit = parseInt(searchParams.get('limit') || '50')

  let query = supabase
    .from('deployments')
    .select('*, environments!inner(project_id)')
    .order('created_at', { ascending: false })
    .limit(limit)

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
  const deployments = data?.map(deploy => {
    const { environments, ...rest } = deploy as any
    return rest
  }) || []

  return NextResponse.json(deployments)
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const body = await request.json()

  // Create a new deployment
  const { data, error } = await supabase
    .from('deployments')
    .insert({
      environment_id: body.environment_id,
      deployed_by: body.deployed_by || 'manual',
      branch: body.branch || 'main',
      status: 'queued',
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Update environment status to deploying
  await supabase
    .from('environments')
    .update({ status: 'deploying' } as any)
    .eq('id', body.environment_id)

  // Simulate deployment process
  setTimeout(async () => {
    const success = Math.random() > 0.1 // 90% success rate
    const duration = Math.floor(Math.random() * 120000) + 30000 // 30s - 150s
    
    await supabase
      .from('deployments')
      .update({
        status: success ? 'success' : 'failed',
        completed_at: new Date().toISOString(),
        duration_ms: duration,
        commit_sha: Math.random().toString(36).substring(2, 10),
        version: `v1.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 100)}`,
      } as any)
      .eq('id', data.id)

    // Update environment status
    await supabase
      .from('environments')
      .update({ 
        status: success ? 'healthy' : 'degraded',
        last_deploy_at: new Date().toISOString(),
      } as any)
      .eq('id', body.environment_id)
  }, 3000)

  return NextResponse.json(data, { status: 201 })
}

