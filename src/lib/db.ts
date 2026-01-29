/**
 * Database client using Drizzle ORM + Neon serverless PostgreSQL.
 *
 * Setup:
 * 1. Set DATABASE_URL in .env.local (get from https://neon.tech)
 * 2. Define your schema in src/lib/schema.ts
 * 3. Run: npx drizzle-kit push
 *
 * Usage:
 *   import { db } from '@/lib/db';
 *   if (db) {
 *     const users = await db.select().from(usersTable);
 *   }
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Make database connection optional for build time
const databaseUrl = process.env.DATABASE_URL;

// Create db instance only if DATABASE_URL is provided
export const db = databaseUrl
  ? drizzle(neon(databaseUrl), { schema })
  : null;

// Helper to check if database is available
export function isDatabaseAvailable(): boolean {
  return db !== null;
}

// Type for the database instance
export type Database = NonNullable<typeof db>;
