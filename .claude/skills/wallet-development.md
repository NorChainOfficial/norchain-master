# Wallet Development Skill

Expert skill for NorChain wallet development across all platforms.

## Skill Identity

This skill provides expertise in:
- Web wallet development (Next.js)
- iOS wallet development (Swift/SwiftUI)
- Android wallet development (Kotlin/Compose)
- Secure key management
- Hardware wallet integration (Ledger)

## Activation Triggers

Activate this skill when:
- Building wallet UI/UX
- Implementing key management
- Adding biometric authentication
- Integrating Ledger hardware wallet
- Creating transaction signing flows

## Platform-Specific Patterns

### Web Wallet (Next.js)

```typescript
// Key management with ethers.js
import { ethers } from 'ethers';

interface WalletState {
  address: string;
  balance: bigint;
  isConnected: boolean;
}

const createWallet = async (): Promise<ethers.Wallet> => {
  const wallet = ethers.Wallet.createRandom();
  // Store encrypted in localStorage/IndexedDB
  return wallet;
};

const signTransaction = async (
  wallet: ethers.Wallet,
  tx: ethers.TransactionRequest
): Promise<string> => {
  return await wallet.signTransaction(tx);
};
```

### iOS Wallet (Swift)

```swift
// Keychain storage pattern
import LocalAuthentication
import Security

class KeychainService {
    static let shared = KeychainService()

    func storePrivateKey(_ key: Data, for address: String) throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: address,
            kSecValueData as String: key,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
        ]
        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw KeychainError.storeFailed(status)
        }
    }

    func authenticateWithBiometrics() async throws -> Bool {
        let context = LAContext()
        return try await context.evaluatePolicy(
            .deviceOwnerAuthenticationWithBiometrics,
            localizedReason: "Unlock your wallet"
        )
    }
}
```

### Android Wallet (Kotlin)

```kotlin
// Android Keystore pattern
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import androidx.biometric.BiometricPrompt

class KeystoreService(private val context: Context) {

    fun generateKey(alias: String): SecretKey {
        val keyGenerator = KeyGenerator.getInstance(
            KeyProperties.KEY_ALGORITHM_AES,
            "AndroidKeyStore"
        )
        keyGenerator.init(
            KeyGenParameterSpec.Builder(
                alias,
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
            )
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setUserAuthenticationRequired(true)
                .build()
        )
        return keyGenerator.generateKey()
    }

    fun authenticateWithBiometrics(
        activity: FragmentActivity,
        onSuccess: () -> Unit
    ) {
        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Unlock Wallet")
            .setNegativeButtonText("Use Password")
            .build()

        BiometricPrompt(activity, executor, callback).authenticate(promptInfo)
    }
}
```

## Ledger Integration

### Bluetooth Pairing (iOS/Android)
```typescript
// Ledger HW connection
import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';

const connectLedger = async (): Promise<Transport> => {
  const transport = await TransportBLE.create();
  return transport;
};
```

### USB Connection (Android)
```kotlin
// USB OTG for Android
import com.ledger.live.common.transport.TransportUSB

suspend fun connectUSB(context: Context): Transport {
    return TransportUSB.create(context)
}
```

## Token Display Rules

| Token | Display | Send | Receive | Details |
|-------|---------|------|---------|---------|
| NOR | ✅ Balance | ✅ Enable | ✅ Enable | Full history |
| PM-EQ | ✅ Balance | ❌ Hide | ✅ Enable | Certificate link |
| NV-EQ | ✅ Balance | ❌ Hide | ✅ Enable | Certificate link |

## Security Requirements

1. **Never expose private keys in memory longer than necessary**
2. **Use secure enclave when available**
3. **Require biometrics for all signing operations**
4. **Verify transaction details before signing**
5. **Support hardware wallet for high-value transactions**

## Context Files

Always reference:
- `/docs/ROADMAP.md` (Phase 4)
- `.claude/agents/norchain-mobile-agent.md`
- `.claude/agents/norchain-frontend-agent.md`

## Usage

```
/skill wallet-development
```
