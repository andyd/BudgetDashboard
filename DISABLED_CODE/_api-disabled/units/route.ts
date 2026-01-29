/**
 * API Route: /api/units
 * Handles comparison unit operations
 */
import { NextRequest, NextResponse } from 'next/server';
import { getUnits } from '@/lib/mock-data/units';
import type { ComparisonUnit } from '@/types/comparison';

/**
 * GET /api/units
 * Returns all comparison units, optionally filtered by category
 *
 * Query parameters:
 * - category: Optional category filter ('infrastructure', 'everyday', 'vehicles', 'buildings', 'misc')
 *
 * @example
 * GET /api/units
 * GET /api/units?category=infrastructure
 */
export async function GET(request: NextRequest): Promise<NextResponse<ComparisonUnit[] | { error: string }>> {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    // Validate category if provided
    const validCategories = ['infrastructure', 'everyday', 'vehicles', 'buildings', 'misc'];
    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    // Get units (filtered by category if provided)
    const units = getUnits(category || undefined);

    // Return successful response
    return NextResponse.json(units, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    // Log error for debugging
    console.error('Error fetching comparison units:', error);

    // Return error response
    return NextResponse.json(
      { error: 'Failed to fetch comparison units' },
      { status: 500 }
    );
  }
}
