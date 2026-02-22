# ZakatFlow MCP Server

> **The AI backbone for ZakatFlow** — An MCP (Model Context Protocol) server that enables conversational Zakat calculation through ChatGPT, Claude, and other AI assistants.

## Overview

The ZakatFlow MCP Server exposes Islamic finance calculation tools via the [Model Context Protocol](https://modelcontextprotocol.io), allowing AI assistants to compute Zakat obligations using eight scholarly methodologies. It handles user identity persistence, encrypted session storage, and interactive widget rendering — all while respecting Islamic jurisprudence (fiqh) precision.

### Key Capabilities

| Capability | Description |
|-----------|-------------|
| **8 Methodologies** | Bradford, Hanafi, Shafii, Maliki, Hanbali, AMJA, Qaradawi, and Yusuf al-Qaradawi approaches |
| **Encrypted Sessions** | AES-256-GCM encryption with scrypt KDF for session data at rest |
| **ChatGPT Identity** | Persistent user profiles linked via OpenAI Apps SDK context |
| **Interactive Widgets** | Rich UI cards rendered inside ChatGPT via MCP Apps bridge |
| **Scholarly Disclaimer** | Every response includes fiqh-appropriate "calculations, not fatwas" guidance |

---

## Architecture

```
apps/mcp-server/
├── src/
│   ├── index.ts                  # Server bootstrap + tool registration
│   ├── stdio.ts                  # MCP stdio transport
│   ├── crypto.ts                 # AES-256-GCM encryption (Privacy Vault)
│   ├── supabase.ts               # Dual-client: anon + service-role
│   ├── identity/
│   │   └── chatgpt.ts            # ChatGPT user CRUD + session writes
│   ├── session/
│   │   └── persistent-store.ts   # In-memory cache + encrypted Supabase persistence
│   ├── tools/
│   │   ├── calculate_zakat.ts    # Primary calculation tool
│   │   ├── compare_madhabs.ts    # Multi-methodology comparison
│   │   └── ...                   # Additional MCP tools
│   ├── widget/
│   │   └── template.ts           # Widget URI + MIME registration
│   └── __tests__/
│       ├── tools.test.ts         # 17 tool tests
│       ├── identity.test.ts      # 11 identity tests
│       └── crypto.test.ts        # 21 crypto + session tests
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (workspace-aware)
- A [Supabase](https://supabase.com) project (optional — server degrades gracefully without it)

### Installation

```bash
# From the monorepo root
npm install

# Or install just this workspace
npm install --workspace=apps/mcp-server
```

### Environment Variables

Copy the example file and fill in your credentials:

```bash
cp apps/mcp-server/.env.example apps/mcp-server/.env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Optional | Supabase project URL |
| `SUPABASE_ANON_KEY` | Optional | Publishable anon key (respects RLS) |
| `SUPABASE_SERVICE_KEY` | Optional | Service role key (**never expose publicly**) |
| `ENCRYPTION_MASTER_KEY` | Optional | 64-char hex string for AES-256-GCM encryption |
| `NODE_ENV` | Optional | `development` or `production` |
| `CLIENT_URL` | Optional | ZakatFlow web app URL for deep-links |

> **Generate an encryption key:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### Running

```bash
# Development (watch mode)
npm run dev --workspace=apps/mcp-server

# Connect via MCP Inspector
npx @modelcontextprotocol/inspector node dist/index.js
```

---

## MCP Tools

### `calculate_zakat`

Computes Zakat obligation for a given set of financial inputs. Returns both narrated text (for the AI to summarize) and `structuredContent` (for the widget to render).

**Inputs:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `cash` | `number` | Cash, checking, and savings (required) |
| `gold_value` | `number?` | Value of gold in USD |
| `silver_value` | `number?` | Value of silver in USD |
| `long_term_investments` | `number?` | Passive stocks/funds (subject to methodology-specific rates) |
| `retirement_total` | `number?` | 401(k)/IRA vested balance |
| `loans` | `number?` | Immediate debts due now |
| `madhab` | `string?` | Methodology: `bradford`, `hanafi`, `shafii`, `maliki`, `hanbali`, `amja`, `qaradawi` |

### `compare_madhabs`

Runs the same financial data through multiple methodologies and returns a side-by-side comparison with key rule differences (passive investment rates, liability methods, nisab standards).

---

## Testing

```bash
# Run all MCP server tests
npm test --workspace=apps/mcp-server

# Watch mode
npm run test:watch --workspace=apps/mcp-server
```

**Test coverage:** 49 tests across 3 suites (tools, identity, crypto) — runs in ~1 second.

---

## Security

- **Encryption:** AES-256-GCM with scrypt key derivation (N=16384, r=8, p=1). Unique salt + IV per encryption — ciphertext is never reused.
- **RLS:** Supabase Row Level Security enabled with zero public policies on `chatgpt_users` and `chatgpt_sessions` tables. The anon key cannot read ChatGPT data.
- **Graceful Degradation:** All features degrade gracefully when Supabase or encryption is unconfigured. The server never crashes due to missing credentials.

---

## License

[AGPL-3.0-or-later](../../LICENSE) — © 2026 ZakatFlow
