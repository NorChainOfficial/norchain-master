import { NextRequest, NextResponse } from 'next/server'
import { claudeAI } from '@/lib/ai/claude'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectContext } = body

    if (!projectContext) {
      return NextResponse.json(
        { error: 'Project context is required' },
        { status: 400 }
      )
    }

    const analysis = await claudeAI.analyzeProject(projectContext)

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('AI analyze error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI service error' },
      { status: 500 }
    )
  }
}

