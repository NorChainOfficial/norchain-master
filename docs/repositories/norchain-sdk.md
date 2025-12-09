# norchain-sdk

> Full-Stack Blockchain Operating System Monorepo

## Overview

| Attribute | Value |
|-----------|-------|
| **Repository** | [NorChainOfficial/norchain-sdk](https://github.com/NorChainOfficial/norchain-sdk) |
| **Visibility** | 🟢 Public |
| **License** | - |
| **Created** | November 12, 2025 |
| **Default Branch** | main |
| **Category** | Monorepo |

## Description

The `norchain-sdk` repository is the main monorepo containing the complete NorChain ecosystem. It houses 8 applications, 4 shared packages, and comprehensive documentation for the full-stack blockchain operating system.

## Statistics

| Metric | Value |
|--------|-------|
| Total Code Size | ~6.3 MB |
| Primary Language | TypeScript (80%) |
| Applications | 8 |
| Packages | 4 |
| API Endpoints | 110+ |
| API Modules | 21 |

### Language Breakdown

| Language | Size | Percentage |
|----------|------|------------|
| TypeScript | 5,079,691 bytes | 80.1% |
| Swift | 725,781 bytes | 11.4% |
| MDX | 155,791 bytes | 2.5% |
| Shell | 154,703 bytes | 2.4% |
| Kotlin | 89,249 bytes | 1.4% |
| Rust | 73,280 bytes | 1.2% |
| JavaScript | 38,312 bytes | 0.6% |
| CSS | 29,586 bytes | 0.5% |

## Architecture

```
norchain-sdk/
├── apps/
│   ├── api/                # Unified NestJS Backend API
│   ├── explorer/           # NorExplorer - Blockchain Explorer
│   ├── nex-exchange/       # NEX Retail Exchange
│   ├── dev-portal/         # Developer Portal
│   ├── landing/            # Marketing Website
│   ├── docs/               # Nextra Documentation
│   ├── norai/              # AI Analytics Platform
│   └── norstudio/          # Studio Application
├── packages/
│   ├── config/             # Shared configuration
│   ├── design-system/      # UI component library
│   ├── sdk/                # NorChain SDK
│   └── types/              # Shared TypeScript types
├── docs/
│   ├── architecture/       # Architecture documentation
│   ├── deployment/         # Deployment guides
│   ├── development/        # Development guides
│   └── product/            # Product documentation
├── scripts/                # Build and utility scripts
├── docker-compose.yml      # Production compose
├── docker-compose.dev.yml  # Development compose
├── package.json            # Root package.json
└── README.md               # Main README
```

## Applications

### 1. Unified API (`apps/api`)

**Status:** ✅ Production Ready

The backbone of the NorChain ecosystem, providing 110+ REST endpoints across 21 modules.

| Metric | Value |
|--------|-------|
| Framework | NestJS |
| Port | 3000 |
| Database | PostgreSQL |
| Cache | Redis |
| Auth | JWT + API Keys |

**API Modules:**
- Authentication & Authorization
- Users & Accounts
- Blockchain (Blocks, Transactions)
- Contracts & Verification
- Tokens & NFTs
- Governance & Proposals
- Staking & Rewards
- Bridge & Cross-chain
- Compliance & KYC
- Analytics & Reports
- AI Integration
- Webhooks & Notifications

### 2. NorExplorer (`apps/explorer`)

**Status:** ✅ Production Ready  
**Port:** 4002

World-class blockchain explorer competing with Etherscan, BSCscan, and PolygonScan.

**Features:**
- Block and transaction explorer
- Account and contract viewer
- Contract verification (multi-file, JSON)
- Token tracking and analytics
- Validator network information
- Universal search
- API documentation
- Export tools (CSV/JSON)

### 3. NEX Exchange (`apps/nex-exchange`)

**Status:** ✅ Production Ready

Retail on/off-ramp exchange for NOR token.

**Features:**
- Buy/sell NOR with fiat
- Real-time price charts
- Order book and trading
- KYC integration
- Payment processing

### 4. Developer Portal (`apps/dev-portal`)

**Status:** ✅ Production Ready

Developer hub for NorChain APIs and SDKs.

**Features:**
- API documentation
- SDK downloads
- Interactive API explorer
- API key management
- Usage analytics

### 5. Landing Page (`apps/landing`)

**Status:** ✅ Production Ready

Marketing website for NorChain.

**Features:**
- Product overview
- Feature highlights
- Team and roadmap
- Contact forms

### 6. Documentation (`apps/docs`)

**Status:** ✅ Production Ready

Nextra-powered documentation site.

**Features:**
- Searchable documentation
- Code examples
- Tutorials and guides
- API reference

### 7. NorAI (`apps/norai`)

**Status:** 🚧 In Development

AI analytics platform for blockchain intelligence.

**Planned Features:**
- Transaction pattern analysis
- Anomaly detection
- Predictive analytics
- Natural language queries

### 8. NorStudio (`apps/norstudio`)

**Status:** 🚧 In Development

Development studio for smart contracts.

**Planned Features:**
- Contract IDE
- Visual contract builder
- Testing environment
- Deployment tools

## Shared Packages

### `packages/config`

Shared configuration files for all applications.

```typescript
// Usage
import { databaseConfig, redisConfig } from '@norchain/config';
```

### `packages/design-system`

UI component library built with React and Tailwind.

```typescript
// Usage
import { Button, Card, Modal } from '@norchain/design-system';
```

### `packages/sdk`

NorChain SDK for interacting with the blockchain.

```typescript
// Usage
import { NorChain, Wallet } from '@norchain/sdk';

const norchain = new NorChain({
  network: 'mainnet',
  apiKey: 'your-api-key'
});

const balance = await norchain.getBalance(address);
```

### `packages/types`

Shared TypeScript type definitions.

```typescript
// Usage
import type { Block, Transaction, Account } from '@norchain/types';
```

## Development

### Prerequisites

```bash
# Node.js 18+
nvm install 18
nvm use 18

# Install dependencies
npm install
```

### Environment Setup

```bash
# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/explorer/.env.example apps/explorer/.env

# Configure database
DATABASE_URL=postgresql://user:password@localhost:5432/norchain
REDIS_URL=redis://localhost:6379
```

### Running Applications

```bash
# Start all services (Docker)
docker-compose -f docker-compose.dev.yml up -d

# Start API
npm run dev --workspace=apps/api

# Start Explorer
npm run dev --workspace=apps/explorer

# Start all apps
npm run dev
```

### Building

```bash
# Build all
npm run build

# Build specific app
npm run build --workspace=apps/api

# Type check
npm run typecheck
```

### Testing

```bash
# Run all tests
npm test

# Test specific package
npm test --workspace=apps/api

# E2E tests
npm run test:e2e
```

## Infrastructure

### Docker Compose (Development)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: norchain
      POSTGRES_USER: norchain
      POSTGRES_PASSWORD: norchain

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis

  explorer:
    build:
      context: .
      dockerfile: apps/explorer/Dockerfile
    ports:
      - "4002:3002"
    depends_on:
      - api
```

### Ports

| Application | Internal Port | External Port |
|-------------|---------------|---------------|
| API | 3000 | 3000 |
| Explorer | 3002 | 4002 |
| Dev Portal | 3003 | 4003 |
| Landing | 3004 | 4004 |
| Docs | 3005 | 4005 |

## Documentation Structure

```
docs/
├── architecture/
│   ├── ECOSYSTEM_MAPPING.md      # Full ecosystem overview
│   ├── ECOSYSTEM_DIAGRAM.svg     # Visual architecture
│   └── API_ARCHITECTURE.md       # API design
├── deployment/
│   ├── DOCKER.md                 # Docker deployment
│   └── KUBERNETES.md             # K8s deployment
├── development/
│   ├── CONTRIBUTING.md           # Contribution guide
│   ├── CODING_STANDARDS.md       # Code style
│   └── TESTING.md                # Testing guide
├── implementation/
│   └── ...                       # Implementation docs
├── status/
│   ├── API_100_PERCENT_PRODUCTION_READY.md
│   └── COMPLETE_FINAL_SUMMARY.md
└── INDEX.md                      # Documentation index
```

## Ecosystem Comparison

NorChain applications compete with world-class analogues:

| NorChain | Competitor | Category |
|----------|------------|----------|
| NorExplorer | Etherscan | Explorer |
| NorPay | Stripe | Payments |
| NorLedger | QuickBooks | Accounting |
| NorChat | WhatsApp | Messaging |
| NorSwap | Uniswap | DEX |
| NorDEX | Binance | Exchange |
| NorBridge | LayerZero | Bridge |

## Roadmap

### Phase 1 (Current)
- [x] Unified API (110+ endpoints)
- [x] NorExplorer
- [x] NEX Exchange
- [x] Developer Portal
- [x] Documentation

### Phase 2
- [ ] NorPay payment gateway
- [ ] NorLedger accounting
- [ ] Enhanced bridge UI

### Phase 3
- [ ] NorChat messaging
- [ ] NorDEX exchange
- [ ] NorAI analytics

## Dependencies

| Repository | Relationship |
|------------|--------------|
| `norchain-node` | RPC provider |
| `norchain-contracts` | Contract ABIs |
| `norchain-infra` | Deployment configs |

---

*Part of the [NorChain Organization](https://github.com/NorChainOfficial)*

