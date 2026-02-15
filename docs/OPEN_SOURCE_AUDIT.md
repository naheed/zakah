# Open Source Readiness Audit

**Date:** February 14, 2026  
**Purpose:** Audit the repository for public release; identify sensitive content, history exposure, and document the two strategies (clean this repo vs. fresh clone) previously outlined in the backlog.

---

## 1. Executive Summary

The codebase is **not yet safe to open-source as-is** because:

1. **Git history** contains commits where `.env` (with real Supabase credentials) was tracked; that content remains in history even though `.env` was later removed and added to `.gitignore`.
2. **Tracked files** include `.lovable/plan.md` and `supabase/config.toml`, which contain your **real Supabase project ID** (`pcwdpsoheoiiavkeyeyx`). The Lovable plan file also describes the previous credential leak and how to restore `.env` with that project.
3. **BACKLOG.md** already recommends a **“Fresh repo recommended”** branching strategy for the open-source launch and lists security pre-requisites (rotate anon key, ensure `.gitignore` excludes `.env`).

You have **two main options**: **Option A — Clean this repo** (sanitize current repo and optionally rewrite history), or **Option B — Fresh clone** (new repo with no history). Option B is the backlog’s recommended approach and is the only way to guarantee no credential or project-identifying data in history.

---

## 2. Current State: Sensitive and Tool-Specific Content

### 2.1 Git history (credentials / env)

| Item | Status | Risk |
|------|--------|------|
| `.env` in history | **Exposed** — was committed in at least 4 commits (e.g. `137cdc2`, `5201437`, `ea6dbdd`; removed in `9b529c7`) | **High** — Anyone who clones and inspects history can recover the old `.env` (Supabase URL, project ID, and at that time likely the anon key). |
| `.gitignore` for `.env` | **Fixed** — `.env`, `.env.local`, `.env.*.local` are ignored (no `!.env`) | Current working tree is safe; history is not. |

**Conclusion:** Even if you never commit `.env` again, **past commits still contain it**. The only way to remove it entirely is to rewrite history (Option A.2) or use a fresh repo (Option B).

### 2.2 Tracked files containing project-specific or sensitive info

| File | Content | Risk |
|------|---------|------|
| **`.lovable/plan.md`** | Real Supabase project ID `pcwdpsoheoiiavkeyeyx`, URL, and instructions to put anon key in `.env`; narrative about the previous credential leak | **Medium** — Exposes your Supabase project and suggests keys were once in repo. Not in `.gitignore`; currently tracked. |
| **`supabase/config.toml`** | `project_id = "pcwdpsoheoiiavkeyeyx"` | **Medium** — Links the repo to your real Supabase project. Often kept for local/linked development; for a public repo you may want a placeholder or to gitignore project-specific overrides. |

No other **hardcoded secrets** (API keys, passwords, tokens) were found in the **current** tree. Secrets are correctly referenced via `import.meta.env` / `Deno.env.get(...)` and documented in `.env.example` and `docs/SECURITY.md`.

### 2.3 Safe / already in good shape

- **`.env.example`** — Placeholder-only; safe and useful for contributors.
- **`docs/SECURITY.md`** — Clear on what is safe vs. never commit; no secrets.
- **LICENSE** — Already AGPL-3.0 (backlog’s target).
- **Code** — No credentials in source; uses env vars and Supabase secrets as intended.

---

## 3. Backlog Strategy (Phase 14) — Recap

From **BACKLOG.md** (Phase 14: Open Source Launch):

- **Pre-requisites (Security):**
  - Rotate Supabase anon key (Dashboard → Settings → API).
  - Fix `.gitignore` to exclude `.env` — **already done**.
  - **Choose branching strategy (Fresh repo recommended).**

So the **previously explored strategy** was:

1. **Security:** Rotate anon key, ensure `.env` never committed (done for future commits; history still has old `.env`).
2. **Strategy choice:** Prefer a **fresh repo** over cleaning the current one, to avoid history containing credentials or project identifiers.

This audit aligns with that: **Option B (fresh clone)** is the only way to guarantee no credential or project ID in history without doing history rewrites.

---

## 4. Options for Going Open Source

### Option A — Clean this repository

Keep this repo and make it safe for public clone.

**A.1 — Minimal clean (no history rewrite)**  
- **Do:**  
  - Remove or sanitize **tracked** sensitive/tool-specific content:  
    - **`.lovable/plan.md`** — Delete from repo and add `.lovable/` to `.gitignore`, **or** replace content with a generic “Lovable plan” placeholder (no project IDs, no env examples with real IDs).  
    - **`supabase/config.toml`** — Replace `project_id` with a placeholder (e.g. `your-project-id`) or document that contributors must set it locally; optionally add a `config.toml.example` and ignore `config.toml` for project-specific overrides.  
  - Rotate **Supabase anon key** (and any other keys that might have been in old `.env`).  
  - Rely on **GitHub secret scanning** and **Dependabot** as in backlog.  
- **Do not:** Rely on “we don’t commit .env anymore.”  
- **Result:** **Current tree** is clean; **history still contains** the old `.env` and possibly the old anon key. Anyone who runs `git log -p -- .env` (or similar) can see past content.  
- **When to use:** If you accept that history is permanently compromised for this repo and you rotate all keys that were ever in that `.env`, and you are okay with the project ID having been in history in `.lovable/plan.md` and possibly elsewhere.

**A.2 — Full clean (history rewrite)**  
- **Do:** Everything in A.1, plus **rewrite history** so that `.env` and `.lovable/plan.md` (and any other sensitive files) never appear in any commit (e.g. `git filter-repo` or BFG to remove those paths and optionally replace `config.toml` / `plan.md` with sanitized versions in the rewritten history).  
- **Then:** Force-push to the main remote; all clones must re-clone.  
- **Result:** Repo has no history of `.env` or of the Lovable plan with real project ID (if you remove/sanitize it in the rewrite).  
- **Cost:** History changes; force-push; coordination with anyone who has clones.  
- **When to use:** When you want to keep a single repo and its history but make history “clean” for open source.

### Option B — Fresh clone (new repo, no history) — **Recommended in backlog**

Create a **new** repository whose **only** history is a single (or few) initial commit(s) with the **current, sanitized tree**. No old commits, no `.env`, no old `.lovable/plan.md` with real project ID.

**Steps (high level):**

1. **Sanitize the current tree** (same as A.1):  
   - Remove or genericize `.lovable/plan.md`; add `.lovable/` to `.gitignore`.  
   - Replace real `project_id` in `supabase/config.toml` with a placeholder or use a template.  
   - Ensure `.env` and `.env.local` are never added (already in `.gitignore`).
2. **Rotate Supabase anon key** (and any other keys that ever lived in `.env`).
3. **Create a new repo** (e.g. `zakatflow-public` or under an org).
4. **Copy only the current tree** (no history):  
   - `git clone --depth 1 file:///path/to/zakah zakah-clean && cd zakah-clean`  
   - Or: fresh init + `cp -r` (excluding `.git`) then one initial commit.  
5. **Add remote** pointing to the new repo; push (e.g. `main`).
6. **Optionally** keep the **current** repo as private “source of truth” with full history, and treat the new repo as the public, history-clean mirror.

**Result:**  
- Public repo has **zero** history of credentials or of the real project ID in `.lovable/plan.md`.  
- No force-push or history rewrite on the main dev repo.  
- Clear separation: private repo = full history; public repo = clean, open-source-ready.

**When to use:** When you want the strongest guarantee that no one can recover credentials or project identifiers from git history, and you’re okay maintaining two repos (or replacing the current one with the clean one and archiving the old one).

---

## 5. Recommendation Summary

| Goal | Suggested option |
|------|-------------------|
| Strongest guarantee: no credentials or project ID in any reachable history | **Option B (fresh clone)** |
| Keep this repo and its history, accept that old .env was in history | **Option A.1** + rotate all keys + sanitize tracked files |
| Keep this repo but make history clean | **Option A.2** (history rewrite) |

The backlog’s “Fresh repo recommended” aligns with **Option B**. If you choose Option B, complete the “Sanitize current tree” and “Rotate keys” steps before creating the first commit in the new repo.

---

## 6. Checklist Before Going Public (either option)

- [ ] **Rotate Supabase anon key** (and any other keys that were ever in `.env`).
- [ ] **Remove or sanitize `.lovable/plan.md`** (no real project ID/URL/keys); add `.lovable/` to `.gitignore` if you keep the directory for local use only.
- [ ] **Sanitize `supabase/config.toml`** (placeholder `project_id` or example + gitignore for local overrides).
- [ ] Confirm **`.env` and `.env.local`** are in `.gitignore` (already done).
- [ ] If **Option A.2:** run history rewrite, then force-push and coordinate with collaborators.
- [ ] If **Option B:** create new repo, copy only sanitized tree, push, then add branch protection / Dependabot / SECURITY.md / CODE_OF_CONDUCT.md per BACKLOG Phase 14.
- [ ] Enable **GitHub secret scanning** and **Dependabot** on the public repo.
- [ ] Document in README or CONTRIBUTING that contributors must use their own Supabase project and `.env.example` (already documented in `.env.example` and `docs/SECURITY.md`).

---

## 7. References

- **BACKLOG.md** — Phase 14: Open Source Launch (pre-requisites, branching strategy, license, GitHub setup).
- **docs/SECURITY.md** — What’s safe to commit, secret management, Supabase anon key as publishable.
- **.env.example** — Template for contributors; no real values.
- **.gitignore** — `.env`, `.env.local`, `.env.*.local` (and test artifacts) already excluded.
