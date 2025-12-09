# NorChain Repository Structure

> Complete codebase organization for the NorChain ecosystem

---

## Overview

The NorChain ecosystem comprises **50+ repositories** organized into 10 domains.

**Strategy**: "Private First — Regulated Later" — See [Legal Compliance Roadmap](./LEGAL_COMPLIANCE_ROADMAP.md)

### Domain Summary

| Domain | Repos | Phase | Description |
|--------|-------|-------|-------------|
| Blockchain | 8 | 1 | Core chain infrastructure |
| Smart Contracts | 8 | 3 | On-chain logic (NOR, PM-EQ, NV-EQ) |
| SmartPay/NorPay | 5 | 5 | Payment infrastructure |
| Wallets | 5 | 4 | Multi-platform wallets |
| Explorer | 2 | 2 | Block explorer |
| Portals | 4 | 6 | RWA company portals |
| Compliance | 4 | 10 | KYC/AML/Regulatory |
| Documentation | 6 | 9 | Docs & landing pages |
| Ecosystem Apps | 5 | Future | NEX, NorChat, DEX, DAO |
| Bridges | 4 | Future | Cross-chain infrastructure |

### MVP vs Future

| Category | Included | Timeline |
|----------|----------|----------|
| **MVP (Phases 1-10)** | Blockchain, Contracts, Wallets, SmartPay, Explorer, Portals, Admin, Compliance, Docs | 2025 |
| **Future** | Ecosystem Apps, Bridges, Mobile Validators, DEX | 2026+ |

---

## Complete Structure

```
norchain/
│
├── blockchain/
│   ├── norchain-node/              # Core blockchain node (PoSA)
│   │   ├── consensus/              # Consensus engine
│   │   ├── network/                # P2P networking
│   │   ├── state/                  # State management
│   │   ├── rpc/                    # JSON-RPC server
│   │   └── cli/                    # Node CLI
│   │
│   ├── mobile-validator/           # Mobile PoA-Lite validator
│   │   ├── ios/                    # iOS validator app
│   │   ├── android/                # Android validator app
│   │   └── shared/                 # Cross-platform logic
│   │
│   ├── consensus-engine/           # Standalone consensus library
│   │   ├── posa/                   # Proof of Staked Authority
│   │   ├── validators/             # Validator management
│   │   └── rewards/                # Reward distribution
│   │
│   ├── genesis/                    # Genesis configurations
│   │   ├── mainnet/                # Mainnet genesis
│   │   ├── testnet/                # Testnet genesis
│   │   └── devnet/                 # Local development
│   │
│   ├── rpc-gateway/                # RPC proxy + load balancer
│   │   ├── nginx/                  # Nginx configs
│   │   ├── ssl/                    # SSL certificates
│   │   └── rate-limiting/          # Request throttling
│   │
│   ├── websocket-service/          # Real-time subscriptions
│   │   ├── subscriptions/          # Event subscriptions
│   │   ├── broadcast/              # Event broadcasting
│   │   └── connections/            # Connection management
│   │
│   ├── indexer/                    # Blockchain indexer
│   │   ├── processors/             # Block/TX processors
│   │   ├── storage/                # PostgreSQL schema
│   │   └── api/                    # Query API
│   │
│   └── monitoring/                 # Infrastructure monitoring
│       ├── prometheus/             # Metrics collection
│       ├── grafana/                # Dashboards
│       └── alertmanager/           # Alert rules
│
├── smart-contracts/
│   ├── nor-token/                  # NOR utility token
│   │   ├── contracts/              # Solidity contracts
│   │   ├── test/                   # Test suites
│   │   └── scripts/                # Deployment scripts
│   │
│   ├── pmeq-token/                 # PM-EQ security token
│   │   ├── contracts/              # Whitelisted ERC-20
│   │   ├── whitelist/              # Whitelist management
│   │   └── compliance/             # Compliance hooks
│   │
│   ├── rwa-templates/              # RWA token templates
│   │   ├── security-token/         # Security token base
│   │   ├── revenue-share/          # Revenue distribution
│   │   └── governance/             # Token governance
│   │
│   ├── investor-registry/          # Investor whitelist
│   │   ├── contracts/              # Registry contracts
│   │   ├── merkle/                 # Merkle proof verification
│   │   └── admin/                  # Admin functions
│   │
│   ├── certificate-registry/       # Ownership certificates
│   │   ├── contracts/              # Certificate NFTs
│   │   ├── metadata/               # Certificate metadata
│   │   └── verification/           # Verification logic
│   │
│   ├── escrow/                     # Escrow contracts
│   │   ├── contracts/              # Escrow logic
│   │   ├── conditions/             # Release conditions
│   │   └── disputes/               # Dispute resolution
│   │
│   ├── company-registry/           # RWA company registry
│   │   ├── contracts/              # Company records
│   │   ├── verification/           # Company verification
│   │   └── actions/                # Corporate actions
│   │
│   └── audits/                     # Security audits
│       ├── reports/                # Audit reports
│       └── fixes/                  # Remediation tracking
│
├── smartpay-norpay/
│   ├── payment-backend/            # Payment processing
│   │   ├── src/
│   │   │   ├── payments/           # Payment handlers
│   │   │   ├── settlements/        # Settlement engine
│   │   │   ├── invoices/           # B2B invoicing
│   │   │   └── webhooks/           # Event webhooks
│   │   └── api/                    # REST API
│   │
│   ├── escrow-service/             # Escrow orchestration
│   │   ├── src/
│   │   │   ├── escrow/             # Escrow management
│   │   │   ├── conditions/         # Release conditions
│   │   │   ├── kyc-integration/    # KYC verification
│   │   │   └── refunds/            # Refund processing
│   │   └── api/
│   │
│   ├── compliance-engine/          # Payment compliance
│   │   ├── src/
│   │   │   ├── screening/          # Transaction screening
│   │   │   ├── limits/             # Transaction limits
│   │   │   └── reporting/          # Compliance reports
│   │   └── rules/                  # Rule definitions
│   │
│   ├── fiat-onramp-integrations/   # FIAT→Crypto
│   │   ├── ramp/                   # Ramp Network
│   │   ├── moonpay/                # MoonPay
│   │   ├── transak/                # Transak
│   │   └── common/                 # Shared interfaces
│   │
│   └── admin-dashboard/            # Payment admin UI
│       ├── src/
│       │   ├── transactions/       # TX management
│       │   ├── escrows/            # Escrow monitoring
│       │   ├── settlements/        # Settlement tracking
│       │   └── reports/            # Financial reports
│       └── components/
│
├── wallets/
│   ├── wallet-web/                 # Browser wallet
│   │   ├── src/
│   │   │   ├── app/                # Next.js app
│   │   │   ├── features/           # Feature modules
│   │   │   ├── lib/                # Crypto utilities
│   │   │   └── hooks/              # React hooks
│   │   └── public/
│   │
│   ├── wallet-ios/                 # iOS wallet
│   │   ├── NorWallet/
│   │   │   ├── App/                # App entry
│   │   │   ├── Features/           # Feature modules
│   │   │   ├── Core/               # Crypto, network
│   │   │   └── Resources/          # Assets
│   │   └── NorWalletTests/
│   │
│   ├── wallet-android/             # Android wallet
│   │   ├── app/
│   │   │   ├── src/main/java/
│   │   │   │   ├── ui/             # Compose UI
│   │   │   │   ├── data/           # Data layer
│   │   │   │   └── crypto/         # Crypto operations
│   │   │   └── src/main/res/
│   │   └── core/                   # Core module
│   │
│   ├── wallet-sdk/                 # Wallet SDK
│   │   ├── src/
│   │   │   ├── core/               # Core wallet logic
│   │   │   ├── signing/            # Transaction signing
│   │   │   ├── providers/          # RPC providers
│   │   │   └── types/              # TypeScript types
│   │   └── bindings/               # Platform bindings
│   │
│   └── ledger-integration/         # Hardware wallet
│       ├── app/                    # Ledger app
│       ├── transport/              # USB/Bluetooth
│       └── signing/                # Secure signing
│
├── explorer/
│   ├── nor-explorer-ui/            # Explorer frontend
│   │   ├── src/
│   │   │   ├── app/                # Next.js app
│   │   │   ├── components/         # UI components
│   │   │   │   ├── blocks/         # Block views
│   │   │   │   ├── transactions/   # TX views
│   │   │   │   ├── addresses/      # Address views
│   │   │   │   ├── tokens/         # Token views
│   │   │   │   └── validators/     # Validator views
│   │   │   └── hooks/
│   │   └── public/
│   │
│   └── nor-explorer-api/           # Explorer backend
│       ├── src/
│       │   ├── modules/
│       │   │   ├── blocks/         # Block queries
│       │   │   ├── transactions/   # TX queries
│       │   │   ├── addresses/      # Address queries
│       │   │   ├── tokens/         # Token queries
│       │   │   └── stats/          # Statistics
│       │   └── websocket/          # Real-time updates
│       └── prisma/                 # Database schema
│
├── portals/
│   ├── pureminerals/               # PureMinerals portal
│   │   ├── src/
│   │   │   ├── app/                # Next.js app
│   │   │   ├── features/
│   │   │   │   ├── dashboard/      # Investor dashboard
│   │   │   │   ├── purchase/       # SmartPay purchase
│   │   │   │   ├── documents/      # Document vault
│   │   │   │   ├── marketplace/    # P2P trading
│   │   │   │   └── certificates/   # Certificate downloads
│   │   │   └── components/
│   │   └── public/
│   │
│   ├── norvege/                    # NorVége portal
│   │   └── [same structure as pureminerals]
│   │
│   ├── taxi-portal/                # Taxi Portal (future)
│   │   ├── src/
│   │   │   ├── features/
│   │   │   │   ├── fleet/          # Fleet tokenization
│   │   │   │   ├── subscriptions/  # Subscription management
│   │   │   │   └── payments/       # Payment processing
│   │   │   └── components/
│   │   └── public/
│   │
│   └── rwa-company-template/       # Template for new RWA companies
│       ├── template/               # Base template
│       ├── scripts/                # Setup scripts
│       └── docs/                   # Integration docs
│
├── ecosystem-apps/                     # FUTURE - Post-MVP
│   ├── nex-ai/                     # NEX AI Assistant
│   │   ├── src/
│   │   │   ├── ai/
│   │   │   │   ├── models/         # LLM integration
│   │   │   │   ├── embeddings/     # Vector search
│   │   │   │   └── agents/         # AI agents
│   │   │   ├── features/
│   │   │   │   ├── search/         # AI search
│   │   │   │   ├── insights/       # Blockchain insights
│   │   │   │   ├── helpdesk/       # Support assistant
│   │   │   │   └── developer/      # Dev assistant
│   │   │   └── api/
│   │   └── knowledge-base/         # Training data
│   │
│   ├── norchat/                    # Encrypted messaging
│   │   ├── src/
│   │   │   ├── messaging/          # E2E encrypted chat
│   │   │   ├── channels/           # Company channels
│   │   │   ├── announcements/      # Broadcasts
│   │   │   └── wallet-connect/     # Wallet auth
│   │   └── encryption/             # Crypto primitives
│   │
│   ├── dex/                        # Decentralized exchange
│   │   ├── contracts/              # AMM contracts
│   │   │   ├── pools/              # Liquidity pools
│   │   │   ├── router/             # Swap router
│   │   │   └── governance/         # DEX governance
│   │   ├── frontend/               # Trading UI
│   │   └── sdk/                    # DEX SDK
│   │
│   ├── swap-aggregator/            # Swap aggregation
│   │   ├── src/
│   │   │   ├── routing/            # Best price routing
│   │   │   ├── sources/            # Liquidity sources
│   │   │   └── quotes/             # Quote engine
│   │   └── api/
│   │
│   └── dao-module/                 # DAO governance
│       ├── contracts/
│       │   ├── governance/         # Governor contract
│       │   ├── voting/             # Voting mechanisms
│       │   ├── treasury/           # DAO treasury
│       │   └── timelock/           # Execution delay
│       └── frontend/               # Governance UI
│
├── bridges/                            # FUTURE - Post-MVP
│   ├── bnb-bridge/                 # NorChain ↔ BNB
│   │   ├── contracts/
│   │   │   ├── norchain/           # NorChain side
│   │   │   └── bnb/                # BNB side
│   │   ├── relayer/                # Bridge relayer
│   │   └── frontend/               # Bridge UI
│   │
│   ├── eth-bridge/                 # NorChain ↔ Ethereum
│   │   └── [same structure]
│   │
│   ├── polygon-bridge/             # NorChain ↔ Polygon
│   │   └── [same structure]
│   │
│   └── bridge-monitor/             # Bridge monitoring
│       ├── src/
│       │   ├── monitoring/         # Health checks
│       │   ├── alerts/             # Alert system
│       │   └── dashboard/          # Status dashboard
│       └── configs/
│
├── compliance/
│   ├── kyc-aml-service/            # KYC/AML service
│   │   ├── src/
│   │   │   ├── kyc/
│   │   │   │   ├── providers/      # Sumsub, Onfido
│   │   │   │   ├── verification/   # ID verification
│   │   │   │   └── documents/      # Document handling
│   │   │   ├── aml/
│   │   │   │   ├── screening/      # Name screening
│   │   │   │   ├── monitoring/     # TX monitoring
│   │   │   │   └── sanctions/      # Sanctions lists
│   │   │   └── api/
│   │   └── configs/
│   │
│   ├── risk-engine/                # Risk assessment
│   │   ├── src/
│   │   │   ├── scoring/            # Risk scoring
│   │   │   ├── rules/              # Rule engine
│   │   │   └── ml/                 # ML models
│   │   └── models/
│   │
│   ├── audit-log/                  # Audit trail
│   │   ├── src/
│   │   │   ├── logging/            # Event logging
│   │   │   ├── storage/            # Immutable storage
│   │   │   └── search/             # Log search
│   │   └── retention/
│   │
│   └── regulatory-reports/         # Reporting
│       ├── src/
│       │   ├── generators/         # Report generators
│       │   ├── templates/          # Report templates
│       │   └── schedules/          # Scheduled reports
│       └── outputs/
│
├── docs/
│   ├── developers/                 # Developer documentation
│   │   ├── getting-started/
│   │   ├── api-reference/
│   │   ├── smart-contracts/
│   │   └── tutorials/
│   │
│   ├── investors/                  # Investor documentation
│   │   ├── guides/
│   │   ├── faq/
│   │   └── glossary/
│   │
│   ├── companies/                  # RWA company docs
│   │   ├── onboarding/
│   │   ├── integration/
│   │   └── templates/
│   │
│   ├── compliance/                 # Compliance documentation
│   │   ├── policies/
│   │   ├── procedures/
│   │   └── regulations/
│   │
│   ├── wallet-docs/                # Wallet documentation
│   │   ├── user-guide/
│   │   ├── security/
│   │   └── troubleshooting/
│   │
│   └── api/                        # API documentation
│       ├── rest/
│       ├── websocket/
│       └── graphql/
│
└── landing/
    ├── norchain-org/               # norchain.org
    │   ├── src/
    │   │   ├── app/
    │   │   ├── components/
    │   │   └── content/
    │   └── public/
    │
    ├── pureminerals-landing/       # PureMinerals marketing
    │   └── [standard Next.js structure]
    │
    ├── norvege-landing/            # NorVége marketing
    │   └── [standard Next.js structure]
    │
    ├── smartpay-landing/           # SmartPay marketing
    │   └── [standard Next.js structure]
    │
    └── developer-portal/           # Developer portal
        ├── src/
        │   ├── app/
        │   ├── features/
        │   │   ├── docs/           # Documentation viewer
        │   │   ├── api-keys/       # API key management
        │   │   ├── playground/     # API playground
        │   │   └── examples/       # Code examples
        │   └── components/
        └── public/
```

---

## Technology Stack by Domain

### Blockchain

| Repository | Language | Framework |
|------------|----------|-----------|
| norchain-node | Go | Custom |
| mobile-validator | Swift/Kotlin | SwiftUI/Compose |
| indexer | TypeScript | NestJS |
| monitoring | YAML | Prometheus/Grafana |

### Smart Contracts

| Repository | Language | Framework |
|------------|----------|-----------|
| All contracts | Solidity | Hardhat |
| Testing | TypeScript | Chai/Waffle |

### Backend Services

| Repository | Language | Framework |
|------------|----------|-----------|
| payment-backend | TypeScript | NestJS |
| escrow-service | TypeScript | NestJS |
| explorer-api | TypeScript | NestJS |
| kyc-aml-service | TypeScript | NestJS |

### Frontend Applications

| Repository | Language | Framework |
|------------|----------|-----------|
| All web apps | TypeScript | Next.js 14 |
| wallet-ios | Swift | SwiftUI |
| wallet-android | Kotlin | Jetpack Compose |

### Infrastructure

| Component | Technology |
|-----------|------------|
| Container | Docker |
| Orchestration | Kubernetes |
| IaC | Terraform |
| CI/CD | GitHub Actions |
| Database | PostgreSQL |
| Cache | Redis |
| Search | Elasticsearch |

---

## Repository Naming Conventions

| Pattern | Example | Description |
|---------|---------|-------------|
| `norchain-*` | `norchain-node` | Core blockchain |
| `*-token` | `nor-token` | Token contracts |
| `*-registry` | `investor-registry` | Registry contracts |
| `wallet-*` | `wallet-ios` | Wallet applications |
| `*-service` | `escrow-service` | Backend services |
| `*-api` | `explorer-api` | API services |
| `*-bridge` | `bnb-bridge` | Bridge infrastructure |
| `*-landing` | `smartpay-landing` | Marketing sites |

---

## Monorepo vs Multi-Repo

### Monorepos

| Monorepo | Contains |
|----------|----------|
| `norchain-sdk` | Existing 8 apps + 4 packages |
| `smart-contracts` | All Solidity contracts |
| `docs` | All documentation |

### Standalone Repos

All other repositories are standalone for:
- Independent versioning
- Separate CI/CD pipelines
- Team ownership boundaries
- Security isolation (private repos)

---

## Related Documents

| Document | Description |
|----------|-------------|
| [Development Roadmap](./ROADMAP.md) | 10-phase development plan |
| [Legal Compliance Roadmap](./LEGAL_COMPLIANCE_ROADMAP.md) | MiCA-safe strategy |
| [Developer Tasks](./DEVELOPER_TASKS.md) | Task breakdown by role |
| [Organization Documentation](../NORCHAIN_ORGANIZATION_DOCUMENTATION.md) | GitHub repositories |

---

*Last Updated: December 2025*
*Version: 2.0*
