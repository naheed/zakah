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
│   ├── supabase.ts               # Gateway client via edge functions
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
| `MCP_GATEWAY_SECRET` | Optional | Shared secret for mcp-gateway edge function |
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

### Core Calculation
- **`calculate_zakat`**: Computes Zakat obligation for a given set of financial inputs. Returns both narrated text and `structuredContent`.
- **`compare_madhabs`**: Runs financial data through multiple methodologies for a side-by-side comparison.

### Document Analysis
- **`parse_blob`**: Extracts and structures data from OCR'd financial documents into zakatable line items.

### Market & Reference
- **`marketTools`**: Fetches real-time precious metals and currency exchange rates.
- **`discoveryTools`**: Provides rules and insights regarding specific madhab calculations.

### Compliance & Management
- **`reportingTools`**: Generates calculation history summaries or full ledger reports.
- **`legalTools`**: Retrieves disclaimers, privacy policies, and Shariah-compliance caveats.
- **`delete_data`**: Handles user identity or session deletion (GDPR/privacy compliance).

### Agentic Protocols
- **`agentProtocol`**: Exposes the OpenClaw orchestration hooks and inter-agent routing.
- **`interactiveTools`**: Exposes the Apps SDK widget template lifecycle methods.

---

## Interactive Widgets & CSP (Apps SDK)

The `calculate_zakat` tool returns `structuredContent` that is intended to be rendered interactively within the ChatGPT or Claude UI via the Apps SDK. The MCP server registers a `ui://zakatflow/calculator-widget.html` template.

For maximum security, the widget enforces a strict Content Security Policy (CSP):
- **`domain`**: `https://mcp.zakatflow.org`
- **`connectDomains`**: Whitelists only the Supabase backend URL (`https://pcwdpsoheoiiavkeyeyx.supabase.co`).
- **`resourceDomains`**: Whitelists `https://*.oaistatic.com` for OpenAI static asset interactions.

The widget bridge securely receives messages via `window.addEventListener('message')` to render methodology badges, detailed breakdowns, and nisab checks without executing untrusted external scripts.

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
