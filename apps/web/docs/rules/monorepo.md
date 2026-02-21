# Monorepo Build Contract

ZakatFlow builds entirely inside Lovable's single-package environment. To prevent deployment failures and local configuration drift, **all AI Agents and Human Contributors must strictly obey the following 6 Rules**:

1. **Root Source of Truth:** 
   The root `package.json` solves dependencies for the Lovable build. Lovable *does not* read `apps/web/package.json`.
   
2. **Synchronized Dependencies:** 
   If you add a dependency to `apps/web/package.json`, you *MUST* simultaneously add it to the root `/package.json` with the exact same version range.

3. **Wrapper Configurations:** 
   The root config files (`vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, and `postcss.config.cjs`) point the build processes down to `apps/web/src`. Do not delete them or re-home them.

4. **Internal Package Resolution:** 
   The calculation engine `packages/core` is resolved via a Vite alias (`@zakatflow/core` → `packages/core/src/index.ts`). It is *not* resolved via NPM standard workspaces.

5. **MCP Server Isolation:** 
   `apps/mcp-server` is NOT built by Lovable. It contains its own isolated build pipeline and multi-stage `Dockerfile`.

6. **Pinned Core Infrastructure:** 
   React 18 and Tailwind v3 are explicitly pinned. Do not initiate an upgrade to React 19 or Tailwind v4 without a coordinated, cross-team migration plan involving the Senior Tech Lead.

7. **Local Testing Principle (Zero-Defect Pushes):**
   Before initiating *any* GitHub push or PR, both human contributors and AI Agents **MUST** execute local verification. 
   - Lovable deploys from the root directory. Therefore, **`npm run build` from the repository root** is the single source of truth for deployment success.
   - You must also verify unit/e2e tests pass (`npm run test`).
   - Never push code if `npm run build` at the root directory fails.
