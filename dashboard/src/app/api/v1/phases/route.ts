import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/v1/phases - List all phases with deliverables
export async function GET() {
  try {
    const supabase = createServerClient()
    
    const { data: phases, error: phasesError } = await supabase
      .from('phases')
      .select('*')
      .order('sort_order', { ascending: true })
    
    if (phasesError) throw phasesError

    const { data: deliverables, error: delError } = await supabase
      .from('deliverables')
      .select('*')
      .order('sort_order', { ascending: true })
    
    if (delError) throw delError

    // Combine phases with their deliverables
    const phasesWithDeliverables = phases.map(phase => ({
      ...phase,
      deliverables: deliverables.filter(d => d.phase_id === phase.id)
    }))

    return NextResponse.json(phasesWithDeliverables)
  } catch (error) {
    console.error('Error fetching phases:', error)
    return NextResponse.json({ error: 'Failed to fetch phases' }, { status: 500 })
  }
}

// POST /api/v1/phases - Create a new phase
export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('phases')
      .insert(body)
      .select()
      .single()
    
    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating phase:', error)
    return NextResponse.json({ error: 'Failed to create phase' }, { status: 500 })
  }
}

