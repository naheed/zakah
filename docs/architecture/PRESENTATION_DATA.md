# Architecture: Presentation, Data Flow, & Export

## Conceptual Overview
The ZakatFlow presentation layer (`apps/web`) is responsible for taking the vast `ZakatCalculationResult` matrix and distilling it into a clean, understandable UI for the consumer.

The core philosophy of the presentation layer is **strict parity across viewing mediums** (Web UI, CSV Export, PDF Report).

## The Sankey Chart (Flow Conservation)
The `ZakatSankeyChart` provides the user with a visual proof of their calculation.

### Conservation Rule
The diagram structurally enforces:
`Gross Assets = Zakat Due + Retained Wealth + Liabilities + Exempt Assets`

### Nodes & Links
- **Assets (Sources):** Rendered dynamically based on value.
- **Zakat (Target):** The 2.5% obligatory charity (or appropriate override rate). Always sorted to the top.
- **Retained (Target):** `Net Asset - Zakat Contribution - Liability Contribution`.
- **Liabilities (Target):** Visualized as a red node. Only rendered if `totalLiabilities > 0`. Flow is distributed proportionally across net-value assets to demonstrate how debts reduce zakatable wealth.
- **Exempt (Target):** `Gross Asset - Net Asset`. Always sorted to the bottom.

## Data Persistence Strategy
ZakatFlow operates as a **local-first** application.
- **Transient State (`ZakatFormData`)**: Handled via React state (custom hook `useZakatStore`).
- **Persistence (`useZakatPersistence`)**: Form data is regularly serialized and persisted to `localStorage` or `sessionStorage`. 
- **The Vault (`@zakatflow/core` CryptoService)**: Future-proofing for PII. If data ever leaves the device (e.g., account sync), it is encrypted client-side using AES-256-GCM before transport. The backend (`apps/mcp-server` / Supabase) never receives plaintext financial data.

## Export Architecture (CSV & PDF)
We guarantee that an exported CSV is a "snapshot of truth" that can function as an offline calculation worksheet.

### PDF Export (React-PDF)
- Utilizes `@react-pdf/renderer` inside Web Workers. This ensures the main UI thread isn't blocked while rendering a complex V-DOM to a binary blob.
- Generates `ZakatPDFDocumentV2`, maintaining strict parity with the Web UI's Asset and Liability tables.
- **Critical rule:** Export modules must import `@zakatflow/core` dynamically or strictly via ESM, avoiding older `require()` syntaxes that break Vite build pipelines.

### CSV Export
- Produces a multi-sheet-style flat file.
- Contains specific markers for **Inputs**, **Gross Assets**, **Deducted Liabilities**, **Calculated Zakat**, and a **Methodology Glossary**.
- Designed to minimize the user's need to return to ZakatFlow.org to re-verify fatwas (scholarly basis is included inline in the export).
