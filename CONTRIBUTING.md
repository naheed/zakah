# Contributing to ZakatFlow

Thank you for considering a contribution to ZakatFlow. Every improvement — whether a UI fix, a new MCP tool, or a scholarly methodology preset — helps Muslims calculate their Zakat with greater precision and confidence.

*Last updated: February 17, 2026 (v0.32.0)*

---

## Table of Contents

- [Three Ways to Contribute](#three-ways-to-contribute)
- [Getting Started](#getting-started)
- [Monorepo Build Contract](#monorepo-build-contract)
- [Style Guide](#style-guide)
  - [Code Standards](#code-standards)
  - [User-Facing String Standards](#user-facing-string-standards)
  - [Documentation Standards](#documentation-standards)
- [Contributing a Methodology Preset (ZMCS)](#contributing-a-methodology-preset-zmcs)
- [Pull Request Process](#pull-request-process)
- [Fiqh Considerations](#fiqh-considerations)
- [Documentation Index](#documentation-index)
- [Community](#community)

---

## Three Ways to Contribute

ZakatFlow is organized as a monorepo with three packages. Each package represents a distinct contribution track.

### Track 1: Web Application (`apps/web`)

Build features that users interact with directly on [zakatflow.org](https://zakatflow.org).

**What you can work on:**
- Wizard steps, form components, and the asset dashboard
- Report generation (PDF, CSV, print)
- Visualization (Sankey charts, progress indicators)
- Accessibility improvements (WCAG 2.1 AA compliance)
- Responsive design and mobile experience
- Content and copy improvements

**Key references:**
- [Product Guide](apps/web/PRODUCT.md) — Feature overview
- [Engineering Design](apps/web/docs/ENGINEERING_DESIGN.md) — Architecture and data flow
- [Content Standards](apps/web/docs/CONTENT_STANDARDS.md) — Voice, tone, and terminology
- Design system: shadcn/ui components, Tailwind semantic tokens, Phosphor Icons

**Directory structure:**

```
apps/web/src/
├── components/
│   ├── ui/               # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   ├── zakat/            # Wizard steps, report, Sankey chart
│   ├── assets/           # Asset management dashboard
│   ├── vault/            # Privacy Vault (encryption UI)
│   ├── donations/        # Donation tracking and receipt scanning
│   └── upload/           # Batch document upload
├── hooks/                # Custom React hooks (useAuth, usePrivacyVault, etc.)
├── lib/                  # Business logic, encryption, PDF generation
├── content/              # User-facing copy, fiqh explanations
├── pages/                # Route components
└── types/                # TypeScript interfaces
```

### Track 2: AI Agents (`apps/mcp-server`)

Build tools that connect ZakatFlow to AI assistants via the Model Context Protocol.

**What you can work on:**
- New MCP tools (e.g., charitable giving recommendations, Hawl tracking)
- Agent protocol authoring (per-methodology behavioral instructions)
- Transport improvements (SSE reliability, new transport support)
- Testing and documentation

**Key references:**
- [MCP Server Product Guide](apps/mcp-server/PRODUCT.md) — Tool documentation and quick start
- [MCP Specification](https://modelcontextprotocol.io) — Protocol standard

**How to add a new tool:**

1. Create a new file in `apps/mcp-server/src/tools/` (e.g., `my_tool.ts`)
2. Export a function that registers the tool on a `McpServer` instance
3. Import and call the registration function in both `src/index.ts` (SSE) and `src/stdio.ts` (Stdio)
4. Test with [MCP Inspector](https://github.com/modelcontextprotocol/inspector): `npx @modelcontextprotocol/inspector http://localhost:3001/mcp`

**Directory structure:**

```
apps/mcp-server/src/
├── index.ts              # SSE transport entry point (Express server)
├── stdio.ts              # Stdio transport entry point
├── session/
│   └── store.ts          # In-memory session store
└── tools/
    ├── calculate_zakat.ts    # Full Zakat calculation
    ├── parse_blob.ts         # Unstructured text parser
    ├── interactive.ts        # Session management (start_session, add_asset)
    ├── agent_protocol.ts     # Methodology agent protocols
    ├── market.ts             # Gold/silver market prices
    ├── discovery.ts          # list_methodologies, get_nisab_info
    └── reporting.ts          # Deep link report generation
```

### Track 3: ZMCS Methodology Presets (`packages/core`)

Author, audit, or verify scholarly methodology configurations. **We are actively seeking contributors to audit existing presets and get them verified by respective scholars or Islamic bodies.**

**What you can work on:**
- Audit existing presets against primary scholarly sources
- Author new methodology presets (e.g., Deobandi, Salafi, ISNA, local institutional standards)
- Submit presets for scholar certification
- Improve the ZMCS specification itself

**Key references:**
- [ZMCS Specification](apps/web/docs/ZMCS_SPECIFICATION.md) — Full schema reference (60+ parameters)
- [Contributing a Methodology](apps/web/docs/CONTRIBUTING_METHODOLOGY.md) — Step-by-step preset guide
- [Zakat Jurisprudence](apps/web/docs/ZAKAT_JURISPRUDENCE.md) — Fiqh foundations

**Directory structure:**

```
packages/core/src/
├── config/
│   ├── types.ts              # ZakatMethodologyConfig type definition
│   ├── schema.ts             # Zod validation schema
│   ├── defaults.ts           # Bradford (Balanced) default configuration
│   ├── loader.ts             # Config loading and validation
│   ├── difference-engine.ts  # Cross-methodology comparison logic
│   ├── presets/
│   │   ├── index.ts          # Preset registry (ZAKAT_PRESETS)
│   │   ├── amja.ts           # AMJA preset
│   │   ├── tahir_anwar.ts    # Imam Tahir Anwar preset
│   │   ├── qaradawi.ts       # Dr. Al-Qaradawi preset
│   │   ├── hanafi.ts         # Hanafi Classical preset
│   │   ├── shafii.ts         # Shafi'i Classical preset
│   │   ├── maliki.ts         # Maliki Classical preset
│   │   └── hanbali.ts        # Hanbali Classical preset
│   └── agent/
│       └── index.ts          # Agent protocol definitions (per-methodology)
├── calculators/
│   ├── assets.ts             # Asset calculation logic
│   └── liabilities.ts        # Liability deduction logic
├── types.ts                  # ZakatFormData, ZakatReport, etc.
├── calculator.ts             # Main calculateZakat() entry point
└── index.ts                  # Public API exports
```

**Preset verification status:**

| Preset | Scholar / Institution | Status | Certified By |
|:---|:---|:---|:---|
| `balanced` | Sheikh Joe Bradford | Awaiting audit | — |
| `amja` | AMJA | Awaiting audit | — |
| `tahir_anwar` | Imam Tahir Anwar | Awaiting audit | — |
| `qaradawi` | Dr. Yusuf Al-Qaradawi | Awaiting audit | — |
| `hanafi` | Hanafi Classical | Awaiting audit | — |
| `shafii` | Shafi'i Classical | Awaiting audit | — |
| `maliki` | Maliki Classical | Awaiting audit | — |
| `hanbali` | Hanbali Classical | Awaiting audit | — |

If you are a scholar, student of knowledge, or representative of an Islamic body and would like to audit a preset, please open an issue or contact [naheed@vora.dev](mailto:naheed@vora.dev).

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommend [nvm](https://github.com/nvm-sh/nvm))
- **npm** 9+ (ships with Node.js 18+)
- **Supabase CLI** for local development and migrations
- A **Supabase project** with Google OAuth configured

### Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/zakah.git
   cd zakah
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Supabase credentials. See the [README](README.md) for required variables.

4. **Apply database migrations:**
   ```bash
   supabase link --project-ref YOUR_PROJECT_ID
   supabase db push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app runs at `http://localhost:8080`.

6. **Run tests:**
   ```bash
   # Unit tests (Vitest)
   npm test

   # Accessibility tests (Playwright)
   npx playwright test e2e/static-pages-a11y.spec.ts

   # ZMCS compliance tests
   npm test -- packages/core/src/config/__tests__/zmcs_compliance.test.ts
   ```

---

## Monorepo Build Contract

This project builds inside Lovable's single-package environment. Six rules govern the monorepo structure:

1. **The root `package.json` is the single source of truth for Lovable builds.** Lovable installs dependencies from the root only — it does not read `apps/web/package.json`.
2. **When adding a dependency to `apps/web/package.json`, you MUST also add it to the root `package.json`** with the same version range.
3. **Root config files are wrappers.** `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, and `postcss.config.cjs` at the root point the build to `apps/web/src`. Do not delete them.
4. **`packages/core` is resolved via Vite alias** (`@zakatflow/core` → `packages/core/src/index.ts`), not via npm workspaces.
5. **`apps/mcp-server` is NOT built by Lovable.** It has its own build pipeline and Dockerfile.
6. **React 18 and Tailwind v3 are pinned.** Do not upgrade to React 19 or Tailwind v4 without a coordinated migration.

---

## Style Guide

These standards apply to all contributions — whether authored by humans or AI agents.

### Code Standards

#### TypeScript

- **Strict typing.** No `any` types. Use `unknown` with type guards when necessary.
- **Exhaustive switches.** All union type switches must include a `default` case or exhaustive check.
- **Null safety.** Use optional chaining (`?.`) and nullish coalescing (`??`) instead of truthy checks.
- **Export types from dedicated files.** Domain types live in `types/` or `types.ts` files, not inline in components.
- **Prefer `const` assertions** for literal objects and arrays used as configuration.

```typescript
// Preferred: explicit return types on exported functions
export function calculateNisab(config: NisabConfig): NisabResult {
  // ...
}

// Avoid: implicit any or missing return types on exports
export function calculateNisab(config) {
  // ...
}
```

#### React

- **Functional components only.** No class components.
- **Props interfaces.** Define a named `Props` interface above the component. Use `interface` for component props, `type` for unions and intersections.
- **Hook colocation.** Custom hooks live in `hooks/` with a `use` prefix.
- **Component structure.** Follow this order within a component file:
  1. Imports (external → internal → relative)
  2. Props interface
  3. Component function
  4. Hooks
  5. Derived state and handlers
  6. Return (JSX)
  7. Default export

```typescript
// Import ordering
import { useState } from "react";              // 1. External
import { Button } from "@/components/ui/button"; // 2. Internal (@/ alias)
import { formatCurrency } from "./utils";        // 3. Relative
```

#### File Naming

- **Files:** `kebab-case.tsx` for components, `kebab-case.ts` for utilities
- **Components:** `PascalCase` for component names
- **Hooks:** `use-camel-case.ts` with `useCamelCase` export
- **Types:** `PascalCase` for interfaces and type aliases
- **Constants:** `UPPER_SNAKE_CASE`
- **Test files:** `*.test.ts` or `*.test.tsx`, colocated with source

#### Styling

- **Use semantic design tokens exclusively.** Never use direct Tailwind colors (`text-white`, `bg-gray-100`).
- **All colors must reference the design system** defined in `index.css` and `tailwind.config.ts`.
- **Do not edit `index.css` or `tailwind.config.ts`** unless the change is specifically about the design system.
- Use `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `bg-primary-container`, etc.

```tsx
// Correct: semantic tokens
<div className="bg-card text-foreground border rounded-xl p-6">

// Wrong: direct colors
<div className="bg-white text-gray-800 border-gray-200 rounded-xl p-6">
```

#### Error Handling

- **Edge functions:** Return structured JSON errors with HTTP status codes.
- **Client-side:** Use `try/catch` with user-friendly `toast()` messages. Log technical details to `console.error`.
- **Zod validation:** Validate all external inputs (API responses, AI output, user forms) with Zod schemas.

### User-Facing String Standards

All user-facing text must follow the guidelines in [Content Standards](apps/web/docs/CONTENT_STANDARDS.md). Key rules:

#### Terminology

| Use | Avoid |
|-----|-------|
| Methodology | Rules, School, Madhab (in UI copy) |
| Zakatable | Taxable |
| Scholarly basis | Religious rule |
| Hawl | Zakat year (acceptable in secondary explanations) |
| Milk Tām | Full ownership |
| Nisab | Threshold (acceptable in secondary explanations) |

#### Voice and Tone

- **Dignified Guide:** Professional, respectful, and clear. Not preachy, not casual.
- **ESL-friendly:** Use Subject + Verb + Object structure. Avoid idioms and colloquialisms.
- **No emoji in production UI strings.** Emoji are acceptable in documentation and developer-facing content.
- **Active voice.** "ZakatFlow calculates your obligation" not "Your obligation is calculated by ZakatFlow."
- **Islamic greetings** are appropriate in contextual places (e.g., closing a report). Use with restraint.

#### Writing Numbers

- Use `$12,500` format (with commas, no decimals for whole numbers).
- Use `2.5%` (not "two and a half percent").
- Percentages and rates always use numerals.

### Documentation Standards

#### Markdown Formatting

- **Header hierarchy:** One `#` per document (the title). Sections use `##`, subsections `###`. Never skip levels.
- **Tables:** Use alignment colons (`:---` for left, `:---:` for center, `---:` for right).
- **Code blocks:** Always include the language tag (```typescript, ```bash, ```json).
- **Links:** Use relative paths for internal docs (`[Guide](apps/web/PRODUCT.md)`). Use absolute URLs for external resources.
- **Lists:** Use `-` for unordered lists, `1.` for ordered. One blank line before and after lists.

#### Required Elements

- **"Last Updated" line** with date and version at the top of every technical document.
- **Table of contents** for documents longer than 200 lines.
- **Author and audience** metadata table for design documents and specifications.

#### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use |
|--------|-----|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Formatting, no logic change |
| `refactor:` | Code restructuring without feature/fix |
| `test:` | Adding or updating tests |
| `chore:` | Maintenance, dependency updates |
| `fiqh:` | Methodology or scholarly content changes |

Scope is optional but encouraged: `feat(wizard): add trust asset step`

---

## Contributing a Methodology Preset (ZMCS)

This section summarizes the workflow. For the full step-by-step guide, see [Contributing a Methodology](apps/web/docs/CONTRIBUTING_METHODOLOGY.md).

### Overview

1. **Copy an existing preset** from `packages/core/src/config/presets/` as your starting point.
2. **Customize all fields** according to the scholar's or institution's rulings. Every section must include `description` and `scholarly_basis` strings citing authoritative sources.
3. **Register the preset** in `packages/core/src/config/presets/index.ts`.
4. **Run the compliance test suite** — your preset must pass the "Super Ahmed" canonical profile test.
5. **Submit a pull request** with the tag `fiqh: add [methodology-name] preset`.

### Scholar Audit Process

Presets carry more weight when verified by a recognized authority. To submit a preset for scholar audit:

1. **Open an issue** titled "ZMCS Audit Request: [Methodology Name]" with:
   - The preset file path
   - The scholar or institution you are submitting for
   - Any relevant fatwa URLs or publication references
2. **Tag the issue** with `zmcs-audit`.
3. **The maintainer will coordinate** with the scholar or institution for review.
4. **Upon certification**, the preset's `meta.certification` field is populated:
   ```typescript
   certification: {
     certified_by: 'Scholar Name or Institution',
     date: '2026-MM-DD',
     url: 'https://link-to-endorsement-or-fatwa',
   }
   ```

### The "Super Ahmed" Test Profile

All presets must produce a Zakat Due greater than $0 for this canonical profile:

| Asset | Value |
|:---|:---|
| Cash | $100,000 |
| 401k (Vested) | $100,000 |
| Passive Investments | $100,000 |
| Gold Jewelry | $5,000 |
| Age | 30 |

---

## Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** following the style guide above.

3. **Run the full test suite:**
   ```bash
   npm test
   npm run build
   ```

4. **Commit** with a conventional commit message.

5. **Push and open a pull request** on GitHub. Include:
   - A clear description of what changed and why
   - Screenshots for UI changes
   - Test results for calculation logic changes
   - Scholarly references for fiqh changes

6. **Respond to review feedback** promptly.

### Review Expectations

- **UI changes:** Reviewed for design system compliance, accessibility, and responsiveness.
- **Calculation changes:** Reviewed for correctness against scholarly sources and ZMCS compliance test results.
- **MCP changes:** Reviewed for tool correctness, session isolation, and transport compatibility.
- **Documentation:** Reviewed for clarity, accuracy, and adherence to documentation standards.

---

## Fiqh Considerations

ZakatFlow's calculation logic is rooted in published scholarly methodology. Contributors must approach fiqh content with care.

### Principles

- **Scholarly humility.** Present multiple opinions without declaring one "correct." Use the ZMCS framework to express differences through configuration, not code branches.
- **Source attribution.** Every calculation rule must trace to a named scholar, published fatwa, or recognized institution.
- **Multi-methodology awareness.** Changes to the core engine must not break any of the eight shipped presets. Run the full compliance suite before submitting.
- **No arbitrary formulas.** Do not add asset classes, rates, or thresholds without scholarly backing.

### Before Changing Calculation Logic

1. Open an issue describing the proposed change with scholarly references.
2. Wait for maintainer feedback before implementing.
3. Include the `fiqh:` commit prefix for all methodology-related changes.

---

## Documentation Index

| Document | Path | Description |
|----------|------|-------------|
| [README](README.md) | `README.md` | Repository overview and getting started |
| [Product Guide (Web)](apps/web/PRODUCT.md) | `apps/web/PRODUCT.md` | Complete web application feature overview |
| [Product Guide (MCP)](apps/mcp-server/PRODUCT.md) | `apps/mcp-server/PRODUCT.md` | MCP server tools, transports, and quick start |
| [Contributing Guide](CONTRIBUTING.md) | `CONTRIBUTING.md` | This document — contribution workflow and style guides |
| [Changelog](CHANGELOG.md) | `CHANGELOG.md` | Version history and release notes |
| [Backlog](BACKLOG.md) | `BACKLOG.md` | Planned features and technical debt |
| [ZMCS Specification](apps/web/docs/ZMCS_SPECIFICATION.md) | `apps/web/docs/` | Zakat Methodology Configuration Standard v1.0 |
| [Zakat Jurisprudence](apps/web/docs/ZAKAT_JURISPRUDENCE.md) | `apps/web/docs/` | Scholarly analysis and fiqh foundations |
| [Engineering Design](apps/web/docs/ENGINEERING_DESIGN.md) | `apps/web/docs/` | Technical architecture deep dive |
| [Security Architecture](apps/web/docs/SECURITY_ARCHITECTURE.md) | `apps/web/docs/` | Encryption, privacy, and threat model |
| [Content Standards](apps/web/docs/CONTENT_STANDARDS.md) | `apps/web/docs/` | Writing guidelines, voice, tone, and terminology |
| [Contributing Methodology](apps/web/docs/CONTRIBUTING_METHODOLOGY.md) | `apps/web/docs/` | Step-by-step guide for adding a new scholarly preset |
| [Copy Framing](apps/web/docs/COPY_FRAMING.md) | `apps/web/docs/` | Landing page and marketing copy strategy |
| [License](LICENSE) | `LICENSE` | GNU Affero General Public License v3.0 |

---

## Community

- **Issues:** [github.com/naheed/zakah/issues](https://github.com/naheed/zakah/issues)
- **Email:** [naheed@vora.dev](mailto:naheed@vora.dev)
- **Live App:** [zakatflow.org](https://zakatflow.org)

---

**JazakAllah khair for contributing.** May Allah accept your efforts.
