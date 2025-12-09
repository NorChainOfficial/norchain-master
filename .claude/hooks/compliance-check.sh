#!/bin/bash
# NorChain Compliance Check Hook
# Validates code changes against compliance requirements

set -e

echo "🔒 Running NorChain Compliance Check..."

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

VIOLATIONS=0

# Function to report violation
report_violation() {
    echo -e "${RED}❌ VIOLATION:${NC} $1"
    echo "   File: $2"
    echo "   Line: $3"
    ((VIOLATIONS++))
}

# Function to report warning
report_warning() {
    echo -e "${YELLOW}⚠️  WARNING:${NC} $1"
    echo "   File: $2"
}

# Check 1: No FIAT handling in NorChain code
echo "Checking for FIAT handling violations..."
FIAT_PATTERNS=(
    "stripe"
    "paypal"
    "creditCard"
    "credit_card"
    "bankTransfer"
    "bank_transfer"
    "fiatPayment"
    "fiat_payment"
)

for pattern in "${FIAT_PATTERNS[@]}"; do
    results=$(grep -rn "$pattern" --include="*.ts" --include="*.tsx" --include="*.sol" --include="*.go" 2>/dev/null || true)
    if [ -n "$results" ]; then
        while IFS= read -r line; do
            file=$(echo "$line" | cut -d: -f1)
            linenum=$(echo "$line" | cut -d: -f2)
            report_violation "Direct FIAT handling detected ($pattern). Use on-ramp partners instead." "$file" "$linenum"
        done <<< "$results"
    fi
done

# Check 2: Security tokens must have KYC checks
echo "Checking security token transfer restrictions..."
SECURITY_TOKEN_FILES=$(find . -name "*.sol" -exec grep -l "PM-EQ\|NV-EQ\|SecurityToken" {} \; 2>/dev/null || true)

for file in $SECURITY_TOKEN_FILES; do
    # Check if transfer function exists without KYC check
    if grep -q "function transfer" "$file" && ! grep -q "isVerified\|kycCheck\|whitelist" "$file"; then
        report_violation "Security token transfer without KYC verification" "$file" "N/A"
    fi
done

# Check 3: No DEX/CEX integration for security tokens
echo "Checking for prohibited exchange integrations..."
DEX_PATTERNS=(
    "IUniswapV2Router"
    "IUniswapV3"
    "ISushiSwap"
    "IPancakeSwap"
    "addLiquidity"
    "removeLiquidity"
    "swapExactTokens"
)

for pattern in "${DEX_PATTERNS[@]}"; do
    results=$(grep -rn "$pattern" --include="*.sol" 2>/dev/null || true)
    if [ -n "$results" ]; then
        while IFS= read -r line; do
            file=$(echo "$line" | cut -d: -f1)
            # Only flag if it's a security token file
            if grep -q "PM-EQ\|NV-EQ\|SecurityToken" "$file" 2>/dev/null; then
                linenum=$(echo "$line" | cut -d: -f2)
                report_violation "DEX integration in security token ($pattern)" "$file" "$linenum"
            fi
        done <<< "$results"
    fi
done

# Check 4: Private key exposure
echo "Checking for private key exposure..."
PK_PATTERNS=(
    "privateKey.*=.*['\"]0x"
    "PRIVATE_KEY.*=.*['\"]0x"
    "mnemonic.*=.*['\"]"
)

for pattern in "${PK_PATTERNS[@]}"; do
    results=$(grep -rn "$pattern" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.sol" --include="*.go" 2>/dev/null || true)
    if [ -n "$results" ]; then
        while IFS= read -r line; do
            file=$(echo "$line" | cut -d: -f1)
            linenum=$(echo "$line" | cut -d: -f2)
            report_violation "Hardcoded private key or mnemonic" "$file" "$linenum"
        done <<< "$results"
    fi
done

# Check 5: Ensure pause mechanism in security tokens
echo "Checking for pause mechanism in security tokens..."
for file in $SECURITY_TOKEN_FILES; do
    if ! grep -q "Pausable\|pause\|whenNotPaused" "$file"; then
        report_warning "Security token missing pause mechanism" "$file"
    fi
done

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $VIOLATIONS -eq 0 ]; then
    echo -e "${GREEN}✅ All compliance checks passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Found $VIOLATIONS compliance violation(s)${NC}"
    echo ""
    echo "Please fix the violations before proceeding."
    echo "Refer to docs/LEGAL_COMPLIANCE_ROADMAP.md for guidance."
    exit 1
fi
