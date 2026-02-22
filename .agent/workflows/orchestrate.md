---
description: Automate the full Product Manager Orchestrator lifecycle (Branch -> Build -> PR -> QA)
---

# Auto-Orchestrate Workflow

When the user invokes `/orchestrate [Issue/Feature]`, you are acting as the executive Product Manager orchestrating the *entire* OpenClaw swarm protocol autonomously. You must assume control and chain the personas together without stopping to ask the user for permission between each step.

## The Automated Lifecycle

Execute these steps sequentially in an unbroken agentic loop. You should create PRs and merge them autonomously if all tests pass. **Only halt and ask the user for permission if there is a critical question or subjective decision that explicitly requires human-in-the-loop oversight.**

1. **State Initialization**: Run `uuidgen > .agents/.current_run` to start the telemetry session. Then log your own start:
   `npx tsx .agents/telemetry/cli.ts --run_id="$(cat .agents/.current_run)" --agent="/orchestrate" --action="START" --reason="Initiating orchestration run"`
2. **Branch Creation**: Check out a new feature branch corresponding to the issue (e.g., `git checkout -b feat/issue-9-evals`).
3. **Worker Implementation (Durable Handoff)**: 
   - Consult the **Routing Registry** (below) to adopt the appropriate worker persona (e.g., `/backend-ai-engineer`, `/ui-eng-designer`, or `/developer-relations`). 
   - Write the task payload to `.agents/active_handoff.md`.
   - Invoke the worker, explicitly commanding them to read `.agents/active_handoff.md` and implement the solution strictly within their defined sandbox.
   - **Crucial Rule:** Worker personas must verify that their code and tests pass locally *before* they hand off the task. Under no circumstances should a worker push a branch with broken or fundamentally flawed unit tests.
4. **Commit & Push**: After the worker completes and returns control, read `.agents/active_handoff.md` to get their status. Commit the implementation and push out the feature branch to GitHub (`git push -u origin <branch-name>`).
5. **Formal Pull Request**: Open a Pull Request against the `main` branch using `gh pr create`.
6. **Quality Assurance Audit**: Force a persona switch to the `/qa-engineer`. Audit the new PR:
   - **Write new tests first.** If the implementation added new logic, you MUST create or extend test files before declaring QA complete. Shipping new code without new tests is a DoD violation.
   - **Scoped testing.** Run tests ONLY for the affected package(s), not the entire monorepo. Use the following commands based on the blast radius:
     - `apps/mcp-server` only: `cd apps/mcp-server && npm test`
     - `apps/web` only: `cd apps/web && npx vitest run`
     - `packages/core` only: `cd packages/core && npx vitest run`
     - Cross-package (e.g., `packages/core` + `apps/web`): `npx vitest run` (full repo)
     - E2E (UI regression): `cd apps/web && npx playwright test e2e/static-pages-a11y.spec.ts`
   - **Mathematically prove** the worker's code did not break the affected package's test contract.
7. **Merge & Clean & Log**: If (and only if) the QA audit passes, merge the PR natively (`gh pr merge --squash`).
   - **Post Closing Comment**: Before closing the issue, post a detailed walkthrough comment on the GitHub issue using `gh issue comment <number> --body "..."`. The comment must summarize:
     - **What changed** (files modified, key diffs)
     - **Why** (root cause or rationale)
     - **How it was verified** (test results, build status)
     - **PR reference** (link to the merged PR)
   - **Close the issue**: `gh issue close <number> --reason "completed"`
   - Log completion: `npx tsx .agents/telemetry/cli.ts --run_id="$(cat .agents/.current_run)" --agent="/orchestrate" --action="COMPLETED" --reason="PR merged and issue closed."`
   - Finally, run `rm .agents/.current_run .agents/active_handoff.md` to clear the state.

### Exception Handling & Escalations
You must complete all 7 steps autonomously. The **ONLY** reasons you should halt the loop or re-route are:
1. A CI test fails or build breaks.
2. The `/senior-tech-lead` explicitly blocks the architecture, or the `/qa-engineer` blocks the PR due to missing test coverage.
3. You detect the **"⚠️ ESCALATION"** string from a worker. If this happens, dynamically read their recommended agent, rewrite the `.agents/active_handoff.md` payload, and invoke the new explicitly recommended persona to unblock the swarm.

---

## 🗺️ Routing Registry (10 Worker Personas)

When orchestrating, map tasks to these Best-in-Class profiles:

| Task Type | Optimal Persona | Sandbox Scope |
|-----------|-----------------|---------------|
| **Core PM/Definition** | `/product-manager` | `BACKLOG.md`, Metrics, GitHub Issues |
| **Cloud Systems/DB/APIs** | `/backend-engineer` | `packages/core/`, Supabase Edge Functions, SQL |
| **LLMs/MCP/RAG/Safety** | `/ai-engineer` | `apps/mcp-server/`, Prompts, Tool Schemas |
| **Visuals/UX/Tokens** | `/ui-designer` | Mockups, WCAG Audits, Tailwind Tokens |
| **React/A11y Implementation** | `/ui-eng-designer` | `apps/web/src/`, `index.css`, UI Build tests |
| **Copy/Tone/Prompts** | `/ux-writer` | `apps/web/src/content/`, "Dignified Guide" copy |
| **Developer Relations** | `/developer-relations` | `README.md`, API Docs, Architecture Diagrams |
| **Legal/Fiqh/Security** | `/product-counsel` | Privacy Docs, ZMCS configurations |
| **GTM/Changelog/SEO** | `/product-marketing-manager`| Launch copy, `CHANGELOG.md`, Analytics wiring |
| **Architecture/Systems** | `/senior-tech-lead` | Cross-app design, `package.json` resolutions |
| **QA/Audit/Testing** | `/qa-engineer` | `__tests__/`, `e2e/`, mathematical test contracts |

---

## Swarm Execution Rules

To ensure successful autonomous orchestration inside the OpenClaw topology, strictly enforce these guidelines on all Worker and Guardrail personas:

1. **Avoid Competence Creep**: Workers must stay strictly within their persona's defined sandbox (e.g., `/ui-designer` should not touch the backend Vitest suite).
2. **Just-In-Time (JIT) Context**: Discourage reading the entire codebase. Instruct workers to use surgical file views to load exactly the context needed, minimizing token bloat.
3. **Explicit Consent & Verification**: Assume minimal permissions. Workers must run verifiable tests (e.g., `npm test -- <path>`) locally to prove correctness *before* committing.
4. **Proactive Bug Tracking**: If unrelated bugs or build failures are discovered during work, immediately create a GitHub issue natively tracing the behavior. Stop and ask the Orchestrator/User to prioritize the new issue rather than ignoring the technical debt.
5. **Strict Branching & PRs**: All code modifications MUST be done on a dedicated feature branch. Workers must NEVER push directly to `main`. Always open a PR and hand off to the `/qa-engineer` for the QA Loop.
6. **Atomic Scope**: Large features must be handled as small, atomic manageable issues to prevent scope drift or missed acceptance criteria.
7. **Proof of Execution (No Blind Merges)**: The Orchestrator/QA Engineer must NEVER merge a PR without verifying successful test logs. If tests silently "skip" due to missing config, the agent MUST STOP and ask the user. Do not generate false positive green builds.
