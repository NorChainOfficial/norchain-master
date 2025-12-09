# PM Update Dashboard Command

Update the PM Dashboard with task/phase progress.

## Usage

When completing tasks, update the dashboard:

```bash
# Update a task status
curl -X POST http://localhost:3000/api/update \
  -H "Content-Type: application/json" \
  -d '{"type": "task", "payload": {"taskId": "t1-1", "status": "done"}}'

# Update phase progress
curl -X POST http://localhost:3000/api/update \
  -H "Content-Type: application/json" \
  -d '{"type": "phase", "payload": {"phaseId": 1, "progress": 25}}'

# Update a deliverable
curl -X POST http://localhost:3000/api/update \
  -H "Content-Type: application/json" \
  -d '{"type": "phase", "payload": {"phaseId": 1, "deliverable": {"name": "NorChain L1 (PoSA)", "status": "complete"}}}'

# Update compliance item
curl -X POST http://localhost:3000/api/update \
  -H "Content-Type: application/json" \
  -d '{"type": "compliance", "payload": {"itemId": "c6", "status": "complete"}}'
```

## Task IDs

Phase 1 (Blockchain):
- t1-1: Finalize PoSA consensus parameters
- t1-2: Configure validator node setup scripts
- t1-3: Implement P2P health check endpoints
- t1-4: Set up bootnode infrastructure
- t1-5: Create genesis file generator
- t1-6: Set up Nginx + SSL RPC gateway
- t1-7: Create Ansible deployment scripts
- t1-8: Configure Prometheus metrics collection

Phase 2 (Explorer):
- t2-1 through t2-6

Phase 3 (Contracts):
- t3-1 through t3-6

## Status Values

Tasks: `backlog` | `in_progress` | `review` | `done`
Phases: `pending` | `active` | `complete`
Deliverables: `pending` | `in_progress` | `complete`
Compliance: `pending` | `in_progress` | `complete`

## Direct File Update (Alternative)

If the dashboard isn't running, agents can directly update:

```
dashboard/src/data/tasks.json
dashboard/src/data/phases.json
dashboard/src/data/compliance.json
```

Then refresh the dashboard to see changes.

