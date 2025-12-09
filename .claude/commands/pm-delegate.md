# PM Delegate Command

Route a task to the appropriate domain agent.

## Arguments
- `$ARGUMENTS` - Task description to delegate

## Instructions

You are the NorChain PM Agent. Analyze the task and delegate to the appropriate domain agent.

1. Analyze task requirements
2. Identify required expertise and repositories
3. Check dependencies and prerequisites
4. Assign to appropriate agent(s)
5. Define success criteria

## Domain Agent Matrix

| Agent | Domain | Expertise | Repositories |
|-------|--------|-----------|--------------|
| `norchain-blockchain-agent` | Core | Go, PoSA, libp2p, consensus | norchain-node, norchain-genesis |
| `norchain-contract-agent` | Contracts | Solidity, Hardhat, ERC standards | norchain-contracts |
| `norchain-backend-agent` | Services | NestJS, PostgreSQL, Redis, APIs | norchain-services, norchain-payments |
| `norchain-frontend-agent` | Web | Next.js, React, Tailwind | wallets, portals, explorer |
| `norchain-mobile-agent` | Mobile | Swift, Kotlin, biometrics | wallet-ios, wallet-android |

## Output Format

```
## Task Delegation: [Task Summary]
Generated: [timestamp]

### Task Analysis

**Original Request**: $ARGUMENTS

**Task Type**: [Feature/Bugfix/Enhancement/Research/Documentation]
**Complexity**: [Low/Medium/High/Critical]
**Estimated Effort**: [hours/days/weeks]
**Priority**: [P0/P1/P2/P3]

---

### Domain Classification

**Primary Domain**: [domain]
**Secondary Domains**: [domains if cross-cutting]

**Keywords Detected**:
- [keyword] → [domain]
- [keyword] → [domain]

**Repository Mapping**:
| Repository | Relevance | Changes Expected |
|------------|-----------|------------------|
| [repo] | Primary/Secondary | [change type] |

---

### Agent Assignment

#### Primary Assignment

**Agent**: `[agent-name]`
**Confidence**: [High/Medium/Low]

**Rationale**:
[Why this agent is best suited for this task]

**Specific Instructions for Agent**:
```
You are assigned: [task summary]

Context:
- [context point 1]
- [context point 2]

Requirements:
1. [requirement 1]
2. [requirement 2]

Constraints:
- [constraint 1]
- [constraint 2]

Deliverables:
1. [deliverable 1]
2. [deliverable 2]

Success Criteria:
- [ ] [criterion 1]
- [ ] [criterion 2]

Timeline: [expected duration]
Priority: [priority level]

Report back when:
- Blocked on dependencies
- Significant design decisions needed
- Completion (with summary)
```

---

#### Supporting Agents (if applicable)

| Agent | Role | Dependencies | Handoff Point |
|-------|------|--------------|---------------|
| [agent] | [role] | [what they need] | [when to hand off] |

---

### Prerequisites

**Must be completed first**:
1. [ ] [prerequisite 1] - Status: [done/in-progress/pending]
2. [ ] [prerequisite 2] - Status: [done/in-progress/pending]

**Information needed**:
- [information 1]
- [information 2]

---

### Cross-Repository Coordination

**Affected Repositories**:
```
[repo-1] (primary)
    ↓ API contract
[repo-2] (integration)
    ↓ shared types
[repo-3] (consumer)
```

**Sync Points**:
| Point | Repositories | When |
|-------|--------------|------|
| [sync] | [repos] | [timing] |

---

### Compliance Check

| Requirement | Status | Notes |
|-------------|--------|-------|
| Security token impact | ✅/❌/N/A | [notes] |
| KYC requirements | ✅/❌/N/A | [notes] |
| MiCA considerations | ✅/❌/N/A | [notes] |

**Compliance Review Required**: [Yes/No]

---

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [risk] | [L/M/H] | [L/M/H] | [mitigation] |

---

### Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| [metric] | [target] | [measurement] |

---

### Timeline

| Phase | Duration | Agent | Deliverable |
|-------|----------|-------|-------------|
| 1. [phase] | X days | [agent] | [deliverable] |
| 2. [phase] | X days | [agent] | [deliverable] |

**Total Estimated Duration**: [X days/weeks]

---

### Communication Protocol

**Status Updates**: [frequency]
**Escalation Path**: Domain Agent → PM Agent → Human Review
**Completion Report**: Required with summary of changes

---

### Handoff Checklist

To Domain Agent:
- [ ] Context provided
- [ ] Requirements clear
- [ ] Success criteria defined
- [ ] Timeline set
- [ ] Dependencies identified
- [ ] Compliance checked

**Task is ready for delegation**: ✅

---

### Next Steps

1. **PM Agent**: Send delegation to [agent]
2. **[Agent]**: Acknowledge receipt and estimated completion
3. **[Agent]**: Begin work, report blockers immediately
4. **PM Agent**: Monitor progress, coordinate cross-repo
5. **[Agent]**: Complete and report back
6. **PM Agent**: Verify and close task
```
