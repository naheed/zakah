---
description: How to orchestrate Antigravity personas in a continuous, agile workflow
---

# ZakatFlow Agile Playbook (OpenClaw Inspired)

This playbook defines how to use the 11 core ZakatFlow personas together in a fluid, continuous iteration cycle. Inspired by the orchestration patterns of **OpenClaw/Clawdbot**, we avoid rigid waterfall handoffs or "competence creep." Instead, the goal is **Continuous Refinement** via explicitly scoped, context-aware agent interactions utilizing the new Intelligence Layer.

## The 11-Agent "Orchestrator + Worker" Swarm Model

In the OpenClaw topology, agents perform best when their boundaries are strictly enforced. We mimic this by designating the `/orchestrate`, `/product-manager`, or `/senior-tech-lead` as the **Orchestrators** (holding the full context/memory), who then direct specialized **Worker** personas to execute focused tasks.

### 1. The Kickoff (Defining the "Job to be Done")
* **Role:** Orchestrator (`/product-manager`)
* **Focus:** Define the problem, acceptance criteria, and Just-In-Time (JIT) context. 
* **Action:** The PM establishes the minimum necessary context before invoking workers. They prevent "context bloat" by only passing relevant requirements.
* **Example:** 
  > You: "/product-manager We need a CSV export feature. Define the MVP and the Google Analytics event."
  > PM: *Creates the GitHub issue and explicitly lists the 3 specific files the workers will need to touch.*

### 2. The Sandbox Implementation (Code -> Critique)
* **Role:** Specialist Workers (`/backend-engineer`, `/ai-engineer`, `/ui-eng-designer`, `/ui-designer`, `/ux-writer`)
* **Focus:** Build and refine within strict boundaries. Prevent "competence creep."
* **Best Practice:** Give the worker *fresh* context via the `.agents/active_handoff.md` file. The UI Engineer shouldn't attempt to rewrite the backend SQL during this phase. 
* **Action:**
  > You: "/backend-engineer Using the PM's spec in the handoff file, build the CSV data parser in `packages/core`. Do not touch the React UI."
  > You: "/ui-eng-designer Build the generic React button for the CSV download."
  > You: "/ui-designer Look at the UI Engineer's button. How should we adjust the Tailwind tokens to align with ZakatFlow's visual hierarchy?"

### 3. The Quality Assurance Loop (A11y, Fiqh, Security)
* **Role:** Guardrail Orchestrators (`/product-counsel`, `/senior-tech-lead`)
* **Focus:** The feature works, but is it compliant? This mirrors OpenClaw's "Consent Mode" and minimal-permission philosophy.
* **Action:** The Guardrails audit the workers' output before any code is committed or merged.
  > You: "/product-counsel Review the CSV export. Does exposing this data violate our Sovereign mode encryption promises?"
  > You: "/senior-tech-lead Audit the PR. Run the Playwright a11y tests and check against OpenClaw security principles (e.g., no raw shell execution exposed via the UI)."

### 4. The Launch Cycle
* **Role:** Polishers (`/product-marketing-manager`, `/product-manager`)
* **Action:** The PMM translates the technical merge into GTM copy (`CHANGELOG.md`), and the PM verifies telemetry.

---

## Agent Guidelines for OpenClaw-Style Collaboration

To make this swarm model work, you must adhere to these rules when adopting a persona:

1. **Avoid Competence Creep:** If you are the `/ui-designer`, do not attempt to fix the Vitest suite. Stay strictly within your persona's defined sandbox and boundaries.
2. **Just-In-Time (JIT) Context:** Do not read the entire codebase for a button change. Use surgical file views (e.g., `view_file`) to load exactly the context you need, minimizing token consumption and hallucinations.
3. **Explicit Consent & Verification:** Like OpenClaw's safety model, assume you have minimal permissions. Always run the designated verifiable tests (e.g., `npm test -- packages/core/src/config/__tests__/zmcs_compliance.test.ts`) to prove your work is correct. 
4. **Critique the Actual State:** Do not generate hypothetical specs if code already exists. Point directly to line numbers in the live React components or SQL schemas when proposing refinements.
5. **Proactive Bug Tracking (Log It to Fix It):** If any issues, broken tests, or build failures are discovered while working on a different task, the agent must *immediately* create a GitHub issue natively tracing the errant behavior. After logging it, the agent must ask the `/product-manager` to prioritize the new issue (e.g. assigning priority P0 vs P3). Do not let technical debt slip away unlogged.
6. **Strict Branching & PRs (No Direct Commits to Main):** All code modifications MUST be done on a dedicated feature branch (e.g., `feat/ahmed-matrix`). Workers must NEVER commit or push directly to the `main` branch. After pushing the branch, you must open a formal GitHub Pull Request (PR) and explicitly hand off the task to the `/senior-tech-lead` to execute the Quality Assurance Loop before the code can be merged.
7. **Atomic, Granular Scope (Prevent Scope Drift):** Large features must be broken down into small, atomic manageable issues to prevent losing context or ignoring acceptance criteria. For example, instead of one massive PR for "Agentic Evals," create three separate issues: one for Claude, one for Gemini, and one for OpenAI. The Orchestrator must enforce this granularity before assigning workers.
8. **Proof of Execution (No Blind Merges):** The Orchestrator/Tech Lead must NEVER merge a PR without verifying explicitly successful test execution logs. If tests silently "skip" or exit `0` because of missing API keys, environment variables, or mock data, the agent MUST STOP and ask the user to provide the required configuration. Do not generate false positive green builds.
9. **Durable File Handoffs:** Never pass critical state strictly via conversational memory. Between every worker invocation, use `.agents/active_handoff.md` to pass accomplishments, blockers, and next steps to the next agent.
10. **Telemetry Logging:** Every agent phase must culminate in terminal-based telemetry using `.agents/.current_run` to prevent "silent failures" in the swarm. Run `npx tsx .agents/telemetry/cli.ts` locally to append your run state.
