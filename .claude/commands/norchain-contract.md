# NorChain Smart Contract Reference

Get smart contract specifications and templates.

## Arguments
- `$ARGUMENTS` - Contract type: "nor", "pmeq", "nveq", "escrow", "registry", "vault", or "all"

## Instructions

1. Read `docs/REPOSITORY_STRUCTURE.md` for contract structure
2. Read `docs/ROADMAP.md` Phase 3 for contract deliverables
3. Read `docs/LEGAL_COMPLIANCE_ROADMAP.md` for compliance requirements

## Contract Types

| Contract | Purpose | Phase |
|----------|---------|-------|
| NOR Token | Utility token (ERC-20) | 3 |
| PM-EQ Token | PureMinerals security token | 3 |
| NV-EQ Token | NorVége security token | 3 |
| Investor Registry | KYC-verified investor whitelist | 3 |
| Certificate Registry | Ownership certificate hashes | 3 |
| Distribution Vault | Dividend distribution | 3 |
| SmartPay Escrow | Payment escrow | 3 |

## Output Format

```
## Smart Contract: [Name]

### Purpose
[What this contract does]

### Token Classification
[For tokens: Utility/Security, tradability]

### Key Features
- Feature 1
- Feature 2

### Compliance Requirements
- [KYC-gating, whitelist, etc.]

### Interface
```solidity
// Key functions
function transfer(address to, uint256 amount) external;
function whitelist(address investor) external;
```

### Security Considerations
- [Important security notes]

### Dependencies
- Depends on: [other contracts]
- Used by: [services/apps]
```

Include compliance warnings for security tokens.
