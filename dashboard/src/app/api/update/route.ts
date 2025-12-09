import { NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

// API endpoint for agents to update dashboard data
// This allows Claude/AI agents to push updates to the dashboard

interface UpdateTaskPayload {
  taskId: string
  status: 'backlog' | 'in_progress' | 'review' | 'done'
}

interface UpdatePhasePayload {
  phaseId: number
  progress?: number
  status?: 'pending' | 'active' | 'complete'
  deliverable?: {
    name: string
    status: 'pending' | 'in_progress' | 'complete'
  }
}

interface UpdateCompliancePayload {
  itemId: string
  status: 'pending' | 'in_progress' | 'complete'
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, payload } = body

    // Validate request
    if (!type || !payload) {
      return NextResponse.json(
        { error: 'Missing type or payload' },
        { status: 400 }
      )
    }

    const dataDir = path.join(process.cwd(), 'src/data')

    switch (type) {
      case 'task': {
        const { taskId, status } = payload as UpdateTaskPayload
        const tasksPath = path.join(dataDir, 'tasks.json')
        const tasks = JSON.parse(fs.readFileSync(tasksPath, 'utf-8'))
        
        const taskIndex = tasks.findIndex((t: any) => t.id === taskId)
        if (taskIndex === -1) {
          return NextResponse.json({ error: 'Task not found' }, { status: 404 })
        }
        
        tasks[taskIndex].status = status
        fs.writeFileSync(tasksPath, JSON.stringify(tasks, null, 2))
        
        return NextResponse.json({ 
          success: true, 
          message: `Task ${taskId} updated to ${status}`,
          task: tasks[taskIndex]
        })
      }

      case 'phase': {
        const { phaseId, progress, status, deliverable } = payload as UpdatePhasePayload
        const phasesPath = path.join(dataDir, 'phases.json')
        const phases = JSON.parse(fs.readFileSync(phasesPath, 'utf-8'))
        
        const phaseIndex = phases.findIndex((p: any) => p.id === phaseId)
        if (phaseIndex === -1) {
          return NextResponse.json({ error: 'Phase not found' }, { status: 404 })
        }
        
        if (progress !== undefined) {
          phases[phaseIndex].progress = progress
        }
        if (status !== undefined) {
          phases[phaseIndex].status = status
        }
        if (deliverable) {
          const delIndex = phases[phaseIndex].deliverables.findIndex(
            (d: any) => d.name === deliverable.name
          )
          if (delIndex !== -1) {
            phases[phaseIndex].deliverables[delIndex].status = deliverable.status
          }
        }
        
        fs.writeFileSync(phasesPath, JSON.stringify(phases, null, 2))
        
        return NextResponse.json({ 
          success: true, 
          message: `Phase ${phaseId} updated`,
          phase: phases[phaseIndex]
        })
      }

      case 'compliance': {
        const { itemId, status } = payload as UpdateCompliancePayload
        const compliancePath = path.join(dataDir, 'compliance.json')
        const compliance = JSON.parse(fs.readFileSync(compliancePath, 'utf-8'))
        
        const itemIndex = compliance.checklist.findIndex((c: any) => c.id === itemId)
        if (itemIndex === -1) {
          return NextResponse.json({ error: 'Compliance item not found' }, { status: 404 })
        }
        
        compliance.checklist[itemIndex].status = status
        fs.writeFileSync(compliancePath, JSON.stringify(compliance, null, 2))
        
        return NextResponse.json({ 
          success: true, 
          message: `Compliance item ${itemId} updated to ${status}`,
          item: compliance.checklist[itemIndex]
        })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid type. Use: task, phase, or compliance' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to check API status
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoints: {
      updateTask: 'POST /api/update { type: "task", payload: { taskId, status } }',
      updatePhase: 'POST /api/update { type: "phase", payload: { phaseId, progress?, status?, deliverable? } }',
      updateCompliance: 'POST /api/update { type: "compliance", payload: { itemId, status } }',
    },
    example: {
      type: 'task',
      payload: {
        taskId: 't1-1',
        status: 'done'
      }
    }
  })
}

