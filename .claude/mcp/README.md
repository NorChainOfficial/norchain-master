# NorChain MCP Server Configuration

This directory contains comprehensive Model Context Protocol (MCP) server configurations for NorChain ecosystem development tools.

## Available Servers (11 total)

### 1. norchain-blockchain
Core blockchain interaction (12 tools):
- `nor_getBlockNumber` - Get current block number
- `nor_getBlock` - Get block by number or hash
- `nor_getBalance` - Get NOR balance
- `nor_getTransaction` - Get transaction details
- `nor_getTransactionReceipt` - Get receipt with logs
- `nor_sendRawTransaction` - Submit signed transaction
- `nor_estimateGas` - Estimate gas
- `nor_gasPrice` - Get current gas price
- `nor_getCode` - Get contract bytecode
- `nor_call` - Execute read-only call
- `nor_getLogs` - Get event logs
- `nor_getTransactionCount` - Get nonce

### 2. norchain-validator
Validator and consensus (6 tools):
- `validator_list` - Get active validators
- `validator_info` - Get validator details
- `validator_stake` - Get staking info
- `validator_rewards` - Get rewards history
- `validator_slashing` - Get slashing events
- `consensus_epoch` - Get epoch info

### 3. norchain-contracts
Smart contract development (9 tools):
- `contract_compile` - Compile with Hardhat
- `contract_deploy` - Deploy to network
- `contract_verify` - Verify on explorer
- `contract_test` - Run tests
- `contract_abi` - Get ABI
- `contract_encode` - Encode function call
- `contract_decode` - Decode data/logs
- `contract_slither` - Security analysis
- `contract_size` - Check bytecode size

### 4. norchain-tokens
Token operations (5 tools):
- `token_info` - Get token metadata
- `token_balance` - Get balance
- `token_holders` - List holders
- `token_transfers` - Transfer history
- `token_allowance` - Check allowance

### 5. norchain-compliance
KYC/AML compliance (9 tools):
- `kyc_status` - Check KYC status
- `kyc_details` - Get KYC details
- `whitelist_check` - Check whitelist
- `whitelist_list` - List whitelisted
- `sanctions_check` - Sanctions screening
- `risk_score` - Get risk score
- `compliance_report` - Generate reports
- `audit_trail` - Get audit trail
- `investor_registry` - Query registry

### 6. norchain-smartpay
Payment processing (8 tools):
- `smartpay_create` - Create payment session
- `smartpay_status` - Get session status
- `smartpay_escrow_balance` - Check escrow
- `smartpay_release` - Release tokens
- `smartpay_refund` - Process refund
- `smartpay_history` - Payment history
- `onramp_providers` - List providers
- `onramp_quote` - Get quote

### 7. norchain-certificates
Certificate management (4 tools):
- `certificate_get` - Get certificate
- `certificate_verify` - Verify hash
- `certificate_history` - Amendment history
- `certificate_download` - Download URL

### 8. norchain-explorer
Block explorer API (7 tools):
- `explorer_search` - Search all types
- `explorer_stats` - Network stats
- `explorer_address` - Address details
- `explorer_contract` - Contract details
- `explorer_blocks` - Recent blocks
- `explorer_transactions` - Recent transactions
- `explorer_charts` - Chart data

### 9. norchain-wallet
Wallet development (4 tools):
- `wallet_create` - Create wallet
- `wallet_import` - Import wallet
- `wallet_sign` - Sign message/tx
- `wallet_faucet` - Request test NOR

### 10. norchain-admin
Admin operations (6 tools):
- `admin_pause_token` - Pause transfers
- `admin_unpause_token` - Unpause transfers
- `admin_whitelist_add` - Add to whitelist
- `admin_whitelist_remove` - Remove from whitelist
- `admin_treasury_balance` - Treasury balances
- `admin_multisig_pending` - Pending multisig

### 11. norchain-dev
Development utilities (9 tools):
- `dev_node_start` - Start local node
- `dev_node_stop` - Stop node
- `dev_node_reset` - Reset state
- `dev_mine` - Mine blocks
- `dev_set_balance` - Set balance
- `dev_impersonate` - Impersonate account
- `dev_snapshot` - Create snapshot
- `dev_revert` - Revert to snapshot
- `dev_trace` - Transaction trace

## Network Configuration

| Network | Chain ID | RPC URL | Explorer |
|---------|----------|---------|----------|
| Mainnet | 8453 | https://rpc.norchain.org | https://explorer.norchain.org |
| Testnet | 84531 | https://testnet-rpc.norchain.org | https://testnet-explorer.norchain.org |
| Devnet | 31337 | http://localhost:8545 | http://localhost:3000 |

## On-Ramp Providers

| Provider | Currencies | Countries |
|----------|------------|-----------|
| MoonPay | USD, EUR, GBP, CAD, AUD | US, EU, UK, CA, AU |
| Transak | USD, EUR, GBP, INR | US, EU, UK, IN |
| Ramp Network | EUR, GBP, PLN | EU, UK, PL |
| Banxa | USD, EUR, AUD, CAD | US, EU, AU, CA |

## Usage

Add to your `.claude/settings.json`:

```json
{
  "mcp": {
    "servers": {
      "norchain": {
        "config": ".claude/mcp/norchain-tools.json"
      }
    }
  }
}
```

## Contract Addresses

Contract addresses are stored in the configuration and will be populated after deployment:
- NOR Token
- PM-EQ Token
- NV-EQ Token
- Investor Registry
- Certificate Registry
- SmartPay Escrow
- Distribution Vault
- Treasury

## Implementation Notes

These tool definitions are specifications. Implementations require:

1. **Backend Services**: NestJS services exposing endpoints
2. **Authentication**: API keys for production networks
3. **Rate Limiting**: Per-user limits for production
4. **WebSocket**: Real-time subscriptions for explorer

## Security Considerations

- Never commit API keys or private keys
- Use environment variables for secrets
- Mainnet operations require additional confirmation
- Compliance tools require proper authorization
- Admin tools are restricted to authorized roles
