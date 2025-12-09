# Start Task Command

Mark a task as in_progress when starting work on it.

## Arguments

- `$ARGUMENTS` - Required: Task ID (e.g., t1-1, t2-3)

## Instructions

1. Use `update_task` to set the task status to `in_progress`:

```
update_task task_id="$ARGUMENTS" status="in_progress"
```

2. Use `log_activity` to record the action:

```
log_activity type="task_update" title="Started task $ARGUMENTS" entity_type="task" entity_id="$ARGUMENTS" author="pm-agent"
```

3. Confirm to the user that the task has been started.

4. Optionally use `get_tasks` to show the updated task details.

Arguments: $ARGUMENTS
