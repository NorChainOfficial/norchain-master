# NorChain Official Organization Documentation

> **Generated:** December 9, 2025  
> **Organization:** [NorChainOfficial](https://github.com/NorChainOfficial)  
> **Total Repositories:** 14

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Organization Overview](#organization-overview)
3. [Repository Architecture](#repository-architecture)
4. [Core Infrastructure Repositories](#core-infrastructure-repositories)
5. [Wallet Repositories](#wallet-repositories)
6. [Service Repositories](#service-repositories)
7. [Legacy/Established Repositories](#legacyestablished-repositories)
8. [Inter-Repository Dependencies](#inter-repository-dependencies)
9. [Development Roadmap](#development-roadmap)
10. [Appendix: Individual Repository Specifications](#appendix-individual-repository-specifications)

---

## Executive Summary

NorChain is a comprehensive blockchain ecosystem designed as a **Full-Stack Blockchain Operating System**. The organization comprises 14 repositories spanning blockchain infrastructure, multi-platform wallets, compliance services, bridge infrastructure, and payment solutions.

### Key Statistics

| Metric | Value |
|--------|-------|
| Total Repositories | 14 |
| Public Repositories | 10 |
| Private Repositories | 4 |
| Languages Used | TypeScript, Swift, Kotlin, Rust, JavaScript, Shell, CSS, Python |
| Primary Framework | NestJS (Backend), Next.js (Frontend), React Native (Mobile) |

### Repository Distribution

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NORCHAIN ECOSYSTEM ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    BLOCKCHAIN CORE LAYER                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │   │
│  │  │ norchain-node│  │norchain-genesis│ │   norchain-contracts     │  │   │
│  │  │  (consensus) │  │  (network)    │ │  (smart contracts)       │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────┼───────────────────────────────────┐   │
│  │                     INFRASTRUCTURE LAYER                │            │   │
│  │  ┌──────────────────┐                  ┌─────────────────────────┐  │   │
│  │  │  norchain-infra  │◄─────────────────│     norchain-sdk        │  │   │
│  │  │ (Docker/K8s/TF)  │                  │   (monorepo: 8 apps)    │  │   │
│  │  └──────────────────┘                  └─────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────┼───────────────────────────────────┐   │
│  │                       WALLET LAYER                                   │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │                  norchain-wallet-core                         │   │   │
│  │  │           (shared cryptography & key management)              │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │         │                    │                     │                │   │
│  │  ┌──────┴──────┐     ┌───────┴───────┐     ┌───────┴──────┐       │   │
│  │  │wallet-ios   │     │wallet-android │     │ wallet-web   │       │   │
│  │  │  (Swift)    │     │   (Kotlin)    │     │  (React)     │       │   │
│  │  └─────────────┘     └───────────────┘     └──────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────┼───────────────────────────────────┐   │
│  │                      SERVICES LAYER (Private)                       │   │
│  │  ┌──────────────┐  ┌────────────────────┐  ┌──────────────────┐    │   │
│  │  │ bridge-hub   │  │compliance-service  │  │    payments      │    │   │
│  │  │(ETH/BSC/MATIC│  │  (KYC/AML)         │  │   (SmartPay)     │    │   │
│  │  └──────────────┘  └────────────────────┘  └──────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Organization Overview

### Vision

NorChain aims to be the world's first comprehensive blockchain ecosystem — 16+ modular, focused applications unified under:
- **One Chain** - NorChain blockchain
- **One Token** - NOR
- **One API** - Unified API gateway

### Mission

To provide enterprise-ready blockchain infrastructure that competes with world-class analogues (Etherscan, Stripe, QuickBooks, WhatsApp, Binance) while maintaining seamless integration across all services.

---

## Repository Architecture

### Categorization

| Category | Repositories | Purpose |
|----------|--------------|---------|
| **Core Blockchain** | `norchain-node`, `norchain-genesis`, `norchain-contracts` | Fundamental blockchain infrastructure |
| **Infrastructure** | `norchain-infra`, `norchain-sdk` | DevOps and development tooling |
| **Wallets** | `norchain-wallet-core`, `norchain-wallet-ios`, `norchain-wallet-android`, `norchain-wallet-web` | Multi-platform wallet solutions |
| **Services** | `norchain-bridge-hub`, `norchain-compliance-service`, `norchain-payments` | Enterprise services |
| **Legacy** | `norchain`, `mobile-validator` | Established codebases |

### Visibility Matrix

| Repository | Visibility | Rationale |
|------------|------------|-----------|
| norchain-node | 🟢 Public | Open-source node software for network decentralization |
| norchain-genesis | 🟢 Public | Transparent network genesis configuration |
| norchain-contracts | 🟢 Public | Auditable smart contracts for trust |
| norchain-infra | 🟢 Public | Community infrastructure contributions |
| norchain-wallet-* | 🟢 Public | Reference implementations for ecosystem |
| norchain-bridge-hub | 🔴 Private | Proprietary bridge security logic |
| norchain-compliance-service | 🔴 Private | KYC/AML sensitive implementation |
| norchain-payments | 🔴 Private | PSP integrations and financial logic |
| mobile-validator | 🔴 Private | Internal development tooling |

---

## Core Infrastructure Repositories

### 1. norchain-node

| Attribute | Value |
|-----------|-------|
| **URL** | https://github.com/NorChainOfficial/norchain-node |
| **Visibility** | Public |
| **Created** | 2025-12-09 |
| **Default Branch** | main |
| **License** | MIT |

**Description:**  
Core NorChain blockchain node software encompassing consensus mechanisms, peer-to-peer networking, and state management.

**Planned Architecture:**
```
norchain-node/
├── consensus/          # Consensus algorithm implementation
│   ├── pos/           # Proof of Stake logic
│   └── validators/    # Validator management
├── network/           # P2P networking layer
│   ├── discovery/     # Node discovery
│   └── protocols/     # Communication protocols
├── state/             # State management
│   ├── trie/          # Merkle Patricia Trie
│   └── storage/       # Persistent storage
├── rpc/               # JSON-RPC interface
├── cli/               # Command-line interface
├── config/            # Configuration files
└── tests/             # Test suites
```

**Key Responsibilities:**
- Block production and validation
- Transaction processing and mempool management
- State synchronization
- P2P network communication
- JSON-RPC API exposure

---

### 2. norchain-genesis

| Attribute | Value |
|-----------|-------|
| **URL** | https://github.com/NorChainOfficial/norchain-genesis |
| **Visibility** | Public |
| **Created** | 2025-12-09 |
| **Default Branch** | main |
| **License** | MIT |

**Description:**  
Genesis configuration and genesis assets for NorChain network initialization.

**Planned Structure:**
```
norchain-genesis/
├── mainnet/
│   ├── genesis.json        # Mainnet genesis block
│   ├── validators.json     # Initial validator set
│   └── allocations.json    # Token allocations
├── testnet/
│   ├── genesis.json        # Testnet genesis block
│   └── faucet-config.json  # Testnet faucet settings
├── devnet/
│   └── genesis.json        # Local development genesis
├── scripts/
│   ├── generate-genesis.sh # Genesis generation tools
│   └── validate-genesis.sh # Validation scripts
└── docs/
    └── GENESIS_SPEC.md     # Genesis specification
```

**Key Components:**
- Chain ID definitions
- Initial validator configurations
- Token distribution allocations
- Network parameters (block time, gas limits)

---

### 3. norchain-contracts

| Attribute | Value |
|-----------|-------|
| **URL** | https://github.com/NorChainOfficial/norchain-contracts |
| **Visibility** | Public |
| **Created** | 2025-12-09 |
| **Default Branch** | main |
| **License** | MIT |

**Description:**  
Smart contracts repository including NOR token, governance, staking, RWA templates, payment contracts, bridge contracts, with comprehensive tests and audits.

**Planned Structure:**
```
norchain-contracts/
├── contracts/
│   ├── token/
│   │   └── NORToken.sol         # ERC-20 NOR token
│   ├── governance/
│   │   ├── Governor.sol         # DAO governance
│   │   └── Timelock.sol         # Execution delay
│   ├── staking/
│   │   ├── StakingPool.sol      # Staking mechanism
│   │   └── Rewards.sol          # Reward distribution
│   ├── rwa/                     # Real World Assets
│   │   ├── RWAToken.sol         # Tokenization template
│   │   └── Compliance.sol       # Compliance hooks
│   ├── payments/
│   │   ├── Escrow.sol           # Escrow contracts
│   │   └── Subscription.sol     # Recurring payments
│   └── bridge/
│       ├── BridgeGateway.sol    # Bridge entry point
│       └── TokenVault.sol       # Locked token vault
├── test/                        # Test suites
├── scripts/                     # Deployment scripts
├── audits/                      # Security audit reports
└── hardhat.config.ts            # Hardhat configuration
```

---

### 4. norchain-infra

| Attribute | Value |
|-----------|-------|
| **URL** | https://github.com/NorChainOfficial/norchain-infra |
| **Visibility** | Public |
| **Created** | 2025-12-09 |
| **Default Branch** | main |
| **License** | MIT |

**Description:**  
Infrastructure-as-code repository containing Docker configurations, Kubernetes manifests, Terraform modules, monitoring setup, and CI/CD pipelines.

**Planned Structure:**
```
norchain-infra/
├── docker/
│   ├── node/                # Node Docker images
│   ├── api/                 # API Docker images
│   └── compose/             # Docker Compose files
├── kubernetes/
│   ├── base/                # Base K8s manifests
│   ├── overlays/
│   │   ├── production/      # Prod configurations
│   │   ├── staging/         # Staging configs
│   │   └── development/     # Dev configs
│   └── helm/                # Helm charts
├── terraform/
│   ├── modules/
│   │   ├── vpc/             # VPC setup
│   │   ├── eks/             # EKS clusters
│   │   ├── rds/             # Database
│   │   └── redis/           # Cache layer
│   └── environments/
│       ├── prod/            # Production
│       └── staging/         # Staging
├── monitoring/
│   ├── prometheus/          # Metrics
│   ├── grafana/             # Dashboards
│   └── alertmanager/        # Alerting
├── ci/
│   ├── github-actions/      # GH Actions workflows
│   └── scripts/             # CI helper scripts
└── docs/
    └── RUNBOOK.md           # Operations runbook
```

---

## Wallet Repositories

### 5. norchain-wallet-core

| Attribute | Value |
|-----------|-------|
| **URL** | https://github.com/NorChainOfficial/norchain-wallet-core |
| **Visibility** | Public |
| **Created** | 2025-12-09 |
| **Default Branch** | main |
| **License** | MIT |

**Description:**  
Shared wallet core libraries providing cryptography primitives, key management, and common utilities for mobile and web wallets.

**Planned Structure:**
```
norchain-wallet-core/
├── src/
│   ├── crypto/
│   │   ├── hd-wallet.ts        # HD wallet derivation
│   │   ├── secp256k1.ts        # Elliptic curve ops
│   │   └── encryption.ts       # AES encryption
│   ├── keystore/
│   │   ├── keyring.ts          # Key management
│   │   └── secure-storage.ts   # Secure storage interface
│   ├── transaction/
│   │   ├── builder.ts          # TX builder
│   │   └── signer.ts           # TX signing
│   └── network/
│       ├── provider.ts         # RPC provider
│       └── types.ts            # Network types
├── bindings/
│   ├── swift/                  # Swift bindings
│   └── kotlin/                 # Kotlin bindings
└── tests/
```

**Key Features:**
- BIP-32/39/44 HD wallet support
- Multi-signature capabilities
- Hardware wallet integration interfaces
- Cross-platform cryptography

---

### 6. norchain-wallet-ios

| Attribute | Value |
|-----------|-------|
| **URL** | https://github.com/NorChainOfficial/norchain-wallet-ios |
| **Visibility** | Public |
| **Created** | 2025-12-09 |
| **Default Branch** | main |
| **License** | MIT |

**Description:**  
Reference iOS wallet application built with Swift and SwiftUI.

**Planned Structure:**
```
norchain-wallet-ios/
├── NorWallet/
│   ├── App/                    # App entry point
│   ├── Features/
│   │   ├── Onboarding/         # Wallet creation
│   │   ├── Dashboard/          # Main dashboard
│   │   ├── Send/               # Send transactions
│   │   ├── Receive/            # QR code display
│   │   ├── History/            # Transaction history
│   │   └── Settings/           # App settings
│   ├── Core/
│   │   ├── Crypto/             # Crypto operations
│   │   ├── Network/            # API client
│   │   └── Storage/            # Keychain storage
│   └── Resources/              # Assets
├── NorWalletTests/             # Unit tests
├── NorWalletUITests/           # UI tests
└── NorWallet.xcodeproj
```

**Tech Stack:**
- Swift 5.9+
- SwiftUI
- Combine framework
- Keychain Services
- LocalAuthentication (Face ID/Touch ID)

---

### 7. norchain-wallet-android

| Attribute | Value |
|-----------|-------|
| **URL** | https://github.com/NorChainOfficial/norchain-wallet-android |
| **Visibility** | Public |
| **Created** | 2025-12-09 |
| **Default Branch** | main |
| **License** | MIT |

**Description:**  
Reference Android wallet application built with Kotlin and Jetpack Compose.

**Planned Structure:**
```
norchain-wallet-android/
├── app/
│   ├── src/main/
│   │   ├── java/com/norchain/wallet/
│   │   │   ├── ui/
│   │   │   │   ├── onboarding/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── send/
│   │   │   │   ├── receive/
│   │   │   │   └── settings/
│   │   │   ├── data/
│   │   │   │   ├── repository/
│   │   │   │   └── network/
│   │   │   └── crypto/
│   │   └── res/
│   └── build.gradle.kts
├── core/                       # Core module
├── buildSrc/                   # Build configuration
└── gradle/
```

**Tech Stack:**
- Kotlin 1.9+
- Jetpack Compose
- Kotlin Coroutines & Flow
- Android Keystore System
- BiometricPrompt API

---

### 8. norchain-wallet-web

| Attribute | Value |
|-----------|-------|
| **URL** | https://github.com/NorChainOfficial/norchain-wallet-web |
| **Visibility** | Public |
| **Created** | 2025-12-09 |
| **Default Branch** | main |
| **License** | MIT |

**Description:**  
Browser/web wallet application supporting both extension and hosted modes.

**Planned Structure:**
```
norchain-wallet-web/
├── src/
│   ├── app/                    # Next.js app router
│   ├── components/
│   │   ├── ui/                 # UI components
│   │   └── wallet/             # Wallet components
│   ├── features/
│   │   ├── onboarding/
│   │   ├── dashboard/
│   │   ├── send/
│   │   └── dapp-connector/     # dApp integration
│   ├── lib/
│   │   ├── crypto/             # Crypto utilities
│   │   └── storage/            # IndexedDB storage
│   └── hooks/                  # React hooks
├── extension/                  # Browser extension
│   ├── manifest.json
│   ├── background.ts
│   ├── content.ts
│   └── popup/
└── package.json
```

**Tech Stack:**
- Next.js 14
- React 18
- TypeScript
- Web Crypto API
- IndexedDB
- WebExtension APIs

---

## Service Repositories

### 9. norchain-bridge-hub

| Attribute | Value |
|-----------|-------|
| **URL** | https://github.com/NorChainOfficial/norchain-bridge-hub |
| **Visibility** | 🔴 Private |
| **Created** | 2025-12-09 |
| **Default Branch** | main |
| **License** | MIT |

**Description:**  
Bridge orchestrator service managing cross-chain transfers between NorChain and ETH/BSC/Polygon networks.

**Planned Architecture:**
```
norchain-bridge-hub/
├── src/
│   ├── orchestrator/           # Bridge orchestration
│   │   ├── bridge-manager.ts
│   │   └── fee-calculator.ts
│   ├── relayers/
│   │   ├── ethereum/           # ETH relayer
│   │   ├── bsc/                # BSC relayer
│   │   └── polygon/            # Polygon relayer
│   ├── monitoring/
│   │   ├── health-check.ts
│   │   └── alerts.ts
│   ├── security/
│   │   ├── multi-sig.ts
│   │   └── rate-limiter.ts
│   └── api/                    # REST/GraphQL API
├── config/
│   ├── chains.json             # Chain configurations
│   └── tokens.json             # Supported tokens
└── tests/
```

**Supported Networks:**
- Ethereum Mainnet
- BNB Smart Chain (BSC)
- Polygon PoS
- Arbitrum (planned)
- Optimism (planned)

---

### 10. norchain-compliance-service

| Attribute | Value |
|-----------|-------|
| **URL** | https://github.com/NorChainOfficial/norchain-compliance-service |
| **Visibility** | 🔴 Private |
| **Created** | 2025-12-09 |
| **Default Branch** | main |
| **License** | MIT |

**Description:**  
Compliance service handling KYC/AML integration, risk scoring, and sanctions screening.

**Planned Architecture:**
```
norchain-compliance-service/
├── src/
│   ├── kyc/
│   │   ├── providers/
│   │   │   ├── sumsub.ts       # Sumsub integration
│   │   │   ├── onfido.ts       # Onfido integration
│   │   │   └── jumio.ts        # Jumio integration
│   │   └── verification.ts
│   ├── aml/
│   │   ├── screening.ts        # Transaction screening
│   │   └── monitoring.ts       # Continuous monitoring
│   ├── sanctions/
│   │   ├── ofac.ts             # OFAC list
│   │   └── eu-sanctions.ts     # EU sanctions
│   ├── risk/
│   │   ├── scoring.ts          # Risk scoring engine
│   │   └── rules.ts            # Rule definitions
│   └── api/
├── config/
│   └── jurisdictions.json      # Jurisdiction rules
└── tests/
```

**Compliance Features:**
- Multi-provider KYC integration
- Real-time AML screening
- OFAC/EU sanctions checking
- Risk-based scoring
- Regulatory reporting

---

### 11. norchain-payments

| Attribute | Value |
|-----------|-------|
| **URL** | https://github.com/NorChainOfficial/norchain-payments |
| **Visibility** | 🔴 Private |
| **Created** | 2025-12-09 |
| **Default Branch** | main |
| **License** | MIT |

**Description:**  
SmartPay / NorPay backend service handling payment processing, escrow orchestration, and PSP integrations.

**Planned Architecture:**
```
norchain-payments/
├── src/
│   ├── payments/
│   │   ├── processor.ts        # Payment processor
│   │   ├── checkout.ts         # Checkout flow
│   │   └── refunds.ts          # Refund handling
│   ├── escrow/
│   │   ├── orchestrator.ts     # Escrow logic
│   │   └── disputes.ts         # Dispute resolution
│   ├── psp/
│   │   ├── stripe.ts           # Stripe integration
│   │   ├── adyen.ts            # Adyen integration
│   │   └── vipps.ts            # Vipps (Nordic)
│   ├── merchants/
│   │   ├── onboarding.ts       # Merchant onboarding
│   │   └── settlements.ts      # Settlement processing
│   └── api/
├── webhooks/                   # Webhook handlers
└── tests/
```

**Payment Features:**
- Multi-PSP routing
- Instant crypto-to-fiat
- Merchant dashboard
- Subscription billing
- Invoice management
- Multi-currency support

---

## Legacy/Established Repositories

### 12. norchain-sdk (Monorepo)

| Attribute | Value |
|-----------|-------|
| **URL** | https://github.com/NorChainOfficial/norchain-sdk |
| **Visibility** | Public |
| **Created** | 2025-11-12 |
| **Default Branch** | main |
| **License** | - |

**Description:**  
Main monorepo containing the complete NorChain ecosystem with 8 applications and 4 shared packages.

**Repository Statistics:**
- **Lines of Code:** ~5.5M+ across all languages
- **Primary Language:** TypeScript (5,079,691 bytes)

**Languages Breakdown:**

| Language | Size (bytes) | Percentage |
|----------|-------------|------------|
| TypeScript | 5,079,691 | 80.1% |
| Swift | 725,781 | 11.4% |
| MDX | 155,791 | 2.5% |
| Shell | 154,703 | 2.4% |
| Kotlin | 89,249 | 1.4% |
| Rust | 73,280 | 1.2% |
| JavaScript | 38,312 | 0.6% |
| CSS | 29,586 | 0.5% |

**Applications (`apps/`):**

| App | Description | Port | Status |
|-----|-------------|------|--------|
| `api` | Unified NestJS Backend API (110+ endpoints) | 3000 | ✅ Production |
| `explorer` | NorExplorer - Blockchain Explorer | 4002 | ✅ Production |
| `nex-exchange` | NEX Retail Exchange | - | ✅ Production |
| `dev-portal` | Developer Portal | - | ✅ Production |
| `landing` | Marketing Website | - | ✅ Production |
| `docs` | Nextra Documentation | - | ✅ Production |
| `norai` | AI Analytics Platform | - | 🚧 Development |
| `norstudio` | Studio Application | - | 🚧 Development |

**Shared Packages (`packages/`):**

| Package | Description |
|---------|-------------|
| `config` | Shared configuration files |
| `design-system` | UI component library |
| `sdk` | NorChain SDK |
| `types` | Shared TypeScript types |

**API Modules (21 total):**
- Authentication & Authorization
- Blockchain (Blocks, Transactions, Accounts)
- Contracts & Tokens
- Governance & Staking
- Bridge & Cross-chain
- Compliance & KYC
- Analytics & AI

---

### 13. mobile-validator

| Attribute | Value |
|-----------|-------|
| **URL** | https://github.com/NorChainOfficial/mobile-validator |
| **Visibility** | 🔴 Private |
| **Created** | 2025-11-13 |
| **Default Branch** | main |
| **License** | - |

**Description:**  
Next.js-based validator dashboard template with AI agent integration support.

**Tech Stack:**
- Next.js 14
- TypeScript
- Prisma ORM
- Supabase
- tRPC
- Tailwind CSS
- Inngest (background jobs)

**Languages:**

| Language | Size (bytes) |
|----------|-------------|
| TypeScript | 72,280 |
| Shell | 8,657 |
| CSS | 3,262 |
| JavaScript | 135 |

**Key Features:**
- AI coding assistant integration
- Storybook component development
- Multiple AI provider support (OpenAI, Anthropic, Perplexity, Groq)
- Task-based agent workflow

---

### 14. norchain

| Attribute | Value |
|-----------|-------|
| **URL** | https://github.com/NorChainOfficial/norchain |
| **Visibility** | Public |
| **Created** | 2025-11-12 |
| **Default Branch** | - (empty) |
| **License** | - |

**Description:**  
Placeholder repository for the main NorChain organization presence.

**Status:** Empty repository, reserved for future use.

---

## Inter-Repository Dependencies

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DEPENDENCY GRAPH                                     │
└─────────────────────────────────────────────────────────────────────────────┘

                              norchain-genesis
                                     │
                                     ▼
                              norchain-node
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
            norchain-contracts  norchain-sdk    norchain-infra
                    │                │                │
         ┌──────────┴──────────┐     │    ┌──────────┴──────────┐
         ▼                     ▼     ▼    ▼                     ▼
  norchain-bridge-hub   norchain-payments  Docker/K8s      Monitoring
         │                     │
         ▼                     ▼
  norchain-compliance-service ◄┘
                    
                              norchain-wallet-core
                                     │
              ┌──────────────────────┼──────────────────────┐
              ▼                      ▼                      ▼
      norchain-wallet-ios    norchain-wallet-android  norchain-wallet-web
```

### Dependency Matrix

| Repository | Depends On | Depended By |
|------------|------------|-------------|
| norchain-node | norchain-genesis | norchain-sdk, norchain-infra |
| norchain-genesis | - | norchain-node |
| norchain-contracts | norchain-node | norchain-bridge-hub, norchain-payments |
| norchain-infra | - | All deployment targets |
| norchain-wallet-core | - | All wallet repos |
| norchain-wallet-ios | norchain-wallet-core | - |
| norchain-wallet-android | norchain-wallet-core | - |
| norchain-wallet-web | norchain-wallet-core | - |
| norchain-bridge-hub | norchain-contracts | norchain-payments |
| norchain-compliance-service | - | norchain-payments, norchain-bridge-hub |
| norchain-payments | norchain-contracts, norchain-compliance-service | - |
| norchain-sdk | norchain-node | - |

---

## Development Roadmap

> **Strategy**: "Private First — Regulated Later"
>
> See [docs/ROADMAP.md](./docs/ROADMAP.md) for detailed phase breakdown.
> See [docs/LEGAL_COMPLIANCE_ROADMAP.md](./docs/LEGAL_COMPLIANCE_ROADMAP.md) for MiCA-safe strategy.

### Token Classification

| Token | Type | Tradability |
|-------|------|-------------|
| **NOR** | Utility | Public |
| **PM-EQ** | Security (PureMinerals) | Private only |
| **NV-EQ** | Security (NorVége) | Private only |

### MVP Phases (2025)

| Phase | Focus | Duration | Status |
|-------|-------|----------|--------|
| 1 | Blockchain Core | 0–6 weeks | 🟡 In Progress |
| 2 | NorExplorer | 2–4 weeks | ⬜ Pending |
| 3 | Smart Contracts | 3–6 weeks | ⬜ Pending |
| 4 | Wallet Ecosystem | 4–8 weeks | ⬜ Pending |
| 5 | SmartPay/NorPay | 4–6 weeks | ⬜ Pending |
| 6 | RWA Portals | 4–6 weeks | ⬜ Pending |
| 7 | Admin & Backoffice | 3–5 weeks | ⬜ Pending |
| 8 | Coinbase Integration | 2–4 weeks | ⬜ Pending |
| 9 | Landing Sites + Docs | 3–5 weeks | ⬜ Pending |
| 10 | Compliance + MiCA | 4–8 weeks | ⬜ Pending |

### Future Phases (2026+)

| Phase | Focus | Prerequisites |
|-------|-------|---------------|
| 11 | Ecosystem Apps (NEX, NorChat, DAO) | Phases 1-10 complete |
| 12 | DEX / Swap | Liquidity, regulatory clarity |
| 13 | Cross-Chain Bridges | Mainnet stability |
| 14 | Mobile Validators | Network maturity |

### Current Milestones

- [x] Create repository structure
- [x] Define tokenization strategy
- [x] Complete legal framework documentation
- [ ] Implement norchain-node core consensus (Phase 1)
- [ ] Deploy genesis configuration (Phase 1)
- [ ] Deploy PM-EQ smart contracts (Phase 3)
- [ ] Launch PureMinerals portal (Phase 6)
- [ ] Launch NorVége portal (Phase 6)

---

## Appendix: Individual Repository Specifications

### Quick Reference Table

| Repository | Type | Visibility | Branch | Created | Languages |
|------------|------|------------|--------|---------|-----------|
| norchain-node | Core | Public | main | 2025-12-09 | TBD (Rust/Go) |
| norchain-genesis | Core | Public | main | 2025-12-09 | JSON, Shell |
| norchain-contracts | Core | Public | main | 2025-12-09 | Solidity |
| norchain-infra | DevOps | Public | main | 2025-12-09 | YAML, HCL, Shell |
| norchain-wallet-core | Wallet | Public | main | 2025-12-09 | TS, Rust |
| norchain-wallet-ios | Wallet | Public | main | 2025-12-09 | Swift |
| norchain-wallet-android | Wallet | Public | main | 2025-12-09 | Kotlin |
| norchain-wallet-web | Wallet | Public | main | 2025-12-09 | TypeScript |
| norchain-bridge-hub | Service | Private | main | 2025-12-09 | TypeScript |
| norchain-compliance-service | Service | Private | main | 2025-12-09 | TypeScript |
| norchain-payments | Service | Private | main | 2025-12-09 | TypeScript |
| norchain-sdk | Monorepo | Public | main | 2025-11-12 | Multi |
| mobile-validator | Tool | Private | main | 2025-11-13 | TypeScript |
| norchain | Placeholder | Public | - | 2025-11-12 | - |

---

## Contribution Guidelines

### For Public Repositories

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow existing code style and conventions
- Write comprehensive tests
- Update documentation as needed
- Ensure CI passes before requesting review

### Security

For security vulnerabilities, please email security@norchain.org instead of opening public issues.

---

## License

Most public repositories are licensed under the MIT License. See individual repositories for specific license information.

---

## Related Documentation

| Document | Location | Description |
|----------|----------|-------------|
| Development Roadmap | [docs/ROADMAP.md](./docs/ROADMAP.md) | 10-phase development plan |
| Legal Compliance | [docs/LEGAL_COMPLIANCE_ROADMAP.md](./docs/LEGAL_COMPLIANCE_ROADMAP.md) | MiCA-safe strategy |
| Repository Structure | [docs/REPOSITORY_STRUCTURE.md](./docs/REPOSITORY_STRUCTURE.md) | 50+ repository organization |
| Developer Tasks | [docs/DEVELOPER_TASKS.md](./docs/DEVELOPER_TASKS.md) | Task breakdown by role |
| Node Specification | [docs/repositories/norchain-node.md](./docs/repositories/norchain-node.md) | Core node architecture |
| Genesis Specification | [docs/repositories/norchain-genesis.md](./docs/repositories/norchain-genesis.md) | Network configuration |

---

*Documentation generated for NorChainOfficial organization. Last updated: December 2025*
*Version: 2.0*

