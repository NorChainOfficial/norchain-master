# SmartPay Integration Skill

Expert skill for SmartPay/NorPay payment system integration.

## Skill Identity

This skill provides expertise in:
- Payment flow implementation
- Escrow contract development
- On-ramp partner integration
- Compliance-aware payment processing

## Activation Triggers

Activate this skill when:
- Implementing payment features
- Working with escrow contracts
- Integrating on-ramp partners
- Building checkout flows
- Handling refund logic

## Payment Flow Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Investor  │────▶│  On-ramp     │────▶│   NOR       │
│   (FIAT)    │     │  (Regulated) │     │   Wallet    │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                               │
                   ┌──────────────────────────▼──────┐
                   │         SmartPay Escrow          │
                   │   ┌─────────────────────────┐   │
                   │   │    KYC Verification     │   │
                   │   └───────────┬─────────────┘   │
                   │               │                  │
                   │   ┌───────────▼─────────────┐   │
                   │   │   Compliance Check      │   │
                   │   └───────────┬─────────────┘   │
                   │               │                  │
                   │   ┌───────────▼─────────────┐   │
                   │   │   Treasury Release      │   │
                   │   └───────────┬─────────────┘   │
                   └───────────────┼──────────────────┘
                                   │
                   ┌───────────────▼──────────────┐
                   │      PM-EQ / NV-EQ Token     │
                   └──────────────────────────────┘
```

## Critical Rules

1. **NorChain NEVER touches FIAT** - All FIAT handled by regulated on-ramps
2. **KYC required before token release** - No exceptions
3. **Escrow holds NOR only** - Security tokens released from treasury
4. **Refunds go back as NOR** - Never FIAT

## Escrow Contract Pattern

```solidity
// SmartPay Escrow Pattern
contract SmartPayEscrow {
    enum State { Pending, KYCVerified, Released, Refunded }

    struct Deposit {
        address investor;
        uint256 amount;
        State state;
        bytes32 kycHash;
    }

    function deposit(uint256 amount) external;
    function verifyKYC(bytes32 depositId, bytes32 kycHash) external onlyKYCOracle;
    function release(bytes32 depositId) external onlyTreasury;
    function refund(bytes32 depositId) external;
}
```

## On-Ramp Partners

Supported integrations:
- Moonpay
- Transak
- Ramp Network
- Banxa

## Context Files

Always reference:
- `/docs/ROADMAP.md` (Phase 5)
- `/docs/LEGAL_COMPLIANCE_ROADMAP.md` (Payment compliance)
- `.claude/commands/smartpay.md`

## Usage

```
/skill smartpay-integration
```
