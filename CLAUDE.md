# CLAUDE.md - Federal Budget Dashboard

## Project Tracking

| Field           | Value                 |
| --------------- | --------------------- |
| **Category**    | Web Application       |
| **Status**      | 🔵 Active Development |
| **Last Worked** | Jan 2026              |
| **Next Action** | Build MVP             |

---

## Overview

A living dashboard showing US federal spending with side-by-side comparisons that translate billions into tangible terms. See the design doc at `docs/plans/2026-01-29-federal-budget-dashboard-design.md`.

## Setup

1. Copy environment variables:

   ```bash
   cp env.example .env.local
   ```

2. Fill in required values in `.env.local`:
   - `DATABASE_URL` - Neon PostgreSQL connection string
   - `ADMIN_PASSWORD` - Admin panel password (min 8 chars)

3. See `docs/environment-setup.md` for full environment variable documentation

## Commands

```bash
pnpm dev          # Development server (Turbopack)
pnpm build        # Production build
pnpm lint         # ESLint
pnpm type-check   # TypeScript check
pnpm test         # Playwright E2E tests
pnpm test:unit    # Vitest unit tests
pnpm db:push      # Push schema to database
pnpm db:studio    # Drizzle Studio GUI
```

## Architecture

```
src/
├── app/
│   ├── page.tsx                    # Landing page (budget viz + comparisons)
│   ├── budget/[...path]/page.tsx   # Drill-down routes
│   ├── compare/[id]/page.tsx       # Shareable comparison page
│   ├── admin/                      # Admin interface
│   └── api/
│       ├── budget/                 # Budget data endpoints
│       ├── comparisons/            # Comparison CRUD
│       └── units/                  # Comparison units
├── components/
│   ├── budget/                     # Budget visualization components
│   │   ├── BudgetTreemap.tsx       # D3.js treemap
│   │   ├── BudgetBreadcrumb.tsx    # Navigation breadcrumb
│   │   ├── SpotlightPanel.tsx      # Info cards
│   │   └── DrillDownPanel.tsx      # Drill-down UI
│   ├── comparison/                 # Comparison components
│   │   ├── ComparisonCard.tsx      # Single comparison display
│   │   ├── ComparisonBuilder.tsx   # Build your own
│   │   ├── FeaturedCarousel.tsx    # Rotating featured
│   │   └── ShareButton.tsx         # Social sharing
│   └── ui/                         # shadcn/ui components
├── lib/
│   ├── env.ts                      # Type-safe environment variables (Zod)
│   ├── schema.ts                   # Drizzle schema
│   ├── budget-data.ts              # Budget data utilities
│   ├── unit-converter.ts           # Dollar to unit conversion
│   └── usaspending.ts              # USAspending API client
├── stores/
│   ├── budget-store.ts             # Zustand budget state
│   └── comparison-store.ts         # Zustand comparison state
└── types/
    └── budget.ts                   # TypeScript types
```

## Key Components

- **BudgetTreemap** - D3.js treemap showing budget hierarchy
- **ComparisonCard** - Displays a single comparison with sources
- **ComparisonBuilder** - "Compare X to Y" interface
- **SpotlightPanel** - Editorial explainer cards

## Data Flow

1. USAspending API → Backend sync job → PostgreSQL
2. PostgreSQL → API routes → React components
3. Admin panel → Editorial content → Featured comparisons

## Tech Stack

- Next.js 15 (App Router + Turbopack)
- TypeScript strict
- Tailwind CSS 4 + shadcn/ui
- D3.js (treemap visualization)
- Framer Motion (animations)
- Zustand (state management)
- Drizzle ORM + PostgreSQL
