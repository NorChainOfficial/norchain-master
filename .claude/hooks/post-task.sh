#!/bin/bash
# NorChain Post-Task Hook
# Runs after Claude completes a task to validate output

set -e

TASK_TYPE="${1:-general}"
AFFECTED_FILES="${2:-}"

echo "📋 Running NorChain post-task validation..."
echo "Task type: $TASK_TYPE"

# Validate based on task type
case "$TASK_TYPE" in
    "contract")
        echo "Validating smart contract changes..."

        # Run slither if available
        if command -v slither &> /dev/null; then
            echo "Running Slither security analysis..."
            slither . --print human-summary || true
        fi

        # Run solhint if available
        if command -v solhint &> /dev/null; then
            echo "Running Solhint linter..."
            solhint 'contracts/**/*.sol' || true
        fi
        ;;

    "frontend")
        echo "Validating frontend changes..."

        # Run TypeScript check if available
        if [ -f "tsconfig.json" ]; then
            echo "Running TypeScript check..."
            npx tsc --noEmit || true
        fi

        # Run ESLint if available
        if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ]; then
            echo "Running ESLint..."
            npx eslint . --ext .ts,.tsx || true
        fi
        ;;

    "backend")
        echo "Validating backend changes..."

        # Run TypeScript check
        if [ -f "tsconfig.json" ]; then
            echo "Running TypeScript check..."
            npx tsc --noEmit || true
        fi

        # Run tests if available
        if [ -f "package.json" ] && grep -q '"test"' package.json; then
            echo "Running tests..."
            npm test || true
        fi
        ;;

    "mobile-ios")
        echo "Validating iOS changes..."

        # Run SwiftLint if available
        if command -v swiftlint &> /dev/null; then
            echo "Running SwiftLint..."
            swiftlint || true
        fi
        ;;

    "mobile-android")
        echo "Validating Android changes..."

        # Run ktlint if available
        if command -v ktlint &> /dev/null; then
            echo "Running ktlint..."
            ktlint || true
        fi
        ;;

    "compliance")
        echo "Validating compliance-related changes..."

        # Check for required compliance markers
        if [ -n "$AFFECTED_FILES" ]; then
            for file in $AFFECTED_FILES; do
                if grep -iE '(transfer|send|receive)' "$file" 2>/dev/null; then
                    echo "⚠️  File $file contains transfer logic - ensure KYC checks are in place"
                fi
            done
        fi
        ;;

    *)
        echo "Running general validation..."
        ;;
esac

echo "✅ Post-task validation complete!"
