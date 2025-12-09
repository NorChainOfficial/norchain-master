import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/v1/tasks/[id] - Get single task
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 })
  }
}

// PATCH /api/v1/tasks/[id] - Update task
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('tasks')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) throw error

    // Log activity
    await supabase.from('activity_log').insert({
      type: 'task_update',
      entity_type: 'task',
      entity_id: params.id,
      title: `Task updated: ${data.title}`,
      description: `Status: ${data.status}`,
      author: body.assignee || 'system'
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

// DELETE /api/v1/tasks/[id] - Delete task
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', params.id)
    
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}

