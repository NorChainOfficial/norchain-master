# Product Management Skill

Comprehensive product management skill for blockchain/web3 projects.

## Skill Identity

This skill provides expertise in:
- Agile/Scrum methodologies for blockchain projects
- Security token compliance requirements
- Prioritization frameworks (RICE, ICE, MoSCoW)
- Risk management for Web3 projects
- Stakeholder communication
- Release management processes
- Cross-repository orchestration

## Activation Triggers

Activate this skill when:
- Planning features or epics
- Prioritizing backlog items
- Assessing risks
- Coordinating releases
- Managing cross-repo dependencies
- Reviewing compliance requirements
- Communicating with stakeholders

---

## Agile for Blockchain Projects

### Sprint Structure (2-week sprints)

| Day | Activity |
|-----|----------|
| Day 1 | Sprint Planning (2h) |
| Days 1-9 | Development |
| Day 5 | Mid-Sprint Review (1h) |
| Day 10 | Sprint Review (2h) + Retrospective (1h) |

### Blockchain-Specific Ceremonies

**Security Review**: Required for any smart contract changes
**Compliance Gate**: Before any security token modifications
**Audit Planning**: For critical security changes

### Story Point Scale (Fibonacci)

| Points | Definition | Example |
|--------|------------|---------|
| 1 | Trivial, < 2 hours | Fix typo, update config |
| 2 | Simple, < 4 hours | Add validation, small fix |
| 3 | Standard, 1 day | New API endpoint |
| 5 | Medium, 2-3 days | New feature component |
| 8 | Complex, 1 week | Multi-repo feature |
| 13 | Very complex, 2 weeks | Major integration |
| 21 | Epic-level | Split this further |

---

## Prioritization Frameworks

### RICE Framework (Blockchain-Adapted)

**Reach** (1-10): Users/investors impacted
- 10: All ecosystem users
- 7: All token holders
- 4: Specific segment
- 1: Internal only

**Impact** (1-10): Strategic importance
- 10: Security/compliance critical
- 7: Revenue/ecosystem impact
- 4: UX improvement
- 1: Minor enhancement

**Confidence** (1-10): Certainty level
- 10: Proven, no regulatory risk
- 7: Clear path, low risk
- 4: Some unknowns
- 1: Experimental

**Effort**: Weeks of work (all repos combined)

**Formula**: `(R × I × C) / E = Score`

### ICE Framework (Quick Decisions)

**Impact**: 1-10 business value
**Confidence**: 1-10 certainty
**Ease**: 1-10 inverse of effort

**Formula**: `(I + C + E) / 3 = Score`

### MoSCoW with Compliance Layer

| Priority | Definition | Compliance Override |
|----------|------------|---------------------|
| Must Have | Critical functionality | All compliance = Must Have |
| Should Have | Important features | Security concerns elevate |
| Could Have | Nice to have | Defer if compliance risk |
| Won't Have | Out of scope | Anything triggering MiCA |

---

## Security Token Compliance

### NorChain Token Matrix

| Token | Type | Public Trade | KYC | Compliance Level |
|-------|------|--------------|-----|------------------|
| NOR | Utility | ✅ Yes | Optional | Standard |
| PM-EQ | Security | ❌ No | Required | Full review |
| NV-EQ | Security | ❌ No | Required | Full review |

### Compliance Checklist (Before Any Security Token Feature)

- [ ] Does NOT enable public trading
- [ ] Does NOT integrate DEX/CEX
- [ ] Does NOT bypass KYC verification
- [ ] Does NOT handle FIAT directly
- [ ] Does NOT market as investment publicly
- [ ] DOES maintain private placement status
- [ ] DOES include pause mechanism
- [ ] DOES require whitelist verification

### MiCA Trigger Avoidance

| Trigger | How to Avoid |
|---------|--------------|
| Public offering | Private placement only |
| Exchange listing | No DEX/CEX integration |
| EU retail marketing | No public investment ads |
| FIAT custody | Use on-ramp partners |
| Cross-border | Jurisdiction restrictions |

---

## Risk Management

### Risk Matrix

| Probability | Impact | Score | Action |
|-------------|--------|-------|--------|
| High | High | 9 | Immediate mitigation |
| High | Medium | 6 | Active management |
| High | Low | 3 | Monitor closely |
| Medium | High | 6 | Active management |
| Medium | Medium | 4 | Regular review |
| Medium | Low | 2 | Monitor |
| Low | High | 3 | Contingency plan |
| Low | Medium | 2 | Monitor |
| Low | Low | 1 | Accept |

### Blockchain-Specific Risks

| Risk Category | Examples | Mitigation |
|---------------|----------|------------|
| Smart Contract | Reentrancy, overflow | Audits, testing |
| Regulatory | MiCA triggers | Compliance-first |
| Security | Key compromise | Hardware wallets |
| Market | Token volatility | Stable tokenomics |
| Operational | Node downtime | Redundancy |

### Historical Risk Lessons

| Event | Year | Lesson |
|-------|------|--------|
| Mt. Gox | 2014 | Security non-negotiable |
| DAO Hack | 2016 | Audit everything |
| ICO Crash | 2018 | Sustainable economics |
| UST/Luna | 2022 | Avoid algorithmic stability |
| FTX | 2022 | Proof of reserves |

---

## Release Management

### Release Types

| Type | Scope | Process |
|------|-------|---------|
| Hotfix | Critical bug | Immediate, minimal review |
| Patch | Bug fixes | Standard review |
| Minor | New features | Full review + testing |
| Major | Breaking changes | Extended testing + migration |

### Release Checklist

- [ ] All tests passing
- [ ] Code review completed
- [ ] Security review (if applicable)
- [ ] Compliance review (if security token)
- [ ] Documentation updated
- [ ] Migration scripts tested
- [ ] Rollback plan documented
- [ ] Monitoring configured
- [ ] Stakeholders notified

### Environment Progression

```
Devnet → Testnet → Staging → Mainnet
  1 day    3 days    1 week    Release
```

---

## Stakeholder Communication

### Status Report Template

```
## [Project] Status Report
Date: [date]
Period: [period]

### Executive Summary
[One paragraph overview]

### Key Achievements
1. [Achievement 1]
2. [Achievement 2]

### Metrics
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|

### Risks & Issues
| Item | Impact | Mitigation | Owner |
|------|--------|------------|-------|

### Next Period Focus
1. [Focus 1]
2. [Focus 2]

### Decisions Needed
1. [Decision 1]
```

### Escalation Matrix

| Issue Type | First Contact | Escalation |
|------------|---------------|------------|
| Technical | Domain Agent | PM Agent |
| Strategic | PM Agent | Stakeholders |
| Compliance | PM Agent | Legal |
| Security | PM Agent | Security Team |

---

## Cross-Repository Coordination

### Dependency Types

| Type | Definition | Example |
|------|------------|---------|
| Build | Compile-time dependency | SDK → Wallet |
| Runtime | Execution dependency | Backend → Node |
| Data | Schema dependency | All → Contracts |
| API | Interface contract | Frontend → Backend |

### Coordination Protocol

1. **Identify** all affected repositories
2. **Sequence** changes by dependency order
3. **Coordinate** API/schema changes
4. **Test** integration points
5. **Deploy** in correct order
6. **Verify** end-to-end

### Breaking Change Process

1. RFC document in Master repo
2. All domain agents review
3. Migration plan approved
4. Deprecation notice (2 sprints)
5. Coordinated update
6. Legacy support removal

---

## Metrics & KPIs

### Velocity Metrics

| Metric | Calculation | Target |
|--------|-------------|--------|
| Sprint Velocity | Points completed | Stable ±10% |
| Cycle Time | Start to done | < 5 days |
| Lead Time | Request to done | < 2 weeks |
| Throughput | Items/sprint | Increasing |

### Quality Metrics

| Metric | Calculation | Target |
|--------|-------------|--------|
| Defect Rate | Bugs/feature | < 0.5 |
| Code Coverage | % covered | > 80% |
| Technical Debt | Debt hours | Decreasing |
| Audit Findings | Critical issues | 0 |

### Compliance Metrics

| Metric | Target |
|--------|--------|
| MiCA Triggers | 0 |
| KYC Gate Bypasses | 0 |
| Compliance Review Time | < 2 days |
| Audit Findings Resolution | < 1 sprint |

---

## Context Files

When this skill is active, reference:
- `/docs/ROADMAP.md`
- `/docs/LEGAL_COMPLIANCE_ROADMAP.md`
- `/docs/DEVELOPER_TASKS.md`
- `/docs/REPOSITORY_STRUCTURE.md`
- `/.claude/agents/norchain-pm-agent.md`

## Usage

```
/skill product-management
```

This skill enables comprehensive product management for the NorChain ecosystem.
