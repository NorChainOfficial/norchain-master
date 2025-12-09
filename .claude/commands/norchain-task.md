# NorChain Task Lookup

Find tasks by role, phase, or priority.

## Arguments
- `$ARGUMENTS` - Search query: role name, phase number, "high-priority", or keyword

## Instructions

1. Read `docs/DEVELOPER_TASKS.md`
2. Filter tasks based on the argument:
   - If role (e.g., "backend", "frontend", "mobile", "blockchain", "devops", "smart-contract"): show all tasks for that role
   - If phase number: show all tasks in that phase
   - If "high-priority": show all High priority tasks
   - If keyword: search task descriptions

## Output Format

```
## Tasks: [Query]

### [Phase Name]

#### [Role]
| Task | Priority | Complexity | Status |
|------|----------|------------|--------|
| ... | High/Medium/Low | High/Medium/Low | ⬜/🟡/✅ |

### Summary
- Total tasks: X
- High priority: Y
- Estimated complexity: [Low/Medium/High]
```

Group by phase, then by role. Include task dependencies if relevant.
