# AGENTS.md

Universal AI agent instructions for this project. Works with Claude Code, Cursor, GitHub Copilot, and other AI coding assistants.

## Project

**andyd-webapp-starter** - Production-ready Next.js 15 starter template with TypeScript, Tailwind CSS 4, and shadcn/ui.

## Commands

```bash
npm run dev              # Dev server (Turbopack, port 3000)
npm run build            # Production build
npm run test             # Playwright E2E tests
npm run test:unit        # Vitest unit tests
npm run test:unit:watch  # Vitest watch mode
npm run check-all        # Lint + format + type-check + test
npm run fix-all          # Autofix lint + format
```

## Tech Stack

- Next.js 15.5 (App Router, Turbopack, React Compiler)
- React 19 (Server Components, Server Actions, `use` hook)
- TypeScript 5 (strict mode, noUncheckedIndexedAccess)
- Tailwind CSS 4 (CSS-first config via `@theme`, OKLCH colors)
- shadcn/ui (Radix primitives, CVA variants, `cn()` utility)
- react-hook-form + zod (form validation)
- Vitest + React Testing Library (unit/integration tests)
- Playwright (E2E tests)
- Drizzle ORM + Neon (optional database layer)
- Better Auth (optional authentication)

## Architecture Rules

1. **Server Components by default** — only add `"use client"` when you need state, effects, or event handlers
2. **Server Actions for mutations** — use `"use server"` functions instead of API routes for internal operations
3. **Data Access Layer (DAL)** — verify auth in `src/lib/dal.ts`, not middleware alone
4. **Feature-based organization** — group by domain (components, actions, hooks, tests together)
5. **shadcn/ui components are in `src/components/ui/`** — added via CLI, not edited directly
6. **Use `cn()` from `src/lib/utils.ts`** — for className merging (clsx + tailwind-merge)
7. **Tailwind 4 CSS-first** — all theme tokens in `globals.css` `@theme`, no tailwind.config.js
8. **OKLCH colors** — use OKLCH format for all color definitions
9. **React Compiler handles memoization** — do NOT add useMemo/useCallback/React.memo unless profiling shows a specific need

## File Structure

```
src/
├── app/                    # Routes (App Router)
│   ├── (auth)/             # Auth route group
│   ├── layout.tsx          # Root layout (providers)
│   └── globals.css         # Tailwind @theme + variables
├── components/
│   ├── ui/                 # shadcn/ui (CLI-managed)
│   ├── common/             # Shared components
│   ├── layout/             # Header, Footer, Sidebar
│   └── sections/           # Landing page sections
├── lib/
│   ├── utils.ts            # cn() utility
│   ├── db.ts               # Drizzle client (optional)
│   ├── auth.ts             # Better Auth config (optional)
│   └── dal.ts              # Data Access Layer
├── hooks/                  # Custom React hooks
└── types/                  # TypeScript type definitions
tests/                      # Playwright E2E tests
src/__tests__/              # Vitest unit tests
```

## Key Patterns

### Forms (Field + Controller pattern)

```tsx
<Controller
  name="fieldName"
  control={form.control}
  render={({ field, fieldState }) => (
    <div>
      <Label htmlFor={field.name}>Label</Label>
      <Input {...field} id={field.name} />
      {fieldState.error && <p>{fieldState.error.message}</p>}
    </div>
  )}
/>
```

### Server Actions

```tsx
"use server";
import { revalidatePath } from "next/cache";
export async function createItem(formData: FormData) {
  // validate with zod, write to DB, revalidate
}
```

### Adding shadcn components

```bash
npx shadcn@latest add [component-name]
```

## IMPORTANT Rules

- NEVER modify files in `src/components/ui/` directly (use shadcn CLI to update)
- ALWAYS validate Server Action inputs with zod schemas
- NEVER rely on middleware alone for auth — use the DAL pattern
- ALWAYS co-locate tests with the code they test where possible
- NEVER use `any` type — use `unknown` with type guards instead
