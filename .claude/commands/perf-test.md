# Perf Test Command

Run a performance test scenario.

## Usage

```
/perf-test <scenario> [target]
```

## Arguments

- `scenario` - Test type: `smoke`, `load`, `stress`, `spike`, `soak`
- `target` (optional) - Specific endpoint or service

## What This Does

1. Configures test scenario
2. Runs k6/Artillery test
3. Collects metrics
4. Analyzes results
5. Generates report

## Test Scenarios

| Scenario | Users | Duration | Purpose |
|----------|-------|----------|---------|
| `smoke` | 10 | 5 min | Basic functionality |
| `load` | 100 | 30 min | Normal load |
| `stress` | 500 | 15 min | Breaking point |
| `spike` | 1000 | 5 min | Sudden traffic |
| `soak` | 100 | 4 hours | Memory leaks |

## Output Format

```markdown
## Performance Test Results: [Scenario]

### Summary
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Requests | 50,000 | - | - |
| Success Rate | 99.8% | >99% | ✅ |
| Avg Response | 45ms | <50ms | ✅ |
| P95 Response | 180ms | <200ms | ✅ |
| P99 Response | 450ms | <500ms | ✅ |
| Throughput | 1,200 RPS | >1000 | ✅ |

### Response Time Distribution
| Percentile | Time |
|------------|------|
| p50 | 35ms |
| p90 | 120ms |
| p95 | 180ms |
| p99 | 450ms |

### Errors
| Error | Count | Percentage |
|-------|-------|------------|
| Timeout | 5 | 0.01% |
| 5xx | 10 | 0.02% |

### Bottlenecks Identified
1. Database connection pool at 80%
2. Memory usage spike at peak

### Recommendations
1. Increase connection pool size
2. Add caching for [endpoint]
```

## Example

```
/perf-test load /api/v1/wallets
/perf-test stress
```

## Related Commands

- `/perf-analyze` - Analyze bottlenecks
- `/perf-budget` - Check budgets

## Agent

`norchain-performance-agent`
