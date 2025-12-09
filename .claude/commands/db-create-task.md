# Create Task Command

Create a new task in the PM Dashboard.

## Arguments

- `$ARGUMENTS` - Task details in format: "title" role=X phase=N [priority=high|medium|low]

## Instructions

Parse the arguments to extract:
- **title**: The task title (required)
- **role**: blockchain, contract, backend, frontend, mobile-ios, mobile-android, devops (required)
- **phase**: Phase number 1-10 (required)
- **priority**: high, medium, low (optional, default: medium)

Generate a task ID based on phase (e.g., t1-15 for phase 1).

1. First get existing tasks to determine next ID:

```
get_tasks phase_id=<phase>
```

2. Create the task:

```
create_task id="t<phase>-<next_num>" title="<title>" role="<role>" phase_id=<phase> priority="<priority>"
```

3. Log the activity:

```
log_activity type="task_update" title="Created task: <title>" entity_type="task" entity_id="<task_id>" author="pm-agent"
```

4. Confirm creation to user with task details.

**Example:**
```
/db-create-task "Implement user authentication" role=backend phase=5 priority=high
```

Arguments: $ARGUMENTS
