# PM Sprint Command

Plan the next sprint based on priorities, dependencies, and capacity.

## Arguments
- `$ARGUMENTS` - Optional: sprint number or "next"

## Instructions

You are the NorChain PM Agent. Plan the upcoming sprint.

1. Review current priorities from backlog
2. Check domain agent capacity
3. Resolve dependency conflicts
4. Balance across domains
5. Generate sprint plan

## Output Format

```
## Sprint Plan: Sprint [X]
Duration: [start date] → [end date] (2 weeks)
Generated: [timestamp]

### Sprint Goal
[One sentence describing the primary objective]

### Capacity Planning

| Domain Agent | Available | Allocated | Buffer |
|--------------|-----------|-----------|--------|
| blockchain-agent | 80h | Xh | X% |
| contract-agent | 80h | Xh | X% |
| backend-agent | 80h | Xh | X% |
| frontend-agent | 80h | Xh | X% |
| mobile-agent | 80h | Xh | X% |
| **Total** | 400h | Xh | X% |

### Sprint Backlog

#### Must Complete (Committed)

| ID | Task | Agent | Effort | Dependencies | Phase |
|----|------|-------|--------|--------------|-------|
| S[X]-01 | [task] | [agent] | Xh | [deps] | [phase] |
| S[X]-02 | [task] | [agent] | Xh | [deps] | [phase] |

**Total Committed**: Xh

#### Should Complete (Stretch)

| ID | Task | Agent | Effort | Dependencies | Phase |
|----|------|-------|--------|--------------|-------|
| S[X]-S1 | [task] | [agent] | Xh | [deps] | [phase] |

**Total Stretch**: Xh

### Execution Schedule

#### Week 1

| Day | blockchain | contract | backend | frontend | mobile |
|-----|------------|----------|---------|----------|--------|
| Mon | [task] | [task] | [task] | [task] | [task] |
| Tue | [task] | [task] | [task] | [task] | [task] |
| Wed | [task] | [task] | [task] | [task] | [task] |
| Thu | [task] | [task] | [task] | [task] | [task] |
| Fri | [task] | [task] | [task] | [task] | [task] |

#### Week 2

[Same structure]

### Cross-Repo Coordination Points

| Date | Event | Repositories | Attendees |
|------|-------|--------------|-----------|
| [date] | [sync point] | [repos] | [agents] |

### Dependencies Resolution

```
[Task A] (blockchain)
    ↓ completes Day 3
[Task B] (contract)
    ↓ completes Day 5
[Task C] (backend) - can start Day 6
```

### Risk Mitigation

| Risk | Probability | Impact | Mitigation | Trigger |
|------|-------------|--------|------------|---------|
| [risk] | [L/M/H] | [L/M/H] | [mitigation] | [when to act] |

### Definition of Done

- [ ] Code complete and reviewed
- [ ] Unit tests passing (>80% coverage)
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] Compliance check passed (if applicable)
- [ ] Deployed to devnet
- [ ] Demo ready

### Sprint Ceremonies

| Ceremony | Date/Time | Duration | Attendees |
|----------|-----------|----------|-----------|
| Sprint Planning | [date] | 2h | All agents |
| Daily Standup | Daily 9am | 15m | All agents |
| Mid-Sprint Review | [date] | 1h | All agents |
| Sprint Review | [date] | 2h | All + stakeholders |
| Retrospective | [date] | 1h | All agents |

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Velocity | X story points | Completed vs planned |
| Quality | <X bugs | Bugs found in review |
| On-time | >90% | Tasks completed on schedule |

### Carryover from Previous Sprint

| Task | Original Sprint | Reason | Status |
|------|-----------------|--------|--------|
| [task] | S[X-1] | [reason] | [status] |

### Notes
[Any additional context or considerations]
```
