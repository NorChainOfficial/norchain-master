# E2E Review Command

Review E2E test coverage and identify gaps.

## Usage

```
/e2e-review
```

## What This Does

1. Lists all existing E2E tests
2. Maps tests to user flows
3. Identifies untested flows
4. Checks for flaky tests
5. Reviews test reliability metrics
6. Recommends new E2E tests

## Output Format

```markdown
## E2E Coverage Review

### Test Inventory
| Test | Flow | Last Run | Pass Rate |
|------|------|----------|-----------|
| ... | ... | ... | ... |

### Coverage Matrix
| User Flow | Coverage | Tests |
|-----------|----------|-------|
| Wallet Creation | ✅ 100% | 3 |
| Token Transfer | ⚠️ 60% | 2 |
| Staking | ❌ 0% | 0 |

### Flaky Tests
| Test | Failure Rate | Issue |
|------|--------------|-------|
| ... | ... | ... |

### Gaps Identified
1. [Missing flow coverage]
2. [Partial coverage area]

### Recommendations
1. Add E2E for [flow]
2. Fix flaky test [name]
```

## Reliability Metrics

| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| Pass Rate | >98% | 95-98% | <95% |
| Flaky Rate | <2% | 2-5% | >5% |
| Avg Duration | <30s | 30-60s | >60s |

## Example

```
/e2e-review
```

## Related Commands

- `/e2e-plan` - Design E2E tests
- `/e2e-debug` - Debug flaky test

## Agent

`norchain-e2e-agent`
