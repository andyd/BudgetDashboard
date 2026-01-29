/**
 * Environment Variable Configuration
 *
 * Type-safe environment variable access with runtime validation using Zod.
 * This module validates all required environment variables on startup and
 * provides typed access throughout the application.
 *
 * @module lib/env
 */

import { z } from 'zod';

/**
 * Server-side environment variable schema
 * These variables are only accessible on the server.
 */
const serverSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL connection string'),

  // Authentication
  ADMIN_PASSWORD: z.string().min(8, 'ADMIN_PASSWORD must be at least 8 characters'),

  // External APIs (optional)
  USASPENDING_API_KEY: z.string().optional(),

  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  ANALYZE: z.string()
    .optional()
    .default('false')
    .transform(val => val === 'true'),
});

/**
 * Client-side environment variable schema
 * These variables are accessible on both client and server.
 * Must be prefixed with NEXT_PUBLIC_
 */
const clientSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default('Federal Budget Dashboard'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_FISCAL_YEAR: z.preprocess(
    (val) => val || '2025',
    z.string()
      .regex(/^\d{4}$/, 'NEXT_PUBLIC_FISCAL_YEAR must be a 4-digit year')
      .transform(val => parseInt(val, 10))
  ),
});

/**
 * Validate and parse environment variables
 * Throws an error if validation fails, preventing the app from starting
 * with invalid configuration.
 */
function validateEnv() {
  // Server-side validation (only run on server)
  const isServer = typeof window === 'undefined';

  if (isServer) {
    const serverParsed = serverSchema.safeParse(process.env);

    if (!serverParsed.success) {
      console.error('❌ Invalid server environment variables:');
      console.error(JSON.stringify(serverParsed.error.format(), null, 2));
      throw new Error('Invalid server environment variables');
    }
  }

  // Client-side validation (runs on both client and server)
  const clientParsed = clientSchema.safeParse(process.env);

  if (!clientParsed.success) {
    console.error('❌ Invalid client environment variables:');
    console.error(JSON.stringify(clientParsed.error.format(), null, 2));
    throw new Error('Invalid client environment variables');
  }

  return {
    server: isServer ? serverSchema.parse(process.env) : null,
    client: clientParsed.data,
  };
}

// Validate on module load
const { server: serverEnv, client: clientEnv } = validateEnv();

/**
 * Type-safe server environment variables
 * Only accessible on the server side
 *
 * @example
 * ```ts
 * import { env } from '@/lib/env';
 * const dbUrl = env.DATABASE_URL;
 * ```
 */
export const env = serverEnv ? {
  ...serverEnv,
  ...clientEnv,
} : clientEnv;

/**
 * Type-safe client environment variables
 * Accessible on both client and server
 *
 * @example
 * ```ts
 * import { publicEnv } from '@/lib/env';
 * const year = publicEnv.NEXT_PUBLIC_FISCAL_YEAR;
 * ```
 */
export const publicEnv = clientEnv;

/**
 * Helper function to check if we're in development mode
 */
export const isDev = (serverEnv?.NODE_ENV || process.env.NODE_ENV) === 'development';

/**
 * Helper function to check if we're in production mode
 */
export const isProd = (serverEnv?.NODE_ENV || process.env.NODE_ENV) === 'production';

/**
 * Helper function to check if we're in test mode
 */
export const isTest = (serverEnv?.NODE_ENV || process.env.NODE_ENV) === 'test';

/**
 * Type exports for use in other modules
 */
export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;
