import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/v1/repositories - List all repositories
export async function GET(request: Request) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    
    let query = supabase.from('repositories').select('*')
    
    // Apply filters
    const category = searchParams.get('category')
    const visibility = searchParams.get('visibility')
    
    if (category) query = query.eq('category', category)
    if (visibility) query = query.eq('visibility', visibility)
    
    const { data, error } = await query.order('name', { ascending: true })
    
    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching repositories:', error)
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 })
  }
}

// POST /api/v1/repositories - Create a new repository
export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('repositories')
      .insert(body)
      .select()
      .single()
    
    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating repository:', error)
    return NextResponse.json({ error: 'Failed to create repository' }, { status: 500 })
  }
}

