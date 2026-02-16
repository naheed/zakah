# Agent Workflow: Cursor + Antigravity + GitHub

**Purpose:** Run Cursor and Antigravity agents on the same project without conflicts, using GitHub as source of truth, with branches, PRs, and issues for velocity and traceability.

---

## 1. Recommended Setup

### 1.1 Two working copies (recommended)

Use **two separate clones** of the same GitHub repo so each environment has its own working tree and branch:

| Clone | Location (example) | Used by | Default branch to work on |
|-------|--------------------|--------|---------------------------|
| **Clone A** | `~/code/zf/zakah` (or `zakah-cursor`) | Cursor + Cursor agents | `main` or feature branch |
| **Clone B** | `~/code/zf/zakah-antigravity` (or similar) | Antigravity + Antigravity agents | `main` or feature branch |

- **Single source of truth:** GitHub `main` (or your default branch).
- **Sync:** Each clone `git fetch origin` and `git checkout main && git pull` before starting work. Create **new branches from up-to-date main** so you don’t base work on stale state.
- **Why two directories:** Prevents one agent from overwriting the other’s files or switching branches while the other is mid-task. Merges happen on GitHub via PRs, not in one shared folder.

### 1.2 One clone (alternative)

If you prefer a single directory:

- Only one agent (Cursor or Antigravity) should run at a time.
- Always commit (and push) your branch before switching context or running the other agent.
- Risk: uncommitted changes or branch switches can confuse the other agent.

**Recommendation:** Use two clones when both Cursor and Antigravity are active on the same project.

---

## 2. Branch strategy

- **`main`** — Always shippable. Protected; updates only via merged PRs.
- **Feature/fix branches** — One branch per issue (or per logical change). Merge into `main` via PR.

### 2.1 Branch naming

Use a consistent pattern so you can see what work lives where:

- `issue/<number>-<short-slug>` — e.g. `issue/42-plaid-account-type`
- `feature/<short-slug>` — e.g. `feature/reports-yoy`
- `fix/<short-slug>` — e.g. `fix/nisab-cache`

Pick one convention and stick to it. Issue-based names make it easy to link PRs to GitHub Issues.

### 2.2 Creating and pushing branches

In **Cursor’s clone** (or Antigravity’s):

```bash
git fetch origin
git checkout main
git pull origin main
git checkout -b issue/99-my-feature
# ... work, commit ...
git push -u origin issue/99-my-feature
```

Then open a PR on GitHub from `issue/99-my-feature` → `main`.

---

## 3. Using GitHub Issues for agent work

### 3.1 Why use issues

- **Backlog:** One place for “what needs to be done” (can mirror or link to BACKLOG.md).
- **Ownership:** Assign an issue to “Cursor” or “Antigravity” (or to yourself and use labels).
- **Traceability:** PRs reference issues; releases can list “Fixed #12, #15”.

### 3.2 Creating issues for agent work

When you want an agent to do something:

1. Create a **GitHub Issue** with:
   - **Title:** Short, actionable (e.g. “Add YoY comparison to Reports”).
   - **Description:** Acceptance criteria, scope, and any constraints (e.g. “see BACKLOG Phase 15”).
   - **Labels:** e.g. `cursor`, `antigravity`, `phase-15`, `frontend`, `backend`, `docs`.
2. Optionally **assign** yourself (or leave unassigned and use labels to indicate which tool will pick it up).
3. In the right clone, create a branch named after the issue (e.g. `issue/99-yoy-reports`), do the work, push, and open a PR that **closes** the issue (e.g. “Fixes #99” in the PR description).

### 3.3 Suggested labels

| Label | Purpose |
|-------|--------|
| `cursor` | Work intended for Cursor / Cursor agents |
| `antigravity` | Work intended for Antigravity / Antigravity agents |
| `phase-14`, `phase-15`, … | Tied to BACKLOG phases |
| `frontend` / `backend` / `docs` / `infra` | Scope so you can avoid two agents editing the same area in parallel |
| `priority:p0`, `priority:p1`, … | Priority (align with BACKLOG if you like) |

You can add more (e.g. `good first issue`, `release-blocker`).

### 3.4 Who does what

- **Option A — You assign:** Create an issue, assign it to yourself, add label `cursor` or `antigravity`, then in that tool’s clone create the branch and do the work.
- **Option B — Claim by label:** Create issues with labels; when you run Cursor you pick any open issue with `cursor` (and maybe `unassigned`); when you run Antigravity you pick one with `antigravity`. Remove the label or assign when claimed to avoid duplicate work.
- **Option C — Scope by area:** Use `frontend` / `backend` (or similar) and a rule of thumb: e.g. Cursor = frontend + docs, Antigravity = backend + infra. Both can still work in the same repo; they just tend to touch different files.

---

## 4. Day-to-day workflow (per agent)

1. **Sync:** In that agent’s clone: `git fetch origin && git checkout main && git pull origin main`.
2. **Pick work:** Choose an open GitHub Issue (by label/assignment or from BACKLOG).
3. **Branch:** `git checkout -b issue/<num>-<slug>` (or `feature/<slug>`).
4. **Work:** Make changes in that clone; commit often with clear messages (e.g. “Add YoY comparison component”, “Fixes #99”).
5. **Push and PR:** `git push -u origin <branch>`, then open a PR on GitHub targeting `main`. In the PR description, add “Fixes #99” (or “Closes #99”) so the issue auto-closes on merge.
6. **Review and merge:** Review the PR (yourself or a teammate), merge into `main`, then delete the branch if desired.
7. **Next task:** In the **same** clone, go back to step 1 and pick another issue (so you always work from an up-to-date `main` in that clone).

Avoid: working in both Cursor and Antigravity on the **same** branch in the **same** directory. Use two clones and different branches, then merge via PRs.

---

## 5. Major releases (versioned releases)

### 5.1 When to cut a release

- After a set of features/fixes from BACKLOG (e.g. “Phase 15 done”).
- When you want a stable tag for deploy or for “what’s in production.”

### 5.2 Release workflow (simple)

1. **Stabilize `main`:** All work for the release is merged to `main` (via PRs). No “WIP” for this release left on `main`.
2. **Version bump:** On `main`, update version in `package.json` (and anywhere else you track version, e.g. CHANGELOG or docs). Commit: e.g. `chore: release v0.29.0`.
3. **Tag:** `git tag -a v0.29.0 -m "Release v0.29.0"` then `git push origin v0.29.0`.
4. **Changelog:** Update CHANGELOG.md (or release notes) with what’s in this release; commit before or with the version bump.
5. **GitHub Release (optional):** On GitHub, create a Release from tag `v0.29.0`, paste in the changelog or summary. Good for visibility and for tools that watch releases.

### 5.3 Release branches (optional, for hotfixes)

If you need to patch an already-released version while `main` has moved on:

- Create `release/0.29` from tag `v0.29.0`.
- Make hotfix commits on `release/0.29`, then tag `v0.29.1` and merge `release/0.29` back into `main` so main has the fix too.

For many projects, “release from `main` + tag” is enough; add release branches when you need to maintain multiple versions.

### 5.4 Aligning with BACKLOG

- In BACKLOG.md, mark phases/items as done and (optionally) note the version: e.g. “Phase 15 ✅ (v0.29.0)”.
- In GitHub Issues, close issues that are done and reference the release (e.g. “Shipped in v0.29.0”). Labels like `phase-15` help when you’re preparing release notes.

---

## 6. Quick reference

| Goal | Action |
|------|--------|
| Start work in Cursor | Use Cursor’s clone; sync from `main`; create branch; open issue or pick one with `cursor`. |
| Start work in Antigravity | Use Antigravity’s clone; sync from `main`; create branch; open issue or pick one with `antigravity`. |
| Merge work | Open PR from feature branch → `main`; add “Fixes #N”; review and merge on GitHub. |
| Cut a release | Bump version on `main`, update CHANGELOG, tag (e.g. `v0.29.0`), push tag, optionally create GitHub Release. |
| Avoid conflicts | Two clones; one branch per issue/feature; merge only via PRs; don’t share the same directory between Cursor and Antigravity. |

---

## 7. Summary

- **Setup:** Two clones (one for Cursor, one for Antigravity); GitHub = source of truth.
- **Workflow:** Issues drive work → branch per issue/feature → PR → merge to `main`.
- **Releases:** Stabilize `main` → version bump + CHANGELOG → tag → optional GitHub Release.
- **Velocity:** Both agents can work in parallel in different directories and branches; coordination happens via issues (labels/assignment) and PRs.

You can extend this with GitHub Actions (e.g. CI on PRs, or “when PR merges to main, run deploy”) and more labels as the project grows.
