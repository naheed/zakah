# Agents & Workflows

This directory (`.agents/`) is the central repository for **AI telemetry and logging infrastructure**. 

> **Note:** The actual agent persona definition files (like `/product-manager` or `/developer-relations`) and their execution rules are located in the sister directory: `.agent/workflows/`.

As we advance our AI capabilities using open-source agent frameworks (e.g., OpenClaw, AutoGen) and our own native orchestrators, we use `.agents/...` to track how well these agents collaborate, route tasks, and self-reflect.

## What's in Here?

### 1. `telemetry/`
Contains the telemetry utility scripts (`logger.ts`) used to track multi-agent orchestration quality.
- **Why JSONL?**: Agent runs can generate thousands of events. Using JSON Lines allows us to partition logs by month (`YYYY-MM.jsonl`), safely append data without Git merge conflicts, and easily ingest it into analytical systems (e.g., Datadog, BigQuery) in the future.
- **What is Tracked?**: The `AgentEvent` schema captures context tokens used, handoff accuracy, redundant file reads, and self-reflection escalation rates.

### 2. `logs/orchestration/`
Contains the actual `.jsonl` files documenting agent workflow events. 
- *Note:* These are checked into version control for now to allow outside collaborators to trace and study the agentic execution data.

## Usage

When building a new agent Workflow or Persona logic, use this directory to house any infrastructure code required to manage the agents themselves.

```typescript
import { appendTelemetryEvent } from '../.agents/telemetry/logger.js';

await appendTelemetryEvent({
  run_id: 'orc-123',
  active_agent: '/ui-designer',
  action: 'ESCALATE',
  reason: 'Out of bounds: requires SQL schema migration.',
  context_tokens_used: 4200
});
```
