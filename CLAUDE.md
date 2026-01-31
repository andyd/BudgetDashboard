# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Tracking

| Field           | Value                 |
| --------------- | --------------------- |
| **Category**    | Web Application       |
| **Status**      | 🔵 Active Development |
| **Last Worked** | Jan 2026              |
| **Next Action** | Build MVP             |

---

## Overview

A living dashboard showing US federal spending with side-by-side comparisons that translate billions into tangible terms. Users can compare budget items like "Defense Department spending" to relatable units like "teacher salaries" or "hospital beds."

## Commands

```bash
pnpm dev              # Development server (Turbopack)
pnpm build            # Production build
pnpm lint             # ESLint
pnpm type-check       # TypeScript check
pnpm test             # Playwright E2E tests
pnpm test:unit        # Vitest unit tests
pnpm test:unit:watch  # Vitest watch mode

# Run single tests
npx playwright test tests/e2e/homepage.spec.ts
npx playwright test -g "test name"
pnpm test:unit -- src/lib/__tests__/comparison-engine.test.ts
```

## Architecture

### Core Data Model

The app has two main data types that get combined to create comparisons:

1. **Budget Items** (`src/lib/data/budget-items/`) - Federal spending amounts
   - Departments (HHS, Defense, etc.)
   - Programs (Medicare, SNAP, etc.)
   - Current events (specific policy spending)

2. **Comparison Units** (`src/lib/data/comparison-units/`) - Tangible cost references
   - Categories: education, healthcare, housing, transportation, income, veterans, etc.
   - Each unit has `costPerUnit`, `name`, `nameSingular`, `pluralName`

### Comparison Engine (`src/lib/comparison-engine.ts`)

Core logic that:

- Converts dollar amounts to unit counts via `calculateComparison(amount, unit)`
- Scores comparisons for memorability via `calculateImpactScore()` (prefers round numbers, 1-100 range)
- Auto-selects best units via `findBestComparison(amount, units)`
- Returns diverse alternatives via `getAlternatives()`

### State Management

- **Budget Store** (`src/stores/budget-store.ts`) - Zustand store for treemap navigation
  - Handles drill-down path, breadcrumb navigation
  - Syncs navigation state to URL query params
- **Comparison Store** (`src/stores/comparison-store.ts`) - Comparison builder state

### Key Routes

| Route                            | Purpose                                           |
| -------------------------------- | ------------------------------------------------- |
| `/`                              | Homepage with budget treemap + comparison builder |
| `/compare`                       | Full comparison builder page                      |
| `/compare/[spendingId]/[unitId]` | Shareable comparison page                         |
| `/budget/[...path]`              | Budget drill-down navigation                      |
| `/embed/[budgetId]/[unitId]`     | Embeddable comparison widget                      |
| `/api/compare`                   | Comparison calculation API                        |
| `/api/budget/search`             | Budget item search                                |
| `/api/units/search`              | Comparison unit search                            |

### Component Organization

- `components/budget/` - Budget visualization (BudgetTreemap, DrillDownPanel, SpotlightPanel)
- `components/comparison/` - Comparison display (ComparisonCard, ComparisonBuilder)
- `components/comparison-builder/` - Smart Comparison Builder with browse modals
- `components/ui/` - shadcn/ui components

## Data Sources

Budget data currently uses static mock data in `src/lib/data/`. The `src/lib/usaspending.ts` client is prepared for future integration with the USAspending API.

## Setup

1. Copy environment variables:

   ```bash
   cp env.example .env.local
   ```

2. Fill in required values:
   - `DATABASE_URL` - Neon PostgreSQL connection string (optional for dev)
   - `ADMIN_PASSWORD` - Admin panel password

## Tech Stack

- Next.js 16 (App Router + Turbopack)
- React 19 with TypeScript strict
- Tailwind CSS 4 + shadcn/ui
- D3.js (treemap visualization)
- Framer Motion (animations)
- Zustand (state management)
- Drizzle ORM + PostgreSQL
- Vitest (unit) + Playwright (E2E)
