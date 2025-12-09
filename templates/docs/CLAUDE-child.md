# CLAUDE.md - {REPO_NAME}

## NorChain Ecosystem Repository

This repository is part of the NorChain blockchain ecosystem.

| Property | Value |
|----------|-------|
| **Repository** | {REPO_NAME} |
| **Phase** | {PHASE_NUMBER} |
| **Domain** | {DOMAIN} |
| **Master Repo** | github.com/NorChainOfficial/Master |

---

## CRITICAL: Dashboard Sync Protocol (MANDATORY)

**All task management is centralized in the Master PM Dashboard.**

The dashboard is backed by Supabase and accessed via the `norchain-dashboard` MCP server located in the Master repository.

### Session Start Protocol (MANDATORY)

**At the START of every coding session, ALWAYS run:**

```
get_dashboard_stats
get_tasks phase_id={PHASE_NUMBER}
```

This ensures you are synced with current project state before making changes.

### Task Lifecycle Protocol (MANDATORY)

**EVERY task MUST follow this workflow:**

| Step | MCP Tool | When |
|------|----------|------|
| 1. Check tasks | `get_tasks phase_id={PHASE_NUMBER}` | Before starting work |
| 2. Start task | `update_task task_id="tX-Y" status="in_progress"` | When beginning work |
| 3. Log start | `log_activity type="task_update" title="Started tX-Y" entity_type="task" entity_id="tX-Y"` | After #2 |
| 4. Complete task | `update_task task_id="tX-Y" status="done"` | When finished |
| 5. Update phase | `update_phase phase_id={PHASE_NUMBER} progress=X` | After completing tasks |
| 6. Log completion | `log_activity type="task_update" title="Completed tX-Y" entity_type="task" entity_id="tX-Y"` | After #4 |

### Dashboard Commands

| Command | Purpose |
|---------|---------|
| `/db-stats` | Get dashboard statistics |
| `/db-tasks` | List tasks (filter by phase, status, role) |
| `/db-start-task <id>` | Start working on a task |
| `/db-complete-task <id>` | Mark task as done |
| `/db-phases` | View all phases |
| `/db-compliance` | View compliance checklist |

### MCP Tools Reference

**Tasks:**
```
get_tasks           - Query tasks (phase_id, status, role filters)
create_task         - Create new task
update_task         - Update task status/details
delete_task         - Delete task
```

**Phases:**
```
get_phases          - Get all phases with deliverables
update_phase        - Update phase progress/status
```

**Activity:**
```
get_dashboard_stats - Get full statistics summary
get_activity        - Get recent activity log
log_activity        - Log activity event
```

**Activity Types:** `task_update`, `phase_update`, `compliance_update`, `commit`, `issue`, `pr`, `release`, `milestone`

---

## Compliance Rules

**Critical compliance requirements (inherited from Master):**

1. **Never** enable public trading for security tokens (PM-EQ, NV-EQ)
2. **Never** integrate DEX/CEX for security tokens
3. **Never** bypass KYC verification for security tokens
4. **Never** handle FIAT directly
5. **Always** maintain private placement status
6. **Always** include pause mechanisms for security tokens
7. **Always** require whitelist verification for transfers

### Token Strategy: "Private First - Regulated Later"

| Token | Type | Tradability | KYC | Compliance |
|-------|------|-------------|-----|------------|
| **NOR** | Utility | Public | Optional | Standard |
| **PM-EQ** | Security | Private Only | Required | Full Review |
| **NV-EQ** | Security | Private Only | Required | Full Review |

---

## MCP Server Setup

The dashboard MCP server must be configured in your Claude Code settings.

**Required**: Clone the Master repository alongside this repo:
```
/your/dev/path/
├── Master/                    # Master repo with MCP server
│   └── dashboard/mcp-server/  # MCP server location
└── {REPO_NAME}/               # This repository
```

**Configuration** is in `.claude/settings.local.json` (auto-generated).

### Environment Variables Required

Set these in your shell profile or `.env`:
```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

---

## Development Workflow

### Before Starting Any Work

1. Run `get_dashboard_stats` to see current project state
2. Run `get_tasks phase_id={PHASE_NUMBER}` to see available tasks
3. Pick a task and run `update_task task_id="tX-Y" status="in_progress"`

### While Working

- Keep task status updated
- Log significant milestones with `log_activity`
- Reference task IDs in commit messages

### After Completing Work

1. Run `update_task task_id="tX-Y" status="done"`
2. Update phase progress if appropriate
3. Log completion activity

---

## Documentation

- [NorChain Roadmap](.norchain/ROADMAP.md)
- [Compliance Requirements](.norchain/LEGAL_COMPLIANCE_ROADMAP.md)
- [Master Repository](https://github.com/NorChainOfficial/Master)

---

*Synced from NorChain Master - Do not edit manually*
