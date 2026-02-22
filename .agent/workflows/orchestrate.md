---
description: Automate the full Product Manager Orchestrator lifecycle (Branch -> Build -> PR -> QA)
---

# Auto-Orchestrate Workflow

When the user invokes `/orchestrate [Issue/Feature]`, you are acting as the executive Product Manager orchestrating the *entire* OpenClaw swarm protocol autonomously. You must assume control and chain the personas together without stopping to ask the user for permission between each step.

## The Automated Lifecycle

Execute these steps sequentially in an unbroken agentic loop:

1. **State Initialization**: Run `uuidgen > .agents/.current_run` to start the telemetry session.
2. **Branch Creation**: Check out a new feature branch (e.g., `git checkout -b feat/issue-9-evals`).
3. **Worker Implementation (Durable Handoff)**: 
   - Consult the **Routing Registry** (below) to adopt the appropriate worker persona.
   - Write the task payload to `.agents/active_handoff.md`.
   - Invoke the worker, explicitly commanding them to read `.agents/active_handoff.md` and execute within their defined sandbox.
4. **Commit & Push**: After the worker completes and returns control, read `.agents/active_handoff.md` to get their status. Commit the implementation and push (`git push -u origin <branch-name>`).
5. **Formal Pull Request**: Open a Pull Request against the `main` branch using `gh pr create`.
5. **Quality Assurance Audit**: Force a persona switch to the `/senior-tech-lead`. Audit the new PR:
   - **Write new tests first.** If the implementation added new logic, you MUST create or extend test files before declaring QA complete. Shipping new code without new tests is a DoD violation.
   - **Scoped testing.** Run tests ONLY for the affected package(s), not the entire monorepo. Use the following commands based on the blast radius:
     - `apps/mcp-server` only: `cd apps/mcp-server && npm test`
     - `apps/web` only: `cd apps/web && npx vitest run`
     - `packages/core` only: `cd packages/core && npx vitest run`
     - Cross-package (e.g., `packages/core` + `apps/web`): `npx vitest run` (full repo)
     - E2E (UI regression): `cd apps/web && npx playwright test e2e/static-pages-a11y.spec.ts`
   - **Mathematically prove** the worker's code did not break the affected package's test contract.
7. **Merge & Clean & Log**: If (and only if) the tech lead audit passes, merge the PR natively (`gh pr merge --squash`), close the issue.
   - Finally, run `rm .agents/.current_run .agents/active_handoff.md` to clear the state.

### Exception Handling & Escalations
You must complete all 7 steps autonomously. The **ONLY** reasons you should halt the loop or re-route are:
1. A CI test fails or build breaks.
2. The `/senior-tech-lead` audit explicitly blocks the PR for security/architecture violations.
3. You detect the **"⚠️ ESCALATION"** string from a worker. If this happens, dynamically read their recommended agent, rewrite the `.agents/active_handoff.md` payload, and invoke the new explicitly recommended persona to unblock the swarm.

---

## 🗺️ Routing Registry (The 11-Agent Taxonomy)

When orchestrating, map tasks to these Best-in-Class profiles:

| Task Type | Optimal Persona | Sandbox Scope |
|-----------|-----------------|---------------|
| **Core PM/Definition** | `/product-manager` | `BACKLOG.md`, Metrics, GitHub Issues |
| **Cloud Systems/DB/APIs** | `/backend-engineer` | `packages/core/`, Supabase Edge Functions, SQL |
| **LLMs/MCP/RAG/Safety** | `/ai-engineer` | `apps/mcp-server/`, Prompts, Tool Schemas |
| **Visuals/UX/Tokens** | `/ui-designer` | Mockups, WCAG Audits, Tailwind Tokens |
| **React/A11y Implementation** | `/ui-eng-designer` | `apps/web/src/`, `index.css`, UI Build tests |
| **Copy/Tone/Prompts** | `/ux-writer` | `apps/web/src/content/`, "Dignified Guide" copy |
| **Legal/Fiqh/Security** | `/product-counsel` | Privacy Docs, ZMCS configurations |
| **GTM/Changelog/SEO** | `/product-marketing-manager`| Launch copy, `CHANGELOG.md`, Analytics wiring |
| **QA/Audit/Testing** | `/senior-tech-lead` | `__tests__/`, `e2e/`, mathematical test contracts |
