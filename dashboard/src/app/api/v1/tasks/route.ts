import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/v1/tasks - List all tasks with optional filters
export async function GET(request: Request) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    
    let query = supabase.from('tasks').select('*')
    
    // Apply filters
    const phaseId = searchParams.get('phase_id')
    const status = searchParams.get('status')
    const role = searchParams.get('role')
    
    if (phaseId) query = query.eq('phase_id', parseInt(phaseId))
    if (status) query = query.eq('status', status)
    if (role) query = query.eq('role', role)
    
    const { data, error } = await query.order('created_at', { ascending: true })
    
    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

// POST /api/v1/tasks - Create a new task
export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('tasks')
      .insert(body)
      .select()
      .single()
    
    if (error) throw error

    // Log activity
    await supabase.from('activity_log').insert({
      type: 'task_update',
      entity_type: 'task',
      entity_id: data.id,
      title: `Task created: ${data.title}`,
      author: 'system'
    })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}

