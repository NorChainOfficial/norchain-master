# Perf Analyze Command

Analyze performance bottlenecks and recommend optimizations.

## Usage

```
/perf-analyze [target]
```

## Arguments

- `target` (optional) - Specific service, endpoint, or file

## What This Does

1. Profiles application performance
2. Analyzes database queries
3. Reviews caching efficiency
4. Identifies slow code paths
5. Recommends optimizations

## Output Format

```markdown
## Performance Analysis

### Overall Health
| Area | Score | Status |
|------|-------|--------|
| API Response | 8/10 | ✅ |
| Database | 5/10 | ⚠️ |
| Caching | 3/10 | ❌ |
| Memory | 7/10 | ✅ |

### Bottlenecks Found
| Location | Issue | Impact | Fix Effort |
|----------|-------|--------|------------|
| UserService.getAll | N+1 queries | High | Medium |
| /api/transactions | No caching | Medium | Low |
| TokenContract.balanceOf | Blocking call | Medium | High |

### Slow Queries
| Query | Avg Time | Calls/min | Index |
|-------|----------|-----------|-------|
| SELECT * FROM users... | 500ms | 100 | Missing |
| SELECT * FROM tx... | 200ms | 500 | Partial |

### Caching Analysis
| Endpoint | Cache Status | Hit Rate | TTL |
|----------|--------------|----------|-----|
| /users/:id | None | 0% | - |
| /balance/:addr | Redis | 85% | 30s |

### Memory Profile
- Heap usage: 512MB / 1GB
- GC frequency: 2/min
- Potential leaks: [list]

### Optimization Plan
| Priority | Optimization | Impact | Effort |
|----------|--------------|--------|--------|
| 1 | Add index on users.email | High | Low |
| 2 | Cache balance queries | High | Low |
| 3 | Use connection pooling | Medium | Medium |

### Code Changes
```typescript
// BEFORE: N+1 query
const users = await User.findAll();
for (const user of users) {
  user.orders = await Order.findByUser(user.id);
}

// AFTER: Eager loading
const users = await User.findAll({
  include: [{ model: Order }]
});
```
```

## Example

```
/perf-analyze src/services/
```

## Related Commands

- `/perf-test` - Run performance test
- `/perf-budget` - Check budgets

## Agent

`norchain-performance-agent`
