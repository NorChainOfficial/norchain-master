# NorChain Repository Info

Get information about a specific repository or domain.

## Arguments
- `$ARGUMENTS` - Repository name (e.g., "norchain-node", "wallet-ios") or domain (e.g., "blockchain", "wallets", "smartpay")

## Instructions

1. Read `docs/REPOSITORY_STRUCTURE.md` for directory structure
2. Read `NORCHAIN_ORGANIZATION_DOCUMENTATION.md` for repository details
3. Check `docs/repositories/` for detailed specs if available

## Output Format

```
## Repository: [Name]

### Overview
| Attribute | Value |
|-----------|-------|
| Domain | [blockchain/wallets/etc] |
| Phase | [Development phase] |
| Visibility | 🟢 Public / 🔴 Private |
| Language | [Primary language] |
| Framework | [Framework] |

### Directory Structure
```
[repo-name]/
├── src/
│   └── ...
```

### Key Responsibilities
- [Responsibility 1]
- [Responsibility 2]

### Dependencies
- Depends on: [repos]
- Used by: [repos]

### Related Tasks
[Tasks from DEVELOPER_TASKS.md for this repo]
```

If domain is specified, list all repositories in that domain.
