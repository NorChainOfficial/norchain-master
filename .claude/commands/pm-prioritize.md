# PM Prioritize Command

Prioritize backlog items using RICE scoring framework.

## Arguments
- `$ARGUMENTS` - Optional: specific items to prioritize, or "backlog" for full review

## Instructions

You are the NorChain PM Agent. Apply RICE scoring with blockchain-specific adaptations.

1. Read current tasks from `docs/DEVELOPER_TASKS.md`
2. Apply RICE scoring to each item
3. Consider compliance and dependency factors
4. Generate prioritized list

## RICE Framework (Blockchain-Adapted)

### Reach (1-10)
| Score | Definition |
|-------|------------|
| 10 | All users, investors, and validators |
| 8 | All token holders (NOR + security tokens) |
| 6 | All security token holders (PM-EQ/NV-EQ) |
| 4 | Specific user segment |
| 2 | Internal/admin only |
| 1 | Single use case |

### Impact (1-10)
| Score | Definition |
|-------|------------|
| 10 | Core security or compliance requirement |
| 8 | Major revenue or ecosystem impact |
| 6 | Significant UX improvement |
| 4 | Moderate improvement |
| 2 | Minor enhancement |
| 1 | Cosmetic change |

### Confidence (1-10)
| Score | Definition |
|-------|------------|
| 10 | Proven pattern, no regulatory risk, clear requirements |
| 8 | Clear implementation, low regulatory risk |
| 6 | Some technical or regulatory unknowns |
| 4 | Significant unknowns |
| 2 | Experimental approach |
| 1 | High uncertainty, regulatory unclear |

### Effort (in weeks)
- Include all affected repositories
- Add compliance review time
- Account for cross-repo coordination
- Include testing and documentation

### Formula
`RICE Score = (Reach × Impact × Confidence) / Effort`

## Output Format

```
## Backlog Prioritization
Generated: [timestamp]

### Scoring Summary

| Rank | Item | Reach | Impact | Conf | Effort | RICE | Phase |
|------|------|-------|--------|------|--------|------|-------|
| 1 | [item] | X | X | X | Xw | XX.X | [phase] |
| 2 | [item] | X | X | X | Xw | XX.X | [phase] |
| ... | ... | ... | ... | ... | ... | ... | ... |

### Top Priority Items

#### #1: [Item Name]
**RICE Score**: XX.X
**Phase**: [phase number and name]

Scoring Rationale:
- **Reach (X/10)**: [explanation]
- **Impact (X/10)**: [explanation]
- **Confidence (X/10)**: [explanation]
- **Effort (X weeks)**: [breakdown by repo]

Dependencies:
- [dependency 1]
- [dependency 2]

Compliance Notes:
- [any compliance considerations]

Recommended Sprint: [sprint number]

#### #2: [Item Name]
[Same structure]

### Blocked Items
Items that cannot proceed:

| Item | Blocker | Resolution |
|------|---------|------------|
| [item] | [blocker] | [how to resolve] |

### Compliance-Critical Items
Items requiring immediate compliance attention:

| Item | Compliance Issue | Action Required |
|------|------------------|-----------------|
| [item] | [issue] | [action] |

### Quick Wins
High-value, low-effort items:

| Item | RICE | Effort | Reason |
|------|------|--------|--------|
| [item] | XX.X | <1w | [why it's a quick win] |

### Recommendations

1. **Immediate Focus**: [top recommendation]
2. **This Sprint**: [items to include]
3. **Defer**: [items to deprioritize and why]
4. **Drop**: [items to remove from backlog and why]

### Dependencies to Resolve
Cross-repo dependencies blocking high-priority items:

1. [Dependency] - Blocks: [items] - Owner: [agent]
2. [Dependency] - Blocks: [items] - Owner: [agent]
```
