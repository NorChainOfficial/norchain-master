# Update Phase Command

Update phase progress or status.

## Arguments

- `$ARGUMENTS` - Phase ID and updates: <phase_id> progress=N or status=X

## Instructions

Parse arguments for:
- **phase_id**: Required (1-10)
- **progress**: Optional (0-100)
- **status**: Optional (pending, active, complete)

Use `update_phase` to apply updates:

```
update_phase phase_id=<id> progress=<value> status="<status>"
```

Log the activity:

```
log_activity type="phase_update" title="Updated phase <id>" entity_type="phase" entity_id="<id>" author="pm-agent"
```

**Examples:**
```
/db-update-phase 1 progress=25
/db-update-phase 1 status=complete
/db-update-phase 2 status=active progress=10
```

Arguments: $ARGUMENTS
