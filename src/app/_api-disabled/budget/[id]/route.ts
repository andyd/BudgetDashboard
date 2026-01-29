/**
 * Budget Item API Route
 * GET /api/budget/[id] - Returns specific budget item with its children
 */

import { NextRequest, NextResponse } from 'next/server';
import { MOCK_BUDGET_DATA } from '@/lib/mock-data/budget';
import type { BudgetCategory } from '@/types/budget';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Recursively find a budget category by ID
 */
function findCategoryById(
  categories: BudgetCategory[],
  id: string
): BudgetCategory | null {
  for (const category of categories) {
    if (category.id === id) {
      return category;
    }

    if (category.subcategories) {
      const found = findCategoryById(category.subcategories, id);
      if (found) return found;
    }
  }

  return null;
}

/**
 * GET /api/budget/[id]
 *
 * Path parameters:
 * - id: Budget category ID (e.g., "dod", "hhs", "medicare", "army")
 *
 * Returns: Budget category with its subcategories
 * Status codes:
 * - 200: Success
 * - 400: Invalid request
 * - 404: Budget category not found
 * - 500: Server error
 *
 * Cache: Revalidates every hour (3600 seconds)
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Get the id from params (await the promise in Next.js 15)
    const { id } = await context.params;

    // Validate ID parameter
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        {
          error: 'Invalid request',
          message: 'Budget category ID is required',
        },
        { status: 400 }
      );
    }

    // Find the budget category by ID
    const category = findCategoryById(MOCK_BUDGET_DATA, id);

    // Return 404 if not found
    if (!category) {
      return NextResponse.json(
        {
          error: 'Not found',
          message: `Budget category with ID "${id}" not found`,
        },
        { status: 404 }
      );
    }

    // Return successful response with cache headers
    return NextResponse.json(category, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Budget Item API Error:', error);

    // Return 500 for unexpected errors
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
