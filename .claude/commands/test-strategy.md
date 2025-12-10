# Test Strategy Command

Design a comprehensive test strategy for a feature.

## Usage

```
/test-strategy <feature>
```

## Arguments

- `feature` - Name or description of the feature to design tests for

## What This Does

1. Analyzes the feature requirements
2. Identifies test categories (unit, integration, E2E)
3. Defines test cases for happy path and edge cases
4. Recommends testing frameworks and tools
5. Sets coverage targets
6. Creates test file structure

## Output Format

```markdown
## Test Strategy: [Feature Name]

### Test Categories
- Unit Tests: [count] tests
- Integration Tests: [count] tests
- E2E Tests: [count] tests

### Test Cases

#### Unit Tests
| Test | Description | Priority |
|------|-------------|----------|
| ... | ... | ... |

#### Integration Tests
| Test | Description | Priority |
|------|-------------|----------|
| ... | ... | ... |

#### E2E Tests
| Test | Description | Priority |
|------|-------------|----------|
| ... | ... | ... |

### Coverage Targets
- Statements: 80%
- Branches: 70%
- Functions: 80%
- Lines: 80%

### Test File Structure
```

## Example

```
/test-strategy wallet-connect
```

## Related Commands

- `/test-coverage` - Analyze current coverage
- `/test-review` - Review test quality
- `/e2e-plan` - Design E2E tests

## Agent

`norchain-testing-agent`
