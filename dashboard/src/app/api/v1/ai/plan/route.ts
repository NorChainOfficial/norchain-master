import { NextRequest, NextResponse } from 'next/server'
import { claudeAI } from '@/lib/ai/claude'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, projectContext } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const plan = await claudeAI.planFromPrompt(prompt, projectContext)

    return NextResponse.json({ plan })
  } catch (error) {
    console.error('AI plan error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI service error' },
      { status: 500 }
    )
  }
}

