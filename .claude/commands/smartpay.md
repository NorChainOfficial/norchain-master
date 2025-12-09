# SmartPay/NorPay Reference

Get information about the SmartPay/NorPay payment system.

## Arguments
- `$ARGUMENTS` - Optional: "flow", "escrow", "compliance", "fiat", "architecture"

## Instructions

1. Read `docs/ROADMAP.md` Phase 5 for SmartPay deliverables
2. Read `docs/LEGAL_COMPLIANCE_ROADMAP.md` Phase 5 for payment compliance
3. Read `docs/REPOSITORY_STRUCTURE.md` for smartpay-norpay structure

## Payment Flow

```
Investor → FIAT → On-ramp Partner (regulated) → NOR → SmartPay Escrow → PM-EQ/NV-EQ
                                                              ↓
                                              KYC Verification Gate
                                                              ↓
                                              Treasury Release (after approval)
```

## Key Principles

1. **No FIAT handling** - SmartPay only handles crypto
2. **Partner compliance** - On-ramp partners handle FIAT KYC/AML
3. **Escrow protection** - Smart contract escrow, not custody
4. **NOR utility** - NOR is utility token, not tied to profits

## Output Format

```
## SmartPay: [Topic]

### Overview
[Description of the topic]

### Components
| Component | Purpose | Regulatory Status |
|-----------|---------|-------------------|
| ... | ... | ... |

### Flow Diagram
[ASCII or description of flow]

### Compliance Notes
- [Important compliance considerations]

### Integration Points
- [APIs, contracts, services involved]
```

Always emphasize that NorChain never holds FIAT and partners handle compliance.
