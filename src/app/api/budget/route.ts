/**
 * Budget API Route
 * GET /api/budget - Returns full budget hierarchy with optional filtering
 */

import { NextRequest, NextResponse } from 'next/server';
import { MOCK_BUDGET_DATA } from '@/lib/mock-data/budget';
import type { BudgetCategory } from '@/types/budget';

/**
 * Helper function to limit depth of budget categories
 */
function limitDepth(categories: BudgetCategory[], maxDepth: number): BudgetCategory[] {
  if (maxDepth <= 0) return [];

  return categories.map(category => {
    const result: BudgetCategory = {
      id: category.id,
      name: category.name,
      allocated: category.allocated,
      spent: category.spent,
      categoryType: category.categoryType,
    };

    // Only include optional properties if they exist
    if (category.description) result.description = category.description;
    if (category.changeFromPriorYear !== undefined) {
      result.changeFromPriorYear = category.changeFromPriorYear;
    }

    // Include subcategories if depth allows
    if (maxDepth > 1 && category.subcategories) {
      result.subcategories = limitDepth(category.subcategories, maxDepth - 1);
    }

    return result;
  });
}

/**
 * GET /api/budget
 *
 * Query parameters:
 * - fiscalYear: Filter by fiscal year (optional, currently only 2025 available)
 * - level: Maximum depth level to return (optional, 1-4)
 *   1 = top-level departments only
 *   2 = departments + first level subcategories
 *   3+ = full depth
 *
 * Returns: Array of BudgetCategory JSON
 * Cache: Revalidates every hour (3600 seconds)
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = request.nextUrl;
    const fiscalYearParam = searchParams.get('fiscalYear');
    const levelParam = searchParams.get('level');

    // Validate fiscal year
    if (fiscalYearParam) {
      const fiscalYear = parseInt(fiscalYearParam, 10);
      if (isNaN(fiscalYear) || fiscalYear < 2000 || fiscalYear > 2100) {
        return NextResponse.json(
          {
            error: 'Invalid fiscal year',
            message: 'Fiscal year must be a number between 2000 and 2100',
          },
          { status: 400 }
        );
      }

      // Currently only FY 2025 is available
      if (fiscalYear !== 2025) {
        return NextResponse.json(
          {
            error: 'Fiscal year not found',
            message: `Budget data for fiscal year ${fiscalYear} is not available. Available: 2025`,
          },
          { status: 404 }
        );
      }
    }

    // Validate level parameter
    let maxDepth: number | undefined;
    if (levelParam) {
      maxDepth = parseInt(levelParam, 10);
      if (isNaN(maxDepth) || maxDepth < 1) {
        return NextResponse.json(
          {
            error: 'Invalid level parameter',
            message: 'Level must be a positive number',
          },
          { status: 400 }
        );
      }
    }

    // Get budget data (mock for now)
    let budgetData: BudgetCategory[] = MOCK_BUDGET_DATA;

    // Apply depth filter if specified
    if (maxDepth !== undefined) {
      budgetData = limitDepth(budgetData, maxDepth);
    }

    // Calculate total for metadata
    const total = budgetData.reduce((sum, cat) => sum + cat.allocated, 0);

    // Return successful response with cache headers
    return NextResponse.json(
      {
        fiscalYear: 2025,
        total,
        categories: budgetData,
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Budget API Error:', error);

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
