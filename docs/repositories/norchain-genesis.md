# norchain-genesis

> Genesis configuration and assets for NorChain network

## Overview

| Attribute | Value |
|-----------|-------|
| **Repository** | [NorChainOfficial/norchain-genesis](https://github.com/NorChainOfficial/norchain-genesis) |
| **Visibility** | 🟢 Public |
| **License** | MIT |
| **Created** | December 9, 2025 |
| **Default Branch** | main |
| **Category** | Core Blockchain |

## Description

The `norchain-genesis` repository contains the genesis block configurations and initial network parameters for all NorChain networks (mainnet, testnet, devnet).

## Architecture

```
norchain-genesis/
├── mainnet/
│   ├── genesis.json            # Mainnet genesis block
│   ├── validators.json         # Initial validator set
│   ├── allocations.json        # Token allocations
│   └── params.json             # Network parameters
├── testnet/
│   ├── genesis.json            # Testnet genesis block
│   ├── validators.json         # Testnet validators
│   ├── faucet-config.json      # Faucet configuration
│   └── params.json             # Testnet parameters
├── devnet/
│   ├── genesis.json            # Local development genesis
│   ├── accounts.json           # Pre-funded dev accounts
│   └── params.json             # Devnet parameters
├── scripts/
│   ├── generate-genesis.sh     # Genesis generation
│   ├── validate-genesis.sh     # Validation script
│   └── merge-allocations.sh    # Allocation merger
├── tools/
│   ├── genesis-generator/      # Genesis generation tool
│   └── validator-setup/        # Validator key generation
└── docs/
    ├── GENESIS_SPEC.md         # Genesis specification
    ├── VALIDATOR_GUIDE.md      # Validator setup guide
    └── ALLOCATION_POLICY.md    # Token allocation policy
```

## Genesis Block Structure

### genesis.json

```json
{
  "config": {
    "chainId": 8453,
    "homesteadBlock": 0,
    "eip150Block": 0,
    "eip155Block": 0,
    "eip158Block": 0,
    "byzantiumBlock": 0,
    "constantinopleBlock": 0,
    "petersburgBlock": 0,
    "istanbulBlock": 0,
    "berlinBlock": 0,
    "londonBlock": 0,
    "consensus": {
      "type": "pos",
      "epochLength": 32,
      "blockTime": 3,
      "minValidators": 4,
      "maxValidators": 100
    }
  },
  "nonce": "0x0",
  "timestamp": "0x...",
  "extraData": "0x...",
  "gasLimit": "0x1c9c380",
  "difficulty": "0x1",
  "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "coinbase": "0x0000000000000000000000000000000000000000",
  "alloc": {
    "0x...": {
      "balance": "0x..."
    }
  },
  "validators": [
    {
      "address": "0x...",
      "publicKey": "0x...",
      "power": 1000000
    }
  ]
}
```

## Network Configurations

### Mainnet

| Parameter | Value |
|-----------|-------|
| Chain ID | 8453 |
| Block Time | 3 seconds |
| Epoch Length | 32 blocks |
| Min Validators | 4 |
| Max Validators | 100 |
| Gas Limit | 30,000,000 |

### Testnet (Nor Testnet)

| Parameter | Value |
|-----------|-------|
| Chain ID | 84531 |
| Block Time | 2 seconds |
| Epoch Length | 16 blocks |
| Min Validators | 2 |
| Max Validators | 50 |
| Gas Limit | 30,000,000 |

### Devnet (Local)

| Parameter | Value |
|-----------|-------|
| Chain ID | 31337 |
| Block Time | 1 second |
| Epoch Length | 8 blocks |
| Min Validators | 1 |
| Max Validators | 10 |
| Gas Limit | 30,000,000 |

## Token Allocations

### Mainnet Distribution

| Category | Percentage | Amount (NOR) | Vesting |
|----------|------------|--------------|---------|
| Foundation | 20% | 200,000,000 | 4 years |
| Team | 15% | 150,000,000 | 4 years cliff |
| Validators | 10% | 100,000,000 | - |
| Ecosystem | 25% | 250,000,000 | 3 years |
| Community | 15% | 150,000,000 | Airdrops |
| Treasury | 15% | 150,000,000 | DAO-controlled |
| **Total** | **100%** | **1,000,000,000** | - |

### allocations.json

```json
{
  "allocations": [
    {
      "address": "0xFoundation...",
      "amount": "200000000000000000000000000",
      "category": "foundation",
      "vestingSchedule": {
        "cliff": 31536000,
        "duration": 126144000,
        "startTime": 0
      }
    },
    {
      "address": "0xValidatorPool...",
      "amount": "100000000000000000000000000",
      "category": "validators",
      "vestingSchedule": null
    }
  ]
}
```

## Validator Configuration

### validators.json

```json
{
  "validators": [
    {
      "name": "NorChain Foundation 1",
      "address": "0x...",
      "publicKey": "0x...",
      "blsPublicKey": "0x...",
      "initialStake": "1000000000000000000000000",
      "commission": 5
    }
  ],
  "minimumStake": "100000000000000000000000",
  "unbondingPeriod": 604800
}
```

## Scripts

### Generate Genesis

```bash
#!/bin/bash
# generate-genesis.sh

NETWORK=${1:-devnet}
OUTPUT_DIR="./output/${NETWORK}"

mkdir -p "$OUTPUT_DIR"

# Generate genesis
./tools/genesis-generator/genesis-gen \
  --network "$NETWORK" \
  --validators "./validators/${NETWORK}.json" \
  --allocations "./allocations/${NETWORK}.json" \
  --params "./params/${NETWORK}.json" \
  --output "$OUTPUT_DIR/genesis.json"

echo "Genesis generated: $OUTPUT_DIR/genesis.json"
```

### Validate Genesis

```bash
#!/bin/bash
# validate-genesis.sh

GENESIS_FILE=${1:-./mainnet/genesis.json}

# Validate JSON syntax
jq empty "$GENESIS_FILE" || { echo "Invalid JSON"; exit 1; }

# Validate required fields
jq -e '.config.chainId' "$GENESIS_FILE" > /dev/null || { echo "Missing chainId"; exit 1; }
jq -e '.validators | length > 0' "$GENESIS_FILE" > /dev/null || { echo "No validators"; exit 1; }

# Validate allocations sum
TOTAL=$(jq '[.alloc[].balance | ltrimstr("0x") | ("0" + .) | tonumber] | add' "$GENESIS_FILE")
echo "Total allocated: $TOTAL"

echo "Genesis validation passed!"
```

## Development

### Creating a Development Genesis

```bash
# Clone repository
git clone https://github.com/NorChainOfficial/norchain-genesis.git
cd norchain-genesis

# Generate devnet genesis with custom accounts
./scripts/generate-genesis.sh devnet \
  --add-account "0xYourAddress:1000000000000000000000" \
  --validators 3

# Validate
./scripts/validate-genesis.sh ./devnet/genesis.json
```

### Adding Test Validators

```bash
# Generate validator keys
./tools/validator-setup/keygen \
  --output ./keys/validator1.json

# Add to validators.json
./scripts/add-validator.sh \
  --network testnet \
  --key ./keys/validator1.json \
  --stake 100000
```

## Dependencies

| Repository | Relationship |
|------------|--------------|
| `norchain-node` | Consumes genesis for network initialization |
| `norchain-contracts` | Receives pre-deployed contract addresses |

## Verification

### Genesis Hash Verification

| Network | Genesis Hash |
|---------|--------------|
| Mainnet | `0x...` (TBD) |
| Testnet | `0x...` (TBD) |
| Devnet | Variable |

## Security

- Genesis files are immutable once mainnet launches
- All allocations are publicly auditable
- Validator setup requires secure key generation
- Multi-signature required for foundation allocations

## Related Documentation

- [Node Configuration](./norchain-node.md)
- [Validator Guide](../guides/validator-setup.md)
- [Token Economics](../specs/tokenomics.md)

---

*Part of the [NorChain Organization](https://github.com/NorChainOfficial)*

