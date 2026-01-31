import { NextRequest, NextResponse } from "next/server";
import { getItemById, getUnitById, type ComparisonUnit } from "@/lib/data";
import {
  calculateComparison,
  formatComparisonResult,
} from "@/lib/comparison-engine";
import {
  FEATURED_COMPARISONS,
  FEATURED_COMPARISON_CONTEXT,
  type SimpleFeaturedComparison,
} from "@/lib/mock-data/featured-comparisons";

/**
 * Featured Comparisons API
 *
 * Returns curated list of featured comparisons with pre-calculated results.
 *
 * Query parameters:
 * - random: If "true", shuffle the order of comparisons
 * - limit: Number of comparisons to return (default: all)
 *
 * Examples:
 * - GET /api/featured - Returns all featured comparisons
 * - GET /api/featured?random=true - Returns shuffled comparisons
 * - GET /api/featured?limit=3 - Returns first 3 comparisons
 * - GET /api/featured?random=true&limit=3 - Returns 3 random comparisons
 */

export interface FeaturedComparisonResponse {
  /** Unique identifier for the comparison */
  id: string;
  /** Budget item ID */
  budgetItemId: string;
  /** Budget item name */
  budgetItemName: string;
  /** Budget amount in dollars */
  budgetAmount: number;
  /** Comparison unit ID */
  unitId: string;
  /** Comparison unit details */
  unit: ComparisonUnit;
  /** Calculated unit count */
  unitCount: number;
  /** Formatted comparison string (e.g., "41,230 Teacher Salaries") */
  formatted: string;
  /** Editorial headline */
  headline: string;
  /** Display order (lower = higher priority) */
  displayOrder: number;
  /** Whether this is featured */
  isFeatured: boolean;
  /** Additional context/methodology */
  context?: {
    source: string;
    sourceUrl: string;
    methodology: string;
    lastUpdated: string;
  };
}

export interface FeaturedApiResponse {
  comparisons: FeaturedComparisonResponse[];
  total: number;
  shuffled: boolean;
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

/**
 * Transforms a featured comparison into the API response format
 * with pre-calculated results
 */
function transformComparison(
  comparison: SimpleFeaturedComparison,
): FeaturedComparisonResponse | null {
  const budgetItem = getItemById(comparison.budgetItemId);
  const unit = getUnitById(comparison.unitId);

  // If either item or unit is not found, skip this comparison
  if (!unit) {
    console.warn(`Unit not found for comparison: ${comparison.unitId}`);
    return null;
  }

  // Use the budget amount from the comparison (may differ from current item amount)
  const budgetAmount = comparison.budgetAmount;
  const budgetItemName = budgetItem?.name ?? comparison.budgetItemId;

  // Calculate comparison server-side
  const calculationResult = calculateComparison(budgetAmount, unit);
  const formattedResult = formatComparisonResult(budgetAmount, unit);

  // Get context if available
  const contextKey =
    comparison.budgetItemId as keyof typeof FEATURED_COMPARISON_CONTEXT;
  const context = FEATURED_COMPARISON_CONTEXT[contextKey];

  return {
    id: `${comparison.budgetItemId}-${comparison.unitId}`,
    budgetItemId: comparison.budgetItemId,
    budgetItemName,
    budgetAmount,
    unitId: comparison.unitId,
    unit,
    unitCount: calculationResult.count,
    formatted: formattedResult.displayString,
    headline: comparison.headline,
    displayOrder: comparison.displayOrder,
    isFeatured: comparison.isFeatured,
    context,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const shouldShuffle = searchParams.get("random") === "true";
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    // Validate limit if provided
    if (limit !== undefined && (isNaN(limit) || limit < 1)) {
      return NextResponse.json(
        { error: "Invalid limit parameter. Must be a positive integer." },
        { status: 400 },
      );
    }

    // Get all featured comparisons
    let comparisons = [...FEATURED_COMPARISONS];

    // Sort by display order (ascending) first
    comparisons.sort((a, b) => a.displayOrder - b.displayOrder);

    // Shuffle if requested
    if (shouldShuffle) {
      comparisons = shuffleArray(comparisons);
    }

    // Transform comparisons with calculated results
    const transformedComparisons: FeaturedComparisonResponse[] = [];
    for (const comparison of comparisons) {
      const transformed = transformComparison(comparison);
      if (transformed) {
        transformedComparisons.push(transformed);
      }
    }

    // Apply limit if specified
    const limitedComparisons = limit
      ? transformedComparisons.slice(0, limit)
      : transformedComparisons;

    const response: FeaturedApiResponse = {
      comparisons: limitedComparisons,
      total: transformedComparisons.length,
      shuffled: shouldShuffle,
    };

    // Return response with 1 hour cache
    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching featured comparisons:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured comparisons" },
      { status: 500 },
    );
  }
}
