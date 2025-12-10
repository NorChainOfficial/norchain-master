import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET /api/v1/notifications - Get notifications for a user
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const userId = request.nextUrl.searchParams.get('user_id')
    const unreadOnly = request.nextUrl.searchParams.get('unread') === 'true'
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20')
    
    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }
    
    let query = supabase
      .from('notifications')
      .select(`*, actor:users!notifications_actor_id_fkey(*)`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (unreadOnly) {
      query = query.is('read_at', null)
    }
    
    const { data, error } = await query
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

// POST /api/v1/notifications - Create notification
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('notifications')
      .insert(body)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}

// PATCH /api/v1/notifications - Mark notification as read
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { id, ids, read_at } = body
    
    // Support both single ID and multiple IDs
    const idsToUpdate = ids || (id ? [id] : [])
    
    if (idsToUpdate.length === 0) {
      return NextResponse.json({ error: 'id or ids required' }, { status: 400 })
    }
    
    const { data, error } = await supabase
      .from('notifications')
      .update({ read_at: read_at || new Date().toISOString() })
      .in('id', idsToUpdate)
      .select()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 })
  }
}

// DELETE /api/v1/notifications - Delete notification
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const id = request.nextUrl.searchParams.get('id')
    const userId = request.nextUrl.searchParams.get('user_id')
    const deleteAll = request.nextUrl.searchParams.get('all') === 'true'
    
    if (deleteAll && userId) {
      // Delete all notifications for user
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    } else if (id) {
      // Delete single notification
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    } else {
      return NextResponse.json({ error: 'id or (user_id + all) required' }, { status: 400 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting notifications:', error)
    return NextResponse.json({ error: 'Failed to delete notifications' }, { status: 500 })
  }
}

