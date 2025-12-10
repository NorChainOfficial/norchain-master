import { createServerClient } from '@/lib/supabase'
import { AgentConfig, AgentTask } from '@/types/database'

export type AutonomyLevel = 'suggest' | 'supervised' | 'autonomous'

export interface AgentAction {
  type: string
  params: Record<string, unknown>
  description: string
}

export interface AgentExecutionResult {
  success: boolean
  output?: Record<string, unknown>
  error?: string
  logs: string[]
}

interface ExecutionContext {
  projectId: string
  userId?: string
  dryRun?: boolean
}

/**
 * Agent Orchestrator manages AI agent tasks with hybrid autonomy
 */
class AgentOrchestrator {
  /**
   * Get configuration for a specific task type
   */
  async getConfig(projectId: string, taskType: string): Promise<AgentConfig | null> {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('agent_configs')
      .select('*')
      .eq('project_id', projectId)
      .eq('task_type', taskType)
      .single()

    if (error) {
      console.error('Error fetching agent config:', error)
      return null
    }

    return data
  }

  /**
   * Get all configurations for a project
   */
  async getAllConfigs(projectId: string): Promise<AgentConfig[]> {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('agent_configs')
      .select('*')
      .eq('project_id', projectId)
      .eq('enabled', true)

    if (error) {
      console.error('Error fetching agent configs:', error)
      return []
    }

    return data || []
  }

  /**
   * Create a new agent task
   */
  async createTask(
    projectId: string,
    taskType: string,
    title: string,
    description: string,
    inputData: Record<string, unknown>
  ): Promise<AgentTask | null> {
    const supabase = createServerClient()
    
    // Get config to determine autonomy level
    const config = await this.getConfig(projectId, taskType)
    const autonomyLevel = config?.autonomy_level || 'suggest'
    const requiresApproval = config?.requires_approval ?? true

    const { data, error } = await supabase
      .from('agent_tasks')
      .insert({
        project_id: projectId,
        type: taskType,
        title,
        description,
        autonomy_level: autonomyLevel,
        requires_approval: requiresApproval,
        input_data: inputData,
        status: requiresApproval ? 'awaiting_approval' : 'queued',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating agent task:', error)
      return null
    }

    // If autonomous and doesn't require approval, execute immediately
    if (autonomyLevel === 'autonomous' && !requiresApproval) {
      this.executeTask(data.id, { projectId })
    }

    return data
  }

  /**
   * Approve a pending task
   */
  async approveTask(taskId: string, approvedBy: string): Promise<boolean> {
    const supabase = createServerClient()
    
    const { error } = await supabase
      .from('agent_tasks')
      .update({
        status: 'queued',
        approved_by: approvedBy,
        approved_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .eq('status', 'awaiting_approval')

    if (error) {
      console.error('Error approving task:', error)
      return false
    }

    return true
  }

  /**
   * Execute a queued task
   */
  async executeTask(
    taskId: string,
    context: ExecutionContext
  ): Promise<AgentExecutionResult> {
    const supabase = createServerClient()
    const logs: string[] = []
    
    try {
      // Get task details
      const { data: task, error: fetchError } = await supabase
        .from('agent_tasks')
        .select('*')
        .eq('id', taskId)
        .single()

      if (fetchError || !task) {
        return { success: false, error: 'Task not found', logs }
      }

      logs.push(`Starting execution of task: ${task.title}`)

      // Update status to running
      await supabase
        .from('agent_tasks')
        .update({
          status: 'running',
          started_at: new Date().toISOString(),
        })
        .eq('id', taskId)

      // Execute based on task type
      let result: AgentExecutionResult

      switch (task.type) {
        case 'create_task':
          result = await this.executeCreateTask(task, context, logs)
          break
        case 'update_status':
          result = await this.executeUpdateStatus(task, context, logs)
          break
        case 'create_issue':
          result = await this.executeCreateIssue(task, context, logs)
          break
        case 'generate_report':
          result = await this.executeGenerateReport(task, context, logs)
          break
        default:
          result = { success: false, error: `Unknown task type: ${task.type}`, logs }
      }

      // Update task with result
      await supabase
        .from('agent_tasks')
        .update({
          status: result.success ? 'completed' : 'failed',
          output_data: result.output || {},
          error_message: result.error,
          execution_log: result.logs.join('\n'),
          completed_at: new Date().toISOString(),
        })
        .eq('id', taskId)

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logs.push(`Error: ${errorMessage}`)

      await supabase
        .from('agent_tasks')
        .update({
          status: 'failed',
          error_message: errorMessage,
          execution_log: logs.join('\n'),
          completed_at: new Date().toISOString(),
        })
        .eq('id', taskId)

      return { success: false, error: errorMessage, logs }
    }
  }

  /**
   * Execute create_task action
   */
  private async executeCreateTask(
    task: AgentTask,
    context: ExecutionContext,
    logs: string[]
  ): Promise<AgentExecutionResult> {
    const supabase = createServerClient()
    const input = task.input_data as Record<string, unknown>

    logs.push(`Creating task: ${input.title}`)

    if (context.dryRun) {
      logs.push('Dry run - task not actually created')
      return { success: true, output: { dryRun: true }, logs }
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        id: input.id as string,
        title: input.title as string,
        description: input.description as string,
        role: input.role as string,
        phase_id: input.phase_id as number,
        project_id: context.projectId,
        status: 'backlog',
        priority: (input.priority as string) || 'medium',
      })
      .select()
      .single()

    if (error) {
      logs.push(`Error creating task: ${error.message}`)
      return { success: false, error: error.message, logs }
    }

    logs.push(`Task created successfully: ${data.id}`)
    return { success: true, output: { task: data }, logs }
  }

  /**
   * Execute update_status action
   */
  private async executeUpdateStatus(
    task: AgentTask,
    context: ExecutionContext,
    logs: string[]
  ): Promise<AgentExecutionResult> {
    const supabase = createServerClient()
    const input = task.input_data as Record<string, unknown>

    logs.push(`Updating status of ${input.entity_type}: ${input.entity_id} to ${input.status}`)

    if (context.dryRun) {
      logs.push('Dry run - status not actually updated')
      return { success: true, output: { dryRun: true }, logs }
    }

    const table = input.entity_type === 'task' ? 'tasks' : 'phases'
    
    const { error } = await supabase
      .from(table)
      .update({ status: input.status as string })
      .eq('id', input.entity_id as string)

    if (error) {
      logs.push(`Error updating status: ${error.message}`)
      return { success: false, error: error.message, logs }
    }

    logs.push('Status updated successfully')
    return { success: true, output: { updated: true }, logs }
  }

  /**
   * Execute create_issue action (GitHub)
   */
  private async executeCreateIssue(
    task: AgentTask,
    context: ExecutionContext,
    logs: string[]
  ): Promise<AgentExecutionResult> {
    const input = task.input_data as Record<string, unknown>
    
    logs.push(`Creating GitHub issue: ${input.title}`)

    if (context.dryRun) {
      logs.push('Dry run - issue not actually created')
      return { success: true, output: { dryRun: true }, logs }
    }

    // TODO: Implement GitHub API integration
    logs.push('GitHub integration not yet implemented')
    return { 
      success: false, 
      error: 'GitHub integration pending implementation', 
      logs 
    }
  }

  /**
   * Execute generate_report action
   */
  private async executeGenerateReport(
    task: AgentTask,
    context: ExecutionContext,
    logs: string[]
  ): Promise<AgentExecutionResult> {
    const supabase = createServerClient()
    const input = task.input_data as Record<string, unknown>

    logs.push(`Generating ${input.report_type} report`)

    // Fetch project data
    const [tasksRes, phasesRes] = await Promise.all([
      supabase
        .from('tasks')
        .select('*')
        .eq('project_id', context.projectId),
      supabase
        .from('phases')
        .select('*')
        .eq('project_id', context.projectId),
    ])

    const tasks = tasksRes.data || []
    const phases = phasesRes.data || []

    // Generate report
    const report = {
      generatedAt: new Date().toISOString(),
      projectId: context.projectId,
      summary: {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'done').length,
        inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
        totalPhases: phases.length,
        activePhases: phases.filter(p => p.status === 'active').length,
        overallProgress: phases.length > 0 
          ? Math.round(phases.reduce((acc, p) => acc + (p.progress || 0), 0) / phases.length)
          : 0,
      },
      phases: phases.map(p => ({
        id: p.id,
        name: p.name,
        progress: p.progress,
        status: p.status,
        taskCount: tasks.filter(t => t.phase_id === p.id).length,
      })),
    }

    logs.push(`Report generated with ${tasks.length} tasks and ${phases.length} phases`)
    return { success: true, output: { report }, logs }
  }

  /**
   * Get pending tasks awaiting approval
   */
  async getPendingTasks(projectId: string): Promise<AgentTask[]> {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('agent_tasks')
      .select('*')
      .eq('project_id', projectId)
      .eq('status', 'awaiting_approval')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching pending tasks:', error)
      return []
    }

    return data || []
  }

  /**
   * Get task history
   */
  async getTaskHistory(
    projectId: string,
    limit = 50
  ): Promise<AgentTask[]> {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('agent_tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching task history:', error)
      return []
    }

    return data || []
  }
}

// Export singleton instance
export const agentOrchestrator = new AgentOrchestrator()

