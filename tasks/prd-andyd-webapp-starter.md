# andyd-webapp-starter PRD

**Author:** Andy Dahley
**Last Updated:** January 20, 2026
**Status:** Draft
**Target Release:** v1.0.0

---

## 1. Problem Statement

### 1.1 Background

Starting a new web application requires significant setup time: configuring TypeScript, setting up linting/formatting, adding UI components, implementing authentication, connecting databases, and establishing architectural patterns. Developers often spend days on boilerplate before writing any business logic.

Existing solutions like `create-next-app` provide minimal scaffolding. Other starter templates are either too opinionated, outdated, or lack the full-stack capabilities needed for production applications.

### 1.2 Problem

Developers need a production-ready starting point that:

- Eliminates repetitive setup across projects
- Enforces best practices from day one
- Provides full-stack capabilities (auth, database, API) out of the box
- Maintains flexibility for different project types (SaaS, landing page, e-commerce)
- Stays current with the latest stable versions of core technologies

### 1.3 Impact

- **Time saved:** 8-16 hours per new project on setup and configuration
- **Consistency:** Uniform architecture across all projects
- **Quality:** Built-in best practices reduce bugs and technical debt
- **Velocity:** Developers can start building features immediately

---

## 2. Goals & Success Metrics

### 2.1 Goals

- **Primary Goal:** Provide a zero-to-production web application template that developers can clone and deploy with real functionality in under 30 minutes
- **Secondary Goals:**
  - Establish consistent patterns for Andy's personal projects and client work
  - Create a reference implementation of modern Next.js best practices
  - Enable rapid prototyping without sacrificing production quality
  - Serve as a learning resource for Next.js 15 / React 19 patterns

### 2.2 Non-Goals

- **Not a CMS:** This is a code template, not a no-code/low-code platform
- **Not framework-agnostic:** This is specifically for Next.js applications
- **Not a component library:** Uses shadcn/ui; doesn't create new primitives
- **Not a hosting solution:** Deploy anywhere (Vercel, Netlify, Docker, etc.)
- **Not a design system:** Uses existing tokens; theming is customizable but not the focus

### 2.3 Success Metrics

| Metric                            | Current | Target                                      | How Measured     |
| --------------------------------- | ------- | ------------------------------------------- | ---------------- |
| Time to first deploy              | N/A     | < 30 minutes                                | Manual testing   |
| Setup commands required           | N/A     | 4 (`clone`, `install`, `env`, `dev`)        | Count            |
| Pre-configured integrations       | 0       | 8+ (auth, DB, payments, storage, analytics) | Feature count    |
| shadcn/ui components included     | 22      | 25+                                         | Component count  |
| E2E test coverage                 | 9 tests | 20+ tests                                   | Playwright count |
| TypeScript strict mode violations | 0       | 0                                           | `tsc --noEmit`   |
| Lighthouse performance score      | N/A     | > 90                                        | Lighthouse audit |

---

## 3. User Stories & Requirements

### 3.1 Target Users

| User Type             | Description                                       | Primary Need                              |
| --------------------- | ------------------------------------------------- | ----------------------------------------- |
| **Solo Developer**    | Building personal projects, MVPs, or side hustles | Fast setup, production-ready defaults     |
| **Freelancer/Agency** | Starting client projects                          | Consistent quality, professional baseline |
| **Team Lead**         | Standardizing team projects                       | Enforced patterns, onboarding efficiency  |
| **Learner**           | Exploring Next.js 15 / React 19                   | Reference implementation, best practices  |

### 3.2 User Stories

| ID    | User Story                                                                                        | Priority | Acceptance Criteria                                                                                                          |
| ----- | ------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| US-1  | As a developer, I want to clone and run the template so that I can see a working app immediately  | P0       | Given a fresh clone, when I run `npm install && npm run dev`, then the app loads at localhost:3000 with all sections visible |
| US-2  | As a developer, I want authentication ready so that I can add user accounts without configuration | P0       | Given the template, when I add OAuth credentials to .env, then users can sign up/in via Google or GitHub                     |
| US-3  | As a developer, I want a database connection so that I can persist data immediately               | P0       | Given Prisma is configured, when I run `npm run db:push`, then tables are created in my database                             |
| US-4  | As a developer, I want pre-built UI components so that I don't need to build basic elements       | P0       | Given shadcn/ui is installed, when I import a component, then it renders with correct styling                                |
| US-5  | As a developer, I want a customization script so that I can brand the template for my project     | P1       | Given I run `npm run customize`, when I enter project details, then package.json/metadata are updated                        |
| US-6  | As a developer, I want E2E tests so that I can verify the app works after changes                 | P1       | Given tests exist, when I run `npm run test`, then all critical paths are verified                                           |
| US-7  | As a developer, I want dark/light mode so that users can choose their preference                  | P1       | Given theme toggle exists, when clicked, then the UI switches themes and persists preference                                 |
| US-8  | As a developer, I want API routes structured so that I can add endpoints quickly                  | P1       | Given the API folder structure, when I add a new route, then it follows established patterns                                 |
| US-9  | As a developer, I want a dashboard layout so that I can build admin/user interfaces               | P1       | Given dashboard components exist, when I create a dashboard page, then layout/nav are ready                                  |
| US-10 | As a developer, I want payment integration ready so that I can accept payments quickly            | P2       | Given Stripe is configured, when I add API keys, then checkout/webhooks work                                                 |

### 3.3 Functional Requirements

| ID    | Requirement                                      | Priority | Notes                        |
| ----- | ------------------------------------------------ | -------- | ---------------------------- |
| FR-1  | Next.js 15+ with App Router and Turbopack        | P0       | Latest stable version        |
| FR-2  | React 19 with latest features                    | P0       | Server components, actions   |
| FR-3  | TypeScript 5 with strict mode enabled            | P0       | All strict flags enabled     |
| FR-4  | Tailwind CSS 4 with CSS variables                | P0       | shadcn/ui compatible theming |
| FR-5  | shadcn/ui with 25+ components pre-installed      | P0       | Extensible via CLI           |
| FR-6  | NextAuth.js v5 authentication                    | P0       | OAuth + credentials ready    |
| FR-7  | Prisma ORM with schema and migrations            | P0       | PostgreSQL default           |
| FR-8  | ESLint 9 + Prettier with Tailwind plugin         | P0       | Pre-commit hooks via Husky   |
| FR-9  | Playwright E2E testing framework                 | P0       | CI-ready configuration       |
| FR-10 | Landing page with 7 customizable sections        | P1       | Hero, Features, etc.         |
| FR-11 | Dashboard layout with sidebar navigation         | P1       | Protected routes             |
| FR-12 | API route structure with error handling          | P1       | Type-safe responses          |
| FR-13 | Form handling with react-hook-form + zod         | P1       | Validation patterns          |
| FR-14 | Toast notifications via Sonner                   | P1       | Success/error feedback       |
| FR-15 | Error boundary with fallback UI                  | P1       | Graceful error handling      |
| FR-16 | Loading states with Skeleton components          | P1       | Async UI patterns            |
| FR-17 | Stripe integration for payments                  | P2       | Checkout + webhooks          |
| FR-18 | File upload integration (Uploadthing)            | P2       | Image/document uploads       |
| FR-19 | Email sending (Resend or SendGrid)               | P2       | Transactional emails         |
| FR-20 | Analytics integration (Google Analytics, Vercel) | P2       | Usage tracking               |

### 3.4 Non-Functional Requirements

| Category                 | Requirement                                                                    |
| ------------------------ | ------------------------------------------------------------------------------ |
| **Performance**          | Lighthouse score > 90; First Contentful Paint < 1.5s; Time to Interactive < 3s |
| **Security**             | CSRF protection; secure headers; input sanitization; auth middleware           |
| **Scalability**          | Stateless design; database connection pooling; edge-ready                      |
| **Accessibility**        | WCAG 2.1 AA compliance; keyboard navigation; screen reader support             |
| **SEO**                  | Dynamic metadata; sitemap generation; robots.txt; Open Graph tags              |
| **Developer Experience** | Hot reload < 500ms; type checking on save; clear error messages                |

---

## 4. Solution Design

### 4.1 Proposed Solution

A comprehensive Next.js 15 starter template with three tiers of functionality:

**Tier 1: Core (Included & Working)**

- Next.js 15 + React 19 + TypeScript 5
- Tailwind CSS 4 + shadcn/ui components
- Landing page with 7 sections
- Dark/light theme toggle
- ESLint + Prettier + Husky
- Playwright E2E tests
- SEO metadata + sitemap

**Tier 2: Full-Stack (Configured & Ready)**

- NextAuth.js v5 authentication (OAuth + credentials)
- Prisma ORM with User/Account/Session models
- API routes structure with error handling
- Dashboard layout with protected routes
- Middleware for auth protection

**Tier 3: Integrations (Documented & Optional)**

- Stripe payments (checkout, webhooks, subscriptions)
- File uploads (Uploadthing or Cloudinary)
- Email (Resend or SendGrid)
- Analytics (GA4, Vercel Analytics)
- Monitoring (Sentry)

### 4.2 Architecture Overview

```
andyd-webapp-starter/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Auth route group (login, register, etc.)
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/          # Protected dashboard routes
│   │   │   ├── dashboard/
│   │   │   ├── settings/
│   │   │   └── layout.tsx
│   │   ├── (marketing)/          # Public marketing pages
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── pricing/
│   │   │   └── layout.tsx
│   │   ├── api/                  # API routes
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── users/
│   │   │   └── webhooks/
│   │   ├── globals.css
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Landing page
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── layout/               # Layout components (Header, Footer, Sidebar)
│   │   ├── sections/             # Landing page sections
│   │   ├── forms/                # Form components
│   │   ├── dashboard/            # Dashboard-specific components
│   │   ├── providers/            # Context providers
│   │   └── common/               # Shared components
│   ├── lib/
│   │   ├── auth.ts               # NextAuth configuration
│   │   ├── db.ts                 # Prisma client
│   │   ├── utils.ts              # Utility functions
│   │   └── validations/          # Zod schemas
│   ├── hooks/                    # Custom React hooks
│   ├── types/                    # TypeScript types
│   └── constants/                # App constants
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
├── tests/                        # Playwright E2E tests
├── public/                       # Static assets
└── .claude/                      # Claude Code agents & config
```

### 4.3 Key User Flows

**Flow 1: New Project Setup**

1. Clone repository
2. Run `npm install`
3. Copy `env.example` to `.env.local`
4. Run `npm run customize` (interactive branding)
5. Run `npm run dev`
6. View working app at localhost:3000

**Flow 2: Add Authentication**

1. Add OAuth credentials to `.env.local`
2. Run `npm run db:push` (creates auth tables)
3. Users can now sign up/in via `/login`
4. Protected routes redirect unauthenticated users

**Flow 3: Build a Feature**

1. Create new route in appropriate route group
2. Import existing components from `@/components`
3. Use Prisma for data operations
4. Add E2E test for new flow
5. Run `npm run check-all` before committing

### 4.4 Technical Decisions

| Decision   | Choice                  | Rationale                                   |
| ---------- | ----------------------- | ------------------------------------------- |
| Framework  | Next.js 15 (App Router) | Latest features, great DX, Vercel ecosystem |
| Language   | TypeScript 5 (strict)   | Type safety, better tooling, fewer bugs     |
| Styling    | Tailwind CSS 4          | Utility-first, great with shadcn/ui         |
| Components | shadcn/ui               | Composable, accessible, customizable        |
| Auth       | NextAuth.js v5          | De facto standard, OAuth support            |
| Database   | Prisma + PostgreSQL     | Type-safe ORM, great migrations             |
| Forms      | react-hook-form + zod   | Performance, validation, type inference     |
| Testing    | Playwright              | Cross-browser, reliable, great API          |
| Linting    | ESLint 9 + Prettier     | Industry standard, Tailwind plugin          |

---

## 5. Scope & Milestones

### 5.1 In Scope (v1.0)

**Must Have:**

- [x] Next.js 15 + React 19 + TypeScript 5 setup
- [x] Tailwind CSS 4 + shadcn/ui (22+ components)
- [x] Landing page with 7 sections
- [x] Dark/light theme toggle
- [x] ESLint + Prettier + Husky + lint-staged
- [x] Playwright E2E test framework
- [x] SEO (metadata, sitemap, robots.txt)
- [x] Error boundary + loading states
- [ ] NextAuth.js v5 authentication
- [ ] Prisma ORM with User model
- [ ] Dashboard layout with sidebar
- [ ] Protected route middleware
- [ ] API routes structure

**Should Have:**

- [x] Custom animations (fade, slide, float)
- [x] Toast notifications (Sonner)
- [x] Customization script
- [ ] Settings page template
- [ ] Profile page template
- [ ] Form examples (contact, settings)

### 5.2 Out of Scope (v1.0)

- Stripe payment integration (document for v1.1)
- File upload integration (document for v1.1)
- Email sending (document for v1.1)
- Internationalization (i18n)
- Mobile app (React Native)
- Admin panel builder
- CMS integration

### 5.3 Milestones

| Milestone          | Description                    | Status      |
| ------------------ | ------------------------------ | ----------- |
| M1: Foundation     | Core setup, UI, landing page   | Complete    |
| M2: Authentication | NextAuth.js, protected routes  | In Progress |
| M3: Database       | Prisma, User model, migrations | Planned     |
| M4: Dashboard      | Layout, sidebar, common pages  | Planned     |
| M5: Polish         | Tests, docs, optimization      | Planned     |
| M6: Release        | v1.0.0 tagged and documented   | Planned     |

---

## 6. Current State Analysis

### 6.1 What's Already Built

| Feature                    | Status   | Notes                                                         |
| -------------------------- | -------- | ------------------------------------------------------------- |
| Next.js 15.5.2 + Turbopack | Complete | Dev and build working                                         |
| React 19.1.0               | Complete | Latest stable                                                 |
| TypeScript 5 (strict)      | Complete | All strict flags enabled                                      |
| Tailwind CSS 4             | Complete | CSS variables, dark mode                                      |
| shadcn/ui (22 components)  | Complete | accordion, button, card, dialog, etc.                         |
| Landing page (7 sections)  | Complete | Hero, Features, How It Works, Testimonials, Pricing, FAQ, CTA |
| Theme toggle               | Complete | System/light/dark with persistence                            |
| ESLint 9 + Prettier        | Complete | Husky pre-commit hooks                                        |
| Playwright                 | Complete | 9 E2E tests                                                   |
| SEO metadata               | Complete | OG tags, Twitter cards                                        |
| sitemap.ts + robots.ts     | Complete | Dynamic generation                                            |
| Error boundary             | Complete | Graceful error handling                                       |
| Toast provider (Sonner)    | Complete | Ready for use                                                 |
| Custom animations          | Complete | 8 animation presets                                           |
| Path aliases               | Complete | @/components, @/lib, etc.                                     |

### 6.2 What Needs to Be Added

| Feature                     | Priority | Effort | Dependencies     |
| --------------------------- | -------- | ------ | ---------------- |
| NextAuth.js v5 setup        | P0       | Medium | None             |
| Prisma schema + client      | P0       | Medium | Database         |
| User/Account/Session models | P0       | Low    | Prisma           |
| Auth middleware             | P0       | Low    | NextAuth         |
| Login/Register pages        | P0       | Medium | NextAuth, UI     |
| Dashboard layout            | P1       | Medium | Auth             |
| Sidebar navigation          | P1       | Low    | Dashboard layout |
| Settings page               | P1       | Low    | Dashboard, Forms |
| Profile page                | P1       | Low    | Dashboard, Auth  |
| API route structure         | P1       | Medium | Prisma           |
| Additional E2E tests        | P1       | Medium | All features     |

---

## 7. Risks & Mitigations

| Risk                                | Likelihood | Impact | Mitigation                              |
| ----------------------------------- | ---------- | ------ | --------------------------------------- |
| Next.js 15 breaking changes         | Medium     | High   | Pin versions, monitor release notes     |
| shadcn/ui component updates         | Low        | Medium | Pin versions, test before updating      |
| NextAuth.js v5 migration issues     | Medium     | Medium | Follow migration guide, test thoroughly |
| Scope creep (too many integrations) | High       | Medium | Strict v1.0 scope, defer to v1.1        |
| Maintenance burden                  | Medium     | Medium | Automated deps updates, good docs       |
| Database vendor lock-in             | Low        | Low    | Prisma abstracts; document alternatives |

---

## 8. Open Questions

- [ ] Should we include a basic admin role system in v1.0, or defer to v1.1?
- [ ] Default database: PostgreSQL (Neon/Supabase) vs SQLite for local dev?
- [ ] Include rate limiting middleware in v1.0?
- [ ] Add Storybook for component documentation?
- [ ] Include Docker configuration for self-hosting?

---

## 9. Appendix

### 9.1 Technology Versions

| Technology   | Version      | Release Date |
| ------------ | ------------ | ------------ |
| Next.js      | 15.5.2       | Dec 2025     |
| React        | 19.1.0       | Jan 2026     |
| TypeScript   | 5.x          | Latest       |
| Tailwind CSS | 4.x          | Dec 2024     |
| Node.js      | 18.17+ / 20+ | LTS          |
| Prisma       | 6.x          | Latest       |
| NextAuth.js  | 5.x          | Latest       |

### 9.2 Pre-installed shadcn/ui Components

accordion, avatar, badge, button, card, checkbox, dialog, dropdown-menu, input, label, navigation-menu, popover, select, separator, sheet, skeleton, sonner, switch, table, tabs, textarea, tooltip

### 9.3 Related Documents

- `README.md` - Getting started guide
- `CLAUDE.md` - Claude Code instructions
- `NEW-PROJECT-CHECKLIST.md` - Project customization checklist
- `COMPONENTS-QUICK-REF.md` - Component usage reference
- `env.example` - Environment variables template

### 9.4 Revision History

| Date         | Author      | Changes           |
| ------------ | ----------- | ----------------- |
| Jan 20, 2026 | Andy Dahley | Initial PRD draft |
