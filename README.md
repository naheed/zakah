# ZakatFlow

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Live App](https://img.shields.io/badge/Live-zakatflow.org-blue.svg)](https://zakatflow.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Accessibility: WCAG AA](https://img.shields.io/badge/Accessibility-WCAG%20AA-success.svg)](https://www.w3.org/WAI/WCAG2AA-Conformance)

**The most accurate Zakat calculator available.** Eight scholarly methodologies. AI-powered document import. Bank-grade encryption. Open source.

[Live App](https://zakatflow.org) · [Product Guide](apps/web/PRODUCT.md) · [MCP Server](apps/mcp-server/PRODUCT.md) · [Methodology Explorer](https://zakatflow.org/methodology) · [Report an Issue](https://github.com/naheed/zakah/issues)

---

## Overview

ZakatFlow helps Muslims calculate their annual Zakat obligation with precision and confidence. The application walks users through each asset class — cash, investments, retirement accounts, precious metals, cryptocurrency, real estate, and more — ensuring nothing is missed. Eight scholarly methodologies power the calculation engine, each fully configurable and traceable to its source.

For a complete feature overview, see the [Product Guide](apps/web/PRODUCT.md).

---

## Repository Structure

This project is organized as a monorepo with three packages:

```
zakatflow/
├── apps/
│   ├── web/                    # Web application (React, Vite, Tailwind)
│   │   ├── src/                # Application source code
│   │   ├── docs/               # Technical documentation
│   │   └── PRODUCT.md          # Web application product guide
│   └── mcp-server/             # Model Context Protocol server
│       ├── src/                # Server source code
│       ├── Dockerfile          # Container deployment
│       └── PRODUCT.md          # MCP server product guide
├── packages/
│   └── core/                   # Shared Zakat calculation library
│       └── src/                # Calculation engine, ZMCS presets, types
├── supabase/
│   ├── functions/              # Edge Functions (AI parsing, Plaid, auth)
│   └── migrations/             # Database schema migrations
├── index.html                  # Build entry point (→ apps/web/src/main.tsx)
├── vite.config.ts              # Root wrapper (→ apps/web/src)
├── tsconfig.json               # Root wrapper (→ apps/web/src)
├── tailwind.config.ts          # Root wrapper (→ apps/web/src)
└── package.json                # Root dependencies (Lovable build source of truth)
```

| Package | Description | Built by Lovable |
|---------|-------------|:---:|
| **`apps/web`** | Full-featured web application with guided wizard, asset dashboard, donation tracking, and report generation | Yes |
| **`apps/mcp-server`** | MCP server exposing Zakat calculation tools to AI assistants (ChatGPT, Claude) | No |
| **`packages/core`** | Shared library containing the ZMCS calculation engine, methodology presets, types, and utilities | Via alias |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript 5, Vite |
| **Styling** | Tailwind CSS 3, shadcn/ui (Radix primitives) |
| **State** | TanStack Query, React Context |
| **Backend** | Supabase (Postgres, Auth, Edge Functions, Storage) |
| **AI** | Google Gemini 3.0 Flash (document parsing) |
| **MCP** | Model Context Protocol SDK (SSE + Stdio transports) |
| **Visualization** | Nivo (Sankey charts), Recharts |
| **PDF** | @react-pdf/renderer |
| **Encryption** | AES-256-GCM (Web Crypto API) |
| **Bank Sync** | Plaid Link |
| **Icons** | Phosphor Icons |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        apps/web (React / Vite)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Wizard   │  │  Assets  │  │ Donations│  │  Report  │  │ Settings │ │
│  │  Pages    │  │ Dashboard│  │ Tracking │  │  Export  │  │  & Vault │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
│       └──────────────┼───────────────┼──────────────┼───────────┘       │
│                      ▼               ▼              ▼                   │
│           ┌──────────────────────────────────────────────────┐          │
│           │              @zakatflow/core                      │          │
│           │   ZMCS Engine · 8 Presets · Types · Utilities     │          │
│           └──────────────────────────────────────────────────┘          │
│                      │                                                  │
│  ┌───────────────────┼───────────────────────────────────────────────┐  │
│  │  Privacy Vault (AES-256-GCM)  │  Active Hawl Manager  │  Plaid  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                         │                          │
                         ▼                          ▼
┌──────────────────────────────────┐  ┌────────────────────────────────┐
│       Backend (Supabase)          │  │    apps/mcp-server              │
│  ┌────────┐  ┌────────────────┐  │  │  ┌──────────────────────────┐  │
│  │  Auth   │  │   Edge Funcs   │  │  │  │  MCP Tools (SSE/Stdio)  │  │
│  │(Google) │  │ ┌────────────┐ │  │  │  │  calculate_zakat        │  │
│  └────────┘  │ │ AI Parser  │ │  │  │  │  parse_blob_input       │  │
│  ┌────────┐  │ │ (Gemini)   │ │  │  │  │  list_methodologies     │  │
│  │Postgres│  │ ├────────────┤ │  │  │  │  get_agent_protocol     │  │
│  │   DB   │  │ │ Plaid Sync │ │  │  │  │  get_market_prices      │  │
│  └────────┘  │ └────────────┘ │  │  │  │  create_report_link     │  │
│              └────────────────┘  │  │  └──────────────────────────┘  │
└──────────────────────────────────┘  │       uses @zakatflow/core      │
                                      └────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommend using [nvm](https://github.com/nvm-sh/nvm))
- **npm** 9+ (ships with Node.js 18+)
- **Supabase CLI** for local development and migrations
- A **Supabase project** with Google OAuth configured

### Clone and Install

```bash
git clone https://github.com/naheed/zakah.git
cd zakah

npm install
```

### Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Supabase (required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id

# Edge Function Secrets (set in Supabase Dashboard → Edge Functions → Secrets)
PLAID_CLIENT_ID=...
PLAID_SECRET=...
PLAID_ENV=sandbox
PLAID_ENCRYPTION_KEY=<32-byte hex string via openssl rand -hex 32>
```

### Database Setup

```bash
# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_ID

# Apply all migrations
supabase db push
```

### Development Server

```bash
npm run dev
```

The app runs at `http://localhost:8080`.

### Running Tests

```bash
# Unit tests (Vitest)
npm test

# Accessibility tests (Playwright)
npx playwright test e2e/static-pages-a11y.spec.ts

# Full E2E suite
npx playwright test
```

---

## Packages

### `@zakatflow/core` — Shared Calculation Library

The core package contains the Zakat Methodology Configuration Standard (ZMCS) engine — a JSON-based specification with 60+ configurable parameters. All calculation logic lives here, shared between the web application and MCP server.

**Exports:**
- `calculateZakat()` — Main calculation function
- `calculateNisab()` — Nisab threshold computation
- `ZAKAT_PRESETS` / `AVAILABLE_PRESETS` — Eight methodology configurations
- `ZakatFormData` / `defaultFormData` — Type definitions and defaults
- Agent protocol definitions for all eight methodologies
- Asset category definitions, formatters, date utilities

**Resolution:** The root `vite.config.ts` aliases `@zakatflow/core` to `packages/core/src/index.ts`. No npm linking required.

### `apps/web` — Web Application

The full-featured web application. See the [Web Product Guide](apps/web/PRODUCT.md) for a complete feature overview.

**Key directories:**

```
apps/web/src/
├── components/
│   ├── ui/                # shadcn/ui primitives
│   ├── zakat/             # Wizard steps, report, Sankey chart
│   ├── assets/            # Asset management dashboard
│   ├── vault/             # Privacy Vault (encryption UI)
│   ├── donations/         # Donation tracking and receipt scanning
│   └── upload/            # Batch document upload
├── hooks/                 # useAuth, useAssetPersistence, usePlaidLink, usePrivacyVault
├── lib/                   # Business logic, encryption, PDF generation
├── content/               # User-facing copy, fiqh explanations
├── pages/                 # Route components
└── types/                 # TypeScript interfaces
```

### `apps/mcp-server` — Model Context Protocol Server

An MCP server that exposes ZakatFlow's calculation engine to AI assistants. See the [MCP Server Product Guide](apps/mcp-server/PRODUCT.md) for tool documentation and quick start guides.

**Transports:** SSE (HTTP) for remote clients, Stdio for local MCP clients (Claude Desktop).

---

## Monorepo Build Contract

This project must build inside Lovable's single-package environment. Six rules govern the monorepo structure:

1. **The root `package.json` is the single source of truth for Lovable builds.** Lovable installs dependencies from the root only — it does not read `apps/web/package.json`.
2. **When adding a dependency to `apps/web/package.json`, you MUST also add it to the root `package.json`** with the same version range.
3. **Root config files are wrappers.** `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, and `postcss.config.cjs` at the root point the build to `apps/web/src`. Do not delete them.
4. **`packages/core` is resolved via Vite alias** (`@zakatflow/core` → `packages/core/src/index.ts`), not via npm workspaces.
5. **`apps/mcp-server` is NOT built by Lovable.** It has its own build pipeline and Dockerfile.
6. **React 18 and Tailwind v3 are pinned.** Do not upgrade to React 19 or Tailwind v4 without a coordinated migration.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full development workflow.

---

## Supported Methodologies

| Methodology | Tradition | Key Position | Debt Approach |
|:---|:---|:---|:---|
| **Sheikh Joe Bradford** (Default) | Balanced Synthesis | Precautionary, AAOIFI-aligned | 12-month rule |
| **AMJA** | Institutional | North American standard | Current due only |
| **Imam Tahir Anwar** | Hanafi | Strong ownership, full retirement zakatable | Full deduction |
| **Dr. Al-Qaradawi** | Progressive Ijtihad | Most influential modern text | 12-month rule |
| **Hanafi** | Classical | Jewelry zakatable, net worth approach | Full deduction |
| **Shafi'i** | Classical | No debt deduction, gross asset approach | No deduction |
| **Maliki** | Classical | Exploited-asset view, velocity economics | 12-month rule |
| **Hanbali** | Classical | Debt deductible, jewelry exempt | Full deduction |

Each methodology is a complete ZMCS configuration — not hardcoded logic. New methodologies can be added without changing the engine. See [ZMCS Specification](apps/web/docs/ZMCS_SPECIFICATION.md) for the full standard.

---

## Deployment

### Web Application (Static Host)

```bash
npm run build
# Output: dist/
# Deploy to Vercel, Netlify, Cloudflare Pages, or any static host
```

### Edge Functions (Supabase)

```bash
supabase functions deploy parse-financial-document
supabase functions deploy plaid-link-token
supabase functions deploy plaid-exchange-token
supabase functions deploy plaid-cleanup-all
supabase functions deploy delete-account
```

### MCP Server (Docker)

```bash
cd apps/mcp-server
docker build -t zakatflow-mcp -f Dockerfile ../..
docker run -p 8080:8080 -e NODE_ENV=production zakatflow-mcp
```

The SSE endpoint is available at `http://localhost:8080/mcp`. See the [MCP Server Product Guide](apps/mcp-server/PRODUCT.md) for client configuration.

---

## Quality Assurance and Accessibility

ZakatFlow maintains a zero-tolerance policy for accessibility violations on public pages and adheres to **WCAG 2.1 AA** standards.

### Design Standards

- **Contrast:** Use `text-foreground` or `text-primary` (checked against background). Avoid `gray-500`.
- **Surfaces:** Use `bg-muted` or `bg-*-container` tokens. Do not use opacity hacks like `bg-primary/10`.
- **Links:** Must use `underline` or clear visual distinction beyond color.
- **Semantic HTML:** Use `<header>`, `<main>`, `<section>`, `<nav>` for structure.

### Test Commands

```bash
# Accessibility suite
npx playwright test e2e/static-pages-a11y.spec.ts

# Full suite (Core + Static + Auth)
npx playwright test
```

---

## Contributing

We welcome contributions. Please see the [Contributing Guide](CONTRIBUTING.md) for setup instructions, coding standards, the monorepo build contract, and the pull request process.

### Quick Start

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make changes and run tests (`npm test`)
4. Submit a pull request

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [Product Guide](apps/web/PRODUCT.md) | Complete feature overview for the web application |
| [MCP Server Guide](apps/mcp-server/PRODUCT.md) | MCP server tools, transports, and quick start |
| [Contributing Guide](CONTRIBUTING.md) | Development workflow, coding standards, fiqh guidelines |
| [Changelog](CHANGELOG.md) | Version history and release notes |
| [Backlog](BACKLOG.md) | Planned features and technical debt |
| [ZMCS Specification](apps/web/docs/ZMCS_SPECIFICATION.md) | Zakat Methodology Configuration Standard v2.0 |
| [Zakat Jurisprudence](apps/web/docs/ZAKAT_JURISPRUDENCE.md) | Scholarly analysis and fiqh foundations |
| [Engineering Design](apps/web/docs/ENGINEERING_DESIGN.md) | Technical architecture deep dive |
| [Security Architecture](apps/web/docs/SECURITY_ARCHITECTURE.md) | Encryption, privacy, and threat model |
| [Content Standards](apps/web/docs/CONTENT_STANDARDS.md) | Writing guidelines and tone |
| [Contributing Methodology](apps/web/docs/CONTRIBUTING_METHODOLOGY.md) | How to add a new scholarly methodology |
| [License](LICENSE) | GNU Affero General Public License v3.0 |

---

## Roadmap

| Feature | Status | Description |
|:---|:---|:---|
| ZMCS v2.0 | Complete | Foundational standard with 8 methodologies, 60+ parameters |
| Core Calculator | Complete | Guided wizard with all asset classes |
| Asset Intelligence | Complete | Extract line items from PDFs and images via Gemini |
| Donation Tracking | Complete | Receipt scanning, Active Hawl, Cloud Sync |
| Asset Dashboard | Complete | Manage accounts and financial statements |
| Export (PDF / CSV) | Complete | Professional reports and spreadsheet baselines |
| Visualization | Complete | Sankey chart: visual asset flow to Zakat obligation |
| Privacy Vault | Complete | Two-tier encryption (Managed and Sovereign modes) |
| Bank Sync | Complete | Plaid integration for real-time balances |
| Methodology UX | Complete | Active indicator, context-aware switching |
| Open Source | Complete | AGPL-3.0, public repository |
| AI Companion (MCP) | Complete | Context-aware Q&A via Model Context Protocol |
| Charity Directory | Planned | Search and filter vetted Zakat-eligible recipients |
| Mobile App | Planned | Native iOS and Android experience |

---

## License

This project is licensed under the **GNU Affero General Public License v3.0**. See [LICENSE](LICENSE) for the full text.

This means:
- Free to use, modify, and distribute
- Full source code access — verify every encryption and privacy claim
- Derivative works must also be open source under AGPL-3.0

---

## Acknowledgments

- **Sheikh Joe Bradford** — Primary methodology source, *Simple Zakat Guide*
- **AMJA** — Assembly of Muslim Jurists of America
- **Imam Tahir Anwar** — Hanafi methodology, Zaytuna College
- **Dr. Yusuf Al-Qaradawi** — *Fiqh al-Zakah*, the most influential modern Zakat treatise
- **AAOIFI** — Accounting and Auditing Organization for Islamic Financial Institutions

---

<p align="center">
  <strong>May Allah accept your Zakat and purify your wealth. 🤲</strong>
</p>
