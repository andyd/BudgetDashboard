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
 *   const users = await db.select().from(usersTable);
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
