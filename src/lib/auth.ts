/**
 * Authentication using Better Auth.
 *
 * Setup:
 * 1. Set BETTER_AUTH_SECRET in .env.local
 * 2. Set DATABASE_URL in .env.local
 * 3. Run: npx drizzle-kit push (to create auth tables)
 *
 * Usage in Server Components:
 *   import { auth } from '@/lib/auth';
 *   const session = await auth.api.getSession({ headers: await headers() });
 *
 * Usage in Client Components:
 *   import { authClient } from '@/lib/auth-client';
 *   const { data: session } = authClient.useSession();
 *
 * See: https://www.better-auth.com/docs
 */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

if (!db) {
  throw new Error("Database connection not available. Please set DATABASE_URL in .env.local");
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
});

export type Session = typeof auth.$Infer.Session;
