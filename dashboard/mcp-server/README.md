# NorChain Dashboard MCP Server

A Model Context Protocol (MCP) server that enables Claude agents to interact with the NorChain PM Dashboard via Supabase.

## Features

This MCP server provides **full CRUD operations** for all dashboard entities:

### Task Management
| Tool | Description |
|------|-------------|
| `create_task` | Create a new task with role, phase, priority, complexity |
| `update_task` | Update task title, status, priority, assignee, etc. |
| `delete_task` | Delete a task by ID |
| `bulk_update_tasks` | Update multiple tasks at once (e.g., status change) |
| `bulk_delete_tasks` | Delete multiple tasks at once |
| `get_tasks` | Query tasks with filters (phase, status, role) |

### Phase Management
| Tool | Description |
|------|-------------|
| `update_phase` | Update phase name, focus, duration, progress, status |
| `get_phases` | Get all phases with their deliverables |

### Deliverable Management
| Tool | Description |
|------|-------------|
| `create_deliverable` | Add a deliverable to a phase |
| `update_deliverable` | Update deliverable status |
| `delete_deliverable` | Remove a deliverable |

### Repository Management
| Tool | Description |
|------|-------------|
| `create_repository` | Add a new repository to the dashboard |
| `update_repository` | Update repo info (stars, forks, health, etc.) |
| `delete_repository` | Remove a repository from tracking |
| `get_repositories` | Query repositories with filters |

### Compliance Management
| Tool | Description |
|------|-------------|
| `create_compliance_item` | Add a new compliance checklist item |
| `update_compliance` | Update compliance item status/notes |
| `delete_compliance_item` | Remove a compliance item |
| `get_compliance` | Get checklist items and tokens |

### Token Management
| Tool | Description |
|------|-------------|
| `create_token` | Add a new token to compliance tracking |
| `update_token` | Update token information |

### Activity & Stats
| Tool | Description |
|------|-------------|
| `log_activity` | Log an activity event (commit, issue, PR, etc.) |
| `get_activity` | Get recent activity log entries |
| `get_dashboard_stats` | Get comprehensive dashboard statistics |

## Installation

```bash
cd dashboard/mcp-server
npm install
```

## Configuration

Create a `.env` file in the `mcp-server` directory:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Usage

### Start the server

```bash
npm start
```

### Build for production

```bash
npm run build
node dist/index.js
```

## Example Tool Calls

### Create a Task
```json
{
  "tool": "create_task",
  "arguments": {
    "id": "t1-15",
    "title": "Implement WebSocket server for real-time updates",
    "role": "backend",
    "phase_id": 2,
    "priority": "high",
    "complexity": "medium"
  }
}
```

### Bulk Update Tasks
```json
{
  "tool": "bulk_update_tasks",
  "arguments": {
    "task_ids": ["t1-1", "t1-2", "t1-3"],
    "status": "done"
  }
}
```

### Create a Repository
```json
{
  "tool": "create_repository",
  "arguments": {
    "name": "norchain-docs",
    "description": "Official NorChain documentation",
    "url": "https://github.com/NorChainOfficial/norchain-docs",
    "visibility": "public",
    "category": "Tools",
    "language": "MDX"
  }
}
```

### Add Compliance Item
```json
{
  "tool": "create_compliance_item",
  "arguments": {
    "id": "c20",
    "category": "Security",
    "item": "Complete penetration testing",
    "required": true
  }
}
```

### Get Dashboard Stats
```json
{
  "tool": "get_dashboard_stats",
  "arguments": {}
}
```

Returns:
```json
{
  "currentPhase": { "id": 1, "name": "Foundation", "progress": 15, "status": "active" },
  "overallProgress": 8,
  "tasks": { "total": 43, "backlog": 38, "in_progress": 3, "review": 1, "done": 1 },
  "compliance": { "total": 13, "pending": 10, "in_progress": 2, "complete": 1 },
  "repositories": { "total": 14, "public": 12, "private": 2 }
}
```

## Integration with Claude

Add this MCP server to your Claude configuration (`.claude/mcp/dashboard-server.json`):

```json
{
  "name": "norchain-dashboard",
  "description": "NorChain PM Dashboard management tools",
  "command": "node",
  "args": ["dashboard/mcp-server/dist/index.js"],
  "env": {
    "SUPABASE_URL": "${SUPABASE_URL}",
    "SUPABASE_SERVICE_ROLE_KEY": "${SUPABASE_SERVICE_ROLE_KEY}"
  }
}
```

## All Available Tools (24 Total)

1. **Tasks (6):** create_task, update_task, delete_task, bulk_update_tasks, bulk_delete_tasks, get_tasks
2. **Phases (2):** update_phase, get_phases
3. **Deliverables (3):** create_deliverable, update_deliverable, delete_deliverable
4. **Repositories (4):** create_repository, update_repository, delete_repository, get_repositories
5. **Compliance (4):** create_compliance_item, update_compliance, delete_compliance_item, get_compliance
6. **Tokens (2):** create_token, update_token
7. **Activity (3):** log_activity, get_activity, get_dashboard_stats
