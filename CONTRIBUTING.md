# Contributing to ZakatFlow

First off, thank you for considering contributing to ZakatFlow! 🤲

ZakatFlow is an open-source project that helps Muslims calculate their Zakat obligation accurately. Every contribution helps make this tool better for the ummah.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Fiqh Considerations](#fiqh-considerations)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. We expect all contributors to:

- Be respectful and considerate in all interactions
- Focus on constructive feedback
- Accept differing viewpoints gracefully
- Prioritize what's best for the community

## Getting Started

### Prerequisites

- **Node.js** 18+ (we recommend using [nvm](https://github.com/nvm-sh/nvm))
- **Bun** (optional, for faster installs)
- **Supabase CLI** for local development
- Your own **Supabase project** (free tier works)

### Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork:**
   ```bash
   git clone https://github.com/naheed/zakah.git
   cd zakatflow
   ```

3. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

4. **Set up environment:**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your Supabase credentials.

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Run tests:**
   ```bash
   npm test
   ```

## Monorepo & Lovable Build Contract

This project is a monorepo (`apps/web`, `apps/mcp-server`, `packages/core`) that also builds inside Lovable's single-package environment.

### Key Rules

1. **The root `package.json` is the single source of truth for Lovable builds.** Lovable installs dependencies from the root only — it does not read `apps/web/package.json`.
2. **When adding a dependency to `apps/web/package.json`, you MUST also add it to the root `package.json`** with the same version range.
3. **Root config files are wrappers.** `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, and `postcss.config.cjs` at the root point the build to `apps/web/src`. Do not delete them.
4. **`packages/core` is resolved via Vite alias** (`@zakatflow/core` → `packages/core/src/index.ts`), not via npm workspaces.
5. **`apps/mcp-server` is NOT built by Lovable.** It has its own build pipeline.
6. **React 18 and Tailwind v3 are pinned.** Do not upgrade to React 19 or Tailwind v4 without a coordinated migration.

### Setting Up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Run the migrations:
   ```bash
   supabase link --project-ref YOUR_PROJECT_ID
   supabase db push
   ```
3. Copy your project URL and anon key to `.env.local`

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues. When creating a report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the behavior
- **Expected behavior** vs. what actually happened
- **Screenshots** if applicable
- **Browser/device** information

### Suggesting Enhancements

We welcome feature suggestions! Please:

1. Check if the feature has already been suggested
2. Open an issue with the `enhancement` label
3. Describe the feature and its benefit clearly
4. Consider how it fits with the existing design

### Your First Code Contribution

Look for issues labeled:
- `good first issue` — Simple, well-defined tasks
- `help wanted` — We'd love help with these
- `documentation` — Improve docs and guides

## Pull Request Process

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Write/update tests** for your changes

4. **Run the test suite:**
   ```bash
   npm test
   npm run build
   ```

5. **Commit with a clear message:**
   ```bash
   git commit -m "feat: add support for agricultural zakat"
   ```
   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` — New feature
   - `fix:` — Bug fix
   - `docs:` — Documentation only
   - `style:` — Formatting, no code change
   - `refactor:` — Code change without feature/fix
   - `test:` — Adding tests
   - `chore:` — Maintenance

6. **Push and create a PR:**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open a Pull Request on GitHub.

7. **Respond to review feedback** promptly

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` types — use proper typing
- Export types from dedicated type files

### React

- Use functional components with hooks
- Keep components small and focused
- Use the existing UI component library (shadcn/ui)

### Styling

- **Use semantic design tokens** — never direct colors like `text-white`
- Use Tailwind classes from our design system
- Follow existing patterns in `index.css` and `tailwind.config.ts`

```tsx
// ❌ Wrong
<div className="bg-white text-gray-800">

// ✅ Correct
<div className="bg-background text-foreground">
```

### File Organization

```
src/
├── components/
│   ├── ui/           # Reusable UI primitives
│   └── zakat/        # Domain-specific components
├── hooks/            # Custom React hooks
├── lib/              # Utilities and business logic
├── pages/            # Route components
└── types/            # TypeScript type definitions
```

## Testing

### Running Tests

```bash
# Unit tests
npm test

# E2E tests (requires Playwright)
npx playwright test

# Accessibility tests
npx playwright test e2e/static-pages-a11y.spec.ts
```

### Writing Tests

- Write unit tests for calculation logic in `src/lib/`
- Add E2E tests for critical user flows
- Test accessibility — we maintain WCAG 2.1 AA compliance

## Fiqh Considerations

ZakatFlow's calculation logic is based on scholarly methodology. When contributing to calculation logic:

### Do:
- Reference scholarly sources for any changes
- Document the fiqh basis in code comments
- Consider multiple madhab perspectives
- Discuss methodology changes in issues first

### Don't:
- Make arbitrary changes to calculation formulas
- Add asset classes without scholarly backing
- Assume one ruling applies universally

### Key Resources:
- [Methodology page](https://zakatflow.org/methodology)
- `docs/ZAKAT_JURISPRUDENCE.md` — Detailed fiqh documentation
- `docs/ZMCS_SPECIFICATION.md` — ZMCS v2.0 configuration standard
- `docs/CONTRIBUTING_METHODOLOGY.md` — How to add a new methodology
- `src/lib/config/presets/` — All methodology configurations
- `src/lib/madhahRules.ts` — School-specific display rules

## Questions?

- Open an issue for general questions
- Check existing documentation in `/docs`
- Review the [README](README.md) for project overview

---

**JazakAllah khair for contributing!** May Allah accept your efforts. 🤲
