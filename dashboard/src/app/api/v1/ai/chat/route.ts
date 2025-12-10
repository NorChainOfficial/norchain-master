import { NextRequest, NextResponse } from 'next/server'
import { claudeAI } from '@/lib/ai/claude'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, projectContext } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    const response = await claudeAI.chat(messages, projectContext)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI service error' },
      { status: 500 }
    )
  }
}

