# norchain-contracts

> Smart contracts for NorChain ecosystem

## Overview

| Attribute | Value |
|-----------|-------|
| **Repository** | [NorChainOfficial/norchain-contracts](https://github.com/NorChainOfficial/norchain-contracts) |
| **Visibility** | 🟢 Public |
| **License** | MIT |
| **Created** | December 9, 2025 |
| **Default Branch** | main |
| **Category** | Core Blockchain |

## Description

The `norchain-contracts` repository contains all smart contracts powering the NorChain ecosystem including:

- **NOR Token** - Native ERC-20 token
- **Governance** - DAO governance contracts
- **Staking** - Validator staking mechanism
- **RWA Templates** - Real World Asset tokenization
- **Payment Contracts** - Escrow and payment logic
- **Bridge Contracts** - Cross-chain bridge infrastructure

## Architecture

```
norchain-contracts/
├── contracts/
│   ├── token/
│   │   ├── NORToken.sol              # Main NOR token
│   │   ├── VestedNOR.sol             # Vesting contract
│   │   └── WrappedNOR.sol            # Wrapped token for bridges
│   ├── governance/
│   │   ├── Governor.sol              # Main governance
│   │   ├── Timelock.sol              # Execution delay
│   │   ├── Treasury.sol              # DAO treasury
│   │   └── VotingPower.sol           # Vote weight calculation
│   ├── staking/
│   │   ├── StakingPool.sol           # Main staking pool
│   │   ├── ValidatorRegistry.sol     # Validator management
│   │   ├── RewardDistributor.sol     # Reward distribution
│   │   └── Slashing.sol              # Slashing conditions
│   ├── rwa/
│   │   ├── RWAToken.sol              # Tokenized asset base
│   │   ├── RWAFactory.sol            # Asset factory
│   │   ├── ComplianceHook.sol        # Compliance integration
│   │   └── templates/
│   │       ├── RealEstate.sol        # Real estate template
│   │       ├── Securities.sol        # Securities template
│   │       └── Commodities.sol       # Commodities template
│   ├── payments/
│   │   ├── Escrow.sol                # Escrow contract
│   │   ├── PaymentRouter.sol         # Payment routing
│   │   ├── Subscription.sol          # Recurring payments
│   │   └── Invoice.sol               # Invoice management
│   ├── bridge/
│   │   ├── BridgeGateway.sol         # Main bridge entry
│   │   ├── TokenVault.sol            # Locked token storage
│   │   ├── MessageVerifier.sol       # Cross-chain verification
│   │   └── adapters/
│   │       ├── EthereumAdapter.sol   # ETH adapter
│   │       ├── BSCAdapter.sol        # BSC adapter
│   │       └── PolygonAdapter.sol    # Polygon adapter
│   └── utils/
│       ├── Multicall.sol             # Batch calls
│       └── AccessControl.sol         # Role management
├── interfaces/
│   ├── INORToken.sol
│   ├── IGovernor.sol
│   ├── IStaking.sol
│   └── IBridge.sol
├── libraries/
│   ├── SafeMath.sol
│   ├── MerkleProof.sol
│   └── ECDSA.sol
├── test/
│   ├── token/
│   ├── governance/
│   ├── staking/
│   └── integration/
├── scripts/
│   ├── deploy/
│   │   ├── 001_deploy_token.ts
│   │   ├── 002_deploy_governance.ts
│   │   └── 003_deploy_staking.ts
│   └── verify/
├── audits/
│   ├── audit-report-v1.pdf
│   └── findings.md
├── hardhat.config.ts
└── package.json
```

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Language | Solidity | ^0.8.20 |
| Framework | Hardhat | 2.19+ |
| Testing | Chai, Mocha | - |
| Libraries | OpenZeppelin | 5.0+ |
| Tooling | TypeScript | 5.0+ |

## Core Contracts

### NOR Token

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract NORToken is ERC20, ERC20Burnable, ERC20Permit, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1B tokens
    
    constructor() ERC20("NorChain", "NOR") ERC20Permit("NorChain") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
}
```

### Staking Pool

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IStakingPool {
    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 lockPeriod;
        address validator;
    }
    
    function stake(address validator, uint256 amount, uint256 lockPeriod) external;
    function unstake(uint256 stakeId) external;
    function claimRewards(uint256 stakeId) external returns (uint256);
    function getStake(address user, uint256 stakeId) external view returns (Stake memory);
    function totalStaked() external view returns (uint256);
    function validatorStake(address validator) external view returns (uint256);
}
```

### Governance

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IGovernor {
    enum ProposalState {
        Pending,
        Active,
        Canceled,
        Defeated,
        Succeeded,
        Queued,
        Expired,
        Executed
    }
    
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) external returns (uint256 proposalId);
    
    function castVote(uint256 proposalId, uint8 support) external returns (uint256 weight);
    function execute(uint256 proposalId) external payable;
    function state(uint256 proposalId) external view returns (ProposalState);
}
```

## Contract Addresses

### Mainnet (TBD)

| Contract | Address |
|----------|---------|
| NOR Token | `0x...` |
| Governor | `0x...` |
| Timelock | `0x...` |
| StakingPool | `0x...` |
| BridgeGateway | `0x...` |

### Testnet

| Contract | Address |
|----------|---------|
| NOR Token | `0x...` |
| Governor | `0x...` |
| Timelock | `0x...` |
| StakingPool | `0x...` |
| BridgeGateway | `0x...` |

## Development

### Prerequisites

```bash
# Install Node.js 18+
nvm install 18
nvm use 18

# Install dependencies
npm install
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Configure .env
PRIVATE_KEY=your_private_key
MAINNET_RPC_URL=https://rpc.norchain.org
TESTNET_RPC_URL=https://testnet-rpc.norchain.org
ETHERSCAN_API_KEY=your_api_key
```

### Compilation

```bash
# Compile contracts
npx hardhat compile

# Clean and recompile
npx hardhat clean && npx hardhat compile

# Generate TypeScript types
npx hardhat typechain
```

### Testing

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/token/NORToken.test.ts

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run with coverage
npx hardhat coverage
```

### Deployment

```bash
# Deploy to local hardhat network
npx hardhat run scripts/deploy/001_deploy_token.ts

# Deploy to testnet
npx hardhat run scripts/deploy/001_deploy_token.ts --network testnet

# Deploy to mainnet
npx hardhat run scripts/deploy/001_deploy_token.ts --network mainnet

# Verify on explorer
npx hardhat verify --network testnet DEPLOYED_CONTRACT_ADDRESS
```

## Security

### Audits

| Auditor | Date | Report |
|---------|------|--------|
| TBD | TBD | [Link](#) |

### Security Features

- **Access Control** - Role-based permissions
- **Reentrancy Guards** - OpenZeppelin ReentrancyGuard
- **Pausable** - Emergency pause functionality
- **Upgradeable** - UUPS proxy pattern for select contracts
- **Timelock** - Governance execution delay

### Bug Bounty

Bug bounty program details at [security.norchain.org](https://security.norchain.org)

| Severity | Reward |
|----------|--------|
| Critical | $50,000 |
| High | $20,000 |
| Medium | $5,000 |
| Low | $1,000 |

## Gas Optimization

| Operation | Gas (estimated) |
|-----------|-----------------|
| NOR Transfer | ~50,000 |
| Stake | ~100,000 |
| Unstake | ~80,000 |
| Claim Rewards | ~60,000 |
| Cast Vote | ~70,000 |

## Dependencies

| Repository | Relationship |
|------------|--------------|
| `norchain-node` | Executes contracts on-chain |
| `norchain-genesis` | Pre-deployed in genesis |
| `norchain-bridge-hub` | Bridge contract interaction |
| `norchain-payments` | Payment contract integration |

## Related Documentation

- [Token Economics](../specs/tokenomics.md)
- [Governance Guide](../guides/governance.md)
- [Staking Guide](../guides/staking.md)
- [Bridge Documentation](../guides/bridge.md)

---

*Part of the [NorChain Organization](https://github.com/NorChainOfficial)*

