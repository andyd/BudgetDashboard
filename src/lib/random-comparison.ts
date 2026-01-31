/**
 * Random Comparison Utilities
 *
 * Provides functions to get random comparisons from the featured set
 * for use in widgets like QuickCompare.
 */

import {
  FEATURED_COMPARISONS,
  type SimpleFeaturedComparison,
} from "./mock-data/featured-comparisons";
import { getUnitById } from "./mock-data/units";
import type { ComparisonUnit } from "@/types/comparison";

/**
 * Extended comparison with resolved unit data
 */
export interface RandomComparison {
  /** Budget item identifier */
  budgetItemId: string;
  /** Budget amount in dollars */
  budgetAmount: number;
  /** Resolved comparison unit */
  unit: ComparisonUnit;
  /** Number of units the amount equals */
  unitCount: number;
  /** Editorial headline */
  headline: string;
  /** Whether this is a featured comparison */
  isFeatured: boolean;
}

/**
 * Get a random comparison from the featured comparisons
 * Returns a fully resolved comparison with unit data
 */
export function getRandomComparison(): RandomComparison | null {
  if (FEATURED_COMPARISONS.length === 0) {
    return null;
  }

  const index = Math.floor(Math.random() * FEATURED_COMPARISONS.length);
  const comparison = FEATURED_COMPARISONS[index];

  if (!comparison) {
    return null;
  }

  return resolveComparison(comparison);
}

/**
 * Get a random comparison different from the provided one
 * Useful for "shuffle" functionality
 */
export function getRandomComparisonExcluding(
  currentId: string,
): RandomComparison | null {
  const availableComparisons = FEATURED_COMPARISONS.filter(
    (c) => c.budgetItemId !== currentId,
  );

  if (availableComparisons.length === 0) {
    // Fallback to any comparison if all are excluded
    return getRandomComparison();
  }

  const index = Math.floor(Math.random() * availableComparisons.length);
  const comparison = availableComparisons[index];

  if (!comparison) {
    return null;
  }

  return resolveComparison(comparison);
}

/**
 * Get all comparisons in random order
 */
export function getShuffledComparisons(): RandomComparison[] {
  const shuffled = [...FEATURED_COMPARISONS].sort(() => Math.random() - 0.5);

  return shuffled
    .map(resolveComparison)
    .filter((c): c is RandomComparison => c !== null);
}

/**
 * Get an "interesting" comparison - one with high impact (large budget or unit count)
 * Filters for comparisons with budget >= $100M and unit count >= 10,000
 */
export function getInterestingComparison(): RandomComparison | null {
  const interestingComparisons = FEATURED_COMPARISONS.filter(
    (c) => c.budgetAmount >= 100_000_000 && c.unitCount >= 10_000,
  );

  if (interestingComparisons.length === 0) {
    // Fallback to any comparison if none meet the criteria
    return getRandomComparison();
  }

  const index = Math.floor(Math.random() * interestingComparisons.length);
  const comparison = interestingComparisons[index];

  if (!comparison) {
    return null;
  }

  return resolveComparison(comparison);
}

/**
 * Get multiple unique interesting comparisons
 * Returns up to the requested count, or all available if fewer exist
 */
export function getMultipleInterestingComparisons(
  count: number,
): RandomComparison[] {
  if (count <= 0) {
    return [];
  }

  const interestingComparisons = FEATURED_COMPARISONS.filter(
    (c) => c.budgetAmount >= 100_000_000 && c.unitCount >= 10_000,
  );

  // Shuffle the array using Fisher-Yates
  const shuffled = [...interestingComparisons];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }

  // Take up to count items
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected
    .map(resolveComparison)
    .filter((c): c is RandomComparison => c !== null);
}

/**
 * Resolve a SimpleFeaturedComparison to a full RandomComparison with unit data
 */
function resolveComparison(
  comparison: SimpleFeaturedComparison,
): RandomComparison | null {
  const unit = getUnitById(comparison.unitId);

  if (!unit) {
    // Create a fallback unit from the comparison data
    const fallbackUnit: ComparisonUnit = {
      id: comparison.unitId,
      name: comparison.unitId.replace(/-/g, " "),
      category: "general",
    };

    return {
      budgetItemId: comparison.budgetItemId,
      budgetAmount: comparison.budgetAmount,
      unit: fallbackUnit,
      unitCount: comparison.unitCount,
      headline: comparison.headline,
      isFeatured: comparison.isFeatured,
    };
  }

  return {
    budgetItemId: comparison.budgetItemId,
    budgetAmount: comparison.budgetAmount,
    unit,
    unitCount: comparison.unitCount,
    headline: comparison.headline,
    isFeatured: comparison.isFeatured,
  };
}
