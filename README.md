# NorChain Master Repository

**AI-Powered Product Manager Hub** for the NorChain blockchain ecosystem.

## Overview

This repository serves as the central orchestration hub for 50+ NorChain repositories. The PM Agent has 30+ years of blockchain/web3 expertise encoded and controls all development across the ecosystem.

### Key Features

- **Master PM Agent**: 30+ years blockchain expertise, strategic planning, risk assessment
- **5 Domain Agents**: Blockchain, Contracts, Backend, Frontend, Mobile specialists
- **7 PM Commands**: Planning, prioritization, sprint management, delegation
- **5 GitHub Actions**: Cross-repo automation for issues, standards, milestones
- **Hybrid Automation**: Low-risk automated, high-risk requires approval

## Token Classification

| Token | Type | Tradability | KYC | Compliance |
|-------|------|-------------|-----|------------|
| **NOR** | Utility | Public | Optional | Standard |
| **PM-EQ** | Security | Private Only | Required | Full Review |
| **NV-EQ** | Security | Private Only | Required | Full Review |

## Strategy

**"Private First — Regulated Later"**

Security tokens operate as private placements with full KYC/AML compliance. NorChain never handles FIAT—all currency conversion happens through regulated on-ramp partners.

## PM Agent Architecture

```
┌─────────────────────────────────────────────────────┐
│            NORCHAIN-PM-AGENT (Master)               │
│         30+ Years Blockchain Expertise              │
│   Strategic Control • Orchestration • Compliance    │
└───────────────────────┬─────────────────────────────┘
                        │
     ┌──────────────────┼──────────────────┐
     │                  │                  │
     ▼                  ▼                  ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Blockchain  │  │  Contract   │  │   Backend   │
│   Agent     │  │    Agent    │  │    Agent    │
│ (Go, PoSA)  │  │ (Solidity)  │  │  (NestJS)   │
└─────────────┘  └─────────────┘  └─────────────┘
     │                  │                  │
     ▼                  ▼                  ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Frontend   │  │   Mobile    │  │   50+ Repos │
│   Agent     │  │    Agent    │  │  Controlled │
│ (Next.js)   │  │(Swift/Kotlin)│  │             │
└─────────────┘  └─────────────┘  └─────────────┘
```

## PM Commands

| Command | Purpose |
|---------|---------|
| `/pm-plan <feature>` | Generate implementation plan with tasks, dependencies, risks |
| `/pm-review <pr>` | Review PR for architecture, compliance, standards |
| `/pm-prioritize` | Prioritize backlog using RICE scoring |
| `/pm-sprint` | Plan next sprint based on dependencies |
| `/pm-status` | Cross-repository status dashboard |
| `/pm-risk` | Risk assessment for current phase |
| `/pm-delegate <task>` | Assign task to appropriate domain agent |

## Domain Commands

| Command | Purpose |
|---------|---------|
| `/norchain-status` | Ecosystem status overview |
| `/norchain-phase <n>` | Phase-specific context |
| `/norchain-task <id>` | Task details and context |
| `/norchain-compliance` | Compliance check |
| `/norchain-repo <name>` | Repository information |
| `/norchain-contract <name>` | Smart contract details |
| `/norchain-init <type>` | Initialize new repository |
| `/smartpay <action>` | SmartPay integration helpers |

## Development Roadmap

| Phase | Focus | Key Repos | Status |
|-------|-------|-----------|--------|
| 1 | Blockchain Core | norchain-node, norchain-genesis | Planned |
| 2 | Explorer | norchain-explorer | Planned |
| 3 | Smart Contracts | norchain-contracts | Planned |
| 4 | Wallets | norchain-wallet-* | Planned |
| 5 | SmartPay | norchain-services, norchain-payments | Planned |
| 6 | RWA Portals | norchain-portal | Planned |
| 7 | Admin Dashboard | norchain-admin | Planned |
| 8 | Coinbase | norchain-exchange | Planned |
| 9 | Documentation | norchain-docs | Planned |
| 10 | Compliance | norchain-compliance | Planned |

## GitHub Actions Automation

| Workflow | Purpose | Trigger |
|----------|---------|---------|
| `sync-specs.yml` | Sync docs/templates to child repos | Push to docs/ |
| `orchestrate-issues.yml` | Auto-classify and label issues | Issue created |
| `enforce-standards.yml` | PR compliance and code checks | PR opened |
| `track-milestones.yml` | Daily metrics and status updates | Daily cron |
| `init-repo.yml` | Initialize new repositories | Manual dispatch |

## Repository Structure

```
norchain-master/
├── .claude/
│   ├── agents/
│   │   ├── norchain-pm-agent.md        # Master PM Agent
│   │   ├── norchain-blockchain-agent.md
│   │   ├── norchain-contract-agent.md
│   │   ├── norchain-backend-agent.md
│   │   ├── norchain-frontend-agent.md
│   │   └── norchain-mobile-agent.md
│   ├── commands/
│   │   ├── pm-plan.md
│   │   ├── pm-review.md
│   │   ├── pm-prioritize.md
│   │   ├── pm-sprint.md
│   │   ├── pm-status.md
│   │   ├── pm-risk.md
│   │   └── pm-delegate.md
│   ├── skills/
│   │   └── product-management.md
│   ├── mcp/
│   │   └── pm-tools.json
│   └── settings.json
├── .github/
│   └── workflows/
│       ├── sync-specs.yml
│       ├── orchestrate-issues.yml
│       ├── enforce-standards.yml
│       ├── track-milestones.yml
│       └── init-repo.yml
├── templates/
│   ├── github/
│   │   ├── ISSUE_TEMPLATE/
│   │   ├── PULL_REQUEST_TEMPLATE.md
│   │   └── workflows/ci-base.yml
│   └── docs/
├── docs/
│   ├── ROADMAP.md
│   ├── LEGAL_COMPLIANCE_ROADMAP.md
│   ├── DEVELOPER_TASKS.md
│   └── REPOSITORY_STRUCTURE.md
├── CLAUDE.md
└── README.md
```

## Automation Levels

### Automated (No Approval)
- Create GitHub issues
- Apply labels and milestones
- Update issue status
- Dependency analysis
- Compliance checks
- Sync specs to repos
- Auto-label PRs

### Requires Human Approval
- Create/merge Pull Requests
- Release deployments
- Cross-repo breaking changes
- Security token modifications
- Production deployments

## Tech Stack

| Layer | Technology |
|-------|------------|
| Blockchain | Go 1.21+, PoSA consensus |
| Smart Contracts | Solidity 0.8.x, Hardhat |
| Backend | NestJS, TypeScript, PostgreSQL |
| Frontend | Next.js 14, React 18, Tailwind |
| iOS | Swift 5.9+, SwiftUI |
| Android | Kotlin 1.9+, Jetpack Compose |

## Network Configuration

| Network | Chain ID | RPC URL |
|---------|----------|---------|
| Mainnet | 8453 | https://rpc.norchain.org |
| Testnet | 84531 | https://testnet-rpc.norchain.org |
| Devnet | 31337 | http://localhost:8545 |

## Getting Started

### Using Claude Code

```bash
# Clone the repository
git clone https://github.com/NorChainOfficial/norchain-master.git
cd norchain-master

# Start Claude Code
claude

# Get ecosystem status
/pm-status

# Plan a new feature
/pm-plan "Add multi-signature wallet support"

# Prioritize backlog
/pm-prioritize

# Plan next sprint
/pm-sprint
```

### Initialize New Repository

Use the `init-repo` workflow to create properly configured repositories:

1. Go to Actions > "Initialize Repository"
2. Fill in repository details
3. Run workflow
4. New repo is created with templates, labels, and initial issues

## Documentation

| Document | Description |
|----------|-------------|
| [ROADMAP.md](docs/ROADMAP.md) | 10-phase development plan |
| [LEGAL_COMPLIANCE_ROADMAP.md](docs/LEGAL_COMPLIANCE_ROADMAP.md) | MiCA-safe strategy |
| [DEVELOPER_TASKS.md](docs/DEVELOPER_TASKS.md) | 100+ tasks by role |
| [REPOSITORY_STRUCTURE.md](docs/REPOSITORY_STRUCTURE.md) | 50+ repo layouts |

## Critical Compliance Rules

1. **Never** enable public trading for security tokens (PM-EQ, NV-EQ)
2. **Never** integrate DEX/CEX for security tokens
3. **Never** bypass KYC verification for security tokens
4. **Never** handle FIAT directly
5. **Always** maintain private placement status
6. **Always** include pause mechanisms for security tokens
7. **Always** require whitelist verification for transfers

## Related Repositories

| Category | Repositories |
|----------|--------------|
| **Core Blockchain** | norchain-node, norchain-genesis, norchain-contracts |
| **Infrastructure** | norchain-infra, norchain-sdk |
| **Wallets** | norchain-wallet-core, norchain-wallet-ios, norchain-wallet-android, norchain-wallet-web |
| **Services** | norchain-services, norchain-compliance-service, norchain-payments |
| **Frontend** | norchain-explorer, norchain-portal, norchain-admin |

## Contributing

1. Review [DEVELOPER_TASKS.md](docs/DEVELOPER_TASKS.md) for available tasks
2. Check compliance in [LEGAL_COMPLIANCE_ROADMAP.md](docs/LEGAL_COMPLIANCE_ROADMAP.md)
3. Follow [CONTRIBUTING.md](templates/docs/CONTRIBUTING.md) guidelines
4. Use `/pm-plan` to generate implementation plan
5. Submit PR and await PM review

## License

Proprietary - NorChain AS

## Links

- Website: https://norchain.org
- Explorer: https://explorer.norchain.org
- Documentation: https://docs.norchain.org

---

*Powered by NorChain PM Agent - 30+ years blockchain expertise*
