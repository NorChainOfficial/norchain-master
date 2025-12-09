import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/v1/phases/[id] - Get single phase
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const phaseId = parseInt(params.id)
    
    const { data: phase, error: phaseError } = await supabase
      .from('phases')
      .select('*')
      .eq('id', phaseId)
      .single()
    
    if (phaseError) throw phaseError

    const { data: deliverables, error: delError } = await supabase
      .from('deliverables')
      .select('*')
      .eq('phase_id', phaseId)
      .order('sort_order', { ascending: true })
    
    if (delError) throw delError

    return NextResponse.json({ ...phase, deliverables })
  } catch (error) {
    console.error('Error fetching phase:', error)
    return NextResponse.json({ error: 'Failed to fetch phase' }, { status: 500 })
  }
}

// PATCH /api/v1/phases/[id] - Update phase
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const phaseId = parseInt(params.id)
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('phases')
      .update(body)
      .eq('id', phaseId)
      .select()
      .single()
    
    if (error) throw error

    // Log activity
    await supabase.from('activity_log').insert({
      type: 'phase_update',
      entity_type: 'phase',
      entity_id: phaseId.toString(),
      title: `Phase ${phaseId} updated`,
      description: `Status: ${body.status || data.status}, Progress: ${body.progress || data.progress}%`,
      author: 'system'
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating phase:', error)
    return NextResponse.json({ error: 'Failed to update phase' }, { status: 500 })
  }
}

// DELETE /api/v1/phases/[id] - Delete phase
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const phaseId = parseInt(params.id)
    
    const { error } = await supabase
      .from('phases')
      .delete()
      .eq('id', phaseId)
    
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting phase:', error)
    return NextResponse.json({ error: 'Failed to delete phase' }, { status: 500 })
  }
}

