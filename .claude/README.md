# NorChain Claude Code Configuration

This directory contains Claude Code configurations, skills, agents, commands, and hooks for the NorChain blockchain ecosystem.

## Directory Structure

```
.claude/
├── README.md              # This file
├── settings.json          # Global project settings
├── agents/                # Domain-specific agent configurations
│   ├── norchain-blockchain-agent.md
│   ├── norchain-contract-agent.md
│   ├── norchain-backend-agent.md
│   ├── norchain-frontend-agent.md
│   └── norchain-mobile-agent.md
├── commands/              # Custom slash commands
│   ├── norchain-status.md
│   ├── norchain-phase.md
│   ├── norchain-task.md
│   ├── norchain-compliance.md
│   ├── norchain-repo.md
│   ├── norchain-contract.md
│   ├── norchain-init.md
│   └── smartpay.md
├── skills/                # Reusable skill definitions
│   ├── norchain-development.md
│   ├── smartpay-integration.md
│   ├── security-token.md
│   ├── wallet-development.md
│   └── compliance-development.md
├── hooks/                 # Development hooks
│   ├── README.md
│   ├── pre-commit.sh
│   ├── post-task.sh
│   └── compliance-check.sh
└── mcp/                   # MCP server configurations
    ├── README.md
    └── norchain-tools.json
```

## Quick Start

### Using Commands

```bash
# Check project status
/norchain-status

# Get phase details
/norchain-phase 3

# Find tasks by role
/norchain-task backend

# Check compliance
/norchain-compliance

# Get repository info
/norchain-repo smart-contracts

# Smart contract reference
/norchain-contract escrow

# Initialize new repository
/norchain-init backend

# SmartPay reference
/smartpay
```

### Using Agents

Agents are automatically selected based on the task domain:

| Domain | Agent |
|--------|-------|
| Blockchain core (Go) | norchain-blockchain-agent |
| Smart contracts (Solidity) | norchain-contract-agent |
| Backend services (NestJS) | norchain-backend-agent |
| Frontend apps (Next.js) | norchain-frontend-agent |
| Mobile apps (Swift/Kotlin) | norchain-mobile-agent |

### Using Skills

Skills provide domain expertise:

```bash
/skill norchain-development    # General NorChain development
/skill smartpay-integration    # Payment flow implementation
/skill security-token          # PM-EQ/NV-EQ token development
/skill wallet-development      # Wallet implementation
/skill compliance-development  # KYC/AML integration
```

## Key Concepts

### Token Classification

| Token | Type | Tradability | KYC Required |
|-------|------|-------------|--------------|
| **NOR** | Utility | Public | No |
| **PM-EQ** | Security | Private only | Yes |
| **NV-EQ** | Security | Private only | Yes |

### Development Phases

1. Blockchain Core
2. Explorer
3. Smart Contracts
4. Wallets
5. SmartPay
6. RWA Portals
7. Admin Dashboard
8. Coinbase Integration
9. Documentation
10. Compliance

### Critical Rules

1. **NorChain NEVER handles FIAT** - Use on-ramp partners
2. **Security tokens are NOT publicly tradable**
3. **All PM-EQ/NV-EQ transfers require KYC**
4. **Private secondary market only for security tokens**

## Global Usage

These configurations can be used from any NorChain repository by referencing this master configuration:

```bash
# From another repository
claude --config /path/to/Master/.claude/settings.json
```

Or copy the `.claude` directory to other repositories:

```bash
cp -r /path/to/Master/.claude /your/repo/
```

## Documentation References

- `/docs/ROADMAP.md` - Development phases
- `/docs/LEGAL_COMPLIANCE_ROADMAP.md` - Compliance requirements
- `/docs/DEVELOPER_TASKS.md` - Task breakdown by role
- `/docs/REPOSITORY_STRUCTURE.md` - Repository organization

## Support

For NorChain ecosystem development support:
- Review the documentation in `/docs/`
- Use `/norchain-status` to check project state
- Run compliance checks with `/norchain-compliance`
