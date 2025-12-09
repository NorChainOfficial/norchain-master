import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/v1/repositories/[id] - Get single repository
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('repositories')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching repository:', error)
    return NextResponse.json({ error: 'Failed to fetch repository' }, { status: 500 })
  }
}

// PATCH /api/v1/repositories/[id] - Update repository
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('repositories')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating repository:', error)
    return NextResponse.json({ error: 'Failed to update repository' }, { status: 500 })
  }
}

// DELETE /api/v1/repositories/[id] - Delete repository
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    const { error } = await supabase
      .from('repositories')
      .delete()
      .eq('id', params.id)
    
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting repository:', error)
    return NextResponse.json({ error: 'Failed to delete repository' }, { status: 500 })
  }
}

