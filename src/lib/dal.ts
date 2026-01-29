/**
 * Data Access Layer (DAL) — verify auth at data access points, not just middleware.
 *
 * This pattern ensures defense-in-depth: even if middleware is bypassed,
 * data access is protected.
 *
 * Usage in Server Components and Server Actions:
 *   import { verifySession, getUser } from '@/lib/dal';
 *   const session = await verifySession();
 *   const user = await getUser();
 */
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

/**
 * Verify the current session. Redirects to /login if unauthenticated.
 * Uses React cache() to deduplicate within a single render pass.
 */
export const verifySession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session;
});

/**
 * Get the current user. Returns null if unauthenticated (no redirect).
 */
export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
});
