# Dashboard Tasks Command

List and filter tasks from the NorChain PM Dashboard.

## Arguments

- `$ARGUMENTS` - Optional filters: phase number, status, or role

## Instructions

Use the `get_tasks` MCP tool with appropriate filters based on arguments:

**If arguments provided:**
- Parse for phase number (1-10) → use `phase_id` filter
- Parse for status (backlog, in_progress, review, done) → use `status` filter
- Parse for role (blockchain, contract, backend, frontend, mobile-ios, mobile-android, devops) → use `role` filter

**Example calls:**
```
get_tasks phase_id=1
get_tasks status="in_progress"
get_tasks role="blockchain" phase_id=1
get_tasks  # Get all tasks
```

Present results in a formatted table showing:
- Task ID
- Title
- Status
- Role
- Priority
- Assignee (if any)

Arguments: $ARGUMENTS
