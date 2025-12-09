#!/bin/bash
# NorChain Pre-Commit Hook
# Validates code before committing to ensure compliance and quality

set -e

echo "🔍 Running NorChain pre-commit checks..."

# Check for sensitive data
echo "Checking for sensitive data..."
SENSITIVE_PATTERNS=(
    "PRIVATE_KEY"
    "SECRET_KEY"
    "API_KEY"
    "mnemonic"
    "0x[a-fA-F0-9]{64}"  # Private keys
)

for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    if git diff --cached --name-only | xargs grep -l "$pattern" 2>/dev/null; then
        echo "❌ ERROR: Found sensitive data pattern: $pattern"
        echo "Please remove sensitive data before committing."
        exit 1
    fi
done

# Check Solidity files
SOLIDITY_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.sol$' || true)
if [ -n "$SOLIDITY_FILES" ]; then
    echo "Checking Solidity files..."

    # Check for proper license identifier
    for file in $SOLIDITY_FILES; do
        if ! grep -q "SPDX-License-Identifier" "$file"; then
            echo "❌ ERROR: Missing SPDX license identifier in $file"
            exit 1
        fi
    done

    # Check for proper Solidity version
    for file in $SOLIDITY_FILES; do
        if ! grep -q "pragma solidity" "$file"; then
            echo "❌ ERROR: Missing pragma solidity in $file"
            exit 1
        fi
    done

    echo "✅ Solidity checks passed"
fi

# Check TypeScript files
TS_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx)$' || true)
if [ -n "$TS_FILES" ]; then
    echo "Checking TypeScript files..."

    # Check for 'any' type usage
    for file in $TS_FILES; do
        if grep -E ': any\b|<any>' "$file" 2>/dev/null; then
            echo "⚠️  WARNING: Found 'any' type in $file"
            echo "Consider using proper types for better type safety."
        fi
    done

    echo "✅ TypeScript checks passed"
fi

# Check for compliance violations in security token code
SECURITY_TOKEN_FILES=$(git diff --cached --name-only | grep -E '(PM-EQ|NV-EQ|security|token)' || true)
if [ -n "$SECURITY_TOKEN_FILES" ]; then
    echo "Checking security token compliance..."

    for file in $SECURITY_TOKEN_FILES; do
        # Check for public trading enablement
        if grep -iE '(uniswap|sushiswap|dex|exchange\.add|listing)' "$file" 2>/dev/null; then
            echo "❌ ERROR: Potential public trading code in $file"
            echo "Security tokens (PM-EQ, NV-EQ) cannot be listed on public exchanges."
            exit 1
        fi
    done

    echo "✅ Compliance checks passed"
fi

echo "✅ All pre-commit checks passed!"
