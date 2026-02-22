# ZakatFlow AI Agents Manifest

ZakatFlow utilizes an OpenClaw-inspired "Swarm" model for AI-assisted development. We enforce strict "Orchestrator + Worker" topologies to prevent competence creep.

## Core Principles
1. **Just-In-Time (JIT) Context**: Agents must only read the atomic files necessary for their task (see [CONTEXT.md](CONTEXT.md)).
2. **Minimal Permissions**: Treat output as untrusted until validated by tests (Playwright/Vitest).
3. **No Competence Creep**: UX Writers do not write SQL; Backend Engineers do not tweak CSS tokens.
4. **Local Testing Principle**: *Before any push or tool assumption, agents MUST run `npm run build` from the repository root.* Lovable deploys from the root; if the root build fails, the deploy will fail.

## Available Personas
Use standard prompt commands (e.g., `/product-manager`) to invoke these workflows. The source code for these personas lives in `.agent/workflows/`.

### Orchestrators (Context Holders)
- **`/product-manager`**: Scopes the "Job to be Done", defines Acceptance Criteria, and specifies Google Analytics tracking events. Controls the feature loop.
- **`/senior-tech-lead`**: Staff-level architect. Audits system design, end-to-end security (AES-256-GCM), database definitions, and API scalability.

### Specialist Workers (Execution)
- **`/backend-ai-engineer`**: Supabase Edge Functions, Plaid sync, Postgres SQL, and MCP server AI robustness (prompt injection guards). 
- **`/ui-eng-designer`**: Implements React components using `shadcn/ui` and strict Tailwind semantic tokens. Responsible for WCAG 2.1 AA execution.
- **`/ui-designer`**: Pure visual layout, typography scaling, and translating user needs into semantic CSS tokens.
- **`/ux-writer`**: Crafts the "Dignified Guide" copy for Web UI and tunes LLM agent prompts (`agent_protocol.ts`). 
- **`/developer-relations`**: Creates and maintains developer-facing artifacts, API docs, and architecture readmes. 

### Guardrails (Compliance)
- **`/qa-engineer`**: Final gatekeeper (SDET). Mathematically proves test contracts, enforces Vitest/Playwright coverage, and hunts edge cases before PR merge.
- **`/product-counsel`**: Ensures Secular (Privacy/GDPR) and Fiqh (Islamic Jurisprudence) compliance. Audits methodology shifts and triggers "ZMCS Audit Requests".

*For the complete Agile iteration loop, refer to the [Orchestrator Workflow](.agent/workflows/orchestrate.md).*
