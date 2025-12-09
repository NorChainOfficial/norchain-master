import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// PATCH /api/v1/compliance/[id] - Update compliance item
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    
    // Check if updating a token or compliance item
    const isToken = params.id.length > 10 // UUIDs are longer
    
    if (isToken) {
      const { data, error } = await supabase
        .from('tokens')
        .update(body as any)
        .eq('id', params.id)
        .select()
        .single()
      
      if (error) throw error
      return NextResponse.json(data)
    }
    
    // Update compliance item
    const updateData: any = { ...body }
    if (body.status === 'complete' && !body.completed_at) {
      updateData.completed_at = new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('compliance_items')
      .update(updateData as any)
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) throw error

    // Log activity
    await supabase.from('activity_log').insert({
      type: 'compliance_update',
      entity_type: 'compliance_item',
      entity_id: params.id,
      title: `Compliance item updated: ${data.item}`,
      description: `Status: ${data.status}`,
      author: 'system'
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating compliance item:', error)
    return NextResponse.json({ error: 'Failed to update compliance item' }, { status: 500 })
  }
}

