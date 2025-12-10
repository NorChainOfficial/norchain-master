# E2E Debug Command

Debug a flaky or failing E2E test.

## Usage

```
/e2e-debug <test>
```

## Arguments

- `test` - Test name or file path to debug

## What This Does

1. Analyzes test code for issues
2. Checks for common flaky patterns
3. Reviews timing and waits
4. Identifies race conditions
5. Suggests fixes
6. Provides debugging steps

## Output Format

```markdown
## E2E Debug: [Test Name]

### Test Analysis
- File: [path]
- Framework: [Playwright/Cypress]
- Last 10 runs: X passed, Y failed

### Issues Found
| Issue | Location | Severity | Fix |
|-------|----------|----------|-----|
| ... | ... | ... | ... |

### Common Causes
- [ ] Missing waits
- [ ] Race conditions
- [ ] Selector instability
- [ ] Network timing
- [ ] Test data issues
- [ ] State pollution

### Recommended Fixes
1. [Specific fix with code]
2. [Specific fix with code]

### Debugging Steps
1. Run with `--headed` to watch
2. Add `await page.pause()` at [line]
3. Check network with `--trace`
```

## Common Flaky Patterns

| Pattern | Issue | Fix |
|---------|-------|-----|
| No wait | Element not ready | Add `waitForSelector` |
| Fixed sleep | Unreliable timing | Use proper waits |
| Shared state | Previous test affects | Reset in beforeEach |
| CSS selector | Changes with styling | Use data-testid |
| Network race | Response timing | Mock or wait for response |

## Example

```
/e2e-debug tests/wallet-creation.spec.ts
```

## Related Commands

- `/e2e-plan` - Design E2E tests
- `/e2e-review` - Review coverage

## Agent

`norchain-e2e-agent`
