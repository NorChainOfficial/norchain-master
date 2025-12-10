import Anthropic from '@anthropic-ai/sdk'

// Types for AI operations
export interface AIGenerationOptions {
  maxTokens?: number
  temperature?: number
}

export interface Recommendation {
  id: string
  type: 'task' | 'phase' | 'risk' | 'optimization' | 'compliance' | 'security'
  title: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  confidence: number
  actionData?: Record<string, unknown>
  reasoning: string
}

export interface Plan {
  phases: {
    name: string
    description: string
    duration: string
    tasks: {
      title: string
      role: string
      priority: string
      description: string
    }[]
  }[]
}

export interface Analysis {
  summary: string
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  risks: string[]
  recommendations: Recommendation[]
}

export interface ProjectContext {
  name: string
  description?: string
  phases?: Array<{ name: string; progress: number; status: string }>
  tasks?: Array<{ title: string; status: string; role: string }>
  aiContext?: Record<string, unknown>
}

class ClaudeAIService {
  private client: Anthropic | null = null
  private model = 'claude-sonnet-4-20250514'

  private getClient(): Anthropic {
    if (!this.client) {
      const apiKey = process.env.ANTHROPIC_API_KEY
      if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY is not set')
      }
      this.client = new Anthropic({ apiKey })
    }
    return this.client
  }

  /**
   * Generate a detailed description for a phase, task, or other entity
   */
  async generateDescription(
    type: 'phase' | 'task' | 'compliance' | 'test_case',
    context: {
      title: string
      projectContext?: ProjectContext
      additionalContext?: string
    },
    options?: AIGenerationOptions
  ): Promise<string> {
    const client = this.getClient()

    const systemPrompt = `You are an expert product manager with 30+ years of experience in blockchain and web3 development. 
Your task is to generate detailed, professional descriptions for ${type}s in a development project.
The project is NorChain - a Layer-1 blockchain focused on Real World Asset (RWA) tokenization with security tokens.
Keep descriptions concise but comprehensive, focusing on deliverables, requirements, and success criteria.`

    const userPrompt = `Generate a professional description for the following ${type}:

Title: ${context.title}
${context.projectContext ? `\nProject Context: ${JSON.stringify(context.projectContext, null, 2)}` : ''}
${context.additionalContext ? `\nAdditional Context: ${context.additionalContext}` : ''}

Provide a clear, actionable description that would help a developer understand what needs to be done.`

    const response = await client.messages.create({
      model: this.model,
      max_tokens: options?.maxTokens || 500,
      temperature: options?.temperature || 0.7,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const textBlock = response.content.find((block) => block.type === 'text')
    return textBlock ? textBlock.text : ''
  }

  /**
   * Get AI recommendations based on current project state
   */
  async getRecommendations(
    projectContext: ProjectContext,
    options?: AIGenerationOptions
  ): Promise<Recommendation[]> {
    const client = this.getClient()

    const systemPrompt = `You are an expert product manager and blockchain architect analyzing a project's current state.
Your task is to provide actionable recommendations to improve the project's progress, quality, and compliance.
Focus on: risk mitigation, blockers, optimization opportunities, and compliance requirements.
For NorChain, remember: security tokens require KYC, no public DEX/CEX trading for PM-EQ/NV-EQ tokens.

Respond ONLY with valid JSON in this format:
{
  "recommendations": [
    {
      "type": "task|phase|risk|optimization|compliance|security",
      "title": "Short title",
      "description": "Detailed description",
      "priority": "critical|high|medium|low",
      "confidence": 0.0-1.0,
      "reasoning": "Why this recommendation"
    }
  ]
}`

    const userPrompt = `Analyze the following project state and provide recommendations:

${JSON.stringify(projectContext, null, 2)}

Identify:
1. Potential risks or blockers
2. Tasks that should be prioritized
3. Compliance gaps (especially for security tokens)
4. Optimization opportunities
5. Missing phases or tasks`

    const response = await client.messages.create({
      model: this.model,
      max_tokens: options?.maxTokens || 2000,
      temperature: options?.temperature || 0.5,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const textBlock = response.content.find((block) => block.type === 'text')
    if (!textBlock) return []

    try {
      const parsed = JSON.parse(textBlock.text)
      return parsed.recommendations.map((rec: Omit<Recommendation, 'id'>, index: number) => ({
        ...rec,
        id: `rec-${Date.now()}-${index}`,
      }))
    } catch {
      console.error('Failed to parse AI recommendations')
      return []
    }
  }

  /**
   * Generate a project plan from natural language prompt
   */
  async planFromPrompt(
    prompt: string,
    projectContext?: ProjectContext,
    options?: AIGenerationOptions
  ): Promise<Plan> {
    const client = this.getClient()

    const systemPrompt = `You are an expert product manager creating project plans for blockchain development.
Convert user requests into structured phases and tasks.
For NorChain projects, consider: blockchain (Go), smart contracts (Solidity), backend (NestJS), frontend (Next.js), mobile (iOS/Android).

Respond ONLY with valid JSON in this format:
{
  "phases": [
    {
      "name": "Phase Name",
      "description": "Phase description",
      "duration": "X weeks",
      "tasks": [
        {
          "title": "Task title",
          "role": "blockchain|contract|backend|frontend|mobile-ios|mobile-android|devops",
          "priority": "critical|high|medium|low",
          "description": "Task description"
        }
      ]
    }
  ]
}`

    const userPrompt = `Create a project plan for the following request:

"${prompt}"

${projectContext ? `\nExisting Project Context:\n${JSON.stringify(projectContext, null, 2)}` : ''}

Generate appropriate phases and tasks with realistic estimates.`

    const response = await client.messages.create({
      model: this.model,
      max_tokens: options?.maxTokens || 3000,
      temperature: options?.temperature || 0.7,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const textBlock = response.content.find((block) => block.type === 'text')
    if (!textBlock) return { phases: [] }

    try {
      return JSON.parse(textBlock.text)
    } catch {
      console.error('Failed to parse AI plan')
      return { phases: [] }
    }
  }

  /**
   * Analyze project and provide comprehensive insights
   */
  async analyzeProject(
    projectContext: ProjectContext,
    options?: AIGenerationOptions
  ): Promise<Analysis> {
    const client = this.getClient()

    const systemPrompt = `You are a senior blockchain product manager performing a comprehensive project analysis.
Provide SWOT-style analysis with actionable recommendations.

Respond ONLY with valid JSON in this format:
{
  "summary": "Brief project health summary",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "opportunities": ["opportunity1", "opportunity2"],
  "risks": ["risk1", "risk2"],
  "recommendations": [
    {
      "type": "task|phase|risk|optimization|compliance|security",
      "title": "Title",
      "description": "Description",
      "priority": "critical|high|medium|low",
      "confidence": 0.8,
      "reasoning": "Reasoning"
    }
  ]
}`

    const response = await client.messages.create({
      model: this.model,
      max_tokens: options?.maxTokens || 2500,
      temperature: options?.temperature || 0.5,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Analyze this project:\n\n${JSON.stringify(projectContext, null, 2)}`,
        },
      ],
    })

    const textBlock = response.content.find((block) => block.type === 'text')
    if (!textBlock) {
      return {
        summary: 'Analysis unavailable',
        strengths: [],
        weaknesses: [],
        opportunities: [],
        risks: [],
        recommendations: [],
      }
    }

    try {
      const parsed = JSON.parse(textBlock.text)
      return {
        ...parsed,
        recommendations: parsed.recommendations.map(
          (rec: Omit<Recommendation, 'id'>, index: number) => ({
            ...rec,
            id: `rec-${Date.now()}-${index}`,
          })
        ),
      }
    } catch {
      console.error('Failed to parse AI analysis')
      return {
        summary: 'Analysis parsing failed',
        strengths: [],
        weaknesses: [],
        opportunities: [],
        risks: [],
        recommendations: [],
      }
    }
  }

  /**
   * Generate test cases from requirements or code
   */
  async generateTestCases(
    context: {
      feature: string
      requirements?: string
      codeSnippet?: string
      testType: 'unit' | 'integration' | 'e2e' | 'security'
    },
    options?: AIGenerationOptions
  ): Promise<
    Array<{
      name: string
      description: string
      steps: string[]
      expectedResult: string
      priority: string
    }>
  > {
    const client = this.getClient()

    const systemPrompt = `You are a QA engineer generating comprehensive ${context.testType} test cases.
Create thorough test cases that cover edge cases, error conditions, and happy paths.

Respond ONLY with valid JSON array:
[
  {
    "name": "Test case name",
    "description": "What the test verifies",
    "steps": ["Step 1", "Step 2"],
    "expectedResult": "Expected outcome",
    "priority": "critical|high|medium|low"
  }
]`

    const userPrompt = `Generate ${context.testType} test cases for:

Feature: ${context.feature}
${context.requirements ? `\nRequirements:\n${context.requirements}` : ''}
${context.codeSnippet ? `\nCode:\n${context.codeSnippet}` : ''}

Generate at least 5 comprehensive test cases.`

    const response = await client.messages.create({
      model: this.model,
      max_tokens: options?.maxTokens || 2000,
      temperature: options?.temperature || 0.6,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const textBlock = response.content.find((block) => block.type === 'text')
    if (!textBlock) return []

    try {
      return JSON.parse(textBlock.text)
    } catch {
      console.error('Failed to parse AI test cases')
      return []
    }
  }

  /**
   * Chat with AI assistant about the project
   */
  async chat(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    projectContext?: ProjectContext,
    options?: AIGenerationOptions
  ): Promise<string> {
    const client = this.getClient()

    const systemPrompt = `You are an AI Product Manager assistant for NorChain, a Layer-1 blockchain focused on RWA tokenization.
You have 30+ years of experience in blockchain, web3, and fintech development.
You help with project planning, task management, compliance questions, and technical decisions.

Key facts about NorChain:
- Uses PoSA consensus (Proof of Staked Authority)
- Tokens: NOR (utility), PM-EQ and NV-EQ (security tokens)
- Security tokens require KYC and cannot be traded on public DEX/CEX
- Strategy: "Private First — Regulated Later"
- Tech stack: Go (blockchain), Solidity (contracts), NestJS (backend), Next.js (frontend)

${projectContext ? `\nCurrent Project State:\n${JSON.stringify(projectContext, null, 2)}` : ''}`

    const response = await client.messages.create({
      model: this.model,
      max_tokens: options?.maxTokens || 1500,
      temperature: options?.temperature || 0.7,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    })

    const textBlock = response.content.find((block) => block.type === 'text')
    return textBlock ? textBlock.text : ''
  }
}

// Export singleton instance
export const claudeAI = new ClaudeAIService()

