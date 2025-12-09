# NorChain Master Repository

The central documentation and configuration hub for the NorChain blockchain ecosystem.

## Overview

NorChain is an EVM-compatible blockchain designed for Real World Asset (RWA) tokenization, featuring:

- **PoSA Consensus**: Proof of Staked Authority with ~3 second finality
- **Native Gas Token**: NOR utility token for transaction fees
- **Security Tokens**: PM-EQ (PureMinerals) and NV-EQ (NorVège) for RWA representation
- **SmartPay**: Compliant payment processing for security token purchases

## Token Classification

| Token | Type | Tradability | KYC Required |
|-------|------|-------------|--------------|
| **NOR** | Utility | Public exchanges | No |
| **PM-EQ** | Security | Private P2P only | Yes |
| **NV-EQ** | Security | Private P2P only | Yes |

## Strategy

**"Private First — Regulated Later"**

Security tokens operate as private placements with full KYC/AML compliance. NorChain never handles FIAT—all currency conversion happens through regulated on-ramp partners.

## Development Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| 1 | Blockchain Core | Planned |
| 2 | Explorer | Planned |
| 3 | Smart Contracts | Planned |
| 4 | Wallets | Planned |
| 5 | SmartPay | Planned |
| 6 | RWA Portals | Planned |
| 7 | Admin Dashboard | Planned |
| 8 | Coinbase Integration | Planned |
| 9 | Documentation | Planned |
| 10 | Compliance | Planned |

## Repository Structure

```
norchain-master/
├── docs/
│   ├── ROADMAP.md                 # 10-phase development plan
│   ├── LEGAL_COMPLIANCE_ROADMAP.md # MiCA-safe strategy
│   ├── DEVELOPER_TASKS.md         # 100+ tasks by role
│   ├── REPOSITORY_STRUCTURE.md    # 50+ repo layouts
│   └── repositories/              # Individual repo specs
├── .claude/
│   ├── agents/                    # Domain-specific AI agents
│   ├── commands/                  # Custom slash commands
│   ├── skills/                    # Reusable skill definitions
│   ├── hooks/                     # Development hooks
│   └── mcp/                       # MCP tool configurations
└── CLAUDE.md                      # AI assistant guidance
```

## Documentation

| Document | Description |
|----------|-------------|
| [ROADMAP.md](docs/ROADMAP.md) | Development phases and deliverables |
| [LEGAL_COMPLIANCE_ROADMAP.md](docs/LEGAL_COMPLIANCE_ROADMAP.md) | Regulatory strategy and compliance |
| [DEVELOPER_TASKS.md](docs/DEVELOPER_TASKS.md) | Task breakdown by role and phase |
| [REPOSITORY_STRUCTURE.md](docs/REPOSITORY_STRUCTURE.md) | Complete ecosystem repository layout |

## Claude Code Integration

This repository includes comprehensive Claude Code configurations for AI-assisted development:

### Slash Commands
- `/norchain-status` - Project status overview
- `/norchain-phase <n>` - Phase details
- `/norchain-task <role>` - Tasks by developer role
- `/norchain-compliance` - Compliance check
- `/norchain-repo <name>` - Repository information
- `/norchain-contract <type>` - Smart contract reference
- `/norchain-init <type>` - Initialize new repository
- `/smartpay` - Payment flow reference

### Domain Agents
- **norchain-blockchain-agent** - Go, PoSA, libp2p
- **norchain-contract-agent** - Solidity, Hardhat
- **norchain-backend-agent** - NestJS, PostgreSQL
- **norchain-frontend-agent** - Next.js, React
- **norchain-mobile-agent** - Swift, Kotlin

### MCP Tools (79 tools across 11 servers)
- Blockchain RPC methods
- Validator/consensus operations
- Smart contract development
- Token operations
- KYC/AML compliance
- SmartPay payment processing
- Certificate management
- Block explorer API
- Wallet development
- Admin operations
- Development utilities

## Network Configuration

| Network | Chain ID | RPC URL |
|---------|----------|---------|
| Mainnet | 8453 | https://rpc.norchain.org |
| Testnet | 84531 | https://testnet-rpc.norchain.org |
| Devnet | 31337 | http://localhost:8545 |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Blockchain | Go 1.21+, PoSA consensus |
| Smart Contracts | Solidity 0.8.x, Hardhat |
| Backend | NestJS, TypeScript, PostgreSQL |
| Frontend | Next.js 14, React 18, Tailwind |
| iOS | Swift 5.9+, SwiftUI |
| Android | Kotlin 1.9+, Jetpack Compose |

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/NorChainOfficial/norchain-master.git
   cd norchain-master
   ```

2. **Review the roadmap**
   ```bash
   cat docs/ROADMAP.md
   ```

3. **Check available tasks**
   ```bash
   cat docs/DEVELOPER_TASKS.md
   ```

4. **Use Claude Code commands**
   ```bash
   claude
   /norchain-status
   ```

## Related Repositories

| Repository | Description |
|------------|-------------|
| norchain-node | Blockchain node implementation |
| norchain-genesis | Genesis configuration |
| norchain-contracts | Smart contracts |
| norchain-explorer-api | Explorer backend |
| norchain-explorer-web | Explorer frontend |
| norchain-wallet-ios | iOS wallet |
| norchain-wallet-android | Android wallet |
| norchain-wallet-web | Web wallet |
| norchain-smartpay-api | Payment processing |
| norchain-portal-web | RWA investor portal |

## Contributing

1. Review [DEVELOPER_TASKS.md](docs/DEVELOPER_TASKS.md) for available tasks
2. Check compliance requirements in [LEGAL_COMPLIANCE_ROADMAP.md](docs/LEGAL_COMPLIANCE_ROADMAP.md)
3. Follow repository structure in [REPOSITORY_STRUCTURE.md](docs/REPOSITORY_STRUCTURE.md)

## License

Proprietary - NorChain AS

## Links

- Website: https://norchain.org
- Explorer: https://explorer.norchain.org
- Documentation: https://docs.norchain.org
