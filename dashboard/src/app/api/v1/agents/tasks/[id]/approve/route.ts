import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('agent_tasks')
    .update({
      status: 'queued',
      approved_by: 'dashboard_user', // TODO: Get from auth
      approved_at: new Date().toISOString(),
    } as any)
    .eq('id', id)
    .eq('status', 'awaiting_approval')
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

