# Test Review Command

Review test quality and provide improvement suggestions.

## Usage

```
/test-review <file>
```

## Arguments

- `file` - Test file or directory to review

## What This Does

1. Analyzes test structure and naming
2. Checks for anti-patterns
3. Reviews assertion quality
4. Identifies missing test cases
5. Suggests improvements

## Output Format

```markdown
## Test Review: [File]

### Quality Score: X/10

### Issues Found
| Issue | Severity | Location | Fix |
|-------|----------|----------|-----|
| ... | ... | ... | ... |

### Anti-Patterns Detected
- [ ] Test interdependence
- [ ] Shared mutable state
- [ ] Implementation testing
- [ ] Missing assertions
- [ ] Flaky test indicators

### Recommendations
1. [Improvement suggestion]
2. [Improvement suggestion]

### Good Practices Found
- [Positive observation]
```

## Common Anti-Patterns

| Anti-Pattern | Issue | Fix |
|--------------|-------|-----|
| Shared state | Tests affect each other | Use beforeEach reset |
| No assertions | Test always passes | Add meaningful assertions |
| Implementation details | Breaks on refactor | Test behavior only |
| Magic numbers | Hard to understand | Use named constants |
| Missing edge cases | Low coverage | Add boundary tests |

## Example

```
/test-review src/services/__tests__/transfer.test.ts
```

## Related Commands

- `/test-strategy` - Design test strategy
- `/test-coverage` - Analyze coverage

## Agent

`norchain-testing-agent`
