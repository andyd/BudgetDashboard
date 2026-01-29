# FAQ

## How do I start a new project?

```bash
npx degit andyd/andyd-webapp-starter my-app
cd my-app
git init
pnpm install
pnpm customize
```

`degit` downloads the latest files from the repo without any git history, giving you a clean starting point.

If you already have the template locally:

```bash
cp -r ~/code/4-Web-App-Frameworks/andyd-webapp-starter ./my-app
cd my-app
rm -rf .git && git init
pnpm install
pnpm customize
```

## What does `pnpm customize` do?

It asks four questions:

1. **App name** — kebab-case project name (e.g. `bowling-site`)
2. **What is the app for?** — 1-2 sentence description
3. **Inspiration URLs** — sites to reference (optional)
4. **Reference docs** — PRDs, designs, specs (optional)

Then it generates/updates:

- `PROJECT_BRIEF.md` — central project context for you and AI tools
- `package.json` — sets the project name
- `CLAUDE.md` — updates project info for Claude Code
- `AGENTS.md` — updates project info for other AI assistants
- `.env.local` — creates from `env.example` with your app name

## What is `PROJECT_BRIEF.md`?

A central context file that AI coding tools (Claude Code, Cursor, Copilot) can read to understand your project. It contains your app's purpose, inspiration links, reference docs, and placeholder sections for target users, key features, and tech decisions. Fill these in as your project takes shape.

## What should I do after setup?

1. `pnpm dev` — start the dev server
2. Fill in the TODO sections in `PROJECT_BRIEF.md`
3. Edit `src/app/page.tsx` to replace the landing page
4. Add shadcn components as needed: `npx shadcn@latest add [component]`
5. Configure `.env.local` with any API keys you need

## How do I add UI components?

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add card
```

Components are installed to `src/components/ui/`. Don't edit them directly — use the CLI to update.

## What's included in the starter?

- Next.js 15.5 (App Router, Turbopack, React Compiler)
- React 19
- TypeScript 5 (strict mode)
- Tailwind CSS 4 (CSS-first config)
- shadcn/ui (15+ components pre-installed)
- Vitest + React Testing Library (unit tests)
- Playwright (E2E tests)
- ESLint + Prettier + Husky (code quality)
- Drizzle ORM + Neon PostgreSQL (optional)
- Better Auth (optional)

## What's optional vs required?

**Required (always active):** Next.js, React, TypeScript, Tailwind, shadcn/ui, ESLint, Prettier

**Optional (needs .env config):** Database (Drizzle + Neon), Authentication (Better Auth), Analytics, Payments, Email

The optional features are already wired up in the code but won't activate until you set the corresponding environment variables.

## How do I deploy?

```bash
# Vercel (recommended)
npm i -g vercel
vercel

# Or connect your GitHub repo to Vercel for auto-deploys
```

## How do I run tests?

```bash
pnpm test:unit          # Vitest unit tests
pnpm test               # Playwright E2E tests
pnpm check-all          # Everything: lint + format + types + tests
```
