# Security Token Skill

Expert skill for implementing compliant security tokens (PM-EQ, NV-EQ).

## Skill Identity

This skill provides expertise in:
- ERC-20 with transfer restrictions
- Whitelist management
- KYC verification integration
- Certificate registry
- Compliance enforcement

## Activation Triggers

Activate this skill when:
- Implementing PM-EQ or NV-EQ tokens
- Building investor registry
- Creating certificate systems
- Implementing transfer restrictions
- Working on compliance features

## Security Token vs Utility Token

| Aspect | NOR (Utility) | PM-EQ/NV-EQ (Security) |
|--------|---------------|------------------------|
| Transfer | Unrestricted | Whitelist only |
| Trading | Public DEX/CEX | Private P2P only |
| KYC | Optional | Required |
| Compliance | Minimal | Full |
| Certificate | None | Required |

## Transfer Restriction Pattern

```solidity
// Security Token Transfer Pattern
contract SecurityToken is ERC20, Pausable, AccessControl {
    IInvestorRegistry public investorRegistry;

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(!paused(), "Token transfers paused");

        // Skip for minting/burning
        if (from != address(0) && to != address(0)) {
            require(
                investorRegistry.isVerified(from) &&
                investorRegistry.isVerified(to),
                "Both parties must be KYC verified"
            );
            require(
                investorRegistry.canTransfer(from, to, amount),
                "Transfer not allowed"
            );
        }

        super._beforeTokenTransfer(from, to, amount);
    }
}
```

## Investor Registry Pattern

```solidity
interface IInvestorRegistry {
    function isVerified(address investor) external view returns (bool);
    function getKYCHash(address investor) external view returns (bytes32);
    function getShareClass(address investor) external view returns (ShareClass);
    function getJurisdiction(address investor) external view returns (string memory);
    function canTransfer(address from, address to, uint256 amount) external view returns (bool);
}
```

## Certificate Registry Pattern

```solidity
interface ICertificateRegistry {
    function getCertificateHash(address investor) external view returns (bytes32);
    function verifyCertificate(address investor, bytes32 hash) external view returns (bool);
    function getAmendmentHistory(address investor) external view returns (Amendment[] memory);
}
```

## Compliance Requirements

### Transfer Checks
1. Both sender and receiver are KYC verified
2. Neither party is on sanctions list
3. Transfer doesn't exceed jurisdiction limits
4. Both parties have valid certificates

### Prohibited Actions
- ❌ List on DEX/CEX
- ❌ Transfer to non-KYC wallet
- ❌ Cross-border without approval
- ❌ Transfer during lock-up period

## Context Files

Always reference:
- `/docs/LEGAL_COMPLIANCE_ROADMAP.md`
- `/docs/ROADMAP.md` (Phase 3)
- `.claude/agents/norchain-contract-agent.md`

## Usage

```
/skill security-token
```
