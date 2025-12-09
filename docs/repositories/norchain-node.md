# norchain-node

> Core NorChain blockchain node software

## Overview

| Attribute | Value |
|-----------|-------|
| **Repository** | [NorChainOfficial/norchain-node](https://github.com/NorChainOfficial/norchain-node) |
| **Visibility** | 🟢 Public |
| **License** | MIT |
| **Created** | December 9, 2025 |
| **Default Branch** | main |
| **Category** | Core Blockchain |

## Description

The `norchain-node` repository contains the core blockchain node software for the NorChain network. This includes:

- **Consensus Engine** - Proof of Stake consensus mechanism
- **Networking Layer** - P2P communication and node discovery
- **State Management** - Transaction processing and state storage
- **RPC Interface** - JSON-RPC API for external interaction

## Architecture

```
norchain-node/
├── cmd/                        # CLI entry points
│   ├── norchain/              # Main node binary
│   └── norctl/                # Node control CLI
├── consensus/                  # Consensus implementation
│   ├── pos/                   # Proof of Stake
│   │   ├── validator.go       # Validator logic
│   │   ├── proposer.go        # Block proposer
│   │   └── voting.go          # Voting mechanism
│   └── engine.go              # Consensus engine interface
├── network/                    # P2P networking
│   ├── discovery/             # Node discovery (Kademlia DHT)
│   ├── protocols/             # Wire protocols
│   │   ├── sync.go           # Block sync protocol
│   │   └── tx.go             # Transaction gossip
│   └── peer/                  # Peer management
├── core/                       # Core blockchain logic
│   ├── types/                 # Core types (Block, Transaction, etc.)
│   ├── state/                 # State management
│   │   ├── trie/             # Merkle Patricia Trie
│   │   └── db/               # State database
│   ├── txpool/               # Transaction mempool
│   └── vm/                    # Virtual machine (EVM-compatible)
├── rpc/                        # RPC interfaces
│   ├── jsonrpc/              # JSON-RPC server
│   ├── websocket/            # WebSocket subscriptions
│   └── graphql/              # GraphQL API
├── config/                     # Configuration
│   ├── genesis/              # Genesis handling
│   └── params/               # Chain parameters
├── crypto/                     # Cryptographic primitives
│   ├── keys/                 # Key management
│   └── signatures/           # Signature schemes
└── tests/                      # Test suites
    ├── unit/
    ├── integration/
    └── e2e/
```

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Language | Go | 1.21+ |
| Database | LevelDB / RocksDB | - |
| Networking | libp2p | - |
| Consensus | Custom PoS | - |
| VM | EVM-compatible | - |

## Key Features

### Consensus
- **Delegated Proof of Stake (DPoS)** - Energy-efficient consensus
- **Validator rotation** - Fair block production distribution
- **Slashing conditions** - Penalty for malicious behavior
- **Finality** - Fast transaction finality (~3 seconds)

### Networking
- **Node discovery** - Kademlia DHT-based peer discovery
- **Block propagation** - Efficient block gossip protocol
- **Transaction mempool** - Priority-based transaction ordering
- **NAT traversal** - Support for nodes behind NAT

### State Management
- **Merkle Patricia Trie** - Efficient state storage
- **State pruning** - Reduced storage requirements
- **Fast sync** - Quick node synchronization
- **Archive mode** - Full historical state

### RPC API
- **JSON-RPC 2.0** - Standard Ethereum-compatible API
- **WebSocket** - Real-time event subscriptions
- **GraphQL** - Flexible querying (optional)

## Configuration

### Node Configuration (`config.toml`)

```toml
[node]
name = "my-norchain-node"
data_dir = "/var/lib/norchain"

[network]
listen_addr = "0.0.0.0:30303"
max_peers = 50
bootstrap_nodes = [
  "/dns4/boot1.norchain.org/tcp/30303/p2p/QmBootNode1...",
  "/dns4/boot2.norchain.org/tcp/30303/p2p/QmBootNode2..."
]

[consensus]
validator = true
validator_key = "/path/to/validator.key"

[rpc]
enabled = true
http_addr = "127.0.0.1:8545"
ws_addr = "127.0.0.1:8546"
cors_origins = ["*"]

[metrics]
enabled = true
prometheus_addr = "127.0.0.1:9090"

[logging]
level = "info"
format = "json"
```

## Commands

### Running a Node

```bash
# Start a full node
norchain --config /etc/norchain/config.toml

# Start a validator node
norchain --validator --config /etc/norchain/config.toml

# Start with specific network
norchain --network mainnet
norchain --network testnet
norchain --network devnet
```

### Node Control (norctl)

```bash
# Check node status
norctl status

# Get peer info
norctl peers list

# Check sync status
norctl sync status

# Export/import state
norctl state export --file state.dump
norctl state import --file state.dump
```

## API Reference

### JSON-RPC Endpoints

| Method | Description |
|--------|-------------|
| `nor_blockNumber` | Get current block number |
| `nor_getBlockByNumber` | Get block by number |
| `nor_getBlockByHash` | Get block by hash |
| `nor_getTransaction` | Get transaction by hash |
| `nor_sendRawTransaction` | Submit signed transaction |
| `nor_getBalance` | Get account balance |
| `nor_call` | Execute contract call |
| `nor_estimateGas` | Estimate gas for transaction |
| `nor_gasPrice` | Get current gas price |

### WebSocket Subscriptions

```javascript
// Subscribe to new blocks
{
  "jsonrpc": "2.0",
  "method": "nor_subscribe",
  "params": ["newHeads"],
  "id": 1
}

// Subscribe to pending transactions
{
  "jsonrpc": "2.0", 
  "method": "nor_subscribe",
  "params": ["pendingTransactions"],
  "id": 2
}
```

## Dependencies

| Repository | Relationship |
|------------|--------------|
| `norchain-genesis` | Consumes genesis configuration |
| `norchain-contracts` | Executes deployed contracts |
| `norchain-infra` | Deployment configurations |

## Development

### Prerequisites

```bash
# Install Go 1.21+
brew install go  # macOS
apt install golang-go  # Ubuntu

# Install dependencies
go mod download
```

### Building

```bash
# Build all binaries
make build

# Build specific binary
make build-node
make build-norctl

# Build with race detector (development)
make build-dev
```

### Testing

```bash
# Run unit tests
make test

# Run integration tests
make test-integration

# Run with coverage
make test-coverage
```

## Deployment

### Docker

```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o norchain ./cmd/norchain

FROM alpine:3.19
COPY --from=builder /app/norchain /usr/local/bin/
EXPOSE 30303 8545 8546
ENTRYPOINT ["norchain"]
```

### Kubernetes

See `norchain-infra` repository for Kubernetes manifests and Helm charts.

## Monitoring

### Prometheus Metrics

| Metric | Description |
|--------|-------------|
| `norchain_block_height` | Current block height |
| `norchain_peers_connected` | Number of connected peers |
| `norchain_txpool_pending` | Pending transactions in mempool |
| `norchain_consensus_round` | Current consensus round |

### Health Endpoints

- `GET /health` - Basic health check
- `GET /ready` - Readiness probe
- `GET /metrics` - Prometheus metrics

## Security Considerations

- Keep validator keys secure and backed up
- Use firewall to restrict RPC access
- Enable TLS for production RPC endpoints
- Regularly update to latest releases
- Monitor for consensus anomalies

## Related Documentation

- [Genesis Configuration](./norchain-genesis.md)
- [Smart Contracts](./norchain-contracts.md)
- [Infrastructure](./norchain-infra.md)
- [Network Specifications](../specs/network.md)

## Changelog

### v0.1.0 (Initial)
- Repository created
- Basic structure established

---

*Part of the [NorChain Organization](https://github.com/NorChainOfficial)*

