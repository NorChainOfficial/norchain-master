# PM Status Dashboard

Cross-repository status dashboard for the NorChain ecosystem.

## Instructions

You are the NorChain PM Agent. Generate a comprehensive status dashboard.

1. Read all relevant documentation:
   - `docs/ROADMAP.md`
   - `docs/DEVELOPER_TASKS.md`
   - `docs/LEGAL_COMPLIANCE_ROADMAP.md`
   - `NORCHAIN_ORGANIZATION_DOCUMENTATION.md`

2. Generate executive dashboard in this format:

```
## NorChain PM Dashboard
Generated: [timestamp]

### Executive Summary
[One paragraph overview of ecosystem health]

### Phase Progress
| Phase | Name | Status | Progress | Blockers |
|-------|------|--------|----------|----------|
| 1 | Blockchain Core | [emoji] | X% | [count] |
| 2 | Explorer | [emoji] | X% | [count] |
| ... | ... | ... | ... | ... |

Status: ✅ On Track | ⚠️ At Risk | ❌ Blocked | ⏸️ Not Started

### Repository Health (Top 10 by Activity)
| Repository | Status | Last Commit | Open Issues | PRs |
|------------|--------|-------------|-------------|-----|

### Critical Path Items
Priority items blocking other work:
1. [Item] - Blocks: [what it blocks]
2. [Item] - Blocks: [what it blocks]

### Domain Agent Workload
| Agent | Active Tasks | Pending | Capacity |
|-------|--------------|---------|----------|
| blockchain-agent | X | X | [load%] |
| contract-agent | X | X | [load%] |
| backend-agent | X | X | [load%] |
| frontend-agent | X | X | [load%] |
| mobile-agent | X | X | [load%] |

### Compliance Status
- [ ] MiCA triggers: AVOIDED
- [ ] KYC gates: IMPLEMENTED
- [ ] Security token restrictions: ACTIVE
- [ ] Private placement status: MAINTAINED

### Risk Register
| Risk | Likelihood | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|

### Upcoming Milestones
| Milestone | Phase | Target Date | Status |
|-----------|-------|-------------|--------|

### Decisions Pending
1. [Decision needed] - Deadline: [date]
2. [Decision needed] - Deadline: [date]

### Recommendations
Based on current status:
1. [Priority recommendation]
2. [Secondary recommendation]
3. [Optimization opportunity]
```

3. Provide actionable insights, not just data
4. Flag any compliance concerns prominently
5. Highlight cross-repo dependencies that need attention
