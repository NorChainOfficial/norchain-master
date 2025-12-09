# Complete Task Command

Mark a task as done when work is completed.

## Arguments

- `$ARGUMENTS` - Required: Task ID (e.g., t1-1, t2-3)

## Instructions

1. Use `update_task` to set the task status to `done`:

```
update_task task_id="$ARGUMENTS" status="done"
```

2. Use `log_activity` to record the completion:

```
log_activity type="task_update" title="Completed task $ARGUMENTS" entity_type="task" entity_id="$ARGUMENTS" author="pm-agent"
```

3. Check if this affects phase progress. Get the task's phase and calculate new progress:

```
get_tasks phase_id=<phase_id>
```

4. If appropriate, update the phase progress:

```
update_phase phase_id=<phase_id> progress=<new_percentage>
```

5. Confirm completion to the user and show updated stats.

Arguments: $ARGUMENTS
