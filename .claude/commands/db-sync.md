# Dashboard Sync Command

Sync and verify dashboard data integrity.

## Instructions

Perform a full dashboard sync by:

1. **Get current stats:**
```
get_dashboard_stats
```

2. **Verify phase progress matches task completion:**
```
get_phases
get_tasks
```

3. **Check for inconsistencies:**
- Tasks marked done but phase progress not updated
- Active tasks in completed phases
- Missing task assignments

4. **Report findings:**
- Current overall progress
- Any data inconsistencies found
- Recommended corrections

5. **If issues found, offer to fix them:**
- Update phase progress based on completed tasks
- Flag orphaned or misassigned tasks

Present a sync report to the user with status and any recommended actions.
