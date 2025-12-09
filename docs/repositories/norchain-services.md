# NorChain Services

> Private service repositories for enterprise features

This document covers the three private service repositories:
- `norchain-bridge-hub`
- `norchain-compliance-service`
- `norchain-payments`

---

## norchain-bridge-hub

### Overview

| Attribute | Value |
|-----------|-------|
| **Repository** | [NorChainOfficial/norchain-bridge-hub](https://github.com/NorChainOfficial/norchain-bridge-hub) |
| **Visibility** | 🔴 Private |
| **License** | MIT |
| **Created** | December 9, 2025 |
| **Category** | Services |

### Description

Bridge orchestrator service for cross-chain transfers between NorChain and external networks (Ethereum, BSC, Polygon).

### Architecture

```
norchain-bridge-hub/
├── src/
│   ├── orchestrator/
│   │   ├── bridge-manager.ts      # Main orchestration
│   │   ├── transfer-processor.ts  # Transfer handling
│   │   └── fee-calculator.ts      # Fee estimation
│   ├── relayers/
│   │   ├── base-relayer.ts        # Base relayer class
│   │   ├── ethereum/              # ETH mainnet relayer
│   │   ├── bsc/                   # BSC relayer
│   │   └── polygon/               # Polygon relayer
│   ├── validators/
│   │   ├── signature-verifier.ts  # Multi-sig verification
│   │   └── proof-validator.ts     # Cross-chain proofs
│   ├── monitoring/
│   │   ├── health-check.ts        # Service health
│   │   ├── metrics.ts             # Prometheus metrics
│   │   └── alerts.ts              # Alert triggers
│   ├── security/
│   │   ├── rate-limiter.ts        # Rate limiting
│   │   ├── blacklist.ts           # Address blacklist
│   │   └── threshold.ts           # Transfer thresholds
│   └── api/
│       ├── rest/                  # REST API
│       └── graphql/               # GraphQL API
├── config/
│   ├── chains.json                # Supported chains
│   ├── tokens.json                # Bridgeable tokens
│   └── limits.json                # Transfer limits
└── tests/
```

### Supported Networks

| Network | Chain ID | Status |
|---------|----------|--------|
| NorChain Mainnet | 8453 | ✅ Primary |
| Ethereum | 1 | ✅ Active |
| BNB Smart Chain | 56 | ✅ Active |
| Polygon | 137 | ✅ Active |
| Arbitrum | 42161 | 🚧 Planned |
| Optimism | 10 | 🚧 Planned |

### Key Features

- **Multi-signature validation** - 3-of-5 validator consensus
- **Atomic transfers** - Guaranteed completion or rollback
- **Fee optimization** - Dynamic fee calculation
- **Liquidity management** - Automated rebalancing
- **Real-time monitoring** - 24/7 operational monitoring

---

## norchain-compliance-service

### Overview

| Attribute | Value |
|-----------|-------|
| **Repository** | [NorChainOfficial/norchain-compliance-service](https://github.com/NorChainOfficial/norchain-compliance-service) |
| **Visibility** | 🔴 Private |
| **License** | MIT |
| **Created** | December 9, 2025 |
| **Category** | Services |

### Description

Compliance service handling KYC/AML verification, risk scoring, and sanctions screening for regulatory compliance.

### Architecture

```
norchain-compliance-service/
├── src/
│   ├── kyc/
│   │   ├── providers/
│   │   │   ├── provider-interface.ts
│   │   │   ├── sumsub.ts           # Sumsub integration
│   │   │   ├── onfido.ts           # Onfido integration
│   │   │   └── jumio.ts            # Jumio integration
│   │   ├── verification.ts         # Verification workflow
│   │   └── document-types.ts       # Supported documents
│   ├── aml/
│   │   ├── screening.ts            # Transaction screening
│   │   ├── monitoring.ts           # Continuous monitoring
│   │   └── reporting.ts            # SAR generation
│   ├── sanctions/
│   │   ├── lists/
│   │   │   ├── ofac.ts             # US OFAC list
│   │   │   ├── eu.ts               # EU sanctions
│   │   │   └── un.ts               # UN sanctions
│   │   ├── checker.ts              # Sanctions checking
│   │   └── updater.ts              # List updates
│   ├── risk/
│   │   ├── scoring.ts              # Risk score calculation
│   │   ├── rules-engine.ts         # Rule definitions
│   │   └── factors.ts              # Risk factors
│   ├── travel-rule/
│   │   ├── compliance.ts           # FATF Travel Rule
│   │   └── vasp-directory.ts       # VASP registry
│   └── api/
├── config/
│   ├── jurisdictions.json          # Regional rules
│   └── thresholds.json             # KYC thresholds
└── tests/
```

### KYC Levels

| Level | Requirements | Limits |
|-------|--------------|--------|
| Level 0 | Email only | View only |
| Level 1 | Email + Phone | 1,000 NOR/day |
| Level 2 | + ID Document | 10,000 NOR/day |
| Level 3 | + Proof of Address | 100,000 NOR/day |
| Level 4 | + Enhanced Due Diligence | Unlimited |

### Supported Jurisdictions

- **EU** - MiCA compliant
- **US** - FinCEN registered
- **UK** - FCA registered
- **Singapore** - MAS regulated
- **UAE** - VARA compliant

---

## norchain-payments

### Overview

| Attribute | Value |
|-----------|-------|
| **Repository** | [NorChainOfficial/norchain-payments](https://github.com/NorChainOfficial/norchain-payments) |
| **Visibility** | 🔴 Private |
| **License** | MIT |
| **Created** | December 9, 2025 |
| **Category** | Services |

### Description

SmartPay / NorPay backend service for payment processing, escrow orchestration, and PSP integrations.

### Architecture

```
norchain-payments/
├── src/
│   ├── payments/
│   │   ├── processor.ts            # Payment processing
│   │   ├── checkout.ts             # Checkout flow
│   │   ├── refunds.ts              # Refund handling
│   │   └── recurring.ts            # Subscriptions
│   ├── escrow/
│   │   ├── orchestrator.ts         # Escrow management
│   │   ├── milestones.ts           # Milestone releases
│   │   └── disputes.ts             # Dispute resolution
│   ├── psp/
│   │   ├── interface.ts            # PSP interface
│   │   ├── stripe.ts               # Stripe integration
│   │   ├── adyen.ts                # Adyen integration
│   │   ├── vipps.ts                # Vipps (Nordic)
│   │   └── paypal.ts               # PayPal integration
│   ├── fiat/
│   │   ├── on-ramp.ts              # Fiat to crypto
│   │   ├── off-ramp.ts             # Crypto to fiat
│   │   └── exchange-rates.ts       # Rate management
│   ├── merchants/
│   │   ├── onboarding.ts           # Merchant registration
│   │   ├── dashboard.ts            # Merchant portal
│   │   └── settlements.ts          # Settlement processing
│   ├── invoicing/
│   │   ├── generator.ts            # Invoice creation
│   │   └── reminders.ts            # Payment reminders
│   └── api/
│       ├── public/                 # Merchant API
│       └── internal/               # Internal API
├── webhooks/
│   ├── stripe.ts                   # Stripe webhooks
│   └── blockchain.ts               # On-chain events
└── tests/
```

### Payment Features

| Feature | Description |
|---------|-------------|
| **Instant Payments** | Real-time NOR payments |
| **Fiat On-ramp** | Credit card to crypto |
| **Fiat Off-ramp** | Crypto to bank account |
| **Recurring** | Subscription billing |
| **Escrow** | Milestone-based releases |
| **Invoicing** | Professional invoices |
| **Multi-currency** | 50+ currencies supported |

### PSP Integrations

| Provider | Region | Features |
|----------|--------|----------|
| Stripe | Global | Cards, wallets |
| Adyen | Global | Enterprise |
| Vipps | Nordic | Mobile payments |
| PayPal | Global | PayPal, Venmo |
| MoonPay | Global | Crypto on-ramp |

### API Example

```typescript
// Create payment intent
POST /api/v1/payments/intent
{
  "amount": "100.00",
  "currency": "USD",
  "description": "Product purchase",
  "metadata": {
    "orderId": "ORD-12345"
  }
}

// Response
{
  "id": "pi_abc123",
  "status": "pending",
  "amount": "100.00",
  "currency": "USD",
  "norAmount": "85.50",
  "exchangeRate": "1.1696",
  "paymentUrl": "https://pay.norchain.org/pi_abc123"
}
```

---

## Security Considerations

All private service repositories implement:

- **Encryption at rest** - AES-256 for stored data
- **Encryption in transit** - TLS 1.3
- **Access control** - Role-based permissions
- **Audit logging** - Complete audit trail
- **Key management** - AWS KMS / HashiCorp Vault
- **Network isolation** - VPC with private subnets
- **DDoS protection** - Cloudflare / AWS Shield

---

## Deployment

All services are deployed via:
- **Docker** - Containerized applications
- **Kubernetes** - Orchestration on EKS
- **Terraform** - Infrastructure provisioning

See `norchain-infra` repository for deployment configurations.

---

*Part of the [NorChain Organization](https://github.com/NorChainOfficial)*

