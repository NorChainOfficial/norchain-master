# Dashboard Activity Command

View recent activity log entries.

## Arguments

- `$ARGUMENTS` - Optional: limit=N or type=X

## Instructions

Use `get_activity` to retrieve recent activities:

```
get_activity
get_activity limit=10
get_activity type="task_update"
```

Present results showing:
- Timestamp
- Activity type
- Title/Description
- Author
- Related entity

## Activity Types

- `commit` - Git commits
- `issue` - GitHub issues
- `pr` - Pull requests
- `release` - Releases
- `milestone` - Milestone updates
- `task_update` - Task status changes
- `phase_update` - Phase progress changes
- `compliance_update` - Compliance item updates

Arguments: $ARGUMENTS
