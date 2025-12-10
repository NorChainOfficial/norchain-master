# Deploy Plan Command

Plan a deployment to an environment.

## Usage

```
/deploy-plan <env>
```

## Arguments

- `env` - Target environment: `staging`, `production`, `dev`

## What This Does

1. Reviews pending changes
2. Checks prerequisites
3. Identifies potential risks
4. Creates deployment checklist
5. Generates rollback plan

## Output Format

```markdown
## Deployment Plan: [Environment]

### Changes to Deploy
| Type | Description | Risk |
|------|-------------|------|
| Feature | [description] | Low |
| Migration | [description] | Medium |
| Config | [description] | Low |

### Prerequisites
- [ ] All tests passing
- [ ] Code review approved
- [ ] Security scan clean
- [ ] Migration tested on staging
- [ ] Rollback plan verified

### Deployment Steps
1. [ ] Create backup checkpoint
2. [ ] Enable maintenance mode
3. [ ] Run database migrations
4. [ ] Deploy application containers
5. [ ] Verify health checks
6. [ ] Run smoke tests
7. [ ] Disable maintenance mode
8. [ ] Monitor for 30 minutes

### Rollback Plan
If issues occur:
1. Enable maintenance mode
2. Rollback database: `./scripts/rollback-db.sh`
3. Deploy previous version: `kubectl rollout undo`
4. Verify health checks
5. Disable maintenance mode

### Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| ... | ... | ... | ... |

### Notifications
- [ ] Notify team in #deployments
- [ ] Update status page
- [ ] Email stakeholders after completion
```

## Environment Requirements

| Environment | Approval | Window | Downtime |
|-------------|----------|--------|----------|
| dev | None | Anytime | Allowed |
| staging | Team lead | Business hours | Allowed |
| production | 2 reviewers | Off-peak | Minimize |

## Example

```
/deploy-plan production
```

## Related Commands

- `/infra-review` - Review infrastructure
- `/pipeline-optimize` - Optimize CI/CD

## Agent

`norchain-devops-agent`
