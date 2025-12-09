import * as fs from 'fs'
import * as path from 'path'

const DOCS_DIR = path.join(__dirname, '../../docs')
const DATA_DIR = path.join(__dirname, '../src/data')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

interface Phase {
  id: number
  name: string
  focus: string
  duration: string
  status: 'pending' | 'active' | 'complete'
  progress: number
  deliverables: Array<{ name: string; status: string; description?: string }>
}

interface Task {
  id: string
  title: string
  role: string
  phase: number
  priority: 'high' | 'medium' | 'low'
  complexity: 'high' | 'medium' | 'low'
  status: 'backlog' | 'in_progress' | 'review' | 'done'
}

interface Repository {
  name: string
  description: string
  url: string
  visibility: 'public' | 'private'
  category: string
  phase: number
}

interface Token {
  symbol: string
  name: string
  type: 'utility' | 'security'
  tradability: 'public' | 'private'
  kycRequired: boolean
  description: string
}

interface ComplianceItem {
  id: string
  category: string
  item: string
  status: 'complete' | 'in_progress' | 'pending'
  required: boolean
}

// Parse phases from ROADMAP.md
function parsePhases(): Phase[] {
  const phases: Phase[] = [
    {
      id: 1,
      name: 'Blockchain Core',
      focus: 'Core blockchain infrastructure',
      duration: '0-6 weeks',
      status: 'active',
      progress: 15,
      deliverables: [
        { name: 'NorChain L1 (PoSA)', status: 'in_progress', description: 'Finalize consensus mechanism' },
        { name: 'Validators', status: 'pending', description: 'Minimum 5-7 validators running' },
        { name: 'P2P Health Checks', status: 'pending', description: 'Network stability monitoring' },
        { name: 'RPC Gateway', status: 'pending', description: 'Nginx + SSL secured endpoints' },
        { name: 'Genesis File', status: 'complete', description: 'Finalized genesis configuration' },
        { name: 'Monitoring', status: 'pending', description: 'Prometheus + Grafana alerting' },
      ],
    },
    {
      id: 2,
      name: 'NorExplorer',
      focus: 'Block explorer',
      duration: '2-4 weeks',
      status: 'pending',
      progress: 0,
      deliverables: [
        { name: 'Block Explorer UI', status: 'pending', description: 'NorExplorer frontend' },
        { name: 'Transaction History', status: 'pending', description: 'Full TX search and display' },
        { name: 'Address Pages', status: 'pending', description: 'Balance, history, tokens' },
        { name: 'Token Pages', status: 'pending', description: 'PM-EQ, NOR token info' },
        { name: 'API Endpoints', status: 'pending', description: 'Public and private APIs' },
      ],
    },
    {
      id: 3,
      name: 'Smart Contracts',
      focus: 'On-chain logic',
      duration: '3-6 weeks',
      status: 'pending',
      progress: 0,
      deliverables: [
        { name: 'PM-EQ Token', status: 'pending', description: 'Private ERC20 with restrictions' },
        { name: 'Transfer Restrictions', status: 'pending', description: 'Whitelist-based transfers' },
        { name: 'Investor Registry', status: 'pending', description: 'KYC-verified investor list' },
        { name: 'Certificate Registry', status: 'pending', description: 'PDF hash on-chain storage' },
        { name: 'SmartPay Escrow', status: 'pending', description: 'Escrow contract for purchases' },
      ],
    },
    {
      id: 4,
      name: 'Wallet Ecosystem',
      focus: 'Multi-platform wallets',
      duration: '4-8 weeks',
      status: 'pending',
      progress: 0,
      deliverables: [
        { name: 'Web Wallet', status: 'pending', description: 'NorChain Web Wallet' },
        { name: 'iOS Wallet', status: 'pending', description: 'Native SwiftUI application' },
        { name: 'Android Wallet', status: 'pending', description: 'Native Jetpack Compose application' },
        { name: 'Biometric Login', status: 'pending', description: 'FaceID / Touch ID / Fingerprint' },
      ],
    },
    {
      id: 5,
      name: 'SmartPay/NorPay',
      focus: 'Payment infrastructure',
      duration: '4-6 weeks',
      status: 'pending',
      progress: 0,
      deliverables: [
        { name: 'SmartPay UI', status: 'pending', description: 'Payment interface' },
        { name: 'Escrow Builder', status: 'pending', description: 'Transaction construction' },
        { name: 'Settlement Module', status: 'pending', description: 'Payment settlement' },
        { name: 'FIAT On-ramp', status: 'pending', description: 'Ramp/MoonPay/Vipps integration' },
      ],
    },
    {
      id: 6,
      name: 'RWA Portals',
      focus: 'Company investor portals',
      duration: '4-6 weeks',
      status: 'pending',
      progress: 0,
      deliverables: [
        { name: 'PureMinerals Portal', status: 'pending', description: 'Investor verification flow' },
        { name: 'NorVége Portal', status: 'pending', description: 'Based on PureMinerals template' },
        { name: 'P2P Marketplace', status: 'pending', description: 'Secondary trading' },
        { name: 'Company Template', status: 'pending', description: 'Base template for new RWA companies' },
      ],
    },
    {
      id: 7,
      name: 'Admin & Backoffice',
      focus: 'Enterprise management',
      duration: '3-5 weeks',
      status: 'pending',
      progress: 0,
      deliverables: [
        { name: 'Admin Panel', status: 'pending', description: 'NorChain Admin interface' },
        { name: 'Company Onboarding', status: 'pending', description: 'RWA company registration' },
        { name: 'KYC Approval', status: 'pending', description: 'Manual verification panel' },
        { name: 'Compliance Reporting', status: 'pending', description: 'Regulatory report generation' },
      ],
    },
    {
      id: 8,
      name: 'Coinbase Integration',
      focus: 'Exchange tools',
      duration: '2-4 weeks',
      status: 'pending',
      progress: 0,
      deliverables: [
        { name: 'Market Data API', status: 'pending', description: 'Price feeds from Coinbase' },
        { name: 'Coinbase Commerce', status: 'pending', description: 'NOR/USDC payment acceptance' },
        { name: 'Wallet Integration', status: 'pending', description: 'Coinbase Wallet connection' },
      ],
    },
    {
      id: 9,
      name: 'Landing Sites + Docs',
      focus: 'Public presence',
      duration: '3-5 weeks',
      status: 'pending',
      progress: 0,
      deliverables: [
        { name: 'norchain.org', status: 'pending', description: 'Main NorChain website' },
        { name: 'Developer Docs', status: 'pending', description: 'API and integration guides' },
        { name: 'PureMinerals Landing', status: 'pending', description: 'Investment marketing site' },
        { name: 'SmartPay Landing', status: 'pending', description: 'Payment solution marketing' },
      ],
    },
    {
      id: 10,
      name: 'Compliance + MiCA',
      focus: 'Regulatory preparation',
      duration: '4-8 weeks',
      status: 'pending',
      progress: 0,
      deliverables: [
        { name: 'TX Monitoring', status: 'pending', description: 'Transaction surveillance' },
        { name: 'KYC/AML Tools', status: 'pending', description: 'Admin verification tools' },
        { name: 'Risk Scoring', status: 'pending', description: 'Automated risk assessment' },
        { name: 'MiCA Architecture', status: 'pending', description: 'EU regulation alignment' },
      ],
    },
  ]

  return phases
}

// Parse tasks from DEVELOPER_TASKS.md
function parseTasks(): Task[] {
  const tasks: Task[] = [
    // Phase 1 - Blockchain
    { id: 't1-1', title: 'Finalize PoSA consensus parameters', role: 'blockchain', phase: 1, priority: 'high', complexity: 'high', status: 'in_progress' },
    { id: 't1-2', title: 'Configure validator node setup scripts', role: 'blockchain', phase: 1, priority: 'high', complexity: 'medium', status: 'backlog' },
    { id: 't1-3', title: 'Implement P2P health check endpoints', role: 'blockchain', phase: 1, priority: 'high', complexity: 'medium', status: 'backlog' },
    { id: 't1-4', title: 'Set up bootnode infrastructure', role: 'blockchain', phase: 1, priority: 'high', complexity: 'medium', status: 'backlog' },
    { id: 't1-5', title: 'Create genesis file generator', role: 'blockchain', phase: 1, priority: 'high', complexity: 'medium', status: 'done' },
    { id: 't1-6', title: 'Set up Nginx + SSL RPC gateway', role: 'devops', phase: 1, priority: 'high', complexity: 'medium', status: 'backlog' },
    { id: 't1-7', title: 'Create Ansible deployment scripts', role: 'devops', phase: 1, priority: 'high', complexity: 'high', status: 'backlog' },
    { id: 't1-8', title: 'Configure Prometheus metrics collection', role: 'devops', phase: 1, priority: 'high', complexity: 'medium', status: 'backlog' },
    
    // Phase 2 - Explorer
    { id: 't2-1', title: 'Build block indexer service', role: 'backend', phase: 2, priority: 'high', complexity: 'high', status: 'backlog' },
    { id: 't2-2', title: 'Create transaction indexer', role: 'backend', phase: 2, priority: 'high', complexity: 'high', status: 'backlog' },
    { id: 't2-3', title: 'Implement address balance tracking', role: 'backend', phase: 2, priority: 'high', complexity: 'medium', status: 'backlog' },
    { id: 't2-4', title: 'Build block explorer UI', role: 'frontend', phase: 2, priority: 'high', complexity: 'high', status: 'backlog' },
    { id: 't2-5', title: 'Create transaction detail pages', role: 'frontend', phase: 2, priority: 'high', complexity: 'medium', status: 'backlog' },
    { id: 't2-6', title: 'Build address pages with history', role: 'frontend', phase: 2, priority: 'high', complexity: 'medium', status: 'backlog' },
    
    // Phase 3 - Contracts
    { id: 't3-1', title: 'Implement PM-EQ token contract', role: 'contract', phase: 3, priority: 'high', complexity: 'high', status: 'backlog' },
    { id: 't3-2', title: 'Build transfer restriction module', role: 'contract', phase: 3, priority: 'high', complexity: 'high', status: 'backlog' },
    { id: 't3-3', title: 'Create Investor Registry contract', role: 'contract', phase: 3, priority: 'high', complexity: 'medium', status: 'backlog' },
    { id: 't3-4', title: 'Build Certificate Registry contract', role: 'contract', phase: 3, priority: 'high', complexity: 'medium', status: 'backlog' },
    { id: 't3-5', title: 'Create SmartPay Escrow contract', role: 'contract', phase: 3, priority: 'high', complexity: 'high', status: 'backlog' },
    { id: 't3-6', title: 'Write comprehensive test suites', role: 'contract', phase: 3, priority: 'high', complexity: 'high', status: 'backlog' },
    
    // Phase 4 - Wallets
    { id: 't4-1', title: 'Build wallet authentication flow', role: 'frontend', phase: 4, priority: 'high', complexity: 'high', status: 'backlog' },
    { id: 't4-2', title: 'Create portfolio dashboard', role: 'frontend', phase: 4, priority: 'high', complexity: 'medium', status: 'backlog' },
    { id: 't4-3', title: 'Implement send/receive flows', role: 'frontend', phase: 4, priority: 'high', complexity: 'high', status: 'backlog' },
    { id: 't4-4', title: 'Set up iOS project (SwiftUI)', role: 'mobile-ios', phase: 4, priority: 'high', complexity: 'medium', status: 'backlog' },
    { id: 't4-5', title: 'Implement Face ID / Touch ID', role: 'mobile-ios', phase: 4, priority: 'high', complexity: 'high', status: 'backlog' },
    { id: 't4-6', title: 'Set up Android project (Jetpack Compose)', role: 'mobile-android', phase: 4, priority: 'high', complexity: 'medium', status: 'backlog' },
    { id: 't4-7', title: 'Implement BiometricPrompt', role: 'mobile-android', phase: 4, priority: 'high', complexity: 'high', status: 'backlog' },
    
    // Phase 5 - SmartPay
    { id: 't5-1', title: 'Build payment processing service', role: 'backend', phase: 5, priority: 'high', complexity: 'high', status: 'backlog' },
    { id: 't5-2', title: 'Create escrow orchestration logic', role: 'backend', phase: 5, priority: 'high', complexity: 'high', status: 'backlog' },
    { id: 't5-3', title: 'Integrate FIAT on-ramp APIs', role: 'backend', phase: 5, priority: 'high', complexity: 'high', status: 'backlog' },
    { id: 't5-4', title: 'Build SmartPay checkout UI', role: 'frontend', phase: 5, priority: 'high', complexity: 'high', status: 'backlog' },
    
    // Phase 6 - Portals
    { id: 't6-1', title: 'Build KYC integration service', role: 'backend', phase: 6, priority: 'high', complexity: 'high', status: 'backlog' },
    { id: 't6-2', title: 'Implement P2P marketplace logic', role: 'backend', phase: 6, priority: 'high', complexity: 'high', status: 'backlog' },
    { id: 't6-3', title: 'Build KYC onboarding flow', role: 'frontend', phase: 6, priority: 'high', complexity: 'high', status: 'backlog' },
    { id: 't6-4', title: 'Create PM-EQ dashboard', role: 'frontend', phase: 6, priority: 'high', complexity: 'high', status: 'backlog' },
    { id: 't6-5', title: 'Build P2P marketplace UI', role: 'frontend', phase: 6, priority: 'high', complexity: 'high', status: 'backlog' },
  ]

  return tasks
}

// Parse repositories
function parseRepositories(): Repository[] {
  const repos: Repository[] = [
    { name: 'norchain-node', description: 'Core NorChain blockchain node software', url: 'https://github.com/NorChainOfficial/norchain-node', visibility: 'public', category: 'Core', phase: 1 },
    { name: 'norchain-genesis', description: 'Genesis configuration and genesis assets', url: 'https://github.com/NorChainOfficial/norchain-genesis', visibility: 'public', category: 'Core', phase: 1 },
    { name: 'norchain-contracts', description: 'Smart contracts (NOR, governance, staking)', url: 'https://github.com/NorChainOfficial/norchain-contracts', visibility: 'public', category: 'Core', phase: 3 },
    { name: 'norchain-infra', description: 'Infrastructure-as-code: Docker, K8s, Terraform', url: 'https://github.com/NorChainOfficial/norchain-infra', visibility: 'public', category: 'DevOps', phase: 1 },
    { name: 'norchain-wallet-core', description: 'Shared wallet core libraries', url: 'https://github.com/NorChainOfficial/norchain-wallet-core', visibility: 'public', category: 'Wallet', phase: 4 },
    { name: 'norchain-wallet-ios', description: 'Reference iOS wallet', url: 'https://github.com/NorChainOfficial/norchain-wallet-ios', visibility: 'public', category: 'Wallet', phase: 4 },
    { name: 'norchain-wallet-android', description: 'Reference Android wallet', url: 'https://github.com/NorChainOfficial/norchain-wallet-android', visibility: 'public', category: 'Wallet', phase: 4 },
    { name: 'norchain-wallet-web', description: 'Browser/web wallet', url: 'https://github.com/NorChainOfficial/norchain-wallet-web', visibility: 'public', category: 'Wallet', phase: 4 },
    { name: 'norchain-bridge-hub', description: 'Bridge orchestrator for ETH/BSC/Polygon', url: 'https://github.com/NorChainOfficial/norchain-bridge-hub', visibility: 'private', category: 'Services', phase: 10 },
    { name: 'norchain-compliance-service', description: 'KYC/AML integration, risk scoring', url: 'https://github.com/NorChainOfficial/norchain-compliance-service', visibility: 'private', category: 'Services', phase: 10 },
    { name: 'norchain-payments', description: 'SmartPay / NorPay backend', url: 'https://github.com/NorChainOfficial/norchain-payments', visibility: 'private', category: 'Services', phase: 5 },
    { name: 'norchain-sdk', description: 'Main monorepo with 8 apps', url: 'https://github.com/NorChainOfficial/norchain-sdk', visibility: 'public', category: 'Core', phase: 1 },
    { name: 'mobile-validator', description: 'Validator dashboard template', url: 'https://github.com/NorChainOfficial/mobile-validator', visibility: 'private', category: 'Tools', phase: 1 },
    { name: 'norchain', description: 'Organization placeholder', url: 'https://github.com/NorChainOfficial/norchain', visibility: 'public', category: 'Core', phase: 1 },
  ]

  return repos
}

// Parse compliance data
function parseCompliance(): { tokens: Token[], checklist: ComplianceItem[], strategy: string } {
  const tokens: Token[] = [
    {
      symbol: 'NOR',
      name: 'NorChain',
      type: 'utility',
      tradability: 'public',
      kycRequired: false,
      description: 'Network gas fees, platform access, SmartPay transactions. NO dividends, NO profit sharing, NO equity claims.',
    },
    {
      symbol: 'PM-EQ',
      name: 'PureMinerals Equity',
      type: 'security',
      tradability: 'private',
      kycRequired: true,
      description: 'Represents actual equity ownership in PureMinerals. Transfer-restricted, KYC-gated, whitelist-only transfers.',
    },
    {
      symbol: 'NV-EQ',
      name: 'NorVége Equity',
      type: 'security',
      tradability: 'private',
      kycRequired: true,
      description: 'Represents actual equity ownership in NorVége. Transfer-restricted, KYC-gated, whitelist-only transfers.',
    },
  ]

  const checklist: ComplianceItem[] = [
    { id: 'c1', category: 'Legal', item: 'Accredited/KYC investors only', status: 'complete', required: true },
    { id: 'c2', category: 'Legal', item: 'Invitation-only distribution', status: 'complete', required: true },
    { id: 'c3', category: 'Legal', item: 'No public marketing', status: 'complete', required: true },
    { id: 'c4', category: 'Legal', item: 'No exchange listing', status: 'complete', required: true },
    { id: 'c5', category: 'Legal', item: 'Legal disclaimers', status: 'in_progress', required: true },
    { id: 'c6', category: 'Technical', item: 'Transfer restrictions implemented', status: 'pending', required: true },
    { id: 'c7', category: 'Technical', item: 'KYC-gating on transfers', status: 'pending', required: true },
    { id: 'c8', category: 'Technical', item: 'Whitelist-only transfers', status: 'pending', required: true },
    { id: 'c9', category: 'Technical', item: 'Pause mechanism', status: 'pending', required: true },
    { id: 'c10', category: 'Documentation', item: 'NOR utility token opinion', status: 'in_progress', required: true },
    { id: 'c11', category: 'Documentation', item: 'PM-EQ security token memo', status: 'in_progress', required: true },
    { id: 'c12', category: 'Documentation', item: 'Regulatory analysis', status: 'pending', required: true },
    { id: 'c13', category: 'Documentation', item: 'Risk disclosures', status: 'pending', required: true },
  ]

  return {
    tokens,
    checklist,
    strategy: 'Private First — Regulated Later',
  }
}

// Main execution
function main() {
  console.log('🔄 Parsing documentation files...')

  // Parse and write phases
  const phases = parsePhases()
  fs.writeFileSync(
    path.join(DATA_DIR, 'phases.json'),
    JSON.stringify(phases, null, 2)
  )
  console.log(`✅ Generated phases.json (${phases.length} phases)`)

  // Parse and write tasks
  const tasks = parseTasks()
  fs.writeFileSync(
    path.join(DATA_DIR, 'tasks.json'),
    JSON.stringify(tasks, null, 2)
  )
  console.log(`✅ Generated tasks.json (${tasks.length} tasks)`)

  // Parse and write repositories
  const repos = parseRepositories()
  fs.writeFileSync(
    path.join(DATA_DIR, 'repos.json'),
    JSON.stringify(repos, null, 2)
  )
  console.log(`✅ Generated repos.json (${repos.length} repositories)`)

  // Parse and write compliance
  const compliance = parseCompliance()
  fs.writeFileSync(
    path.join(DATA_DIR, 'compliance.json'),
    JSON.stringify(compliance, null, 2)
  )
  console.log(`✅ Generated compliance.json`)

  console.log('✨ All data files generated successfully!')
}

main()

