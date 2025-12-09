# Dashboard Management Command

Use this command to interact with the NorChain PM Dashboard.

## Quick Commands

| Command | Description |
|---------|-------------|
| `/db-stats` | Get dashboard statistics summary |
| `/db-tasks [filters]` | List tasks (filter by phase, status, role) |
| `/db-start-task <id>` | Start working on a task |
| `/db-complete-task <id>` | Mark task as done |
| `/db-create-task <details>` | Create a new task |
| `/db-phases` | View all phases with deliverables |
| `/db-update-phase <id> <updates>` | Update phase progress/status |
| `/db-compliance [filter]` | View compliance checklist |
| `/db-repos [filter]` | List tracked repositories |
| `/db-activity [limit]` | View recent activity log |
| `/db-sync` | Sync and verify dashboard data |

## When to Use Dashboard Tools

**ALWAYS update the dashboard when:**
- Starting work on a task → `/db-start-task t1-2` or `update_task`
- Completing a task → `/db-complete-task t1-2` or `update_task`
- Creating new work items → `/db-create-task` or `create_task`
- Finishing a phase milestone → `/db-update-phase` or `update_phase`
- Adding new repositories → `create_repository`
- Completing compliance items → `update_compliance`

## Available MCP Tools (24 total)

### Task Management
```
create_task       - Create new task (id, title, role, phase_id required)
update_task       - Update task (task_id required)
delete_task       - Delete task
bulk_update_tasks - Update multiple tasks
bulk_delete_tasks - Delete multiple tasks  
get_tasks         - Query tasks (optional: phase_id, status, role)
```

### Phase Management
```
update_phase      - Update phase (phase_id required)
get_phases        - Get all phases with deliverables
```

### Deliverable Management
```
create_deliverable - Add deliverable (phase_id, name required)
update_deliverable - Update status (phase_id, deliverable_name, status required)
delete_deliverable - Remove deliverable
```

### Repository Management
```
create_repository  - Add repo (name, url required)
update_repository  - Update repo info
delete_repository  - Remove repo
get_repositories   - Query repos (optional: category, visibility)
```

### Compliance Management
```
create_compliance_item - Add item (id, category, item required)
update_compliance      - Update status (item_id required)
delete_compliance_item - Remove item
get_compliance         - Get checklist and tokens
```

### Token Management
```
create_token - Add token (symbol, name, type required)
update_token - Update token info
```

### Activity & Stats
```
log_activity        - Log event (type, title, entity_type, entity_id required)
get_activity        - Get recent activities
get_dashboard_stats - Get full statistics summary
```

## Example Workflows

### When starting a new task:
```
1. get_tasks (to see what's available)
2. update_task task_id="t1-2" status="in_progress"
3. log_activity type="task_update" title="Started task t1-2" entity_type="task" entity_id="t1-2"
```

### When completing work:
```
1. update_task task_id="t1-2" status="done"
2. update_phase phase_id=1 progress=20
3. log_activity type="task_update" title="Completed task t1-2" entity_type="task" entity_id="t1-2"
```

### When adding new work:
```
1. create_task id="t1-15" title="Implement feature X" role="backend" phase_id=1 priority="high"
2. log_activity type="task_update" title="Created task t1-15" entity_type="task" entity_id="t1-15"
```

## Roles
- `blockchain` - Blockchain/node development
- `contract` - Smart contract development  
- `backend` - Backend services
- `frontend` - Web frontend
- `mobile-ios` - iOS development
- `mobile-android` - Android development
- `devops` - Infrastructure/DevOps

## Statuses
- Tasks: `backlog`, `in_progress`, `review`, `done`
- Phases: `pending`, `active`, `complete`
- Compliance: `pending`, `in_progress`, `complete`
- Deliverables: `pending`, `in_progress`, `complete`

