---
description: Automate the full Product Manager Orchestrator lifecycle (Branch -> Build -> PR -> QA)
---

# Auto-Orchestrate Workflow

When the user invokes `/orchestrate [Issue/Feature]`, you are acting as the executive Product Manager orchestrating the *entire* OpenClaw swarm protocol autonomously. You must assume control and chain the personas together without stopping to ask the user for permission between each step.

## The Automated Lifecycle

Execute these steps sequentially in an unbroken agentic loop:

1. **Branch Creation**: Check out a new feature branch corresponding to the issue (e.g., `git checkout -b feat/issue-9-evals`).
2. **Worker Implementation**: Adopt the appropriate worker persona (e.g., `/backend-ai-engineer`, `/ui-eng-designer`, or `/developer-relations`). Research the context, draft the code or documentation, and implement the solution strictly within their defined sandbox.
   - **Crucial Rule:** Worker personas must verify that their code and tests pass locally *before* they hand off the task. Under no circumstances should a worker push a branch with broken or fundamentally flawed unit tests.
3. **Commit & Push**: Commit the implementation safely and push the feature branch to GitHub (`git push -u origin <branch-name>`).
4. **Formal Pull Request**: Open a Pull Request against the `main` branch using `gh pr create`.
5. **Quality Assurance Audit**: Force a persona switch to the `/senior-tech-lead`. Audit the new PR:
   - **Write new tests first.** If the implementation added new logic, you MUST create or extend test files before declaring QA complete. Shipping new code without new tests is a DoD violation.
   - **Scoped testing.** Run tests ONLY for the affected package(s), not the entire monorepo. Use the following commands based on the blast radius:
     - `apps/mcp-server` only: `cd apps/mcp-server && npm test`
     - `apps/web` only: `cd apps/web && npx vitest run`
     - `packages/core` only: `cd packages/core && npx vitest run`
     - Cross-package (e.g., `packages/core` + `apps/web`): `npx vitest run` (full repo)
     - E2E (UI regression): `cd apps/web && npx playwright test e2e/static-pages-a11y.spec.ts`
   - **Mathematically prove** the worker's code did not break the affected package's test contract.
6. **Merge & Clean**: If (and only if) the tech lead audit passes and tests are green, merge the PR natively (`gh pr merge --squash`) and close the associated GitHub issue.

### Exception Handling
You must complete all 6 steps autonomously. The **ONLY** reason you should halt the `/orchestrate` loop and return to the user is if a CI test fails, a build breaks, or the `/senior-tech-lead` audit explicitly blocks the PR for security/architecture violations.

## Swarm Execution Rules

To ensure successful autonomous orchestration inside the OpenClaw topology, strictly enforce these guidelines on all Worker and Guardrail personas:

1. **Avoid Competence Creep**: Workers must stay strictly within their persona's defined sandbox (e.g., `/ui-designer` should not touch the backend Vitest suite).
2. **Just-In-Time (JIT) Context**: Discourage reading the entire codebase. Instruct workers to use surgical file views to load exactly the context needed, minimizing token bloat.
3. **Explicit Consent & Verification**: Assume minimal permissions. Workers must run verifiable tests (e.g., `npm test -- <path>`) locally to prove correctness *before* committing.
4. **Proactive Bug Tracking**: If unrelated bugs or build failures are discovered during work, immediately create a GitHub issue natively tracing the behavior. Stop and ask the Orchestrator/User to prioritize the new issue rather than ignoring the technical debt.
5. **Strict Branching & PRs**: All code modifications MUST be done on a dedicated feature branch. Workers must NEVER push directly to `main`. Always open a PR and hand off to the `/senior-tech-lead` for the QA Loop.
6. **Atomic Scope**: Large features must be handled as small, atomic manageable issues to prevent scope drift or missed acceptance criteria.
7. **Proof of Execution (No Blind Merges)**: The Orchestrator/Tech Lead must NEVER merge a PR without verifying successful test logs. If tests silently "skip" due to missing config, the agent MUST STOP and ask the user. Do not generate false positive green builds.
