import { NextRequest, NextResponse } from 'next/server'
import { claudeAI } from '@/lib/ai/claude'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, projectContext, additionalContext } = body

    if (!type || !title) {
      return NextResponse.json(
        { error: 'Type and title are required' },
        { status: 400 }
      )
    }

    const description = await claudeAI.generateDescription(
      type,
      { title, projectContext, additionalContext }
    )

    return NextResponse.json({ description })
  } catch (error) {
    console.error('AI generate error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI service error' },
      { status: 500 }
    )
  }
}

