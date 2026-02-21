# Contributing to ZakatFlow

Thank you for considering a contribution to ZakatFlow. Every improvement — whether a UI fix, a new MCP tool, or a scholarly methodology preset — helps Muslims calculate their Zakat with greater precision and confidence.

*Last updated: February 21, 2026 (v0.33.0)*

---

## Table of Contents

- [Three Ways to Contribute](#three-ways-to-contribute)
- [Getting Started](#getting-started)
- [Rules & Standards Index](#rules--standards-index)
- [Contributing a Methodology Preset (ZMCS)](#contributing-a-methodology-preset-zmcs)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

---

## Three Ways to Contribute

ZakatFlow is organized as a monorepo with three packages. Each package represents a distinct contribution track.

### Track 1: Web Application (`apps/web`)
Build features that users interact with directly on [zakatflow.org](https://zakatflow.org).

**Key references:**
- [Product Guide](apps/web/PRODUCT.md) — Feature overview
- [React & Styling Rules](apps/web/docs/rules/react-style.md) 
- [Voice & Tone Standards](apps/web/docs/rules/content-voice.md)

### Track 2: AI Agents (`apps/mcp-server`)
Build tools that connect ZakatFlow to AI assistants via the Model Context Protocol.

**Key references:**
- [MCP Server Guide](apps/mcp-server/PRODUCT.md)
- [Backend & Security Rules](apps/web/docs/rules/backend-architecture.md)

### Track 3: ZMCS Methodology Presets (`packages/core`)
Author, audit, or verify scholarly methodology configurations. 

**Key references:**
- [ZMCS Specification](apps/web/docs/ZMCS_SPECIFICATION.md)
- [Contributing a Methodology](apps/web/docs/CONTRIBUTING_METHODOLOGY.md)
- [Zakat Jurisprudence](apps/web/docs/ZAKAT_JURISPRUDENCE.md)

If you are a scholar and would like to audit a preset, please open an issue or contact [naheed@vora.dev](mailto:naheed@vora.dev).

---

## Getting Started

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/zakah.git
   cd zakah
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit with Supabase credentials
   ```

3. **Apply database migrations:**
   ```bash
   supabase link --project-ref YOUR_PROJECT_ID
   supabase db push
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## Rules & Standards Index

To prevent documentation bloat and ensure precise AI Agent orchestration, all technical rules are modularized. **You must review the relevant rules before submitting a PR:**

- **Build Constraints:** [Monorepo Contract](apps/web/docs/rules/monorepo.md) (Read before adding `package.json` dependencies)
- **UI & Accessibility:** [React Style Guide](apps/web/docs/rules/react-style.md)
- **Copy & Terminology:** [Content Voice](apps/web/docs/rules/content-voice.md)
- **Databases & Encryption:** [Backend Architecture](apps/web/docs/rules/backend-architecture.md)
- **AI Agent Topologies:** [AGENTS.md](AGENTS.md) / [Playbook](.agent/workflows/playbook.md)

---

## Contributing a Methodology Preset (ZMCS)

1. **Copy an existing preset** from `packages/core/src/config/presets/`.
2. **Customize all fields** citing authoritative sources (e.g. fatwas, institutions).
3. **Register the preset** in `packages/core/src/config/presets/index.ts`.
4. **Run the compliance test suite:** `npm test -- packages/core/src/config/__tests__/zmcs_compliance.test.ts`
5. **Submit a pull request** with the tag `fiqh: add [methodology-name] preset`.

---

## Pull Request Process & Local Testing Principle

Before opening a pull request, you **MUST** mathematically guarantee that the Lovable cloud build will succeed by running verification in your local environment. 

1. **Create a feature branch** from `main` (`git checkout -b feature/your-feature-name`).
2. Make changes following the relevant indices linked above.
3. **Execute the Local Testing Verifications:**
   ```bash
   # 1. Verify standard unit tests
   npm run test
   
   # 2. Verify accessibility tests
   npx playwright test e2e/static-pages-a11y.spec.ts
   
   # 3. Verify Lovable Cloud Build (MUST be run from the repository root)
   npm run build
   ```
   *Never push your branch if the root `npm run build` fails.*
4. Push and open a pull request on GitHub using Conventional Commits (`feat:`, `fix:`, `docs:`, `fiqh:`).
5. Ensure a Senior Tech Lead stringently reviews the AES-256-GCM architecture implications and test coverage.

---

## Community

- **Issues:** [github.com/naheed/zakah/issues](https://github.com/naheed/zakah/issues)
- **Email:** [naheed@vora.dev](mailto:naheed@vora.dev)
- **Live App:** [zakatflow.org](https://zakatflow.org)

**JazakAllah khair for contributing.** May Allah accept your efforts.
