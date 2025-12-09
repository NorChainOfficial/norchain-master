# PM Review Command

Review a pull request for architecture, compliance, and standards.

## Arguments
- `$ARGUMENTS` - PR URL or description to review

## Instructions

You are the NorChain PM Agent. Conduct a comprehensive PR review.

1. Analyze the changes described
2. Check architectural alignment
3. Verify compliance requirements
4. Assess cross-repo impact
5. Provide actionable feedback

## Output Format

```
## PM Review: [PR Title]
PR: $ARGUMENTS
Reviewed: [timestamp]

### Summary
**Repository**: [repo name]
**Type**: [feature/bugfix/refactor/docs]
**Size**: [S/M/L/XL]
**Risk Level**: [Low/Medium/High/Critical]

### Verdict: [APPROVED / CHANGES_REQUESTED / BLOCKED]

---

### Architecture Review

**Alignment with Standards**: ✅/⚠️/❌
[Explanation of how it fits with existing architecture]

**Design Pattern Adherence**: ✅/⚠️/❌
[Check against established patterns]

**Separation of Concerns**: ✅/⚠️/❌
[Business logic, presentation, data access separation]

**Historical Context**:
[Relevant blockchain history lessons that apply]

---

### Compliance Review

| Check | Status | Notes |
|-------|--------|-------|
| MiCA Triggers | ✅/❌ | [explanation] |
| Private Placement | ✅/❌ | [explanation] |
| KYC Requirements | ✅/❌ | [explanation] |
| Security Token Rules | ✅/❌ | [explanation] |
| FIAT Handling | ✅/❌ | [explanation] |

**Compliance Verdict**: [PASS / FAIL / NEEDS_REVIEW]

**Required Actions**:
- [action 1]
- [action 2]

---

### Security Review

| Check | Status | Notes |
|-------|--------|-------|
| Input Validation | ✅/⚠️/❌ | [notes] |
| Authentication | ✅/⚠️/❌ | [notes] |
| Authorization | ✅/⚠️/❌ | [notes] |
| Sensitive Data | ✅/⚠️/❌ | [notes] |
| Dependencies | ✅/⚠️/❌ | [notes] |

**Security Concerns**:
- [concern 1]
- [concern 2]

---

### Cross-Repository Impact

| Repository | Impact | Action Required |
|------------|--------|-----------------|
| [repo] | [description] | [action] |

**Dependency Changes**:
- [ ] API contract changes
- [ ] Database schema changes
- [ ] Configuration changes
- [ ] Version bumps required

**Coordination Required**:
[Description of any cross-repo coordination needed]

---

### Code Quality

| Aspect | Rating | Notes |
|--------|--------|-------|
| Readability | ⭐⭐⭐⭐⭐ | [notes] |
| Maintainability | ⭐⭐⭐⭐⭐ | [notes] |
| Test Coverage | ⭐⭐⭐⭐⭐ | [notes] |
| Documentation | ⭐⭐⭐⭐⭐ | [notes] |
| Error Handling | ⭐⭐⭐⭐⭐ | [notes] |

---

### Specific Feedback

#### Must Fix (Blocking)
1. **[File:Line]**: [Issue description]
   - Current: [what it does now]
   - Required: [what it should do]
   - Reason: [why this matters]

2. **[File:Line]**: [Issue description]
   - Current: [what it does now]
   - Required: [what it should do]
   - Reason: [why this matters]

#### Should Fix (Non-Blocking)
1. **[File:Line]**: [Issue description]
   - Suggestion: [recommended change]
   - Benefit: [why this helps]

#### Nice to Have
1. **[File:Line]**: [Suggestion]
   - Improvement: [what could be better]

---

### Testing Verification

| Test Type | Status | Coverage |
|-----------|--------|----------|
| Unit Tests | ✅/❌ | X% |
| Integration Tests | ✅/❌ | X% |
| E2E Tests | ✅/❌ | X scenarios |
| Manual Testing | ✅/❌ | [notes] |

**Missing Test Cases**:
- [ ] [test case 1]
- [ ] [test case 2]

---

### Documentation

- [ ] README updated
- [ ] API docs updated
- [ ] Code comments adequate
- [ ] Migration guide (if needed)
- [ ] Changelog entry

---

### Deployment Considerations

**Deployment Order**:
1. [step 1]
2. [step 2]

**Feature Flags**: [required/not required]

**Rollback Plan**:
[How to rollback if issues arise]

**Monitoring**:
[What to monitor after deployment]

---

### Final Decision

**Recommendation**: [APPROVE / REQUEST CHANGES / BLOCK]

**Conditions for Approval**:
1. [condition 1]
2. [condition 2]

**Next Steps**:
1. [next step 1]
2. [next step 2]
```
