# Dashboard Repositories Command

List repositories tracked in the PM Dashboard.

## Arguments

- `$ARGUMENTS` - Optional filter: category or visibility

## Instructions

Use `get_repositories` with optional filters:

```
get_repositories
get_repositories category="Core"
get_repositories visibility="public"
```

Present results in a table showing:
- Repository name
- Description
- Category (Core, Wallet, Services, Tools, DevOps)
- Visibility (public, private)
- Phase association
- Health status

## Categories

- **Core**: Blockchain node, genesis, contracts
- **Wallet**: Wallet apps (iOS, Android, Web, Core)
- **Services**: Backend services, APIs
- **Tools**: SDKs, CLI tools
- **DevOps**: Infrastructure, deployment

Arguments: $ARGUMENTS
