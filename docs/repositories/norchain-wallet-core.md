# norchain-wallet-core

> Shared wallet core libraries

## Overview

| Attribute | Value |
|-----------|-------|
| **Repository** | [NorChainOfficial/norchain-wallet-core](https://github.com/NorChainOfficial/norchain-wallet-core) |
| **Visibility** | 🟢 Public |
| **License** | MIT |
| **Created** | December 9, 2025 |
| **Default Branch** | main |
| **Category** | Wallet |

## Description

The `norchain-wallet-core` repository provides shared cryptographic libraries and key management utilities used across all NorChain wallet implementations (iOS, Android, Web).

## Architecture

```
norchain-wallet-core/
├── src/
│   ├── crypto/
│   │   ├── index.ts
│   │   ├── hd-wallet.ts          # BIP-32/39/44 HD wallet
│   │   ├── secp256k1.ts          # Elliptic curve operations
│   │   ├── ed25519.ts            # EdDSA operations
│   │   ├── encryption.ts         # AES-256-GCM encryption
│   │   ├── hash.ts               # Hashing utilities
│   │   └── random.ts             # Secure random generation
│   ├── keystore/
│   │   ├── index.ts
│   │   ├── keyring.ts            # Key management
│   │   ├── secure-storage.ts     # Storage interface
│   │   └── backup.ts             # Backup/recovery
│   ├── transaction/
│   │   ├── index.ts
│   │   ├── builder.ts            # Transaction builder
│   │   ├── signer.ts             # Transaction signing
│   │   └── serializer.ts         # RLP serialization
│   ├── network/
│   │   ├── index.ts
│   │   ├── provider.ts           # RPC provider
│   │   ├── types.ts              # Network types
│   │   └── chains.ts             # Chain configurations
│   ├── address/
│   │   ├── index.ts
│   │   ├── generator.ts          # Address generation
│   │   ├── checksum.ts           # EIP-55 checksum
│   │   └── validation.ts         # Address validation
│   └── utils/
│       ├── index.ts
│       ├── encoding.ts           # Hex/Base64 encoding
│       ├── bignumber.ts          # BigNumber utilities
│       └── units.ts              # Unit conversions
├── bindings/
│   ├── swift/                    # Swift bindings (iOS)
│   │   ├── Package.swift
│   │   └── Sources/
│   ├── kotlin/                   # Kotlin bindings (Android)
│   │   ├── build.gradle.kts
│   │   └── src/
│   └── wasm/                     # WebAssembly (Web)
│       ├── Cargo.toml
│       └── src/
├── tests/
│   ├── crypto.test.ts
│   ├── keystore.test.ts
│   └── transaction.test.ts
├── package.json
└── tsconfig.json
```

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Core Language | TypeScript | 5.0+ |
| Crypto (Native) | Rust | 1.70+ |
| iOS Bindings | Swift | 5.9+ |
| Android Bindings | Kotlin | 1.9+ |
| WASM | wasm-bindgen | - |
| Testing | Vitest | - |

## Core Features

### HD Wallet Support

```typescript
import { HDWallet, Mnemonic } from '@norchain/wallet-core';

// Generate new mnemonic (BIP-39)
const mnemonic = Mnemonic.generate(256); // 24 words
console.log(mnemonic.phrase);

// Create HD wallet from mnemonic
const wallet = HDWallet.fromMnemonic(mnemonic.phrase);

// Derive accounts (BIP-44)
// m/44'/8453'/0'/0/0 - First NorChain account
const account = wallet.deriveAccount(0);
console.log(account.address);
console.log(account.publicKey);

// Derive multiple accounts
const accounts = wallet.deriveAccounts(0, 5); // 5 accounts
```

### Key Management

```typescript
import { Keyring, SecureStorage } from '@norchain/wallet-core';

// Initialize keyring with secure storage
const storage = new SecureStorage({
  platform: 'web', // or 'ios', 'android'
  encryptionKey: userPassword
});

const keyring = new Keyring(storage);

// Import wallet
await keyring.importWallet({
  name: 'My Wallet',
  mnemonic: 'word1 word2 ...',
  password: 'strongPassword'
});

// Get account
const account = await keyring.getAccount(0);

// Sign transaction
const signature = await keyring.signTransaction(account.address, txHash);
```

### Transaction Building

```typescript
import { TransactionBuilder, Unit } from '@norchain/wallet-core';

// Create transaction builder
const builder = new TransactionBuilder({
  chainId: 8453,
  provider: 'https://rpc.norchain.org'
});

// Build transfer transaction
const tx = await builder
  .transfer()
  .from('0xSenderAddress...')
  .to('0xRecipientAddress...')
  .value(Unit.toWei('1.5', 'nor'))
  .gasLimit(21000)
  .build();

// Sign and send
const signedTx = await keyring.signTransaction(tx);
const txHash = await provider.sendTransaction(signedTx);
```

### Address Utilities

```typescript
import { Address } from '@norchain/wallet-core';

// Validate address
Address.isValid('0x742d35Cc6634C0532925a3b844Bc9e7595f...'); // true

// Convert to checksum
const checksummed = Address.toChecksum('0x742d35cc6634c0532925a3b844bc9e7595f...');

// Get address from public key
const address = Address.fromPublicKey(publicKeyBytes);

// Parse ENS (if supported)
const resolved = await Address.resolve('user.nor');
```

## Platform Bindings

### iOS (Swift)

```swift
import NorWalletCore

// Create wallet
let mnemonic = try Mnemonic.generate(strength: .bits256)
let wallet = try HDWallet(mnemonic: mnemonic.phrase)

// Derive account
let account = try wallet.deriveAccount(index: 0)
print("Address: \(account.address)")

// Sign message
let signature = try account.signMessage("Hello NorChain".data(using: .utf8)!)
```

### Android (Kotlin)

```kotlin
import io.norchain.walletcore.*

// Create wallet
val mnemonic = Mnemonic.generate(Strength.BITS_256)
val wallet = HDWallet.fromMnemonic(mnemonic.phrase)

// Derive account
val account = wallet.deriveAccount(0)
println("Address: ${account.address}")

// Sign transaction
val signature = account.signTransaction(txBytes)
```

### Web (WASM)

```typescript
import init, { WalletCore } from '@norchain/wallet-core-wasm';

// Initialize WASM module
await init();

// Create wallet
const core = new WalletCore();
const mnemonic = core.generateMnemonic(256);
const wallet = core.createWallet(mnemonic);

// Derive account
const account = wallet.deriveAccount(0);
console.log(`Address: ${account.address}`);
```

## API Reference

### Mnemonic

| Method | Description |
|--------|-------------|
| `generate(bits: number)` | Generate new mnemonic (128/256 bits) |
| `validate(phrase: string)` | Validate mnemonic phrase |
| `toSeed(phrase: string, password?: string)` | Convert to seed bytes |

### HDWallet

| Method | Description |
|--------|-------------|
| `fromMnemonic(phrase: string)` | Create from mnemonic |
| `fromSeed(seed: Uint8Array)` | Create from seed bytes |
| `deriveAccount(index: number)` | Derive account at index |
| `deriveAccounts(start: number, count: number)` | Derive multiple accounts |
| `derivePath(path: string)` | Derive at custom path |

### Account

| Property | Type | Description |
|----------|------|-------------|
| `address` | `string` | Checksummed address |
| `publicKey` | `Uint8Array` | Public key bytes |
| `path` | `string` | Derivation path |

| Method | Description |
|--------|-------------|
| `signMessage(message: Uint8Array)` | Sign arbitrary message |
| `signTransaction(tx: Transaction)` | Sign transaction |
| `verify(message: Uint8Array, signature: Uint8Array)` | Verify signature |

### TransactionBuilder

| Method | Description |
|--------|-------------|
| `transfer()` | Start transfer transaction |
| `contractCall(address: string)` | Start contract call |
| `from(address: string)` | Set sender |
| `to(address: string)` | Set recipient |
| `value(amount: BigNumber)` | Set transfer value |
| `data(bytes: Uint8Array)` | Set call data |
| `gasLimit(limit: number)` | Set gas limit |
| `gasPrice(price: BigNumber)` | Set gas price |
| `nonce(nonce: number)` | Set nonce |
| `build()` | Build transaction |

## Security

### Key Storage

- **iOS**: Keychain Services with biometric protection
- **Android**: Android Keystore with biometric authentication
- **Web**: IndexedDB with AES-256-GCM encryption

### Best Practices

1. Never expose private keys in logs
2. Use secure random number generation
3. Clear sensitive data from memory after use
4. Require biometric/PIN for signing operations
5. Implement key derivation with strong passwords

### Audit Status

| Auditor | Date | Status |
|---------|------|--------|
| TBD | TBD | Pending |

## Development

### Prerequisites

```bash
# Node.js 18+
nvm install 18
nvm use 18

# Rust (for native bindings)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install dependencies
npm install
```

### Building

```bash
# Build TypeScript
npm run build

# Build WASM bindings
npm run build:wasm

# Build iOS bindings
npm run build:ios

# Build Android bindings
npm run build:android

# Build all
npm run build:all
```

### Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Test specific platform
npm run test:wasm
```

## Installation

### npm (TypeScript)

```bash
npm install @norchain/wallet-core
```

### CocoaPods (iOS)

```ruby
pod 'NorWalletCore', '~> 1.0'
```

### Swift Package Manager

```swift
dependencies: [
    .package(url: "https://github.com/NorChainOfficial/norchain-wallet-core.git", from: "1.0.0")
]
```

### Gradle (Android)

```kotlin
implementation("io.norchain:wallet-core:1.0.0")
```

## Dependencies

| Repository | Relationship |
|------------|--------------|
| `norchain-wallet-ios` | Imports as dependency |
| `norchain-wallet-android` | Imports as dependency |
| `norchain-wallet-web` | Imports as dependency |

---

*Part of the [NorChain Organization](https://github.com/NorChainOfficial)*

