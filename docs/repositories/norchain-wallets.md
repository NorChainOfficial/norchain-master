# NorChain Wallets

> Platform-specific wallet implementations

This document covers the three platform-specific wallet repositories:
- `norchain-wallet-ios`
- `norchain-wallet-android`
- `norchain-wallet-web`

All wallets share the `norchain-wallet-core` library for cryptographic operations.

---

## norchain-wallet-ios

### Overview

| Attribute | Value |
|-----------|-------|
| **Repository** | [NorChainOfficial/norchain-wallet-ios](https://github.com/NorChainOfficial/norchain-wallet-ios) |
| **Visibility** | 🟢 Public |
| **License** | MIT |
| **Platform** | iOS 15.0+ |
| **Language** | Swift 5.9 |

### Architecture

```
norchain-wallet-ios/
├── NorWallet/
│   ├── App/
│   │   ├── NorWalletApp.swift        # App entry
│   │   ├── AppDelegate.swift         # App lifecycle
│   │   └── SceneDelegate.swift       # Scene management
│   ├── Features/
│   │   ├── Onboarding/
│   │   │   ├── OnboardingView.swift
│   │   │   ├── CreateWalletView.swift
│   │   │   └── ImportWalletView.swift
│   │   ├── Dashboard/
│   │   │   ├── DashboardView.swift
│   │   │   ├── BalanceCard.swift
│   │   │   └── RecentActivity.swift
│   │   ├── Send/
│   │   │   ├── SendView.swift
│   │   │   ├── RecipientInput.swift
│   │   │   └── AmountInput.swift
│   │   ├── Receive/
│   │   │   ├── ReceiveView.swift
│   │   │   └── QRCodeView.swift
│   │   ├── History/
│   │   │   ├── HistoryView.swift
│   │   │   └── TransactionRow.swift
│   │   ├── Tokens/
│   │   │   ├── TokenListView.swift
│   │   │   └── TokenDetailView.swift
│   │   ├── DApps/
│   │   │   ├── DAppBrowser.swift
│   │   │   └── WalletConnect.swift
│   │   └── Settings/
│   │       ├── SettingsView.swift
│   │       ├── SecuritySettings.swift
│   │       └── NetworkSettings.swift
│   ├── Core/
│   │   ├── Crypto/
│   │   │   └── WalletManager.swift
│   │   ├── Network/
│   │   │   ├── APIClient.swift
│   │   │   └── RPCClient.swift
│   │   ├── Storage/
│   │   │   ├── KeychainManager.swift
│   │   │   └── UserDefaults+.swift
│   │   └── Models/
│   │       ├── Account.swift
│   │       ├── Transaction.swift
│   │       └── Token.swift
│   ├── UI/
│   │   ├── Components/
│   │   │   ├── PrimaryButton.swift
│   │   │   ├── AddressLabel.swift
│   │   │   └── LoadingView.swift
│   │   └── Styles/
│   │       └── Theme.swift
│   └── Resources/
│       ├── Assets.xcassets
│       └── Localizable.strings
├── NorWalletTests/
├── NorWalletUITests/
└── NorWallet.xcodeproj
```

### Tech Stack

| Component | Technology |
|-----------|------------|
| UI Framework | SwiftUI |
| State Management | Combine + ObservableObject |
| Networking | URLSession + async/await |
| Local Storage | Keychain Services |
| Biometrics | LocalAuthentication |
| QR Codes | CoreImage |

### Key Features

- **Secure Key Storage** - Keychain with biometric protection
- **Face ID / Touch ID** - Biometric authentication for transactions
- **WalletConnect v2** - dApp connectivity
- **Multi-account** - Multiple account support
- **Token Management** - ERC-20 token support
- **Transaction History** - Full transaction history with filtering
- **Network Switching** - Mainnet/Testnet toggle

### Development Setup

```bash
# Clone repository
git clone https://github.com/NorChainOfficial/norchain-wallet-ios.git

# Open in Xcode
open NorWallet.xcodeproj

# Install dependencies (if using CocoaPods)
pod install
open NorWallet.xcworkspace

# Run on simulator
# Select target device and press Cmd+R
```

---

## norchain-wallet-android

### Overview

| Attribute | Value |
|-----------|-------|
| **Repository** | [NorChainOfficial/norchain-wallet-android](https://github.com/NorChainOfficial/norchain-wallet-android) |
| **Visibility** | 🟢 Public |
| **License** | MIT |
| **Platform** | Android 8.0+ (API 26) |
| **Language** | Kotlin 1.9 |

### Architecture

```
norchain-wallet-android/
├── app/
│   ├── src/main/
│   │   ├── java/com/norchain/wallet/
│   │   │   ├── NorWalletApp.kt            # Application class
│   │   │   ├── MainActivity.kt            # Main activity
│   │   │   ├── ui/
│   │   │   │   ├── theme/
│   │   │   │   │   ├── Color.kt
│   │   │   │   │   ├── Theme.kt
│   │   │   │   │   └── Type.kt
│   │   │   │   ├── navigation/
│   │   │   │   │   └── NavGraph.kt
│   │   │   │   ├── onboarding/
│   │   │   │   │   ├── OnboardingScreen.kt
│   │   │   │   │   └── OnboardingViewModel.kt
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── DashboardScreen.kt
│   │   │   │   │   └── DashboardViewModel.kt
│   │   │   │   ├── send/
│   │   │   │   │   ├── SendScreen.kt
│   │   │   │   │   └── SendViewModel.kt
│   │   │   │   ├── receive/
│   │   │   │   │   └── ReceiveScreen.kt
│   │   │   │   ├── history/
│   │   │   │   │   ├── HistoryScreen.kt
│   │   │   │   │   └── HistoryViewModel.kt
│   │   │   │   └── settings/
│   │   │   │       └── SettingsScreen.kt
│   │   │   ├── data/
│   │   │   │   ├── repository/
│   │   │   │   │   ├── WalletRepository.kt
│   │   │   │   │   └── TransactionRepository.kt
│   │   │   │   ├── network/
│   │   │   │   │   ├── ApiService.kt
│   │   │   │   │   └── RpcClient.kt
│   │   │   │   └── local/
│   │   │   │       ├── WalletDatabase.kt
│   │   │   │       └── PreferencesManager.kt
│   │   │   ├── domain/
│   │   │   │   ├── model/
│   │   │   │   │   ├── Account.kt
│   │   │   │   │   └── Transaction.kt
│   │   │   │   └── usecase/
│   │   │   │       ├── CreateWalletUseCase.kt
│   │   │   │       └── SendTransactionUseCase.kt
│   │   │   └── crypto/
│   │   │       ├── KeystoreManager.kt
│   │   │       └── BiometricManager.kt
│   │   └── res/
│   │       ├── values/
│   │       └── drawable/
│   └── build.gradle.kts
├── core/                                  # Core module
├── buildSrc/
└── gradle/
```

### Tech Stack

| Component | Technology |
|-----------|------------|
| UI Framework | Jetpack Compose |
| Architecture | MVVM + Clean Architecture |
| DI | Hilt |
| Networking | Retrofit + OkHttp |
| Local Storage | Room + DataStore |
| Biometrics | BiometricPrompt |
| Async | Kotlin Coroutines + Flow |

### Key Features

- **Material You** - Dynamic theming support
- **Fingerprint / Face Unlock** - Biometric authentication
- **WalletConnect v2** - dApp connectivity
- **Deep Links** - Payment request handling
- **Widgets** - Home screen balance widget
- **Notifications** - Transaction notifications

### Development Setup

```bash
# Clone repository
git clone https://github.com/NorChainOfficial/norchain-wallet-android.git

# Open in Android Studio
# File > Open > Select project directory

# Sync Gradle
./gradlew build

# Run on emulator or device
./gradlew installDebug
```

### Gradle Dependencies

```kotlin
// build.gradle.kts (app)
dependencies {
    // Compose
    implementation(platform("androidx.compose:compose-bom:2024.01.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    
    // Architecture
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
    implementation("com.google.dagger:hilt-android:2.48")
    
    // Network
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    
    // Local
    implementation("androidx.room:room-ktx:2.6.1")
    implementation("androidx.datastore:datastore-preferences:1.0.0")
    
    // NorChain
    implementation("io.norchain:wallet-core:1.0.0")
}
```

---

## norchain-wallet-web

### Overview

| Attribute | Value |
|-----------|-------|
| **Repository** | [NorChainOfficial/norchain-wallet-web](https://github.com/NorChainOfficial/norchain-wallet-web) |
| **Visibility** | 🟢 Public |
| **License** | MIT |
| **Platform** | Chrome, Firefox, Safari, Edge |
| **Language** | TypeScript |

### Architecture

```
norchain-wallet-web/
├── src/
│   ├── app/                              # Next.js app router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/
│   │   │   ├── create/page.tsx
│   │   │   ├── import/page.tsx
│   │   │   └── unlock/page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── send/
│   │   │   └── page.tsx
│   │   ├── receive/
│   │   │   └── page.tsx
│   │   ├── history/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   ├── wallet/
│   │   │   ├── BalanceDisplay.tsx
│   │   │   ├── AddressDisplay.tsx
│   │   │   ├── TransactionList.tsx
│   │   │   └── TokenList.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   ├── features/
│   │   ├── wallet/
│   │   │   ├── WalletProvider.tsx
│   │   │   ├── useWallet.ts
│   │   │   └── walletSlice.ts
│   │   ├── transaction/
│   │   │   └── useTransaction.ts
│   │   └── dapp/
│   │       ├── DAppConnector.tsx
│   │       └── useDApp.ts
│   ├── lib/
│   │   ├── crypto/
│   │   │   └── index.ts
│   │   ├── storage/
│   │   │   ├── indexeddb.ts
│   │   │   └── encryption.ts
│   │   └── api/
│   │       └── client.ts
│   ├── hooks/
│   │   ├── useBalance.ts
│   │   └── useNetwork.ts
│   └── types/
│       └── index.ts
├── extension/                            # Browser extension
│   ├── manifest.json
│   ├── background/
│   │   └── index.ts
│   ├── content/
│   │   └── injected.ts
│   └── popup/
│       ├── index.html
│       └── App.tsx
├── public/
├── package.json
└── next.config.ts
```

### Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 |
| UI Library | React 18 |
| Styling | Tailwind CSS |
| State | Zustand |
| Storage | IndexedDB + Web Crypto |
| Extension | WebExtension APIs |

### Key Features

- **Hosted Wallet** - Full-featured web wallet at wallet.norchain.org
- **Browser Extension** - Chrome/Firefox extension for dApp connectivity
- **EIP-1193** - Standard provider interface for dApps
- **WalletConnect** - QR-based dApp connections
- **Hardware Wallet** - Ledger/Trezor support
- **Multi-tab Sync** - State synchronization across tabs

### Extension Manifest

```json
{
  "manifest_version": 3,
  "name": "NorChain Wallet",
  "version": "1.0.0",
  "description": "Official NorChain wallet browser extension",
  "permissions": [
    "storage",
    "activeTab",
    "scripting"
  ],
  "action": {
    "default_popup": "popup/index.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background/index.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content/injected.js"],
      "run_at": "document_start"
    }
  ]
}
```

### Development Setup

```bash
# Clone repository
git clone https://github.com/NorChainOfficial/norchain-wallet-web.git
cd norchain-wallet-web

# Install dependencies
npm install

# Run development server (web app)
npm run dev

# Build extension
npm run build:extension

# Load extension in Chrome
# 1. Go to chrome://extensions
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select extension/dist folder
```

### Provider API (dApp Integration)

```typescript
// dApp integration example
if (typeof window.norchain !== 'undefined') {
  // Request account access
  const accounts = await window.norchain.request({
    method: 'eth_requestAccounts'
  });
  
  // Get current chain
  const chainId = await window.norchain.request({
    method: 'eth_chainId'
  });
  
  // Send transaction
  const txHash = await window.norchain.request({
    method: 'eth_sendTransaction',
    params: [{
      from: accounts[0],
      to: '0xRecipient...',
      value: '0x38D7EA4C68000' // 0.001 NOR
    }]
  });
  
  // Listen for events
  window.norchain.on('accountsChanged', (accounts) => {
    console.log('Accounts changed:', accounts);
  });
  
  window.norchain.on('chainChanged', (chainId) => {
    console.log('Chain changed:', chainId);
  });
}
```

---

## Common Features Across All Wallets

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| Create Wallet | ✅ | ✅ | ✅ |
| Import Mnemonic | ✅ | ✅ | ✅ |
| Import Private Key | ✅ | ✅ | ✅ |
| Multi-Account | ✅ | ✅ | ✅ |
| Biometric Auth | ✅ | ✅ | ❌ |
| Password Protection | ✅ | ✅ | ✅ |
| Send NOR | ✅ | ✅ | ✅ |
| Send Tokens | ✅ | ✅ | ✅ |
| QR Scanner | ✅ | ✅ | ✅ |
| QR Display | ✅ | ✅ | ✅ |
| Transaction History | ✅ | ✅ | ✅ |
| Token List | ✅ | ✅ | ✅ |
| WalletConnect | ✅ | ✅ | ✅ |
| dApp Browser | ✅ | ✅ | ✅ |
| Network Switch | ✅ | ✅ | ✅ |
| Hardware Wallet | ❌ | ❌ | ✅ |
| Browser Extension | ❌ | ❌ | ✅ |

---

## Security Considerations

### Key Storage

| Platform | Method | Protection |
|----------|--------|------------|
| iOS | Keychain | Secure Enclave, Face ID |
| Android | Keystore | TEE, Biometric |
| Web | IndexedDB | AES-256-GCM, Password |

### Best Practices

1. **Seed Phrase Backup** - Encourage users to backup on first launch
2. **No Cloud Backup** - Keys never leave device
3. **Biometric Fallback** - PIN fallback for biometric failures
4. **Session Timeout** - Auto-lock after inactivity
5. **Phishing Protection** - Domain verification for dApps

---

*Part of the [NorChain Organization](https://github.com/NorChainOfficial)*

