# ZakatFlow

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Status: Early Access](https://img.shields.io/badge/Status-Early%20Access-orange.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Accessibility: WCAG AA](https://img.shields.io/badge/Accessibility-WCAG%20AA-success.svg)](https://www.w3.org/WAI/WCAG2AA-Conformance)

**Zakat calculation made simple.** A guided, step-by-step application for accurate Islamic wealth purification.

[Live Demo](https://zakatflow.org) · [Product Guide](PRODUCT.md) · [Methodology](https://zakatflow.org/methodology) · [Report an Issue](https://github.com/your-username/zakatflow/issues)

---

## Overview

ZakatFlow helps Muslims calculate their annual Zakat obligation with precision and confidence. Like TurboTax for taxes, it walks you through each asset class—cash, investments, retirement accounts, precious metals, cryptocurrency, and more—ensuring nothing is missed.

### Key Capabilities

|Feature | Description|
|---------|-------------|
| **Guided Wizard** | Simple mode for quick estimates, detailed mode for comprehensive analysis |
| **Asset Intelligence** | Upload bank statements; AI extracts line items automatically |
| **Methodology Engine** | **ZMCS v2.0** — 8 presets (Hanafi, Shafi'i, Maliki, Hanbali, Bradford, AMJA, Tahir Anwar, Qaradawi) |
| **AI Companion** | **Model Context Protocol (MCP)** — Connect to Claude/ChatGPT for context-aware Q&A about your portfolio |
| **Active Indicator** | Always-visible methodology status with smart fallback and one-click switching |
| **Privacy Shield** | One-click blur mode for privacy in public spaces |
| **Donation Tracking** | Track Zakat payments with Receipt Scanning (Gemini Flash) & Active Hawl progress |
| **Multi-Source Tracking** | Manual entry, PDF upload, or bank connection (Plaid Integrated) |
| **Secure Vault** | Privacy-first mode storing data on-device with AES-256 encryption |
| **Visual Flow Chart** | Sankey diagram showing how assets flow to Zakat obligation |
| **Export Options** | PDF report, CSV Baseline (Spreadsheet-ready), or print-friendly web view |

---

## Architecture

> **Deep Dive**: For a comprehensive technical breakdown, see the [Engineering Design Document](docs/ENGINEERING_DESIGN.md).

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Frontend (React/Vite)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │
│  │   Wizard    │  │   Assets    │  │  Donations  │  │  Report   │  │
│  │   Pages     │  │  Dashboard  │  │  Tracking   │  │  Export   │  │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────┬─────┘  │
│         └────────────────┼────────────────┼───────────────┘         │
│                          ▼                ▼                         │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────┐ │
│  │   ZMCS Calculation  │  │   Privacy Vault     │  │  Active     │ │
│  │   Engine (8 presets)│  │   (AES-256-GCM)     │  │  Hawl Mgr   │ │
│  └─────────────────────┘  └─────────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Backend (Supabase)                               │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────────────┐ │
│  │   Auth      │  │   Database  │  │       Edge Functions         │ │
│  │  (Google)   │  │  (Postgres) │  │  ┌──────────┐ ┌──────────┐  │ │
│  └─────────────┘  └─────────────┘  │  │ AI Parser│ │  Plaid   │  │ │
│                                    │  │(Gemini)  │ │  Sync    │  │ │
│                                    │  └──────────┘ └──────────┘  │ │
│                                    └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript 5, Vite |
| **Styling** | Tailwind CSS, Shadcn UI (Radix primitives) |
| **State** | TanStack Query, React Context |
| **Backend** | Supabase (Postgres, Auth, Edge Functions) |
| **AI** | Google Gemini 3.0 Flash (parsing), Model Context Protocol (MCP) |
| **Visualization** | Nivo (Sankey charts), Recharts |
| **PDF** | @react-pdf/renderer |
| **Icons** | Phosphor Icons |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommend using [nvm](https://github.com/nvm-sh/nvm))
- **Supabase CLI** for local development
- **Supabase Project** with Google OAuth configured

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/zakatflow.git
cd zakatflow

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Environment Configuration

Create a `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id

# Edge Function Secrets (Supabase Dashboard)
PLAID_CLIENT_ID=...
PLAID_SECRET=...
PLAID_ENV=sandbox|development|production
PLAID_ENCRYPTION_KEY=32-byte-hex-string-generated-via-openssl
```

### Database Setup

```bash
# Start Supabase locally (optional)
supabase start

# Push migrations to your Supabase project
supabase db push
```

### Development Server

```bash
npm run dev
```

The app runs at `http://localhost:8080`.

---

## Project Structure

```
src/
├── components/
│   ├── ui/                # Shadcn UI primitives
│   ├── zakat/             # Domain-specific components
│   │   ├── steps/         # Wizard step components
│   │   ├── report/        # Report generation components
│   │   └── sankey/        # Sankey chart visualization
│   ├── assets/            # Asset management components
│   ├── vault/             # Privacy Vault (encryption UI)
│   ├── settings/          # Settings page components
│   ├── upload/            # Batch document upload
│   └── donations/         # Donation tracking & receipt scanning
├── hooks/
│   ├── useAuth.ts              # Authentication state
│   ├── useAssetPersistence.ts  # Asset CRUD operations
│   ├── useDocumentParsingV2.ts # AI document extraction
│   ├── usePlaidLink.ts         # Plaid bank connection
│   └── usePrivacyVault.ts      # Two-tier encryption (Managed/Sovereign)
├── lib/
│   ├── zakatCalculations.ts    # Core calculation engine
│   ├── config/                 # ZMCS methodology presets
│   ├── madhahRules.ts          # School of thought rules
│   ├── assetCategories.ts      # Category definitions & classification
│   ├── accountImportMapper.ts  # Plaid → Zakat category mapping
│   ├── CryptoService.ts        # AES-256-GCM encryption service
│   ├── plaidEncryptedPersistence.ts  # Plaid encrypted token storage
│   └── generatePDFV2.ts        # PDF report generation
├── content/               # All user-facing copy & content
│   ├── privacy.ts         # Privacy policy content
│   ├── fiqhExplanations.ts # Scholarly explanations
│   └── zmcs-docs.ts       # ZMCS specification content
├── pages/                 # Route components
├── types/                 # TypeScript interfaces
└── integrations/
    └── supabase/          # Database client & types

supabase/
├── functions/             # Edge Functions
│   ├── parse-financial-document/  # AI document parser
│   ├── plaid-link-token/          # Plaid Link session
│   ├── plaid-exchange-token/      # Token exchange + encryption
│   ├── plaid-cleanup-all/         # Revoke all Plaid connections
│   └── delete-account/            # Account deletion + Plaid revocation
└── migrations/            # Database schema
```

---

## Data Model

### Core Entities

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Portfolio     │────▶│   Account       │────▶│   Snapshot      │
│                 │     │                 │     │                 │
│ user_id         │     │ institution     │     │ statement_date  │
│ currency        │     │ type            │     │ total_value     │
│                 │     │ mask            │     │ method          │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │   Line Item     │
                                                │                 │
                                                │ description     │
                                                │ amount          │
                                                │ zakat_category  │
                                                └─────────────────┘
```

> **Note:** Zakat rates are not fixed constants — they are determined per-asset-class by the selected ZMCS methodology. For example, passive investments are 30% under Bradford but 100% under Tahir Anwar. See [ZMCS Specification](docs/ZMCS_SPECIFICATION.md) for the full schema.

### Donation Tracking Model

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Hawl Settings  │────▶│   Zakat Year    │────▶│   Donation      │
│                 │     │                 │     │                 │
│ user_id         │     │ hawl_start      │     │ amount          │
│ calendar_type   │     │ calculated_amt  │     │ recipient       │
└─────────────────┘     │ is_current      │     │ receipt_url     │
                        └─────────────────┘     │ notes           │
                                                └─────────────────┘
```

---

## Core Logic & Methodology

### Retrospective Obligation (The Tax Analogy)
Unlike monthly expenses, Zakat is a **retrospective annual obligation**, similar to filing taxes.
1.  **Hawl (Accrual Year)**: The lunar year during which wealth is held.
2.  **Assessment Date**: The end of the Hawl. You calculate Zakat based on wealth held *on this day*.
3.  **Payment Period**: Typically due immediately upon calculation.

The app tracks your **Active Zakat Year**. When you run a calculation, it defaults to assessing the **Year Just Completed**, linking the liability to that period. Donations made *after* the calculation date (or advance payments during the year) count toward satisfying this liability.

### ZMCS: Zakat Methodology Configuration Standard

ZakatFlow's calculation engine is powered by **ZMCS v2.0** — a JSON-based standard with 60+ configurable parameters covering every Zakat calculation decision point. Each methodology is a validated configuration, not hardcoded logic.

See [ZMCS Specification](docs/ZMCS_SPECIFICATION.md) for the full standard.

### Supported Methodologies

| Methodology | Key Position | Debt Approach |
| :--- | :--- | :--- |
| **Sheikh Joe Bradford** (Default) | Precautionary balanced synthesis | 12-month rule |
| **AMJA** | Institutional standard, net-accessible retirement | Current due only |
| **Imam Tahir Anwar** | Strong ownership (Hanafi), full retirement zakatable | Full deduction |
| **Dr. Al-Qaradawi** | Most influential modern text, progressive ijtihad | 12-month rule |
| **Hanafi** | Jewelry zakatable, net worth approach | Full deduction |
| **Shafi'i** | No debt deduction, gross asset approach | No deduction |
| **Maliki** | Exploited-asset view, velocity economics | 12-month rule |
| **Hanbali** | Debt deductible, jewelry exempt | Full deduction |

### Supported Asset Classes

- Cash & bank accounts
- Stocks, ETFs, mutual funds (active & passive)
- Retirement accounts (401k, IRA, Roth, pension)
- Cryptocurrency & digital assets (including staking/DeFi)
- Gold, silver & precious metals (investment & jewelry)
- Business assets (inventory, receivables, fixed assets)
- Real estate (rental income, property for sale, land banking)
- Trusts (revocable & irrevocable)
- Debts owed to you (good & bad debt)

For detailed scholarly analysis, see [Zakat Jurisprudence](docs/ZAKAT_JURISPRUDENCE.md).

---

## Deployment

### Frontend (Lovable Cloud)

The production frontend is hosted on [Lovable Cloud](https://lovable.dev), which provides integrated Supabase backend services.

For self-hosting or local development:

```bash
npm run build
# Output: dist/
# Deploy to any static host (Vercel, Netlify, Cloudflare Pages, etc.)
```

### Edge Functions

Deploy Supabase Edge Functions:

```bash
supabase functions deploy parse-financial-document
supabase functions deploy delete-account
supabase functions deploy plaid-link-token
supabase functions deploy plaid-exchange-token
supabase functions deploy plaid-cleanup-all
```

---

## Quality Assurance & Accessibility

ZakatFlow maintains a zero-tolerance policy for accessibility violations on public pages. We adhere to **WCAG 2.1 AA** standards.

### The Quality Bar
All new UI changes must pass the accessibility suite. We use a "System Design" approach (Container Tokens) to prevent contrast regressions.

```bash
# Run the Accessibility Suite
npx playwright test e2e/static-pages-a11y.spec.ts

# Run the Full Suite (Core + Static + Auth)
npx playwright test
```

### Design Standards
- **Contrast**: Use `text-foreground` or `text-primary` (checked against background). Avoid `gray-500`.
- **Surfaces**: Use `bg-muted` or `bg-*-container` tokens. Do not use opacity hacks like `bg-primary/10`.
- **Links**: Must use `underline` or clear visual distinction beyond color.

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test`)
5. Submit a pull request

---

## Roadmap

| Phase | Status | Description |
| :--- | :--- | :--- |
| ZMCS v2.0 | ✅ Complete | Foundational standard with 8 methodologies, 60+ parameters |
| Core Calculator | ✅ Complete | Guided wizard with all asset classes |
| Asset Intelligence | ✅ Complete | Extract line items from PDFs/images |
| Donation Tracking | ✅ Complete | Receipt scanning, Active Hawl, Cloud Sync |
| Asset Dashboard | ✅ Complete | Manage accounts and statements |
| Export (PDF/CSV) | ✅ Complete | Download reports (PDF & Baseline CSV) |
| Visualization | ✅ Complete | Sankey Chart visual asset flow |
| Settings & Vault | ✅ Complete | Expressive Dashboard & Data Safety (Privacy Shield) |
| Bank Sync | ✅ Complete | Plaid Integration for real-time balances |
| Methodology UX | ✅ Complete | Active Indicator & Context-Aware Switching |
| Security Overhaul | ✅ Complete | Two-tier encryption, Plaid user-key encryption, AGPL-3.0 |
| Open Source | ✅ Complete | Repository public launch |
| AI Companion (MCP) | ✅ Complete | Context-aware Q&A via Model Context Protocol |
| Charity Directory | 📋 Planned | Search & filter vetted recipients |
| Mobile App | 📋 Planned | Native iOS/Android experience |

---

## License

This project is licensed under the GNU Affero General Public License v3.0. See [LICENSE](LICENSE) for details.

---

## Acknowledgments

- **Sheikh Joe Bradford** — Primary methodology source, "Simple Zakat Guide"
- **AMJA** — Assembly of Muslim Jurists of America
- **Imam Tahir Anwar** — Hanafi methodology, Zaytuna College
- **Dr. Yusuf Al-Qaradawi** — *Fiqh al-Zakah*, the most influential modern Zakat treatise
- **AAOIFI** — Accounting and Auditing Organization for Islamic Financial Institutions
- **Supabase** — Backend infrastructure
- **Shadcn** — UI component system

---

<p align="center">
  <strong>May Allah accept your Zakat and purify your wealth. 🤲</strong>
</p>
