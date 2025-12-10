import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET /api/v1/chat - Get chat channels or messages
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const projectId = request.nextUrl.searchParams.get('project_id')
    const channelId = request.nextUrl.searchParams.get('channel_id')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50')
    
    if (channelId) {
      // Get messages for a channel
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          user:users(*),
          thread_messages:chat_messages(*, user:users(*))
        `)
        .eq('channel_id', channelId)
        .is('thread_id', null) // Only top-level messages
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      // Return in chronological order for display
      return NextResponse.json(data?.reverse() || [])
    }
    
    if (projectId) {
      // Get channels for a project
      const { data, error } = await supabase
        .from('chat_channels')
        .select(`
          *,
          created_by_user:users!chat_channels_created_by_fkey(*)
        `)
        .eq('project_id', projectId)
        .order('name')
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(data)
    }
    
    return NextResponse.json({ error: 'project_id or channel_id required' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching chat:', error)
    return NextResponse.json({ error: 'Failed to fetch chat' }, { status: 500 })
  }
}

// POST /api/v1/chat - Create channel or message
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { type } = body
    
    if (type === 'channel') {
      // Create channel
      const { data, error } = await supabase
        .from('chat_channels')
        .insert({
          project_id: body.project_id,
          name: body.name,
          description: body.description,
          type: body.channel_type || 'public',
          created_by: body.created_by,
        })
        .select()
        .single()
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json(data)
    }
    
    // Create message (default)
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        channel_id: body.channel_id,
        user_id: body.user_id,
        content: body.content,
        attachments: body.attachments || [],
        thread_id: body.thread_id || null,
      })
      .select(`*, user:users(*)`)
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating chat:', error)
    return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 })
  }
}

// PATCH /api/v1/chat - Update message
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { id, content } = body
    
    const { data, error } = await supabase
      .from('chat_messages')
      .update({
        content,
        is_edited: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`*, user:users(*)`)
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}

// DELETE /api/v1/chat - Delete channel or message
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const type = request.nextUrl.searchParams.get('type')
    const id = request.nextUrl.searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    
    const table = type === 'channel' ? 'chat_channels' : 'chat_messages'
    
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting chat:', error)
    return NextResponse.json({ error: 'Failed to delete chat' }, { status: 500 })
  }
}

