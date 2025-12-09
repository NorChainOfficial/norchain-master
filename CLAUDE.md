# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is the **NorChain Master Repository** - an AI-powered Product Manager Hub that orchestrates development across 50+ repositories in the NorChain blockchain ecosystem. The PM Agent has 30+ years of blockchain/web3 expertise encoded.

### PM Agent Capabilities

- **Strategic Planning**: Phase planning, sprint planning, feature decomposition
- **Cross-Repo Orchestration**: Dependency analysis, issue tracking, milestone sync
- **Compliance Enforcement**: MiCA compliance, security token gates, KYC verification
- **Risk Assessment**: Historical pattern recognition, mitigation strategies
- **Domain Delegation**: Routes tasks to specialized agents (blockchain, contracts, backend, frontend, mobile)

## Strategy

**"Private First — Regulated Later"**

| Token | Type | Tradability | KYC | Compliance |
|-------|------|-------------|-----|------------|
| **NOR** | Utility | Public | Optional | Standard |
| **PM-EQ** | Security | Private Only | Required | Full Review |
| **NV-EQ** | Security | Private Only | Required | Full Review |

## PM Commands

| Command | Purpose |
|---------|---------|
| `/pm-plan <feature>` | Generate implementation plan with tasks, dependencies, risks |
| `/pm-review <pr>` | Review PR for architecture, compliance, standards |
| `/pm-prioritize` | Prioritize backlog using RICE scoring |
| `/pm-sprint` | Plan next sprint based on dependencies |
| `/pm-status` | Cross-repository status dashboard |
| `/pm-risk` | Risk assessment for current phase |
| `/pm-delegate <task>` | Assign task to appropriate domain agent |

## Domain Commands

| Command | Purpose |
|---------|---------|
| `/norchain-status` | Ecosystem status overview |
| `/norchain-phase <n>` | Phase-specific context |
| `/norchain-task <id>` | Task details and context |
| `/norchain-compliance` | Compliance check |
| `/norchain-repo <name>` | Repository information |
| `/norchain-contract <name>` | Smart contract details |
| `/norchain-init <type>` | Initialize new repository |
| `/smartpay <action>` | SmartPay integration helpers |

## 🎯 Dashboard Integration (CRITICAL - MANDATORY)

**The PM Dashboard is the single source of truth for all project management.**

The dashboard at `dashboard/` is backed by Supabase and tracks all project progress via the `norchain-dashboard` MCP server.

### MANDATORY: Session Start Protocol

**At the START of every coding session, ALWAYS run:**

```
get_dashboard_stats
```

This ensures you are synced with the current project state before making any changes.

### MANDATORY: Task Lifecycle Protocol

**EVERY task MUST follow this workflow:**

| Step | MCP Tool | When |
|------|----------|------|
| 1. Check available tasks | `get_tasks phase_id=<current>` | Before starting work |
| 2. Start task | `update_task task_id="tX-Y" status="in_progress"` | When beginning work |
| 3. Log start | `log_activity type="task_update" ...` | Immediately after #2 |
| 4. Complete task | `update_task task_id="tX-Y" status="done"` | When work is finished |
| 5. Update phase | `update_phase phase_id=X progress=Y` | After completing tasks |
| 6. Log completion | `log_activity type="task_update" ...` | Immediately after #4 |

### Quick Dashboard Commands

| Command | Purpose |
|---------|---------|
| `/db-stats` | Get current dashboard statistics |
| `/db-tasks [filters]` | List tasks with optional filters |
| `/db-start-task <id>` | Start working on a task |
| `/db-complete-task <id>` | Mark task as done |
| `/db-create-task <details>` | Create a new task |
| `/db-phases` | View all phases with deliverables |
| `/db-update-phase <id> <updates>` | Update phase progress |
| `/db-compliance` | View compliance checklist |
| `/db-repos` | List tracked repositories |
| `/db-activity` | View recent activity log |
| `/db-sync` | Sync and verify dashboard data |

### MCP Tools Reference

**Tasks (6 tools):**
```
get_tasks           - Query tasks (phase_id, status, role filters)
create_task         - Create new task (id, title, role, phase_id required)
update_task         - Update task (task_id required)
delete_task         - Delete task
bulk_update_tasks   - Update multiple tasks
bulk_delete_tasks   - Delete multiple tasks
```

**Phases (2 tools):**
```
get_phases          - Get all phases with deliverables
update_phase        - Update phase progress/status
```

**Deliverables (3 tools):**
```
create_deliverable  - Add deliverable to phase
update_deliverable  - Update deliverable status
delete_deliverable  - Remove deliverable
```

**Repositories (4 tools):**
```
get_repositories    - Query repos (category, visibility filters)
create_repository   - Add repository
update_repository   - Update repo info
delete_repository   - Remove repository
```

**Compliance (4 tools):**
```
get_compliance      - Get checklist and tokens
create_compliance_item - Add compliance item
update_compliance   - Update compliance status
delete_compliance_item - Remove compliance item
```

**Tokens (2 tools):**
```
create_token        - Add token to tracking
update_token        - Update token info
```

**Activity & Stats (3 tools):**
```
get_dashboard_stats - Get full statistics summary
get_activity        - Get recent activity log
log_activity        - Log activity event
```

### Activity Types

Use these types when logging activities:
- `task_update` - Task status changes
- `phase_update` - Phase progress changes
- `compliance_update` - Compliance item updates
- `commit` - Git commits
- `issue` - GitHub issues
- `pr` - Pull requests
- `release` - Releases
- `milestone` - Milestone updates

### Full Tool Reference

See `.claude/commands/dashboard.md` for complete documentation.

## Repository Structure

```
Master/
├── CLAUDE.md                              # This file
├── README.md                              # Repository overview
├── .claude/
│   ├── agents/
│   │   ├── norchain-pm-agent.md           # Master PM Agent (30+ years expertise)
│   │   ├── norchain-blockchain-agent.md   # Go, PoSA, P2P
│   │   ├── norchain-contract-agent.md     # Solidity, Hardhat
│   │   ├── norchain-backend-agent.md      # NestJS, PostgreSQL
│   │   ├── norchain-frontend-agent.md     # Next.js, React
│   │   └── norchain-mobile-agent.md       # Swift, Kotlin
│   ├── commands/
│   │   ├── pm-*.md                        # PM slash commands
│   │   └── norchain-*.md                  # Domain slash commands
│   ├── skills/
│   │   ├── product-management.md          # PM skill (Agile, RICE, compliance)
│   │   └── *.md                           # Domain skills
│   ├── mcp/
│   │   └── pm-tools.json                  # PM MCP tools configuration
│   └── settings.json                      # Agent configuration
├── .github/
│   └── workflows/
│       ├── sync-specs.yml                 # Sync docs to child repos
│       ├── orchestrate-issues.yml         # Auto-classify issues
│       ├── enforce-standards.yml          # PR compliance checks
│       ├── track-milestones.yml           # Daily milestone tracking
│       └── init-repo.yml                  # Initialize new repos
├── templates/
│   ├── github/
│   │   ├── ISSUE_TEMPLATE/                # Issue templates
│   │   ├── PULL_REQUEST_TEMPLATE.md       # PR template
│   │   └── workflows/ci-base.yml          # Base CI workflow
│   └── docs/                              # Documentation templates
└── docs/
    ├── ROADMAP.md                         # 10-phase development plan
    ├── LEGAL_COMPLIANCE_ROADMAP.md        # MiCA-safe strategy
    ├── DEVELOPER_TASKS.md                 # 100+ tasks by role
    └── REPOSITORY_STRUCTURE.md            # 50+ repo structure
```

## Agent Hierarchy

```
┌─────────────────────────────────────────────────────┐
│            NORCHAIN-PM-AGENT (Master)               │
│         30+ Years Blockchain Expertise              │
│   Strategic Control • Orchestration • Compliance    │
└───────────────────────┬─────────────────────────────┘
                        │
     ┌──────────────────┼──────────────────┐
     │                  │                  │
     ▼                  ▼                  ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Blockchain  │  │  Contract   │  │   Backend   │
│   Agent     │  │    Agent    │  │    Agent    │
│ (Go, PoSA)  │  │ (Solidity)  │  │  (NestJS)   │
└─────────────┘  └─────────────┘  └─────────────┘
     │                  │                  │
     ▼                  ▼                  ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Frontend   │  │   Mobile    │  │   50+ Repos │
│   Agent     │  │    Agent    │  │  Controlled │
│ (Next.js)   │  │(Swift/Kotlin)│  │             │
└─────────────┘  └─────────────┘  └─────────────┘
```

## Development Roadmap (10 Phases)

| Phase | Focus | Key Repos |
|-------|-------|-----------|
| 1 | Blockchain Core | norchain-node, norchain-genesis |
| 2 | NorExplorer | norchain-explorer |
| 3 | Smart Contracts | norchain-contracts |
| 4 | Wallet Ecosystem | norchain-wallet-* |
| 5 | SmartPay/NorPay | norchain-services, norchain-payments |
| 6 | RWA Portals | norchain-portal |
| 7 | Admin & Backoffice | norchain-admin |
| 8 | Coinbase Integration | norchain-exchange |
| 9 | Landing Sites + Docs | norchain-docs |
| 10 | Compliance + MiCA | norchain-compliance |

## Automation Level

**Hybrid Mode** - Low-risk actions automated, high-risk require human approval.

### Automated (No Approval Needed)
- Create GitHub issues
- Apply labels and milestones
- Update issue status
- Dependency analysis
- Compliance checks
- Sync specs to repos
- Auto-label PRs

### Requires Human Approval
- Create/merge Pull Requests
- Release deployments
- Cross-repo breaking changes
- Security token modifications
- Production deployments

## NorChain Ecosystem Overview

| Category | Repositories |
|----------|--------------|
| **Core Blockchain** | `norchain-node`, `norchain-genesis`, `norchain-contracts` |
| **Infrastructure** | `norchain-infra`, `norchain-sdk` |
| **Wallets** | `norchain-wallet-core`, `norchain-wallet-ios`, `norchain-wallet-android`, `norchain-wallet-web` |
| **Services** | `norchain-services`, `norchain-compliance-service`, `norchain-payments` |
| **Frontend** | `norchain-explorer`, `norchain-portal`, `norchain-admin` |

**Tech Stack**: TypeScript (NestJS/Next.js), Swift, Kotlin, Go, Solidity

## Critical Rules

1. **Never** enable public trading for security tokens (PM-EQ, NV-EQ)
2. **Never** integrate DEX/CEX for security tokens
3. **Never** bypass KYC verification for security tokens
4. **Never** handle FIAT directly
5. **Always** maintain private placement status
6. **Always** include pause mechanisms for security tokens
7. **Always** require whitelist verification for transfers

## Cross-Reference Guide

All documents maintain consistency with:
- **Token naming**: NOR (utility), PM-EQ (PureMinerals), NV-EQ (NorVége)
- **Phase numbering**: 1-10 for MVP, 11+ for future
- **Strategy reference**: "Private First — Regulated Later"
- **Domain reference**: norchain.org (NOT norchain.io)

## Documentation Index

| Document | Description |
|----------|-------------|
| [docs/ROADMAP.md](./docs/ROADMAP.md) | 10-phase development plan |
| [docs/LEGAL_COMPLIANCE_ROADMAP.md](./docs/LEGAL_COMPLIANCE_ROADMAP.md) | MiCA-safe tokenization strategy |
| [docs/DEVELOPER_TASKS.md](./docs/DEVELOPER_TASKS.md) | 100+ tasks by role with priority/complexity |
| [docs/REPOSITORY_STRUCTURE.md](./docs/REPOSITORY_STRUCTURE.md) | 50+ repository structure across 10 domains |
