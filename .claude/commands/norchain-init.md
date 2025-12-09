# NorChain Repository Initialization

Initialize a new NorChain ecosystem repository with proper structure.

## Arguments
- `$ARGUMENTS` - Repository type: "blockchain", "contract", "backend", "frontend", "mobile-ios", "mobile-android", "portal"

## Instructions

Based on the repository type, create the appropriate structure following NorChain standards.

## Repository Templates

### blockchain
```
├── cmd/                    # CLI entry points
├── consensus/              # Consensus implementation
├── network/                # P2P networking
├── state/                  # State management
├── rpc/                    # JSON-RPC interface
├── config/                 # Configuration
└── tests/                  # Test suites
```

### contract
```
├── contracts/              # Solidity contracts
├── test/                   # Test suites
├── scripts/                # Deployment scripts
├── audits/                 # Audit reports
└── hardhat.config.ts
```

### backend (NestJS)
```
├── src/
│   ├── modules/            # Feature modules
│   ├── common/             # Shared utilities
│   └── config/             # Configuration
├── test/
├── prisma/                 # Database schema
└── package.json
```

### frontend (Next.js)
```
├── src/
│   ├── app/                # Next.js app router
│   ├── components/         # UI components
│   ├── features/           # Feature modules
│   ├── lib/                # Utilities
│   └── hooks/              # React hooks
├── public/
└── package.json
```

### mobile-ios (Swift)
```
├── [AppName]/
│   ├── App/                # App entry
│   ├── Features/           # Feature modules
│   ├── Core/               # Crypto, network
│   └── Resources/          # Assets
├── [AppName]Tests/
└── [AppName].xcodeproj
```

### mobile-android (Kotlin)
```
├── app/
│   ├── src/main/java/
│   │   ├── ui/             # Compose UI
│   │   ├── data/           # Data layer
│   │   └── crypto/         # Crypto operations
│   └── src/main/res/
├── core/                   # Core module
└── build.gradle.kts
```

### portal (RWA Company Portal)
```
├── src/
│   ├── app/                # Next.js app
│   ├── features/
│   │   ├── dashboard/      # Investor dashboard
│   │   ├── purchase/       # SmartPay purchase
│   │   ├── documents/      # Document vault
│   │   ├── marketplace/    # P2P trading
│   │   └── certificates/   # Certificate downloads
│   └── components/
└── package.json
```

## Output

1. Create the directory structure
2. Generate a CLAUDE.md specific to that repo type
3. Generate a README.md with NorChain branding
4. Link to master documentation
