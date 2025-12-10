# E2E Plan Command

Design an end-to-end test plan for a user flow.

## Usage

```
/e2e-plan <flow>
```

## Arguments

- `flow` - Name or description of the user flow to test

## What This Does

1. Maps out the complete user journey
2. Identifies pages/screens involved
3. Defines step-by-step test actions
4. Lists assertions for each step
5. Creates Page Object structure
6. Generates test skeleton code

## Output Format

```markdown
## E2E Test Plan: [Flow Name]

### User Journey
1. [Step 1] → [Step 2] → [Step 3] → [Complete]

### Pages/Components
| Page | URL | Key Elements |
|------|-----|--------------|
| ... | ... | ... |

### Test Steps
| Step | Action | Expected Result | Screenshot |
|------|--------|-----------------|------------|
| 1 | ... | ... | Yes/No |

### Page Objects
```typescript
class [PageName]Page {
  // element selectors
  // action methods
}
```

### Test Code
```typescript
test('[flow name]', async ({ page }) => {
  // generated test skeleton
});
```
```

## Critical Flows (NorChain)

| Flow | Priority | Complexity |
|------|----------|------------|
| Wallet Creation | P0 | High |
| Token Transfer | P0 | Medium |
| Login/Auth | P0 | Medium |
| Staking | P1 | High |
| Explorer Search | P1 | Low |

## Example

```
/e2e-plan wallet-creation
```

## Related Commands

- `/e2e-review` - Review E2E coverage
- `/e2e-debug` - Debug flaky test
- `/test-strategy` - Full test strategy

## Agent

`norchain-e2e-agent`
