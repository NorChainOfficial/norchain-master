import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET /api/v1/compliance - Get all compliance data (items + tokens)
export async function GET(request: Request) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    if (type === 'tokens') {
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .order('symbol', { ascending: true })
      
      if (error) throw error
      return NextResponse.json(data)
    }
    
    if (type === 'items') {
      const { data, error } = await supabase
        .from('compliance_items')
        .select('*')
        .order('category', { ascending: true })
      
      if (error) throw error
      return NextResponse.json(data)
    }
    
    // Return all compliance data
    const [tokensRes, itemsRes, settingsRes] = await Promise.all([
      supabase.from('tokens').select('*').order('symbol'),
      supabase.from('compliance_items').select('*').order('category'),
      supabase.from('settings').select('*').eq('key', 'compliance_strategy').single()
    ])
    
    if (tokensRes.error) throw tokensRes.error
    if (itemsRes.error) throw itemsRes.error

    return NextResponse.json({
      tokens: tokensRes.data,
      checklist: itemsRes.data,
      strategy: settingsRes.data?.value || 'Private First — Regulated Later'
    })
  } catch (error) {
    console.error('Error fetching compliance:', error)
    return NextResponse.json({ error: 'Failed to fetch compliance data' }, { status: 500 })
  }
}

// POST /api/v1/compliance - Create compliance item or token
export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { type, ...data } = body
    
    if (type === 'token') {
      const { data: result, error } = await supabase
        .from('tokens')
        .insert(data)
        .select()
        .single()
      
      if (error) throw error
      return NextResponse.json(result, { status: 201 })
    }
    
    const { data: result, error } = await supabase
      .from('compliance_items')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating compliance item:', error)
    return NextResponse.json({ error: 'Failed to create compliance item' }, { status: 500 })
  }
}

