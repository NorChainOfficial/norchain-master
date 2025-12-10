# SOC2 Status Command

Check current SOC2 compliance status.

## Usage

```
/soc2-status [criteria]
```

## Arguments

- `criteria` (optional) - Specific criteria: `security`, `availability`, `integrity`, `confidentiality`, `privacy`

## What This Does

1. Reviews all SOC2 controls
2. Checks evidence collection status
3. Identifies gaps and deficiencies
4. Shows audit readiness score
5. Lists upcoming evidence deadlines

## Output Format

```markdown
## SOC2 Compliance Status

**Last Updated**: [date]
**Audit Period**: [start] - [end]
**Overall Readiness**: X%

### Trust Service Criteria
| Criteria | Controls | Compliant | Gaps | Status |
|----------|----------|-----------|------|--------|
| Security (CC) | 25 | 22 | 3 | ⚠️ |
| Availability (A) | 8 | 8 | 0 | ✅ |
| Processing Integrity (PI) | 6 | 5 | 1 | ⚠️ |
| Confidentiality (C) | 5 | 5 | 0 | ✅ |
| Privacy (P) | 10 | 8 | 2 | ⚠️ |

### Control Gaps
| Control | Criteria | Gap | Priority | Owner |
|---------|----------|-----|----------|-------|
| CC6.3 | Security | Missing access review | High | DevOps |
| PI1.2 | Integrity | Incomplete logging | Medium | Backend |

### Evidence Status
| Control | Evidence | Last Collected | Next Due |
|---------|----------|----------------|----------|
| CC6.1 | Access reviews | 2024-01-01 | 2024-04-01 |
| A1.2 | Backup logs | 2024-01-15 | 2024-02-15 |

### Action Items
1. [ ] Complete access review (due: [date])
2. [ ] Update backup evidence (due: [date])
```

## Example

```
/soc2-status security
```

## Related Commands

- `/soc2-evidence` - Collect evidence
- `/soc2-gap-analysis` - Analyze gaps
- `/db-compliance` - Dashboard compliance view

## Agent

`norchain-soc2-agent`
