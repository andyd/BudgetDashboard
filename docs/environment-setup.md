# Environment Variable Setup

This document explains how to configure environment variables for the Federal Budget Dashboard.

## Quick Start

1. Copy the example file:

   ```bash
   cp env.example .env.local
   ```

2. Fill in your values in `.env.local`

3. Never commit `.env.local` to version control (already in .gitignore)

## Required Variables

### DATABASE_URL

PostgreSQL connection string from Neon.

**Example:**

```
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

**Get it from:** [neon.tech](https://neon.tech)

### ADMIN_PASSWORD

Password for accessing the admin panel to manage featured comparisons and editorial content.

**Generate with:**

```bash
openssl rand -base64 32
```

**Example:**

```
ADMIN_PASSWORD=your-secure-password-here
```

## Public Variables

These are accessible on both client and server (prefixed with `NEXT_PUBLIC_`):

### NEXT_PUBLIC_APP_NAME

Display name for the application.

**Default:** `Federal Budget Dashboard`

### NEXT_PUBLIC_SITE_URL

Full URL of your site (used for SEO, social sharing, etc.).

**Default:** `http://localhost:3000`
**Production example:** `https://budget.example.com`

### NEXT_PUBLIC_FISCAL_YEAR

The fiscal year to display budget data for.

**Default:** `2025`
**Format:** 4-digit year (e.g., `2025`, `2026`)

## Optional Variables

### USASPENDING_API_KEY

API key for USAspending.gov API. The public API has rate limits; get a key for higher limits.

**Get it from:** [api.usaspending.gov](https://api.usaspending.gov/)

**Example:**

```
USASPENDING_API_KEY=your-api-key-here
```

## Using Environment Variables in Code

### Server-side (API routes, server components)

```typescript
import { env } from "@/lib/env";

// Access server-only variables
const dbUrl = env.DATABASE_URL;
const adminPass = env.ADMIN_PASSWORD;

// Access public variables
const appName = env.NEXT_PUBLIC_APP_NAME;
const fiscalYear = env.NEXT_PUBLIC_FISCAL_YEAR; // Type: number
```

### Client-side (client components, browser code)

```typescript
import { publicEnv } from "@/lib/env";

// Only public variables are available
const appName = publicEnv.NEXT_PUBLIC_APP_NAME;
const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL;
const fiscalYear = publicEnv.NEXT_PUBLIC_FISCAL_YEAR; // Type: number
```

### Environment Helpers

```typescript
import { isDev, isProd, isTest } from "@/lib/env";

if (isDev) {
  console.log("Running in development mode");
}

if (isProd) {
  // Production-only logic
}

if (isTest) {
  // Test-only logic
}
```

## Type Safety

All environment variables are validated at startup using Zod schemas. If any required variable is missing or invalid, the application will fail to start with a clear error message.

**Example error:**

```
❌ Invalid server environment variables:
{
  "DATABASE_URL": {
    "_errors": [
      "DATABASE_URL must be a valid PostgreSQL connection string"
    ]
  }
}
```

## Different Environments

### Development (`.env.local`)

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=postgresql://...neon.tech/dev_db
ADMIN_PASSWORD=dev-password
```

### Production (Vercel/deployment platform)

Set these in your deployment platform's environment variable settings:

- `DATABASE_URL` (from production Neon database)
- `ADMIN_PASSWORD` (secure password)
- `NEXT_PUBLIC_SITE_URL` (your production URL)
- `NEXT_PUBLIC_FISCAL_YEAR` (current fiscal year)
- `USASPENDING_API_KEY` (optional, for higher rate limits)

### Testing

Create `.env.test.local` for test environment:

```env
DATABASE_URL=postgresql://...neon.tech/test_db
ADMIN_PASSWORD=test-password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Security Best Practices

1. Never commit `.env.local`, `.env.production`, or any file containing actual secrets
2. Use strong, randomly generated passwords for `ADMIN_PASSWORD`
3. Rotate `ADMIN_PASSWORD` periodically
4. Use separate databases for development, testing, and production
5. Review Neon database permissions regularly
6. Store production secrets in your deployment platform's secure environment variable storage

## Troubleshooting

### "Invalid environment variables" error on startup

- Check that all required variables are set in `.env.local`
- Verify `DATABASE_URL` is a valid PostgreSQL connection string
- Ensure `ADMIN_PASSWORD` is at least 8 characters
- Confirm `NEXT_PUBLIC_FISCAL_YEAR` is a 4-digit year

### "Cannot find env" error

- Make sure you're importing from `@/lib/env`
- Use `publicEnv` on the client side, not `env`

### Environment variables not updating

- Restart your development server after changing `.env.local`
- Clear Next.js cache: `rm -rf .next`
