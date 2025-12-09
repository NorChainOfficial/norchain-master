# NorChain Claude Hooks

This directory contains hooks that run at various points during development with Claude Code.

## Available Hooks

### pre-commit.sh
Runs before git commits to validate:
- No sensitive data (private keys, mnemonics)
- Solidity files have proper license identifiers
- TypeScript files avoid `any` types
- Security token code doesn't enable public trading

**Usage:**
```bash
# Add to git hooks
cp .claude/hooks/pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### post-task.sh
Runs after Claude completes a task to validate:
- Smart contracts: Slither analysis, Solhint linting
- Frontend: TypeScript checks, ESLint
- Backend: TypeScript checks, test suite
- Mobile iOS: SwiftLint
- Mobile Android: ktlint

**Usage:**
```bash
.claude/hooks/post-task.sh contract
.claude/hooks/post-task.sh frontend
.claude/hooks/post-task.sh backend
.claude/hooks/post-task.sh mobile-ios
.claude/hooks/post-task.sh mobile-android
```

### compliance-check.sh
Comprehensive compliance validation:
- No direct FIAT handling
- KYC checks in security token transfers
- No DEX/CEX integration for security tokens
- No hardcoded private keys
- Pause mechanism in security tokens

**Usage:**
```bash
.claude/hooks/compliance-check.sh
```

## Integration with Claude Code

These hooks can be configured to run automatically by adding to `.claude/settings.json`:

```json
{
  "hooks": {
    "enabled": true,
    "configPath": ".claude/hooks/",
    "triggers": {
      "preCommit": "pre-commit.sh",
      "postTask": "post-task.sh",
      "onDemand": ["compliance-check.sh"]
    }
  }
}
```

## Compliance Rules Enforced

1. **NorChain Never Handles FIAT**
   - All FIAT processing through regulated on-ramp partners
   - No direct payment processor integration

2. **Security Token Restrictions**
   - PM-EQ and NV-EQ require KYC for all transfers
   - No public DEX/CEX listing
   - Private P2P marketplace only

3. **Key Security**
   - Never commit private keys or mnemonics
   - Use environment variables for secrets
   - Hardware wallet for production signing

4. **Emergency Controls**
   - All security tokens must have pause mechanism
   - Multi-sig for treasury operations
