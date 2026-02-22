# ZakatFlow ChatGPT Widget

> **Rich interactive Zakat widgets for ChatGPT** — A React 18 application that renders beautifully inside ChatGPT conversations via the MCP Apps SDK.

## Overview

The ChatGPT Widget package renders interactive Zakat calculation results directly inside ChatGPT conversations. When a user asks ChatGPT to calculate their Zakat, the MCP server returns `structuredContent` that this widget renders as premium, animated cards — bringing ZakatFlow's clarity and precision into the AI conversation itself.

### Widget Components

| Widget | Purpose | Key Features |
|--------|---------|-------------|
| **ZakatResultCard** | Single calculation result | Gradient hero amount, nisab progress bar, staggered breakdown, deep-link CTA |
| **MethodologyComparisonCard** | Side-by-side comparison | Range summary, "Lowest" badge, relative bar charts, key rule tags |
| **SessionProgressCard** | Interactive session tracker | Asset icons, 5-step progress dots, running totals, next-step hints |

---

## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3 | Component framework |
| Vite | 6.0 | Build tool with single-file output |
| Tailwind CSS | 4.0 | Utility-first styling |
| `@modelcontextprotocol/ext-apps` | 1.0 | MCP Apps bridge (`useApp` hook) |
| `@openai/apps-sdk-ui` | 0.2 | ChatGPT design system |

---

## Architecture

```
apps/chatgpt-widget/
├── index.html                          # Vite entry point
├── vite.config.ts                      # Single-file output for MCP embedding
├── src/
│   ├── main.tsx                        # React root
│   ├── App.tsx                         # MCP bridge + routing
│   ├── index.css                       # Design system + animations
│   ├── types.ts                        # Shared TypeScript interfaces
│   ├── components/
│   │   ├── ZakatResultCard.tsx         # Calculation result card
│   │   ├── MethodologyComparisonCard.tsx # Comparison card
│   │   └── SessionProgressCard.tsx     # Session progress card
│   └── __tests__/
│       └── widget.test.ts             # 21 type + component tests
```

### MCP Bridge Flow

```
ChatGPT → MCP Server → structuredContent → PostMessage → App.tsx → Widget Card
```

1. User asks ChatGPT to calculate Zakat
2. MCP server runs `calculate_zakat` tool and returns `structuredContent`
3. ChatGPT hosts the widget in an iframe, sends data via `PostMessageTransport`
4. `App.tsx` receives data via `app.ontoolresult` callback
5. Routes to the correct card based on data shape (`zakatDue` → Result, `type: comparison` → Comparison, `type: session_progress` → Progress)

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# From the monorepo root
npm install --workspace=apps/chatgpt-widget
```

### Development

```bash
# Start Vite dev server
npm run dev --workspace=apps/chatgpt-widget
```

### Build

```bash
# Production build (single-file output for MCP resource embedding)
npm run build --workspace=apps/chatgpt-widget
```

The build outputs to `dist/` with a high asset inline limit (100KB), producing a self-contained HTML file suitable for serving as an MCP resource.

---

## Design System

The widget uses CSS custom properties for seamless ChatGPT theme integration:

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `--zf-text` | `#1a1a2e` | `#f1f5f9` | Primary text |
| `--zf-text-muted` | `#64748b` | `#94a3b8` | Secondary text |
| `--zf-card-bg` | `#ffffff` | `#1e1e2e` | Card background |
| `--zf-border` | `#e2e8f0` | `#334155` | Border color |
| `--zf-primary` | `#1a1a2e` | — | CTA button |
| `--zf-accent` | `#16a34a` | — | Brand green |

### Shared CSS Classes

| Class | Purpose |
|-------|---------|
| `.zf-card` | Card container with border, radius, shadow |
| `.zf-badge` | Rounded pill badge (variants: `--success`, `--warning`, `--info`) |
| `.zf-cta` | Primary CTA button with hover lift |
| `.zf-rule-tag` | Small pill tag for key rules |
| `.zf-disclaimer` | Scholarly disclaimer text |
| `.animate-fade-in` | 400ms fade-in animation |
| `.animate-slide-up` | 350ms slide-up with stagger support |

---

## Testing

```bash
# Run widget tests
npm test --workspace=apps/chatgpt-widget

# Watch mode
npm run test:watch --workspace=apps/chatgpt-widget
```

**Test coverage:** 21 tests — type contracts for all 3 data shapes + component existence verification.

---

## License

[AGPL-3.0-or-later](../../LICENSE) — © 2026 ZakatFlow
