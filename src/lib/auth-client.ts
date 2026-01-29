/**
 * Client-side auth utilities for Better Auth.
 *
 * Usage in Client Components:
 *   import { authClient } from '@/lib/auth-client';
 *   const { data: session } = authClient.useSession();
 *   await authClient.signIn.email({ email, password });
 *   await authClient.signOut();
 */
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
});
