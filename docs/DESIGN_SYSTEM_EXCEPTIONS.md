# Design System Audit & Exception Log

## Overview
This document tracks deviations from the standard ZakatFlow design system (`bg-background`, `text-primary`, etc.).

## Audit: Hardcoded Values
We scanned the codebase for hardcoded Tailwind colors (e.g., `text-blue-500`, `#ff0000`).

### Resolved Items
The following files were refactored to use Semantic System Tokens:
- **`src/lib/assetCategories.ts`**: Replaced standard colors (`emerald`, `blue`, `purple`, `orange`) with **Chart Tokens** (`chart-1` to `chart-5`) or **System Containers** (`tertiary-container`).
- **`src/pages/Methodology.tsx`**: Replaced `text-green-600` with `text-success` and `text-red-500` with `text-destructive`.
- **`src/pages/Assets.tsx`**: Replaced arbitrary icons (`indigo`, `emerald`) with `text-primary`.

### Deliberate Exceptions (Ignored)
The following files utilize hardcoded colors for specific reasons (testing, dev tools):

*   **`src/pages/DevTools.tsx`**: Uses `text-emerald-500`, `text-blue-500`, etc. to visually distinguish debug options.
*   **`src/pages/ExtractionTest.tsx`**: Uses hardcoded colors for raw debugging output of extracted financial data.
*   **`src/pages/SankeyTest.tsx`**: Visualization prototypes.
*   **`src/pages/AddAccount.tsx`**: Uses `bg-green-50` / `bg-red-50` for external bank connection status (Plaid-like UI). *Consider refactoring to `success-container` in future.*

## Design System Principles used
1.  **Surfaces**: Use `bg-card` or `bg-muted`. Avoid `bg-gray-100`.
2.  **Tints**: Use `bg-primary-container`, `bg-tertiary-container` (System Tokens). Avoid `bg-primary/10` (Fragile).
3.  **Status**: Use `text-success`, `text-destructive`, `text-muted-foreground`.
4.  **Data Viz**: Use `text-chart-1` through `text-chart-5`.
