import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { randomUUID } from 'crypto'

// GET /api/v1/team - Get team members for a project
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const projectId = request.nextUrl.searchParams.get('project_id')
    
    let query = supabase
      .from('team_members')
      .select(`
        *,
        user:users!team_members_user_id_fkey(*)
      `)
      .order('joined_at', { ascending: false, nullsFirst: false })
    
    if (projectId) {
      query = query.eq('project_id', projectId)
    }
    
    const { data, error } = await query
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 })
  }
}

// POST /api/v1/team - Invite a new team member
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { project_id, email, name, role = 'member' } = body
    
    if (!project_id || !email) {
      return NextResponse.json(
        { error: 'project_id and email are required' }, 
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()
    
    let userId: string
    
    if (existingUser) {
      userId = existingUser.id
      
      // Check if already a team member
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('*')
        .eq('project_id', project_id)
        .eq('user_id', userId)
        .single()
      
      if (existingMember) {
        return NextResponse.json(
          { error: 'User is already a team member' }, 
          { status: 400 }
        )
      }
    } else {
      // Create new user
      userId = randomUUID()
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: email.toLowerCase(),
          name: name || email.split('@')[0],
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
        })
      
      if (userError) {
        console.error('Error creating user:', userError)
        return NextResponse.json({ error: userError.message }, { status: 500 })
      }
    }
    
    // Add team member
    const { data: teamMember, error: memberError } = await supabase
      .from('team_members')
      .insert({
        id: randomUUID(),
        project_id,
        user_id: userId,
        role,
        status: 'pending',
        invited_at: new Date().toISOString(),
      })
      .select(`*, user:users!team_members_user_id_fkey(*)`)
      .single()
    
    if (memberError) {
      console.error('Error adding team member:', memberError)
      return NextResponse.json({ error: memberError.message }, { status: 500 })
    }
    
    // Create notification for the invited user
    await supabase.from('notifications').insert({
      id: randomUUID(),
      user_id: userId,
      type: 'mention',
      title: 'Project Invitation',
      content: `You've been invited to join a project as ${role}`,
    })
    
    return NextResponse.json(teamMember)
  } catch (error) {
    console.error('Error inviting team member:', error)
    return NextResponse.json({ error: 'Failed to invite team member' }, { status: 500 })
  }
}

// PATCH /api/v1/team - Update team member
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { id, ...updates } = body
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    
    // Prevent changing owner role
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('role')
      .eq('id', id)
      .single()
    
    if (existingMember?.role === 'owner') {
      return NextResponse.json(
        { error: 'Cannot change owner role' }, 
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('team_members')
      .update(updates)
      .eq('id', id)
      .select(`*, user:users!team_members_user_id_fkey(*)`)
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
  }
}

// DELETE /api/v1/team - Remove team member
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const id = request.nextUrl.searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    
    // Prevent removing owner
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('role, user_id, project_id')
      .eq('id', id)
      .single()
    
    if (existingMember?.role === 'owner') {
      return NextResponse.json(
        { error: 'Cannot remove project owner' }, 
        { status: 400 }
      )
    }
    
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Create notification for removed user
    if (existingMember?.user_id) {
      await supabase.from('notifications').insert({
        id: randomUUID(),
        user_id: existingMember.user_id,
        type: 'mention',
        title: 'Removed from Project',
        content: 'You have been removed from a project',
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing team member:', error)
    return NextResponse.json({ error: 'Failed to remove team member' }, { status: 500 })
  }
}
