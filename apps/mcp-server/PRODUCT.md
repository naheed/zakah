# ZakatFlow MCP Server — Product Guide

> Connect ZakatFlow's Zakat calculation engine to any AI assistant via the Model Context Protocol.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![MCP](https://img.shields.io/badge/MCP-1.0-blue.svg)](https://modelcontextprotocol.io)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)

*Last updated: February 2026*

---

## Table of Contents

- [Overview](#overview)
- [Available Tools](#available-tools)
- [Transport Modes](#transport-modes)
- [Quick Start](#quick-start)
  - [Claude Desktop (Stdio)](#claude-desktop-stdio)
  - [ChatGPT Custom GPT (SSE)](#chatgpt-custom-gpt-sse)
  - [Docker Deployment](#docker-deployment)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Development](#development)
- [License](#license)

---

## Overview

The ZakatFlow MCP Server exposes the `@zakatflow/core` calculation engine as a set of tools that any [Model Context Protocol](https://modelcontextprotocol.io) client can call. This enables AI assistants like ChatGPT and Claude to perform real Zakat calculations, answer methodology-specific questions, and generate deep-link reports — all powered by the same engine that runs the [ZakatFlow web application](https://zakatflow.org).

**Key properties:**

- **Real calculations** — The server imports `@zakatflow/core` and runs the full ZMCS engine. Results are not mocked or approximated.
- **Methodology-aware** — Each of the eight scholarly presets has an agent protocol that guides AI behavior according to that methodology's rules.
- **Stateful sessions** — The interactive tools maintain an in-memory session store, allowing users to build up a portfolio across multiple conversation turns.
- **Two transports** — SSE (HTTP) for remote clients and Stdio for local MCP clients.

---

## Available Tools

The server registers nine tools across five categories:

### Calculation

| Tool | Parameters | Description |
|------|-----------|-------------|
| `calculate_zakat` | `cash`, `gold_value`, `gold_grams`, `silver_value`, `silver_grams`, `short_term_investments`, `long_term_investments`, `retirement_total`, `age`, `loans`, `monthly_mortgage`, `madhab` | Run a full Zakat calculation. Returns total assets, liabilities, net zakatable wealth, Nisab threshold, and Zakat due. |
| `parse_blob_input` | `blob` | Extract asset values from unstructured text (e.g., "I have $50,000 in cash and $10,000 in gold"). Returns parsed asset map. |

### Interactive Session

| Tool | Parameters | Description |
|------|-----------|-------------|
| `start_session` | *(none)* | Create a new calculation session. Returns a session ID for use in subsequent calls. |
| `add_asset` | `sessionId`, `assetType`, `amount` | Add an asset to an active session. Asset types: `cash`, `gold`, `silver`, `stocks`, `retirement`, `loans`. Automatically recalculates Zakat due. |

### Discovery

| Tool | Parameters | Description |
|------|-----------|-------------|
| `list_methodologies` | *(none)* | List all available ZMCS methodology presets with IDs, names, descriptions, and default Nisab standard. |
| `get_nisab_info` | `methodology_id` (optional) | Get the Nisab threshold for a specific methodology. Returns the standard (gold or silver), current value in USD, required grams, and market prices. |

### Agent Protocol

| Tool | Parameters | Description |
|------|-----------|-------------|
| `get_agent_protocol` | `methodology_id` | Retrieve the full agent protocol for a methodology. The protocol contains behavioral instructions that guide the AI to answer questions according to that scholar's rulings. |

### Market and Reporting

| Tool | Parameters | Description |
|------|-----------|-------------|
| `get_market_prices` | `currency` (default: USD) | Get current gold and silver prices (per gram and per ounce). Note: Returns baseline prices used for Nisab calculation, not live market data. |
| `create_report_link` | `cash`, `gold_value`, `silver_value`, `stocks`, `retirement`, `loans`, `madhab` | Generate a deep link to `zakatflow.org` with the calculation pre-filled. The user can open the link to view, print, or export a full PDF report. |

---

## Transport Modes

### SSE (Server-Sent Events)

The SSE transport runs over HTTP and is designed for remote clients, including ChatGPT Custom GPTs.

- **Endpoint:** `GET /mcp` or `GET /sse` — Establishes an SSE connection
- **Messages:** `POST /messages?sessionId=<id>` — Sends MCP messages to a session
- **Health check:** `GET /` — Returns a simple HTML status page

Each SSE connection creates a fresh `McpServer` instance with all tools registered, ensuring session isolation.

### Stdio

The Stdio transport communicates over standard input/output and is designed for local MCP clients like Claude Desktop.

- **Entry point:** `src/stdio.ts` (compiled to `dist/stdio.js`)
- **No HTTP server** — Communication happens entirely over stdin/stdout
- **Single instance** — One MCP server per process

---

## Quick Start

### Claude Desktop (Stdio)

Add the following to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "zakatflow": {
      "command": "node",
      "args": ["dist/apps/mcp-server/dist/stdio.js"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

> **Prerequisite:** Build the project first with `cd apps/mcp-server && npm run build`. The compiled output is at `dist/stdio.js`.

### ChatGPT Custom GPT (SSE)

1. Deploy the MCP server (see [Docker Deployment](#docker-deployment) below).
2. In ChatGPT's Custom GPT configuration, add the SSE endpoint as an MCP action:
   - **URL:** `https://your-server.example.com/mcp`
   - **Transport:** SSE
3. The GPT can now call all nine ZakatFlow tools.

### Docker Deployment

Build and run the Docker image from the repository root:

```bash
# Build the image (context must be the repo root for monorepo dependencies)
docker build -t zakatflow-mcp -f apps/mcp-server/Dockerfile .

# Run the container
docker run -d \
  -p 8080:8080 \
  -e NODE_ENV=production \
  -e CLIENT_URL=https://zakatflow.org \
  --name zakatflow-mcp \
  zakatflow-mcp
```

The SSE endpoint will be available at `http://localhost:8080/mcp`.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  MCP Client                          │
│         (ChatGPT, Claude, custom agent)              │
└──────────────────────┬──────────────────────────────┘
                       │  MCP Protocol (SSE or Stdio)
                       ▼
┌─────────────────────────────────────────────────────┐
│              ZakatFlow MCP Server                    │
│  ┌───────────────────────────────────────────────┐  │
│  │              Tool Registry                     │  │
│  │  calculate_zakat  │  parse_blob_input          │  │
│  │  start_session    │  add_asset                 │  │
│  │  list_methods     │  get_nisab_info            │  │
│  │  get_agent_proto  │  get_market_prices         │  │
│  │  create_report    │                            │  │
│  └───────────┬───────────────────────────────────┘  │
│              │                                       │
│  ┌───────────▼───────────────────────────────────┐  │
│  │          Session Store (in-memory)             │  │
│  │   Map<sessionId, { formData, lastUpdated }>    │  │
│  └───────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │  imports
                       ▼
┌─────────────────────────────────────────────────────┐
│              @zakatflow/core                         │
│  calculateZakat() · calculateNisab()                 │
│  ZAKAT_PRESETS · AVAILABLE_PRESETS                    │
│  Agent Protocols (8 methodologies)                   │
│  ZakatFormData · defaultFormData                     │
│  GOLD_PRICE · SILVER_PRICE · GRAMS_PER_OUNCE        │
└─────────────────────────────────────────────────────┘
```

### Key Design Decisions

- **Per-connection server instances.** Each SSE connection creates a new `McpServer` instance. This ensures session isolation and avoids SDK constraints around shared state.
- **In-memory session store.** Interactive sessions (`start_session`, `add_asset`) are stored in a `Map` and scoped to the server process lifetime. Sessions are not persisted across restarts.
- **Shared core library.** The server imports `@zakatflow/core` for all calculation and methodology logic. No Zakat logic is implemented in the MCP server itself.
- **Baseline market prices.** `get_market_prices` returns the default gold and silver prices from `@zakatflow/core`. These are the same baseline prices used for Nisab calculation in the web app. Live market data integration is on the roadmap.

---

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Set to `production` for deployed environments |
| `PORT` | `8080` (Docker) / `3001` (local) | HTTP server port for SSE transport |
| `CLIENT_URL` | `https://zakatflow.org` (prod) / `http://localhost:8080` (dev) | Base URL for generated report deep links |

---

## Development

### Prerequisites

- Node.js 18+
- npm 9+

### Local Development

```bash
cd apps/mcp-server

# Install dependencies (from repo root)
cd ../.. && npm install && cd apps/mcp-server

# Start development server (SSE transport, hot-reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Project Structure

```
apps/mcp-server/
├── src/
│   ├── index.ts              # SSE transport entry point (Express server)
│   ├── stdio.ts              # Stdio transport entry point
│   ├── session/
│   │   └── store.ts          # In-memory session store
│   └── tools/
│       ├── calculate_zakat.ts    # Full Zakat calculation
│       ├── parse_blob.ts         # Unstructured text parser
│       ├── interactive.ts        # Session management (start_session, add_asset)
│       ├── agent_protocol.ts     # Methodology agent protocols
│       ├── market.ts             # Gold/silver market prices
│       ├── discovery.ts          # list_methodologies, get_nisab_info
│       └── reporting.ts          # Deep link report generation
├── Dockerfile                # Multi-stage Docker build
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

### Testing with MCP Inspector

You can use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to test tools interactively:

```bash
# Start the server
npm run dev

# In another terminal, connect the inspector
npx @modelcontextprotocol/inspector http://localhost:3001/mcp
```

---

## License

This project is licensed under the **GNU Affero General Public License v3.0**. See [LICENSE](../../LICENSE) for details.

---

<p align="center">
  <strong>May Allah accept your Zakat and purify your wealth. 🤲</strong>
</p>
