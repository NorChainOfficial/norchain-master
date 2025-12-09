#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   gh auth login (ensure your gh session has org repo creation rights)
#   # To exclude optional repos set INCLUDE_OPTIONAL=false
#   export INCLUDE_OPTIONAL="${INCLUDE_OPTIONAL:-true}"
#   ./create-norchain-selected-repos-gh.sh
#
# Requirements:
# - GitHub CLI (gh) installed and authenticated as a user who can create repos in NorChainOfficial.

ORG="NorChainOfficial"
INCLUDE_OPTIONAL="${INCLUDE_OPTIONAL:-true}"

repos=(
"norchain-node|Core NorChain blockchain node software (consensus, networking, state).|public"
"norchain-genesis|Genesis configuration and genesis assets for NorChain network.|public"
"norchain-contracts|Smart contracts (NOR token, governance, staking), RWA templates, payment contracts, bridge contracts, tests and audits.|public"
"norchain-infra|Infrastructure-as-code: Docker, Kubernetes, Terraform, monitoring, CI for running NorChain.|public"
"norchain-wallet-ios|Reference iOS wallet.|public"
"norchain-wallet-android|Reference Android wallet.|public"
"norchain-wallet-web|Browser/web wallet.|public"
)

if [ "$INCLUDE_OPTIONAL" = "true" ]; then
  repos+=(
    "norchain-wallet-core|Shared wallet core libraries (cryptography, key management) for mobile and web wallets.|public"
    "norchain-bridge-hub|Bridge orchestrator for ETH/BSC/Polygon, relayers and monitoring.|private"
    "norchain-compliance-service|KYC/AML integration, risk scoring, sanctions checks.|private"
    "norchain-payments|SmartPay / NorPay backend, escrow orchestration and PSP integrations.|private"
  )
fi

for entry in "${repos[@]}"; do
  IFS='|' read -r repo desc vis <<< "$entry"
  echo "=== Processing $repo ($vis) ==="
  if gh repo view "$ORG/$repo" >/dev/null 2>&1; then
    echo "ALREADY EXISTS: $ORG/$repo"
    gh api repos/"$ORG/$repo" --jq '.'
    echo
    continue
  fi

  if [ "$vis" = "public" ]; then
    visibility="--public"
  else
    visibility="--private"
  fi

  gh repo create "$ORG/$repo" $visibility --description "$desc" --license mit --confirm

  # Overwrite README content with the exact short description (ensure default branch main)
  content_b64=$(printf "%s\n" "$desc" | base64 -w0)
  gh api --method PUT /repos/"$ORG"/"$repo"/contents/README.md -f message="Initial README" -f content="$content_b64" -f branch=main

  echo "Created $ORG/$repo"
  echo
done

echo "Done. Review output above for per-repo success and any gh/HTTP errors."