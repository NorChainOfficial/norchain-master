#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Create MCP Server
const server = new Server(
  {
    name: 'norchain-dashboard',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // ============================================
      // TASK TOOLS
      // ============================================
      {
        name: 'create_task',
        description: 'Create a new task in the NorChain PM Dashboard',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Task ID (e.g., t1-10, t2-5)' },
            title: { type: 'string', description: 'Task title' },
            role: {
              type: 'string',
              enum: ['blockchain', 'contract', 'backend', 'frontend', 'mobile-ios', 'mobile-android', 'devops'],
              description: 'Role responsible for the task',
            },
            phase_id: { type: 'number', description: 'Phase ID (1-10)' },
            priority: { type: 'string', enum: ['high', 'medium', 'low'], description: 'Task priority' },
            complexity: { type: 'string', enum: ['high', 'medium', 'low'], description: 'Task complexity' },
            status: {
              type: 'string',
              enum: ['backlog', 'in_progress', 'review', 'done'],
              description: 'Task status (default: backlog)',
            },
            description: { type: 'string', description: 'Optional task description' },
            assignee: { type: 'string', description: 'Optional assignee' },
          },
          required: ['id', 'title', 'role', 'phase_id'],
        },
      },
      {
        name: 'update_task',
        description: 'Update an existing task',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: { type: 'string', description: 'The task ID (e.g., t1-1, t2-3)' },
            title: { type: 'string', description: 'New title' },
            status: {
              type: 'string',
              enum: ['backlog', 'in_progress', 'review', 'done'],
              description: 'New status',
            },
            priority: { type: 'string', enum: ['high', 'medium', 'low'] },
            complexity: { type: 'string', enum: ['high', 'medium', 'low'] },
            assignee: { type: 'string', description: 'Assignee name' },
            description: { type: 'string', description: 'Task description' },
          },
          required: ['task_id'],
        },
      },
      {
        name: 'delete_task',
        description: 'Delete a task by ID',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: { type: 'string', description: 'Task ID to delete' },
          },
          required: ['task_id'],
        },
      },
      {
        name: 'bulk_update_tasks',
        description: 'Update multiple tasks at once (e.g., change status of multiple tasks)',
        inputSchema: {
          type: 'object',
          properties: {
            task_ids: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of task IDs to update',
            },
            status: { type: 'string', enum: ['backlog', 'in_progress', 'review', 'done'] },
            assignee: { type: 'string' },
          },
          required: ['task_ids'],
        },
      },
      {
        name: 'bulk_delete_tasks',
        description: 'Delete multiple tasks at once',
        inputSchema: {
          type: 'object',
          properties: {
            task_ids: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of task IDs to delete',
            },
          },
          required: ['task_ids'],
        },
      },
      {
        name: 'get_tasks',
        description: 'Get tasks with optional filters',
        inputSchema: {
          type: 'object',
          properties: {
            phase_id: { type: 'number', description: 'Filter by phase ID' },
            status: { type: 'string', enum: ['backlog', 'in_progress', 'review', 'done'] },
            role: { type: 'string' },
            limit: { type: 'number', description: 'Max results (default 100)' },
          },
        },
      },

      // ============================================
      // PHASE TOOLS
      // ============================================
      {
        name: 'update_phase',
        description: 'Update a phase progress or status',
        inputSchema: {
          type: 'object',
          properties: {
            phase_id: { type: 'number', description: 'Phase ID (1-10)' },
            name: { type: 'string', description: 'Phase name' },
            focus: { type: 'string', description: 'Phase focus description' },
            duration: { type: 'string', description: 'Duration (e.g., "2-3 weeks")' },
            progress: { type: 'number', description: 'Progress percentage (0-100)' },
            status: { type: 'string', enum: ['pending', 'active', 'complete'] },
          },
          required: ['phase_id'],
        },
      },
      {
        name: 'get_phases',
        description: 'Get all phases with their deliverables',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },

      // ============================================
      // DELIVERABLE TOOLS
      // ============================================
      {
        name: 'create_deliverable',
        description: 'Create a new deliverable for a phase',
        inputSchema: {
          type: 'object',
          properties: {
            phase_id: { type: 'number', description: 'Phase ID' },
            name: { type: 'string', description: 'Deliverable name' },
            description: { type: 'string', description: 'Optional description' },
            status: { type: 'string', enum: ['pending', 'in_progress', 'complete'], description: 'Status (default: pending)' },
          },
          required: ['phase_id', 'name'],
        },
      },
      {
        name: 'update_deliverable',
        description: 'Update a deliverable status',
        inputSchema: {
          type: 'object',
          properties: {
            phase_id: { type: 'number', description: 'Phase ID' },
            deliverable_name: { type: 'string', description: 'Deliverable name' },
            status: { type: 'string', enum: ['pending', 'in_progress', 'complete'] },
          },
          required: ['phase_id', 'deliverable_name', 'status'],
        },
      },
      {
        name: 'delete_deliverable',
        description: 'Delete a deliverable',
        inputSchema: {
          type: 'object',
          properties: {
            phase_id: { type: 'number', description: 'Phase ID' },
            deliverable_name: { type: 'string', description: 'Deliverable name' },
          },
          required: ['phase_id', 'deliverable_name'],
        },
      },

      // ============================================
      // REPOSITORY TOOLS
      // ============================================
      {
        name: 'create_repository',
        description: 'Add a new repository to the dashboard',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Repository name (e.g., norchain-docs)' },
            description: { type: 'string', description: 'Repository description' },
            url: { type: 'string', description: 'GitHub URL' },
            visibility: { type: 'string', enum: ['public', 'private'], description: 'Visibility' },
            category: { type: 'string', enum: ['Core', 'Wallet', 'Services', 'Tools', 'DevOps'], description: 'Category' },
            phase_id: { type: 'number', description: 'Associated phase ID' },
            language: { type: 'string', description: 'Primary language (e.g., TypeScript, Rust)' },
          },
          required: ['name', 'url'],
        },
      },
      {
        name: 'update_repository',
        description: 'Update repository information',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Repository name' },
            description: { type: 'string' },
            visibility: { type: 'string', enum: ['public', 'private'] },
            category: { type: 'string', enum: ['Core', 'Wallet', 'Services', 'Tools', 'DevOps'] },
            stars: { type: 'number' },
            forks: { type: 'number' },
            open_issues: { type: 'number' },
            health: { type: 'string', enum: ['healthy', 'warning', 'critical'] },
          },
          required: ['name'],
        },
      },
      {
        name: 'delete_repository',
        description: 'Remove a repository from the dashboard',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Repository name to delete' },
          },
          required: ['name'],
        },
      },
      {
        name: 'get_repositories',
        description: 'Get all repositories with optional filters',
        inputSchema: {
          type: 'object',
          properties: {
            category: { type: 'string', enum: ['Core', 'Wallet', 'Services', 'Tools', 'DevOps'] },
            visibility: { type: 'string', enum: ['public', 'private'] },
          },
        },
      },

      // ============================================
      // COMPLIANCE TOOLS
      // ============================================
      {
        name: 'create_compliance_item',
        description: 'Add a new compliance checklist item',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Item ID (e.g., c14, c15)' },
            category: { type: 'string', description: 'Category (e.g., Legal, Documentation)' },
            item: { type: 'string', description: 'Item description' },
            required: { type: 'boolean', description: 'Is this required?' },
            status: { type: 'string', enum: ['pending', 'in_progress', 'complete'], description: 'Status (default: pending)' },
            notes: { type: 'string', description: 'Optional notes' },
          },
          required: ['id', 'category', 'item'],
        },
      },
      {
        name: 'update_compliance',
        description: 'Update a compliance checklist item',
        inputSchema: {
          type: 'object',
          properties: {
            item_id: { type: 'string', description: 'Item ID (e.g., c1, c6)' },
            status: { type: 'string', enum: ['pending', 'in_progress', 'complete'] },
            notes: { type: 'string', description: 'Notes' },
          },
          required: ['item_id'],
        },
      },
      {
        name: 'delete_compliance_item',
        description: 'Delete a compliance checklist item',
        inputSchema: {
          type: 'object',
          properties: {
            item_id: { type: 'string', description: 'Item ID to delete' },
          },
          required: ['item_id'],
        },
      },
      {
        name: 'get_compliance',
        description: 'Get compliance checklist and token information',
        inputSchema: {
          type: 'object',
          properties: {
            category: { type: 'string', description: 'Filter by category' },
            status: { type: 'string', enum: ['pending', 'in_progress', 'complete'] },
          },
        },
      },

      // ============================================
      // TOKEN TOOLS
      // ============================================
      {
        name: 'create_token',
        description: 'Add a new token to compliance tracking',
        inputSchema: {
          type: 'object',
          properties: {
            symbol: { type: 'string', description: 'Token symbol (e.g., NOR)' },
            name: { type: 'string', description: 'Token name' },
            type: { type: 'string', enum: ['utility', 'security'], description: 'Token type (utility or security)' },
            tradability: { type: 'string', enum: ['public', 'private'], description: 'Tradability (public or private)' },
            kyc_required: { type: 'boolean', description: 'KYC required?' },
            description: { type: 'string', description: 'Token description' },
          },
          required: ['symbol', 'name', 'type'],
        },
      },
      {
        name: 'update_token',
        description: 'Update token information',
        inputSchema: {
          type: 'object',
          properties: {
            symbol: { type: 'string', description: 'Token symbol' },
            name: { type: 'string' },
            type: { type: 'string', enum: ['utility', 'security'] },
            tradability: { type: 'string', enum: ['public', 'private'] },
            kyc_required: { type: 'boolean' },
            description: { type: 'string' },
          },
          required: ['symbol'],
        },
      },

      // ============================================
      // ACTIVITY & STATS TOOLS
      // ============================================
      {
        name: 'log_activity',
        description: 'Log an activity event to the dashboard',
        inputSchema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['commit', 'issue', 'pr', 'release', 'milestone', 'task_update', 'phase_update', 'compliance_update'],
            },
            title: { type: 'string', description: 'Activity title' },
            description: { type: 'string' },
            entity_type: { type: 'string', description: 'Entity type (task, phase, repo, etc.)' },
            entity_id: { type: 'string', description: 'Entity ID' },
            author: { type: 'string', description: 'Author name (default: agent)' },
            url: { type: 'string' },
          },
          required: ['type', 'title', 'entity_type', 'entity_id'],
        },
      },
      {
        name: 'get_activity',
        description: 'Get recent activity log entries',
        inputSchema: {
          type: 'object',
          properties: {
            limit: { type: 'number', description: 'Max entries (default 50)' },
            type: { type: 'string', description: 'Filter by activity type' },
          },
        },
      },
      {
        name: 'get_dashboard_stats',
        description: 'Get current dashboard statistics summary',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  }
})

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    switch (name) {
      // ============================================
      // TASK HANDLERS
      // ============================================
      case 'create_task': {
        const { id, title, role, phase_id, priority = 'medium', complexity = 'medium', status = 'backlog', description, assignee } = args as any
        
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            id,
            title,
            role,
            phase_id,
            priority,
            complexity,
            status,
            description,
            assignee,
          })
          .select()
          .single()
        
        if (error) throw error
        
        await logActivity('task_update', `Created task: ${title}`, 'task', id)
        
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, task: data }) }] }
      }

      case 'update_task': {
        const { task_id, ...updates } = args as any
        
        const { data, error } = await supabase
          .from('tasks')
          .update(updates)
          .eq('id', task_id)
          .select()
          .single()
        
        if (error) throw error
        
        await logActivity('task_update', `Updated task ${task_id}`, 'task', task_id)
        
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, task: data }) }] }
      }

      case 'delete_task': {
        const { task_id } = args as any
        
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', task_id)
        
        if (error) throw error
        
        await logActivity('task_update', `Deleted task ${task_id}`, 'task', task_id)
        
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, deleted: task_id }) }] }
      }

      case 'bulk_update_tasks': {
        const { task_ids, ...updates } = args as any
        
        const { data, error } = await supabase
          .from('tasks')
          .update(updates)
          .in('id', task_ids)
          .select()
        
        if (error) throw error
        
        await logActivity('task_update', `Bulk updated ${task_ids.length} tasks`, 'task', task_ids.join(','))
        
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, updated: data?.length || 0, tasks: data }) }] }
      }

      case 'bulk_delete_tasks': {
        const { task_ids } = args as any
        
        const { error } = await supabase
          .from('tasks')
          .delete()
          .in('id', task_ids)
        
        if (error) throw error
        
        await logActivity('task_update', `Bulk deleted ${task_ids.length} tasks`, 'task', task_ids.join(','))
        
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, deleted: task_ids.length }) }] }
      }

      case 'get_tasks': {
        const { phase_id, status, role, limit = 100 } = args as any
        
        let query = supabase.from('tasks').select('*')
        if (phase_id) query = query.eq('phase_id', phase_id)
        if (status) query = query.eq('status', status)
        if (role) query = query.eq('role', role)
        
        const { data, error } = await query.order('created_at').limit(limit)
        if (error) throw error
        
        return { content: [{ type: 'text', text: JSON.stringify(data) }] }
      }

      // ============================================
      // PHASE HANDLERS
      // ============================================
      case 'update_phase': {
        const { phase_id, ...updates } = args as any
        
        const { data, error } = await supabase
          .from('phases')
          .update(updates)
          .eq('id', phase_id)
          .select()
          .single()
        
        if (error) throw error
        
        await logActivity('phase_update', `Updated phase ${phase_id}`, 'phase', phase_id.toString())
        
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, phase: data }) }] }
      }

      case 'get_phases': {
        const { data: phases, error: phasesError } = await supabase
          .from('phases')
          .select('*')
          .order('id')
        
        if (phasesError) throw phasesError
        
        const { data: deliverables, error: delError } = await supabase
          .from('deliverables')
          .select('*')
          .order('sort_order')
        
        if (delError) throw delError
        
        // Attach deliverables to phases
        const result = phases?.map(phase => ({
          ...phase,
          deliverables: deliverables?.filter(d => d.phase_id === phase.id) || []
        }))
        
        return { content: [{ type: 'text', text: JSON.stringify(result) }] }
      }

      // ============================================
      // DELIVERABLE HANDLERS
      // ============================================
      case 'create_deliverable': {
        const { phase_id, name, description, status = 'pending' } = args as any
        
        // Get max sort_order for phase
        const { data: existing } = await supabase
          .from('deliverables')
          .select('sort_order')
          .eq('phase_id', phase_id)
          .order('sort_order', { ascending: false })
          .limit(1)
        
        const sort_order = (existing?.[0]?.sort_order || 0) + 1
        
        const { data, error } = await supabase
          .from('deliverables')
          .insert({ phase_id, name, description, status, sort_order })
          .select()
          .single()
        
        if (error) throw error
        
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, deliverable: data }) }] }
      }

      case 'update_deliverable': {
        const { phase_id, deliverable_name, status } = args as any
        
        const { data, error } = await supabase
          .from('deliverables')
          .update({ status })
          .eq('phase_id', phase_id)
          .eq('name', deliverable_name)
          .select()
          .single()
        
        if (error) throw error
        
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, deliverable: data }) }] }
      }

      case 'delete_deliverable': {
        const { phase_id, deliverable_name } = args as any
        
        const { error } = await supabase
          .from('deliverables')
          .delete()
          .eq('phase_id', phase_id)
          .eq('name', deliverable_name)
        
        if (error) throw error
        
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, deleted: deliverable_name }) }] }
      }

      // ============================================
      // REPOSITORY HANDLERS
      // ============================================
      case 'create_repository': {
        const { name: repoName, description, url, visibility = 'public', category = 'Core', phase_id = 1, language } = args as any
        
        const { data, error } = await supabase
          .from('repositories')
          .insert({
            name: repoName,
            description,
            url,
            visibility,
            category,
            phase_id,
            language,
          })
          .select()
          .single()
        
        if (error) throw error
        
        await logActivity('commit', `Added repository: ${repoName}`, 'repository', repoName)
        
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, repository: data }) }] }
      }

      case 'update_repository': {
        const { name: repoName, ...updates } = args as any
        
        const { data, error } = await supabase
          .from('repositories')
          .update(updates)
          .eq('name', repoName)
          .select()
          .single()
        
        if (error) throw error
        
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, repository: data }) }] }
      }

      case 'delete_repository': {
        const { name: repoName } = args as any
        
        const { error } = await supabase
          .from('repositories')
          .delete()
          .eq('name', repoName)
        
        if (error) throw error
        
        await logActivity('commit', `Removed repository: ${repoName}`, 'repository', repoName)
        
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, deleted: repoName }) }] }
      }

      case 'get_repositories': {
        const { category, visibility } = args as any
        
        let query = supabase.from('repositories').select('*')
        if (category) query = query.eq('category', category)
        if (visibility) query = query.eq('visibility', visibility)
        
        const { data, error } = await query.order('name')
        if (error) throw error
        
        return { content: [{ type: 'text', text: JSON.stringify(data) }] }
      }

      // ============================================
      // COMPLIANCE HANDLERS
      // ============================================
      case 'create_compliance_item': {
        const { id, category, item, required = true, status = 'pending', notes } = args as any
        
        const { data, error } = await supabase
          .from('compliance_items')
          .insert({ id, category, item, required, status, notes })
          .select()
          .single()
        
        if (error) throw error
        
        await logActivity('compliance_update', `Added compliance item: ${item}`, 'compliance_item', id)
        
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, item: data }) }] }
      }

      case 'update_compliance': {
        const { item_id, status, notes } = args as any
        
        const updateData: any = {}
        if (status) updateData.status = status
        if (notes !== undefined) updateData.notes = notes
        if (status === 'complete') updateData.completed_at = new Date().toISOString()
        
        const { data, error } = await supabase
          .from('compliance_items')
          .update(updateData)
          .eq('id', item_id)
          .select()
          .single()
        
        if (error) throw error
        
        await logActivity('compliance_update', `Updated compliance ${item_id}`, 'compliance_item', item_id)
        
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, item: data }) }] }
      }

      case 'delete_compliance_item': {
        const { item_id } = args as any
        
        const { error } = await supabase
          .from('compliance_items')
          .delete()
          .eq('id', item_id)
        
        if (error) throw error
        
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, deleted: item_id }) }] }
      }

      case 'get_compliance': {
        const { category, status } = args as any

        let itemsQuery = supabase.from('compliance_items').select('*')
        if (category) itemsQuery = itemsQuery.eq('category', category)
        if (status) itemsQuery = itemsQuery.eq('status', status)

        const { data: items, error: itemsError } = await itemsQuery.order('id')
        const { data: tokens, error: tokensError } = await supabase.from('tokens').select('*').order('symbol')

        if (itemsError) throw itemsError
        if (tokensError) throw tokensError

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              checklist: items || [],
              tokens: tokens || [],
              summary: {
                total: items?.length || 0,
                pending: items?.filter((c: any) => c.status === 'pending').length || 0,
                in_progress: items?.filter((c: any) => c.status === 'in_progress').length || 0,
                complete: items?.filter((c: any) => c.status === 'complete').length || 0
              }
            })
          }]
        }
      }

      // ============================================
      // TOKEN HANDLERS
      // ============================================
      case 'create_token': {
        const { symbol, name, type, tradability, kyc_required, description } = args as any

        const { data, error } = await supabase
          .from('tokens')
          .insert({
            symbol,
            name,
            type: type?.toLowerCase(),
            tradability: tradability?.toLowerCase(),
            kyc_required,
            description
          })
          .select()
          .single()

        if (error) throw error

        return { content: [{ type: 'text', text: JSON.stringify({ success: true, token: data }) }] }
      }

      case 'update_token': {
        const { symbol, ...updates } = args as any

        // Normalize type and tradability to lowercase if provided
        if (updates.type) updates.type = updates.type.toLowerCase()
        if (updates.tradability) updates.tradability = updates.tradability.toLowerCase()

        const { data, error } = await supabase
          .from('tokens')
          .update(updates)
          .eq('symbol', symbol)
          .select()
          .single()

        if (error) throw error

        return { content: [{ type: 'text', text: JSON.stringify({ success: true, token: data }) }] }
      }

      // ============================================
      // ACTIVITY & STATS HANDLERS
      // ============================================
      case 'log_activity': {
        const { type, title, description, entity_type, entity_id, author = 'agent', url } = args as any
        
        const { data, error } = await supabase
          .from('activity_log')
          .insert({ type, title, description, entity_type, entity_id, author, url })
          .select()
          .single()
        
        if (error) throw error
        
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, activity: data }) }] }
      }

      case 'get_activity': {
        const { limit = 50, type } = args as any
        
        let query = supabase.from('activity_log').select('*')
        if (type) query = query.eq('type', type)
        
        const { data, error } = await query.order('created_at', { ascending: false }).limit(limit)
        if (error) throw error
        
        return { content: [{ type: 'text', text: JSON.stringify(data) }] }
      }

      case 'get_dashboard_stats': {
        const [phasesRes, tasksRes, complianceRes, reposRes] = await Promise.all([
          supabase.from('phases').select('*').order('id'),
          supabase.from('tasks').select('*'),
          supabase.from('compliance_items').select('*'),
          supabase.from('repositories').select('*')
        ])
        
        const phases = phasesRes.data || []
        const tasks = tasksRes.data || []
        const compliance = complianceRes.data || []
        const repos = reposRes.data || []
        
        const currentPhase = phases.find(p => p.status === 'active') || phases[0]
        const overallProgress = phases.length > 0
          ? Math.round(phases.reduce((acc, p) => acc + (p.progress || 0), 0) / phases.length)
          : 0
        
        const stats = {
          currentPhase: {
            id: currentPhase?.id,
            name: currentPhase?.name,
            progress: currentPhase?.progress,
            status: currentPhase?.status,
          },
          overallProgress,
          phases: {
            total: phases.length,
            active: phases.filter(p => p.status === 'active').length,
            complete: phases.filter(p => p.status === 'complete').length,
          },
          tasks: {
            total: tasks.length,
            backlog: tasks.filter(t => t.status === 'backlog').length,
            in_progress: tasks.filter(t => t.status === 'in_progress').length,
            review: tasks.filter(t => t.status === 'review').length,
            done: tasks.filter(t => t.status === 'done').length,
          },
          compliance: {
            total: compliance.length,
            pending: compliance.filter(c => c.status === 'pending').length,
            in_progress: compliance.filter(c => c.status === 'in_progress').length,
            complete: compliance.filter(c => c.status === 'complete').length,
          },
          repositories: {
            total: repos.length,
            public: repos.filter(r => r.visibility === 'public').length,
            private: repos.filter(r => r.visibility === 'private').length,
          },
        }
        
        return { content: [{ type: 'text', text: JSON.stringify(stats) }] }
      }

      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true
        }
    }
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true
    }
  }
})

// Helper function to log activities
async function logActivity(type: string, title: string, entityType: string, entityId: string) {
  await supabase.from('activity_log').insert({
    type,
    title,
    entity_type: entityType,
    entity_id: entityId,
    author: 'agent'
  })
}

// Start server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('NorChain Dashboard MCP Server running')
}

main().catch(console.error)
