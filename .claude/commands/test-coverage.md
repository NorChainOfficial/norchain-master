# Test Coverage Command

Analyze current test coverage and identify gaps.

## Usage

```
/test-coverage [path]
```

## Arguments

- `path` (optional) - Specific file or directory to analyze

## What This Does

1. Runs test coverage analysis
2. Identifies uncovered code paths
3. Highlights critical areas without tests
4. Recommends tests to add
5. Provides coverage report summary

## Output Format

```markdown
## Coverage Report

### Summary
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Statements | X% | 80% | ✅/❌ |
| Branches | X% | 70% | ✅/❌ |
| Functions | X% | 80% | ✅/❌ |
| Lines | X% | 80% | ✅/❌ |

### Uncovered Areas
| File | Lines | Reason | Priority |
|------|-------|--------|----------|
| ... | ... | ... | ... |

### Recommendations
1. Add tests for [area]
2. Improve coverage in [file]
```

## Coverage Tools by Project Type

| Type | Tool | Command |
|------|------|---------|
| TypeScript | c8/nyc | `npm run test:coverage` |
| Go | go cover | `go test -cover ./...` |
| Solidity | solidity-coverage | `npx hardhat coverage` |

## Example

```
/test-coverage src/services/
```

## Related Commands

- `/test-strategy` - Design test strategy
- `/test-review` - Review test quality

## Agent

`norchain-testing-agent`
