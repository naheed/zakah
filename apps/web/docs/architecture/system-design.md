# ZakatFlow System Design

This document details the high-level infrastructure that powers ZakatFlow's calculation wizard and MCP Server ecosystem.

## High-Level Architecture
```text
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

## Packages
The repository is split into three primary isolated ecosystems:

### `@zakatflow/core` (Calculation Library)
- The Zakat Methodology Configuration Standard (ZMCS) JSON engine.
- Contains all computation logic (`calculateZakat`, `calculateNisab`), 60+ parameters, and the 8 Scholarly Methodology Presets.
- Evaluated independently of the UI framework.

### `apps/web` (Frontend Wizard)
- Houses the guided Zakat steps, financial reporting/Sankey charts, document upload parsing interfaces, and Bank Sync configurations.
- Interacts with Supabase Auth and Edge functions.
- Protected client-side by the `Privacy Vault`.

### `apps/mcp-server` (AI Integrations)
- A standalone Model Context Protocol server exposing the `@zakatflow/core` engine to external AI clients (ChatGPT, Claude Desktop).
- Implements two transport protocols:
  1. **SSE (Server-Sent Events)**: HTTP remote clients. Uses stateless Express instances per connection.
  2. **Stdio**: Local machine streaming over stdin/stdout.
