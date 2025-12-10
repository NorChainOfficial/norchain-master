import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET /api/v1/comments - Get comments for an entity
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const entityType = request.nextUrl.searchParams.get('entity_type')
    const entityId = request.nextUrl.searchParams.get('entity_id')
    
    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'entity_type and entity_id are required' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:users(*),
        replies:comments(*, user:users(*))
      `)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .is('parent_id', null) // Only top-level comments
      .order('created_at', { ascending: true })
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

// POST /api/v1/comments - Create comment
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    
    // Insert comment
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        entity_type: body.entity_type,
        entity_id: body.entity_id,
        user_id: body.user_id,
        content: body.content,
        parent_id: body.parent_id || null,
      })
      .select(`*, user:users(*)`)
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Extract and create mentions if any
    const mentionPattern = /@(\w+)/g
    const mentions = body.content.match(mentionPattern)
    
    if (mentions && mentions.length > 0) {
      // Find mentioned users
      const mentionedNames = mentions.map((m: string) => m.slice(1).toLowerCase())
      const { data: mentionedUsers } = await supabase
        .from('users')
        .select('id, name')
        .in('name', mentionedNames)
      
      if (mentionedUsers && mentionedUsers.length > 0) {
        // Create mention records
        const mentionRecords = mentionedUsers.map(user => ({
          comment_id: comment.id,
          user_id: user.id,
        }))
        
        await supabase.from('mentions').insert(mentionRecords)
        
        // Create notifications for mentioned users
        const notifications = mentionedUsers.map(user => ({
          user_id: user.id,
          type: 'mention',
          title: `${comment.user?.name || 'Someone'} mentioned you`,
          content: body.content.substring(0, 100),
          entity_type: body.entity_type,
          entity_id: body.entity_id,
          actor_id: body.user_id,
        }))
        
        await supabase.from('notifications').insert(notifications)
      }
    }
    
    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}

// PATCH /api/v1/comments - Update comment
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { id, content } = body
    
    const { data, error } = await supabase
      .from('comments')
      .update({ 
        content, 
        is_edited: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`*, user:users(*)`)
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
  }
}

// DELETE /api/v1/comments - Delete comment
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const id = request.nextUrl.searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}

