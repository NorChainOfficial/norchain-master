# PM Risk Command

Assess risks for current phase or specific feature.

## Arguments
- `$ARGUMENTS` - Optional: phase number, feature name, or "current"

## Instructions

You are the NorChain PM Agent. Conduct a comprehensive risk assessment.

1. Read roadmap and current phase status
2. Apply 30+ years blockchain risk experience
3. Identify technical, regulatory, and business risks
4. Provide mitigation strategies
5. Assign ownership

## Output Format

```
## Risk Assessment: [Phase/Feature Name]
Generated: [timestamp]
Scope: $ARGUMENTS

### Executive Summary
**Overall Risk Level**: [Low/Medium/High/Critical]
**Key Concerns**: [top 3 risks]
**Immediate Actions Required**: [count]

---

### Risk Register

#### Critical Risks (Immediate Action Required)

##### RISK-001: [Risk Name]
| Attribute | Value |
|-----------|-------|
| Category | [Technical/Regulatory/Business/Security/Operational] |
| Probability | [1-5] |
| Impact | [1-5] |
| Risk Score | [P×I] |
| Status | [Open/Mitigating/Monitoring/Closed] |

**Description**:
[Detailed description of the risk]

**Historical Precedent**:
[Relevant blockchain history - Mt. Gox, DAO, etc.]

**Root Cause**:
[What could cause this risk to materialize]

**Impact if Realized**:
- Business: [impact]
- Technical: [impact]
- Regulatory: [impact]
- Reputation: [impact]

**Early Warning Signs**:
1. [indicator 1]
2. [indicator 2]

**Mitigation Strategy**:
1. [mitigation step 1]
2. [mitigation step 2]

**Contingency Plan**:
[What to do if risk materializes]

**Owner**: [Agent/Team]
**Due Date**: [date]
**Review Frequency**: [daily/weekly/bi-weekly]

---

#### High Risks

##### RISK-002: [Risk Name]
[Same structure as above]

---

#### Medium Risks

| ID | Risk | Category | P | I | Score | Owner | Status |
|----|------|----------|---|---|-------|-------|--------|
| R-003 | [risk] | [cat] | X | X | XX | [owner] | [status] |
| R-004 | [risk] | [cat] | X | X | XX | [owner] | [status] |

---

#### Low Risks (Monitoring)

| ID | Risk | Category | P | I | Score | Notes |
|----|------|----------|---|---|-------|-------|
| R-005 | [risk] | [cat] | X | X | XX | [notes] |

---

### Risk by Category

#### Technical Risks
| Risk | Score | Mitigation Status |
|------|-------|-------------------|
| [risk] | XX | [status] |

#### Regulatory/Compliance Risks
| Risk | Score | Mitigation Status |
|------|-------|-------------------|
| [risk] | XX | [status] |

#### Security Risks
| Risk | Score | Mitigation Status |
|------|-------|-------------------|
| [risk] | XX | [status] |

#### Business Risks
| Risk | Score | Mitigation Status |
|------|-------|-------------------|
| [risk] | XX | [status] |

#### Operational Risks
| Risk | Score | Mitigation Status |
|------|-------|-------------------|
| [risk] | XX | [status] |

---

### Blockchain-Specific Risk Patterns

Based on 30+ years of blockchain experience:

| Pattern | Historical Example | Current Relevance | Action |
|---------|-------------------|-------------------|--------|
| Exchange Security | Mt. Gox 2014 | [relevance] | [action] |
| Smart Contract Bugs | DAO 2016 | [relevance] | [action] |
| Algorithmic Stability | UST/Luna 2022 | [relevance] | [action] |
| Custody Trust | FTX 2022 | [relevance] | [action] |
| Regulatory Action | Various | [relevance] | [action] |

---

### Compliance Risk Matrix

| Trigger | Current Status | Risk Level | Mitigation |
|---------|----------------|------------|------------|
| Public Token Sale | [status] | [level] | [mitigation] |
| Exchange Listing | [status] | [level] | [mitigation] |
| EU Retail Marketing | [status] | [level] | [mitigation] |
| FIAT Custody | [status] | [level] | [mitigation] |
| Cross-Border | [status] | [level] | [mitigation] |

---

### Dependencies at Risk

| Dependency | Risk | Impact | Contingency |
|------------|------|--------|-------------|
| [dependency] | [risk] | [impact] | [contingency] |

---

### Risk Trend

| Week | Critical | High | Medium | Low | Trend |
|------|----------|------|--------|-----|-------|
| W-2 | X | X | X | X | - |
| W-1 | X | X | X | X | ↑/↓/→ |
| Current | X | X | X | X | ↑/↓/→ |

---

### Recommended Actions

#### Immediate (This Week)
1. [ ] [Action] - Owner: [agent] - Due: [date]
2. [ ] [Action] - Owner: [agent] - Due: [date]

#### Short-term (This Sprint)
1. [ ] [Action] - Owner: [agent] - Due: [date]
2. [ ] [Action] - Owner: [agent] - Due: [date]

#### Long-term (This Phase)
1. [ ] [Action] - Owner: [agent] - Due: [date]
2. [ ] [Action] - Owner: [agent] - Due: [date]

---

### Risk Review Schedule

| Review Type | Frequency | Next Date | Attendees |
|-------------|-----------|-----------|-----------|
| Risk Standup | Daily | [date] | PM Agent |
| Risk Review | Weekly | [date] | All Agents |
| Risk Audit | Monthly | [date] | All + Stakeholders |
```
