# ZakatFlow

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Status: Early Access](https://img.shields.io/badge/Status-Early%20Access-orange.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

**Zakat calculation made simple.** A guided, step-by-step application for accurate Islamic wealth purification.

[Live Demo](https://zakatflow.org) · [Methodology](https://zakatflow.org/methodology) · [Report an Issue](https://github.com/your-username/zakatflow/issues)

---

## Overview

ZakatFlow helps Muslims calculate their annual Zakat obligation with precision and confidence. Like TurboTax for taxes, it walks you through each asset class—cash, investments, retirement accounts, precious metals, cryptocurrency, and more—ensuring nothing is missed.

### Key Capabilities

| Feature | Description |
|---------|-------------|
| **Guided Wizard** | Simple mode for quick estimates, detailed mode for comprehensive analysis |
| **Asset Intelligence** | Upload bank statements; AI extracts line items automatically |
| **Donation Tracking** | Track Zakat payments with Receipt Scanning (Gemini Flash) & Active Hawl progress |
| **Multi-Source Tracking** | Manual entry, PDF upload, or bank connection (Plaid—coming soon) |
| **Local Vault** | Privacy-first mode storing data on-device with AES-256 encryption |
| **Scholarly Methodology** | Based on AMJA, AAOIFI guidelines, and Sheikh Joe Bradford's rulings |
| **Madhab Support** | Configure calculations per Hanafi, Maliki, Shafi'i, Hanbali, or balanced approach |
| **Visual Flow Chart** | Sankey diagram showing how assets flow to Zakat obligation |
| **Export Options** | PDF report, CSV breakdown, or print-friendly web view |
| **Privacy-First** | Local-first encryption for guests; cloud sync for signed-in users |

---

## Architecture

```
│                        Frontend (React)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Wizard    │  │   Assets    │  │  Donations  │  │   Report    │ │
│  │   Pages     │  │   Dashboard │  │  Tracking   │  │   Export    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
│         │                │                │                │        │
│         └────────────────┼────────────────┼────────────────┘        │
│                          ▼                ▼                         │
│              ┌─────────────────────┐  ┌─────────────────────┐       │
│              │   Zakat Calculation │  │   Active Hawl       │       │
│              │      Engine         │  │      Manager        │       │
│              └─────────────────────┘  └─────────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Backend (Supabase)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Auth      │  │   Database  │  │   Edge      │              │
│  │   (Google)  │  │   (Postgres)│  │   Functions │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                          │                │                      │
│                          │         ┌──────┴──────┐               │
│                          │         │  AI Parser  │               │
│                          │         │  (Gemini)   │               │
│                          │         └─────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript 5, Vite |
| **Styling** | Tailwind CSS, Shadcn UI (Radix primitives) |
| **State** | TanStack Query, React Context |
| **Backend** | Supabase (Postgres, Auth, Edge Functions) |
| **AI** | Google Gemini 2.0 Flash (document parsing) |
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
│   │   └── report/        # Report generation components
│   ├── assets/            # Asset management components
│   ├── settings/          # Settings page components (new)
│   └── donations/         # Donation tracking & receipt scanning
├── hooks/
│   ├── useAuth.ts         # Authentication state
│   ├── useAssetPersistence.ts  # Asset CRUD operations
│   ├── useDocumentParsingV2.ts # AI document extraction
│   └── usePlaidLink.ts    # Bank connection (future)
├── lib/
│   ├── zakatCalculations.ts    # Core calculation engine
│   ├── madhahRules.ts          # School of thought rules
│   ├── assetCategories.ts      # Category definitions
│   └── generatePDFV2.ts        # PDF report generation
├── pages/                 # Route components
├── types/                 # TypeScript interfaces
└── integrations/
    └── supabase/          # Database client & types

supabase/
├── functions/             # Edge Functions
│   ├── parse-financial-document/  # AI document parser
│   ├── plaid-link-token/          # Plaid integration
│   └── delete-account/            # Account deletion
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

### Zakat Categories

| Category | Description | Zakat Rate |
|----------|-------------|------------|
| `LIQUID` | Cash, checking, savings | 100% |
| `PROXY_30` | Passive investments (stocks, ETFs) | 30% proxy |
| `PROXY_100` | Active trading, cryptocurrency | 100% |
| `EXEMPT` | Personal use, unvested, liabilities | 0% |

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

### Calculation Modes
Based on Sheikh Joe Bradford's methodology.
- **Bradford (Default)**: Follows modern scholarly rulings adaptable for Western contexts.
- **Madhab Specific**: Configuration options for Hanafi, Maliki, Shafi'i, and Hanbali schools.

### Supported Asset Classes
- Cash & Bank Accounts
- Stocks, ETFs, Mutual Funds
- Retirement Accounts (401k, IRA, Roth)
- Cryptocurrency
- Gold & Silver
- Business Inventory
- Real Estate (for sale)
- Trusts

For detailed methodology, see [Methodology Documentation](https://zakatflow.org/methodology).

---

## Deployment

### Vercel (Recommended)

```bash
npm run build
# Output: dist/
```

Configure in Vercel:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Add your Supabase credentials

### Edge Functions

Deploy Supabase Edge Functions:

```bash
supabase functions deploy parse-financial-document
supabase functions deploy delete-account
```

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
|-------|--------|-------------|
| Core Calculator | ✅ Complete | Guided wizard with all asset classes |
| Asset Intelligence | ✅ Complete | Extract line items from PDFs/images |
| Donation Tracking | ✅ Complete | Receipt scanning, Active Hawl, Cloud Sync |
| Asset Dashboard | ✅ Complete | Manage accounts and statements |
| Export (PDF/CSV) | ✅ Complete | Download reports |
| Visualization | ✅ Complete | Sankey Chart visual asset flow |
| Settings Redesign | ✅ Complete | Expressive Dashboard & Data Safety |
| Plaid Integration | 📋 Planned | Bank account connection |
| Charity Directory | 📋 Planned | Search & filter vetted recipients |
| Mobile App | 📋 Planned | React Native implementation |

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgments

- **Sheikh Joe Bradford** — Primary methodology source
- **AMJA** — Assembly of Muslim Jurists of America
- **AAOIFI** — Accounting standards for Islamic finance
- **Supabase** — Backend infrastructure
- **Shadcn** — UI component system

---

<p align="center">
  <strong>May Allah accept your Zakat and purify your wealth. 🤲</strong>
</p>
