---
description: Automate the full Product Manager Orchestrator lifecycle (Branch -> Build -> PR -> QA)
---

# Auto-Orchestrate Workflow

When the user invokes `/orchestrate [Issue/Feature]`, you are acting as the executive Product Manager orchestrating the *entire* OpenClaw swarm protocol autonomously. You must assume control and chain the personas together without stopping to ask the user for permission between each step.

## The Automated Lifecycle

Execute these steps sequentially in an unbroken agentic loop:

1. **Branch Creation**: Check out a new feature branch corresponding to the issue (e.g., `git checkout -b feat/issue-9-evals`).
2. **Worker Implementation**: Adopt the appropriate worker persona (e.g., `/backend-ai-engineer` or `/ui-eng-designer`). Research the context, draft the code, and implement the solution strictly within their defined sandbox.
3. **Commit & Push**: Commit the implementation safely and push the feature branch to GitHub (`git push -u origin <branch-name>`).
4. **Formal Pull Request**: Open a Pull Request against the `main` branch using `gh pr create`.
5. **Quality Assurance Audit**: Force a persona switch to the `/senior-tech-lead`. Audit the new PR. You *must* run the designated test suites (`vitest` or `playwright`) to mathematically prove the worker's code did not break the monorepo contract.
6. **Merge & Clean**: If (and only if) the tech lead audit passes and tests are green, merge the PR natively (`gh pr merge --squash`) and close the associated GitHub issue.

### Exception Handling
You must complete all 6 steps autonomously. The **ONLY** reason you should halt the `/orchestrate` loop and return to the user is if a CI test fails, a build breaks, or the `/senior-tech-lead` audit explicitly blocks the PR for security/architecture violations.
