# React Style & CSS Rules

These standards apply to all code in `apps/web` authored by humans or AI agents.

## Core Directives
1. **React 18 & Functional Strictness**: No class components. Use functional components exclusively. 
2. **TypeScript**: Strict typing required. No `any` types; use `unknown` with type guards. Enforce exhaustive switch statements and nullish coalescing (`??`).
3. **Props interfaces**: Define a named `Props` interface above the component. Use `interface` for props, `type` for unions/intersections.
4. **Export types**: Domain types must live in `types/` or `types.ts` files, not inline. Prefer `const` assertions for literal objects/arrays.

## Component Structure
Follow this exact ordering within files:
1. Imports (external → internal → relative)
2. Props interface
3. Component function
4. Hooks (`use` prefix, colocated in `hooks/`)
5. Derived state and handlers
6. Return (JSX)
7. Default export

## CSS & Styling Constraints (ZakatFlow Quality Bar)
1. **Design System Native**: Exclusively use `shadcn/ui` and Phosphor Icons.
2. **Semantic Tokens ONLY**: Never use direct Tailwind colors (like `bg-white` or `text-gray-500`) or opacity hacks.
3. **Approved Surfaces**: Use `bg-muted`, `bg-background`, `bg-card`, `bg-primary-container`.
4. **Approved Text**: Use `text-foreground`, `text-muted-foreground`.
5. **Modification Rule**: Do not edit `index.css` or `tailwind.config.ts` unless implementing a global design system change approved by the PM.

## Accessibility (A11y)
- **WCAG 2.1 AA**: Treat contrast and keyboard navigation as fundamental constraints.
- **Testing**: Must pass `npx playwright test e2e/static-pages-a11y.spec.ts`.
- **Links**: Use explicit `underline` or clear visual distinction beyond color.
- **HTML**: Standard semantic tags (`<header>`, `<main>`, `<section>`, `<nav>`).
