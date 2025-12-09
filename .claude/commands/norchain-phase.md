# NorChain Phase Details

Get detailed information about a specific development phase.

## Arguments
- `$ARGUMENTS` - Phase number (1-10) or "current"

## Instructions

1. Read `docs/ROADMAP.md` to find the specified phase
2. Read `docs/DEVELOPER_TASKS.md` for tasks in that phase
3. Read `docs/LEGAL_COMPLIANCE_ROADMAP.md` for compliance requirements

## Output Format

```
## Phase [N]: [Name]

### Duration
[X-Y weeks]

### Goal
[Phase goal]

### Deliverables
| Component | Status | Description |
|-----------|--------|-------------|
[Table of deliverables]

### Tasks by Role
#### [Role Name]
- [ ] Task 1 (Priority: High, Complexity: Medium)
- [ ] Task 2 ...

### Dependencies
- Requires: [Previous phases/components]
- Blocks: [What this enables]

### Compliance Notes
[Relevant legal/regulatory considerations]
```

If argument is "current", find the phase marked as In Progress.
