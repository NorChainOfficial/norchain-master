# Integration Test Command

Design integration tests for a service.

## Usage

```
/integration-test <service>
```

## Arguments

- `service` - Name of the service to test

## What This Does

1. Identifies service boundaries
2. Maps integration points (DB, API, blockchain)
3. Designs test scenarios
4. Creates test environment setup
5. Generates test code skeleton

## Output Format

```markdown
## Integration Test Plan: [Service]

### Integration Points
| External | Protocol | Mock Strategy |
|----------|----------|---------------|
| Database | PostgreSQL | Testcontainers |
| Cache | Redis | Testcontainers |
| Blockchain | JSON-RPC | Local node |
| External API | REST | MSW/Nock |

### Test Scenarios
| Scenario | Setup | Assert |
|----------|-------|--------|
| ... | ... | ... |

### Environment Setup
```yaml
# docker-compose.test.yml
services:
  postgres:
    image: postgres:15
  redis:
    image: redis:7
```

### Test Code
```typescript
describe('[Service] Integration', () => {
  // setup code
  // test cases
});
```
```

## Integration Points (NorChain)

| Service | Integrations | Priority |
|---------|--------------|----------|
| API Gateway | Database, Auth, Cache | P0 |
| Transaction Service | Blockchain, Database | P0 |
| Auth Service | Database, External IdP | P0 |
| Explorer | Blockchain, Database | P1 |

## Example

```
/integration-test transaction-service
```

## Related Commands

- `/api-contract-test` - Validate API contracts
- `/blockchain-test` - Test chain interactions
- `/test-strategy` - Full test strategy

## Agent

`norchain-integration-agent`
