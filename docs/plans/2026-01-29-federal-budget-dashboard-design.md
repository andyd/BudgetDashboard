# Federal Budget Dashboard - Design Document

**Date:** 2026-01-29
**Status:** Draft
**Project:** New web application

---

## Overview

A living dashboard showing US federal spending with side-by-side comparisons that translate billions into tangible terms. Users see where tax dollars go and understand trade-offs between spending priorities.

**Core value proposition:** See the budget, understand the trade-offs, share a comparison.

---

## Audience

- General public wanting to understand their taxes
- Activists and advocates making the case for policy change
- Journalists covering budget and policy stories

The surface must be dead simple. Power users can dig deeper.

---

## Landing Experience

### Layout

**Left side (60%):** Interactive budget visualization (treemap or sunburst) showing the full federal budget. Major categories visible at a glance. Click any segment to drill down.

**Right side (40%):** Rotating curated comparison cards. Each card shows a striking comparison with source citations:

> "Daily ICE detention costs = 12,000 teacher salaries/year"

New cards can be featured based on news cycle.

### Above the fold

Minimal. "Where Your Tax Dollars Go" and current fiscal year. The visualization does the talking.

### Key interaction

Hover on any budget segment and the comparison panel updates with relevant translations. Click to drill deeper.

---

## Drill-Down Experience

### Budget hierarchy

```
Federal Budget
  → Department (Defense, HHS, Treasury...)
    → Agency (Army, Navy, CDC...)
      → Program (Aircraft Procurement, Ship Construction...)
        → Line Item (F-35 program, specific contracts...)
```

### Each level displays

- Dollar amount and percentage of parent category
- Year-over-year change (arrows, percentage)
- Contextual comparison ("This program costs more than the entire EPA budget")

### Navigation

Breadcrumb trail: `Federal Budget > Defense > Navy > Ship Construction`

Click any level to zoom back out.

### Spotlight panels

Select items get editorial treatment - info cards explaining what the program is, why it matters, what the money buys. Priority topics: ICE detention, defense procurement, healthcare programs. Factual explanations, not opinion.

### Mobile

Stacked layout: budget viz on top, comparisons below. Drill-down uses slide-in panel.

---

## Comparison Builder

### Build your own

Simple interface below curated comparisons: "Compare **_ to _**"

Two dropdowns let users pick any budget items. Result displays instantly:

> "Annual F-35 program spending ($12.4B) could fund 4.1 million households' annual health insurance premiums"

### Comparison units library

Curated units with real costs and sources:

| Unit                                  | Cost         | Source |
| ------------------------------------- | ------------ | ------ |
| Average teacher salary                | $65,000/year | BLS    |
| Health insurance premium (individual) | $8,500/year  | KFF    |
| Health insurance premium (family)     | $22,000/year | KFF    |
| Monthly insulin cost                  | $300/month   | HHS    |
| School lunch                          | $3.50        | USDA   |
| Section 8 housing voucher             | $1,200/month | HUD    |
| Median household income               | $75,000/year | Census |

Users see the math: `$12.4B ÷ $3,000/year insulin = 4.1M people supplied`

### Sharing

Each comparison generates a unique URL. Share to social or copy embed snippet. Shared version shows comparison card with sources and link back.

### Quick-select presets

- ICE vs Healthcare
- Defense vs Education
- What could $1B buy?

---

## Data Architecture

### Sources

| Source                | Type                  | Update frequency  |
| --------------------- | --------------------- | ----------------- |
| USAspending.gov API   | Actual spending       | Daily/weekly pull |
| CBO reports           | Projections, analysis | Manual extraction |
| OMB budget documents  | Proposed budgets      | Annual, manual    |
| Agency press releases | Breaking news         | As needed         |

### Data pipeline

Backend service pulls from USAspending API on schedule. New data triggers recalculation of comparisons. Manual entries via admin interface for CBO/OMB data.

### Freshness indicators

- Each data point shows "Last updated: [date]" and source
- Header displays "Data as of [month year]"

### Editorial layer

Admin panel for:

- Featuring comparisons on homepage
- Adding spotlight explainers
- Flagging trending items
- Managing comparison units

### Caching

Pre-compute common comparisons and drill-down views server-side.

---

## Technical Stack

### Frontend

- Next.js 15 (App Router)
- TypeScript strict mode
- Tailwind CSS + shadcn/ui
- D3.js for budget visualization
- Framer Motion for transitions

### Backend

- Next.js API routes
- PostgreSQL (budget data, comparisons, editorial content)
- Scheduled jobs for API pulls (Vercel cron)
- Redis cache for pre-computed comparisons

### Admin

- Protected routes at `/admin`
- Forms for editorial content management
- Preview mode before publishing

### Infrastructure

- Vercel hosting
- Vercel Postgres or PlanetScale
- Upstash Redis

### SEO & Sharing

- Dynamic OG images showing comparison cards
- Clean URLs: `/compare/ice-detention/teacher-salaries`
- Structured data markup

---

## Design Principles

### Tone

Neutral and journalistic. Present the data, let it speak. The editorial choices (what to compare, what units) do the persuasion work, but presentation stays factual.

### Focus areas

- Defense spending
- ICE and immigration enforcement costs
- Healthcare comparisons

### Accessibility

- All visualizations have text alternatives
- Keyboard navigable
- Screen reader friendly comparison results

---

## Out of Scope (v1)

**Not building:**

- User accounts or login
- Comments or discussion
- State/local budget data
- Historical trend charts
- Notifications or alerts
- Mobile app
- Multi-language support

**Deferred:**

- International comparisons
- Embedded widgets for other sites
- Public API
- Email newsletter

---

## Open Questions

1. **Project name / domain** - TBD
2. **Visualization style** - Treemap vs sunburst vs other?
3. **Initial comparison set** - Which 5-10 comparisons to launch with?
4. **Admin auth** - Simple password, OAuth, or magic link?

---

## Next Steps

1. Set up project scaffold (Next.js + TypeScript + Tailwind)
2. Prototype budget visualization with sample data
3. Build comparison card component
4. Research USAspending.gov API structure
5. Design database schema
