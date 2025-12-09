# NorChain Ecosystem Development Roadmap

> **2025–2026 | Phased, Actionable, Regulation-Safe**
>
> Aligned with PureMinerals + NorVége onboarding

---

## Executive Summary

This roadmap covers the complete NorChain ecosystem in correct execution order.

**Strategy**: "Private First — Regulated Later" (see [Legal Compliance Roadmap](./LEGAL_COMPLIANCE_ROADMAP.md))

### Token Classification

| Token | Type | Tradability |
|-------|------|-------------|
| **NOR** | Utility | Public |
| **PM-EQ** | Security (PureMinerals) | Private only |
| **NV-EQ** | Security (NorVége) | Private only |

### Phase Overview

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

---

## Phase 1: Core Blockchain Infrastructure

**Duration**: 0–6 weeks

**Goal**: Stabilize the NorChain blockchain so RWA tokens can safely run on it.

### Deliverables

| Component | Status | Description |
|-----------|--------|-------------|
| NorChain L1 (PoSA) | | Finalize consensus mechanism |
| Validators | | Minimum 5–7 validators running |
| P2P Health Checks | | Network stability monitoring |
| RPC Gateway | | Nginx + SSL secured endpoints |
| Chain ID + Metadata | | Fixed, immutable chain identity |
| Genesis File | | Finalized genesis configuration |
| Treasury Wallet | | Multisig treasury setup |
| Testnet Faucet | | Developer token distribution |
| Block Gas Config | | Optimized gas parameters |
| On-chain Parameters | | Parameter governance file |
| Monitoring | | Prometheus + Grafana alerting |
| Ansible Scripts | | Hardened deployment automation |

### Outcome

NorChain becomes a stable, production-ready chain for tokenized equity and SmartPay.

---

## Phase 2: NorExplorer

**Duration**: 2–4 weeks

**Goal**: Make the chain human-readable and transparent.

### Deliverables

| Component | Status | Description |
|-----------|--------|-------------|
| Block Explorer UI | | NorExplorer frontend |
| Transaction History | | Full TX search and display |
| Address Pages | | Balance, history, tokens |
| Token Pages | | PM-EQ, NOR token info |
| PM-EQ Registry | | Investor registry integration |
| Certificate Viewer | | Certificate Registry display |
| Contract Viewer | | Smart contract source display |
| Company Profiles | | RWA company pages |
| Stats Dashboard | | Network statistics |
| API Endpoints | | Public and private APIs |

### Outcome

Investors and companies can see everything transparently. PureMinerals becomes more trusted.

---

## Phase 3: Smart Contract Layer

**Duration**: 3–6 weeks

**Goal**: Deploy the entire PM-EQ tokenization stack.

### Deliverables

| Contract | Status | Description |
|----------|--------|-------------|
| PM-EQ Token | | Private ERC20 with restrictions |
| Transfer Restrictions | | Whitelist-based transfers |
| Investor Registry | | KYC-verified investor list |
| Certificate Registry | | PDF hash on-chain storage |
| Distribution Vault | | Dividend distribution logic |
| SmartPay Escrow | | Escrow contract for purchases |
| NOR Lock/Release | | Token locking mechanisms |
| Burn/Fee Mechanics | | Optional token economics |
| Config Files | | PureMinerals + NorVége configs |

### Outcome

Companies can issue tokenized equity safely.

---

## Phase 4: Wallet Ecosystem

**Duration**: 4–8 weeks

**Goal**: Users must be able to interact with NorChain easily.

### Phase 4A: Web Wallet

| Component | Status | Description |
|-----------|--------|-------------|
| Web Wallet App | | NorChain Web Wallet |
| Authentication | | Email + passphrase login |
| Portfolio View | | NOR, PM-EQ, other RWA |
| Transaction History | | Full TX display |
| Certificate Viewer | | Token certificate display |
| Address Manager | | QR codes + address book |
| SmartPay Integration | | Payment flow integration |

### Phase 4B: Mobile Wallets (Native)

| Component | Status | Description |
|-----------|--------|-------------|
| iOS Wallet (Swift) | | Native SwiftUI application |
| Android Wallet (Kotlin) | | Native Jetpack Compose application |
| Biometric Login | | FaceID / Touch ID / Fingerprint |
| NOR Purchase | | NorPay integration |
| PM-EQ / NV-EQ Viewing | | RWA token display |
| Push Notifications | | Escrow, dividends, updates |
| Ledger Support | | Hardware wallet pairing |

### Outcome

Investors can interact directly without MetaMask.

---

## Phase 5: SmartPay + NorPay

**Duration**: 4–6 weeks

**Goal**: Build the financial engine for PM-EQ purchases.

### Deliverables

| Component | Status | Description |
|-----------|--------|-------------|
| SmartPay UI | | Payment interface |
| NOR Payment | | Native token payments |
| Escrow Builder | | Transaction construction |
| Compliance Checks | | KYC hash verification |
| Refund System | | Automated refund handling |
| Settlement Module | | Payment settlement |
| Wallet Integration | | NorChain wallet connection |
| Admin Dashboard | | Payment monitoring |
| FIAT On-ramp | | Ramp/MoonPay/Vipps integration |

### Outcome

Secure and compliant payments for PM-EQ.

---

## Phase 6: RWA Portals

**Duration**: 4–6 weeks

**Goal**: Build fully functional investor portals.

### PureMinerals Portal

| Component | Status | Description |
|-----------|--------|-------------|
| KYC Onboarding | | Investor verification flow |
| Document Vault | | Legal document storage |
| Company Profile | | Company information display |
| PM-EQ Dashboard | | Holdings and history |
| SmartPay Screen | | Purchase interface |
| P2P Marketplace | | Secondary trading |
| Governance Updates | | Company announcements |
| Certificate Downloads | | PDF certificate generation |

### NorVége Portal

| Component | Status | Description |
|-----------|--------|-------------|
| Portal Replication | | Based on PureMinerals template |
| Custom Branding | | NorVége visual identity |
| NV-EQ Token | | Separate security token instance |
| Marketplace Instance | | Independent P2P trading |
| Investor Registry | | Separate investor whitelist |

### RWA Company Template

| Component | Status | Description |
|-----------|--------|-------------|
| Template Repository | | Base template for new RWA companies |
| Setup Scripts | | Automated deployment |
| Integration Docs | | Onboarding documentation |

### Outcome

Both companies are fully tokenized and investment-ready.

---

## Phase 7: Admin & Backoffice

**Duration**: 3–5 weeks

**Goal**: Provide enterprise management tools.

### Deliverables

| Component | Status | Description |
|-----------|--------|-------------|
| Admin Panel | | NorChain Admin interface |
| Company Onboarding | | RWA company registration |
| Token Management | | PM-EQ minting and admin |
| KYC Approval | | Manual verification panel |
| Compliance Reporting | | Regulatory report generation |
| Investor Support | | Support ticket system |
| Transaction Logs | | Full audit trail |
| Fee Dashboards | | Revenue tracking |
| Treasury Monitor | | Liquidity and holdings view |

### Outcome

Manage everything from a single secure panel.

---

## Phase 8: Coinbase Integration

**Duration**: 2–4 weeks

**Goal**: Add exchange-grade tools without triggering regulation.

### Deliverables

| Integration | Status | Description |
|-------------|--------|-------------|
| Market Data API | | Price feeds from Coinbase |
| Coinbase Commerce | | NOR/USDC payment acceptance |
| Coinbase Prime | | Optional custody for large investors |
| Wallet Integration | | Coinbase Wallet connection |
| Price Oracle | | SmartPay price feed |

**Note**: Silent integration using public APIs — no partnership required.

### Outcome

Corporate investors gain institutional trust.

---

## Phase 9: Landing Sites + Documentation

**Duration**: 3–5 weeks

**Goal**: Present NorChain to the world.

### Landing Pages

| Site | Status | Description |
|------|--------|-------------|
| norchain.org | | Main NorChain website |
| PureMinerals Landing | | Investment marketing site |
| NorVége Landing | | Investment marketing site |
| SmartPay Landing | | Payment solution marketing |
| Company Onboarding | | B2B onboarding funnel |

### Documentation

| Doc | Status | Description |
|-----|--------|-------------|
| Developer Docs | | API and integration guides |
| Investor Docs | | User guides and FAQ |
| PM-EQ Standard | | Token specification |
| SmartPay API | | Payment API documentation |
| Compliance Pages | | Legal and compliance info |
| Tutorials | | Step-by-step guides |

### Outcome

Credibility + clear communication + onboarding.

---

## Phase 10: Compliance + MiCA Preparation

**Duration**: 4–8 weeks

**Goal**: Prepare NorChain for long-term regulated expansion.

### Deliverables

| Component | Status | Description |
|-----------|--------|-------------|
| TX Monitoring | | Transaction surveillance |
| KYC/AML Tools | | Admin verification tools |
| Risk Scoring | | Automated risk assessment |
| Watchlist Integration | | Sanctions list checking |
| MiCA Architecture | | EU regulation alignment |
| Audit Logs | | Evidence tracking system |
| Resolution Generator | | Corporate document automation |

### Outcome

Smooth path toward future STO and regulated ecosystem.

---

## Phase Summary

| # | Phase | Focus | Weeks |
|---|-------|-------|-------|
| 1 | Blockchain Core | PoSA, validators, RPC, monitoring | 0–6 |
| 2 | NorExplorer | Block explorer, APIs, transparency | 2–4 |
| 3 | Smart Contracts | PM-EQ, registries, escrow | 3–6 |
| 4 | Wallet Ecosystem | Web + mobile wallets | 4–8 |
| 5 | SmartPay/NorPay | Payments, FIAT on-ramp | 4–6 |
| 6 | RWA Portals | PureMinerals + NorVége | 4–6 |
| 7 | Admin Panel | Backoffice, compliance tools | 3–5 |
| 8 | Coinbase | Market data, commerce, custody | 2–4 |
| 9 | Landing + Docs | Websites, documentation | 3–5 |
| 10 | Compliance | KYC/AML, MiCA prep | 4–8 |

---

## Roadmap Principles

### Execution Order Rationale

1. **Blockchain first** — Nothing works without a stable chain
2. **Explorer second** — Transparency builds trust before investment
3. **Contracts third** — Token infrastructure before user interfaces
4. **Wallets fourth** — Users need interaction before payments
5. **Payments fifth** — Financial flows after user infrastructure
6. **Portals sixth** — Company portals after payment capability
7. **Admin seventh** — Management tools after products exist
8. **Coinbase eighth** — Institutional features after core stability
9. **Marketing ninth** — Public presence after product readiness
10. **Compliance last** — Regulatory prep after ecosystem maturity

### Key Constraints

- **Regulation-safe**: No MiCA/Finanstilsynet triggers in early phases
- **Scalable**: Each phase builds on previous infrastructure
- **Realistic**: Durations based on typical team velocity
- **Business-aligned**: Matches PureMinerals + NorVége onboarding

---

## Future Phases (Post-MVP)

After completing the core 10 phases, the following are planned:

| Future Phase | Focus | Prerequisites |
|--------------|-------|---------------|
| Ecosystem Apps | NEX AI, NorChat, DAO | Phases 1-10 complete |
| DEX / Swap | Decentralized exchange | Liquidity, regulatory clarity |
| Cross-Chain Bridges | BNB, ETH, Polygon | Mainnet stability |
| Mobile Validators | PoA-Lite mobile nodes | Network maturity |

See [Repository Structure](./REPOSITORY_STRUCTURE.md) for full ecosystem architecture including future components.

---

## Related Documents

| Document | Description |
|----------|-------------|
| [Legal Compliance Roadmap](./LEGAL_COMPLIANCE_ROADMAP.md) | MiCA-safe strategy, token classification, regulatory checklist |
| [Developer Tasks](./DEVELOPER_TASKS.md) | 100+ tasks by role with priority/complexity |
| [Repository Structure](./REPOSITORY_STRUCTURE.md) | Complete 50+ repository organization |
| [Organization Documentation](../NORCHAIN_ORGANIZATION_DOCUMENTATION.md) | 14 GitHub repositories, architecture diagrams |

---

*Last Updated: December 2025*
*Version: 2.1*
