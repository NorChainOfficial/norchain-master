# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is the **NorChain Master Documentation Repository** - a planning and documentation hub for the NorChain blockchain ecosystem. It does NOT contain application code; instead it contains:

- Organization-wide documentation for 14+ repositories
- Development and legal compliance roadmaps
- Repository specifications and architecture plans
- Scripts for creating GitHub repositories

## Strategy

**"Private First — Regulated Later"**

| Token | Type | Tradability |
|-------|------|-------------|
| **NOR** | Utility | Public |
| **PM-EQ** | Security (PureMinerals) | Private only |
| **NV-EQ** | Security (NorVége) | Private only |

## Repository Structure

```
Master/
├── CLAUDE.md                               # This file
├── NORCHAIN_ORGANIZATION_DOCUMENTATION.md  # GitHub repos, architecture diagrams
├── create_repositories.sh                  # GitHub repo creation script
└── docs/
    ├── ROADMAP.md                          # Development roadmap (10 phases)
    ├── LEGAL_COMPLIANCE_ROADMAP.md         # MiCA-safe legal strategy
    ├── DEVELOPER_TASKS.md                  # 100+ tasks by role
    ├── REPOSITORY_STRUCTURE.md             # 50+ repo structure
    └── repositories/
        ├── norchain-node.md                # Core node spec
        └── norchain-genesis.md             # Genesis config spec
```

## Development Roadmap (10 Phases)

| Phase | Focus | Duration |
|-------|-------|----------|
| 1 | Blockchain Core | 0–6 weeks |
| 2 | NorExplorer | 2–4 weeks |
| 3 | Smart Contracts | 3–6 weeks |
| 4 | Wallet Ecosystem | 4–8 weeks |
| 5 | SmartPay/NorPay | 4–6 weeks |
| 6 | RWA Portals | 4–6 weeks |
| 7 | Admin & Backoffice | 3–5 weeks |
| 8 | Coinbase Integration | 2–4 weeks |
| 9 | Landing Sites + Docs | 3–5 weeks |
| 10 | Compliance + MiCA | 4–8 weeks |

**Future**: Ecosystem Apps (NEX, NorChat, DAO), DEX, Bridges, Mobile Validators

## NorChain Ecosystem Overview

| Category | Repositories |
|----------|--------------|
| **Core Blockchain** | `norchain-node`, `norchain-genesis`, `norchain-contracts` |
| **Infrastructure** | `norchain-infra`, `norchain-sdk` |
| **Wallets** | `norchain-wallet-core`, `norchain-wallet-ios`, `norchain-wallet-android`, `norchain-wallet-web` |
| **Services** | `norchain-bridge-hub`, `norchain-compliance-service`, `norchain-payments` |

**Tech Stack**: TypeScript (NestJS/Next.js), Swift, Kotlin, Go, Solidity

## Commands

### Create GitHub Repositories

```bash
# Authenticate with GitHub CLI (requires org admin rights)
gh auth login

# Create all repositories (including optional private ones)
export INCLUDE_OPTIONAL=true
./create_repositories.sh

# Create only core public repositories
export INCLUDE_OPTIONAL=false
./create_repositories.sh
```

## Documentation Index

### Roadmaps
| Document | Description |
|----------|-------------|
| [docs/ROADMAP.md](./docs/ROADMAP.md) | 10-phase development plan |
| [docs/LEGAL_COMPLIANCE_ROADMAP.md](./docs/LEGAL_COMPLIANCE_ROADMAP.md) | MiCA-safe tokenization strategy |

### Implementation
| Document | Description |
|----------|-------------|
| [docs/DEVELOPER_TASKS.md](./docs/DEVELOPER_TASKS.md) | 100+ tasks by role with priority/complexity |
| [docs/REPOSITORY_STRUCTURE.md](./docs/REPOSITORY_STRUCTURE.md) | 50+ repository structure across 10 domains |

### Architecture
| Document | Description |
|----------|-------------|
| [NORCHAIN_ORGANIZATION_DOCUMENTATION.md](./NORCHAIN_ORGANIZATION_DOCUMENTATION.md) | 14 GitHub repos, dependency graphs |
| [docs/repositories/norchain-node.md](./docs/repositories/norchain-node.md) | Core node: Go, PoSA, libp2p, EVM |
| [docs/repositories/norchain-genesis.md](./docs/repositories/norchain-genesis.md) | Genesis: mainnet/testnet/devnet configs |

## Cross-Reference Guide

All documents are synchronized with consistent:
- **Token naming**: NOR (utility), PM-EQ (PureMinerals), NV-EQ (NorVége)
- **Phase numbering**: 1-10 for MVP, 11+ for future
- **Strategy reference**: "Private First — Regulated Later"
- **Related Documents** section at bottom of each file
