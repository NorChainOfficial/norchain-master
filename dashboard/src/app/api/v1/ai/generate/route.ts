import { NextRequest, NextResponse } from 'next/server'
import { claudeAI } from '@/lib/ai/claude'

const documentPrompts: Record<string, string> = {
  description: `Generate a comprehensive project description including:
- Vision and long-term goals
- Target audience and user personas
- Key value propositions
- Success metrics and KPIs
- Competitive advantages`,

  roadmap: `Generate a detailed project roadmap including:
- Clear phases with timeline (quarters/months)
- Milestones for each phase
- Deliverables and success criteria
- Dependencies between phases
- Risk mitigation points`,

  prd: `Generate a Product Requirements Document (PRD) including:
- Executive summary
- User stories with acceptance criteria
- Feature requirements with priorities
- Non-functional requirements (performance, security, scalability)
- Success metrics for each feature`,

  srsd: `Generate a Software Requirements Specification Document (SRSD) including:
- System overview and context
- Functional requirements with IDs
- Non-functional requirements
- Interface requirements (UI, API, external)
- Data requirements and constraints
- Security and compliance requirements`,

  specifications: `Generate Technical Specifications including:
- API contracts with request/response schemas
- Data models and database schemas
- Integration points and protocols
- Error handling strategies
- Performance requirements`,

  architecture: `Generate System Architecture documentation including:
- High-level architecture diagram (ASCII)
- Component descriptions and responsibilities
- Technology stack justification
- Deployment architecture
- Security architecture
- Scalability considerations`,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, projectName, projectDescription, existingContent, context } = body

    // Handle document generation for project page
    if (type && documentPrompts[type]) {
      const prompt = `You are an expert technical writer and project manager.

Project Name: ${projectName || 'Untitled Project'}
${projectDescription ? `Project Description: ${projectDescription}` : ''}
${context?.roadmap ? `Existing Roadmap: ${context.roadmap.substring(0, 500)}...` : ''}
${existingContent ? `Existing Content to Improve: ${existingContent.substring(0, 1000)}...` : ''}

${documentPrompts[type]}

${existingContent 
  ? 'Improve and expand the existing content while maintaining its structure and key points.'
  : 'Generate comprehensive content from scratch using markdown formatting.'}

Use clear headers, bullet points, and proper markdown formatting.
Be specific and actionable, not generic.
Include realistic examples relevant to the project context.`

      try {
        const response = await claudeAI.chat([
          { role: 'user', content: prompt }
        ])
        
        return NextResponse.json({ 
          content: response,
          type,
        })
      } catch (aiError) {
        // If AI fails, return a template
        console.error('AI generation failed, returning template:', aiError)
        return NextResponse.json({ 
          content: getTemplate(type, projectName),
          type,
          template: true,
        })
      }
    }

    // Handle legacy description generation
    if (!type || !title) {
      return NextResponse.json(
        { error: 'Type and title are required' },
        { status: 400 }
      )
    }

    const description = await claudeAI.generateDescription(
      type,
      { title, projectContext: projectDescription, additionalContext: context }
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

function getTemplate(type: string, projectName: string = 'Project'): string {
  const templates: Record<string, string> = {
    description: `# ${projectName}

## Vision
[Describe the project vision and long-term goals]

## Target Audience
[Who are the primary users?]

## Key Value Propositions
- [Value 1]
- [Value 2]
- [Value 3]

## Success Metrics
- [Metric 1]
- [Metric 2]`,

    roadmap: `# ${projectName} Roadmap

## Phase 1: Foundation (Month 1-3)
### Milestones
- [ ] Milestone 1.1
- [ ] Milestone 1.2
### Deliverables
- Deliverable 1

## Phase 2: Core Development (Month 4-6)
### Milestones
- [ ] Milestone 2.1
- [ ] Milestone 2.2
### Deliverables
- Deliverable 2`,

    prd: `# Product Requirements Document: ${projectName}

## Executive Summary
[Brief overview]

## User Stories
### US-001: [Story Title]
**As a** [user type]
**I want to** [action]
**So that** [benefit]

**Acceptance Criteria:**
- [ ] Criteria 1
- [ ] Criteria 2

## Feature Requirements
### FR-001: [Feature Name]
- **Priority:** High
- **Description:** [Details]`,

    srsd: `# Software Requirements Specification: ${projectName}

## 1. Introduction
### 1.1 Purpose
[Purpose of this document]

### 1.2 Scope
[System scope]

## 2. Functional Requirements
### FR-001: [Requirement]
- **Description:** 
- **Input:** 
- **Output:**

## 3. Non-Functional Requirements
### NFR-001: Performance
[Performance requirements]`,

    specifications: `# Technical Specifications: ${projectName}

## API Contracts
### Endpoint: POST /api/v1/resource
\`\`\`json
{
  "request": {},
  "response": {}
}
\`\`\`

## Data Models
\`\`\`typescript
interface Entity {
  id: string;
}
\`\`\`

## Database Schema
| Table | Column | Type |
|-------|--------|------|
| | | |`,

    architecture: `# System Architecture: ${projectName}

## High-Level Architecture
\`\`\`
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
┌──────▼──────┐
│    API      │
└──────┬──────┘
       │
┌──────▼──────┐
│  Database   │
└─────────────┘
\`\`\`

## Technology Stack
- **Frontend:** 
- **Backend:** 
- **Database:** 

## Deployment
[Deployment strategy]`,
  }

  return templates[type] || `# ${projectName}\n\n[Add content here]`
}
