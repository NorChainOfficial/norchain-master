import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// GET /api/v1/projects/[id]/documents - Get all documents for a project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    // Get project with inline documents
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, name, description, roadmap, prd, srsd, specifications, architecture, tech_stack, milestones, risks, stakeholders')
      .eq('id', params.id)
      .single()

    if (projectError) {
      return NextResponse.json({ error: projectError.message }, { status: 500 })
    }

    // Get versioned documents
    const { data: documents, error: docsError } = await supabase
      .from('project_documents')
      .select('*')
      .eq('project_id', params.id)
      .eq('is_current', true)
      .order('type')

    if (docsError) {
      console.error('Error fetching documents:', docsError)
    }

    return NextResponse.json({
      project,
      documents: documents || [],
    })
  } catch (error) {
    console.error('Error fetching project documents:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}

// PUT /api/v1/projects/[id]/documents - Update project documents
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { field, content } = body

    // Validate field is one of the allowed document types
    const allowedFields = ['description', 'roadmap', 'prd', 'srsd', 'specifications', 'architecture']
    if (!allowedFields.includes(field)) {
      return NextResponse.json({ error: 'Invalid document field' }, { status: 400 })
    }

    // Update the project's inline document field
    const { data, error } = await supabase
      .from('projects')
      .update({ [field]: content, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating project document:', error)
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 })
  }
}

// POST /api/v1/projects/[id]/documents - Create a versioned document
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { type, title, content, ai_generated } = body

    // Mark previous versions as not current
    await supabase
      .from('project_documents')
      .update({ is_current: false })
      .eq('project_id', params.id)
      .eq('type', type)

    // Get the next version number
    const { data: lastDoc } = await supabase
      .from('project_documents')
      .select('version')
      .eq('project_id', params.id)
      .eq('type', type)
      .order('version', { ascending: false })
      .limit(1)
      .single()

    const nextVersion = (lastDoc?.version || 0) + 1

    // Create new document
    const { data, error } = await supabase
      .from('project_documents')
      .insert({
        project_id: params.id,
        type,
        title: title || `${type.toUpperCase()} v${nextVersion}`,
        content,
        version: nextVersion,
        is_current: true,
        ai_generated: ai_generated || false,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating project document:', error)
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }
}

