/**
 * Comparison Engine
 *
 * Core logic for calculating and selecting budget comparisons.
 * Provides functions to convert dollar amounts to tangible unit counts,
 * score comparisons for memorability, and auto-select the best units.
 */

import type { ComparisonUnit, ComparisonResult, BudgetItem } from "@/types";

/**
 * Result of a comparison calculation
 */
export interface ComparisonCalculation {
  /** Number of units the amount equals */
  count: number;
  /** Human-readable formatted string (e.g., "1.5 million Eiffel Towers") */
  formatted: string;
}

/**
 * Formatted display object for rendering comparisons
 */
export interface FormattedComparisonResult {
  /** The dollar amount being compared */
  amount: number;
  /** The comparison unit used */
  unit: ComparisonUnit;
  /** Number of units */
  count: number;
  /** Formatted count string (e.g., "1.5 million") */
  formattedCount: string;
  /** Unit name (singular or plural based on count) */
  unitName: string;
  /** Full display string (e.g., "1.5 million Eiffel Towers") */
  displayString: string;
  /** Icon/emoji for the unit (undefined if not available) */
  icon: string | undefined;
}

/**
 * Alternative budget item for comparison
 */
export interface AlternativeSpending {
  /** The budget item */
  item: BudgetItem;
  /** Comparison to the same unit as selected item */
  comparisonCount: number;
  /** Formatted comparison string */
  formatted: string;
  /** Ratio compared to the selected item (e.g., 2.5 means 2.5x larger) */
  ratio: number;
}

// =============================================================================
// Number Formatting Helpers
// =============================================================================

/**
 * Format a number with appropriate suffix (thousand, million, billion, trillion)
 */
function formatLargeNumber(num: number): string {
  const absNum = Math.abs(num);

  if (absNum >= 1_000_000_000_000) {
    const value = num / 1_000_000_000_000;
    return `${formatDecimal(value)} trillion`;
  }
  if (absNum >= 1_000_000_000) {
    const value = num / 1_000_000_000;
    return `${formatDecimal(value)} billion`;
  }
  if (absNum >= 1_000_000) {
    const value = num / 1_000_000;
    return `${formatDecimal(value)} million`;
  }
  if (absNum >= 1_000) {
    const value = num / 1_000;
    return `${formatDecimal(value)} thousand`;
  }

  return formatDecimal(num);
}

/**
 * Format a decimal number, removing unnecessary trailing zeros
 */
function formatDecimal(num: number): string {
  // For whole numbers or near-whole numbers, show as integer
  if (Math.abs(num - Math.round(num)) < 0.005) {
    return Math.round(num).toLocaleString("en-US");
  }

  // For numbers close to nice decimals, round to 1 decimal
  const rounded1 = Math.round(num * 10) / 10;
  if (Math.abs(num - rounded1) < 0.05) {
    return rounded1.toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  }

  // Otherwise show 2 decimals
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Get the singular or plural form of a unit name based on count
 */
function getUnitName(unit: ComparisonUnit, count: number): string {
  const isPlural = Math.abs(count) !== 1;

  if (isPlural) {
    return unit.pluralName ?? unit.name;
  }

  return unit.nameSingular ?? unit.name.replace(/s$/, "");
}

/**
 * Get the cost per unit, handling both costPerUnit and cost properties
 */
function getUnitCost(unit: ComparisonUnit): number {
  return unit.costPerUnit ?? unit.cost ?? 0;
}

// =============================================================================
// Core Comparison Functions
// =============================================================================

/**
 * Calculate how many units a dollar amount equals
 *
 * @param amount - Dollar amount to convert
 * @param unit - Comparison unit to use
 * @returns Object with count and formatted string
 *
 * @example
 * const result = calculateComparison(1_500_000_000, eiffelTowerUnit);
 * // { count: 1, formatted: "1 Eiffel Tower" }
 */
export function calculateComparison(
  amount: number,
  unit: ComparisonUnit,
): ComparisonCalculation {
  const costPerUnit = getUnitCost(unit);

  if (costPerUnit <= 0) {
    return { count: 0, formatted: "0 " + getUnitName(unit, 0) };
  }

  const count = amount / costPerUnit;
  const formattedCount = formatLargeNumber(count);
  const unitName = getUnitName(unit, count);

  return {
    count,
    formatted: `${formattedCount} ${unitName}`,
  };
}

/**
 * Calculate an "impact score" for a comparison based on memorability factors
 *
 * Higher scores indicate more memorable/impactful comparisons.
 * Scoring factors:
 * - Round numbers (1, 10, 100, 1000) score higher
 * - Thousands to millions range scores higher (more relatable)
 * - Very large (trillions) or very small (fractions) score lower
 *
 * @param amount - Dollar amount being compared
 * @param unit - Comparison unit to evaluate
 * @returns Impact score (0-100, higher is better)
 */
export function calculateImpactScore(
  amount: number,
  unit: ComparisonUnit,
): number {
  const costPerUnit = getUnitCost(unit);

  if (costPerUnit <= 0) {
    return 0;
  }

  const count = amount / costPerUnit;

  // Start with base score
  let score = 50;

  // === Roundness Score (0-25 points) ===
  // Prefer round numbers that are easy to remember
  const roundnessScore = calculateRoundnessScore(count);
  score += roundnessScore;

  // === Range Score (0-25 points) ===
  // Prefer thousands to millions range - most relatable to humans
  const rangeScore = calculateRangeScore(count);
  score += rangeScore;

  // === Fractional Penalty (-20 to 0 points) ===
  // Penalize fractional results (less than 1)
  if (count < 1) {
    score -= 20 * (1 - count);
  }

  // === Extreme Penalty (-15 to 0 points) ===
  // Penalize extremely large numbers (hard to conceptualize)
  if (count >= 1_000_000_000_000) {
    score -= 15;
  } else if (count >= 1_000_000_000) {
    score -= 10;
  }

  // Clamp score to 0-100 range
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate how "round" a number is (how easy to remember)
 * Returns 0-25 points
 */
function calculateRoundnessScore(num: number): number {
  // Exact powers of 10 get max score
  const log10 = Math.log10(num);
  if (Number.isInteger(log10) && log10 >= 0) {
    return 25;
  }

  // Numbers divisible by 1000 get high score
  if (num >= 1000 && num % 1000 === 0) {
    return 22;
  }

  // Numbers divisible by 100 get good score
  if (num >= 100 && num % 100 === 0) {
    return 18;
  }

  // Numbers divisible by 10 get decent score
  if (num >= 10 && num % 10 === 0) {
    return 12;
  }

  // Numbers close to nice decimals (1.5, 2.5, etc.)
  const decimal = num - Math.floor(num);
  if (Math.abs(decimal - 0.5) < 0.05) {
    return 10;
  }

  // Whole numbers get some points
  if (Math.abs(num - Math.round(num)) < 0.01) {
    return 8;
  }

  // Fractional numbers score low
  return 0;
}

/**
 * Calculate score based on the numeric range (how relatable)
 * Returns 0-25 points
 */
function calculateRangeScore(num: number): number {
  // Sweet spot: 1-100 (most tangible)
  if (num >= 1 && num <= 100) {
    return 25;
  }

  // Good: 100-10,000 (still relatable)
  if (num > 100 && num <= 10_000) {
    return 22;
  }

  // Okay: 10,000-1,000,000 (thousands range)
  if (num > 10_000 && num <= 1_000_000) {
    return 18;
  }

  // Less ideal: millions range
  if (num > 1_000_000 && num <= 1_000_000_000) {
    return 12;
  }

  // Poor: billions range (hard to conceptualize)
  if (num > 1_000_000_000 && num <= 1_000_000_000_000) {
    return 5;
  }

  // Worst: trillions or fractions
  if (num > 1_000_000_000_000 || num < 1) {
    return 0;
  }

  return 10;
}

/**
 * Find the best comparison unit for a given amount
 *
 * Automatically selects the unit that produces the most memorable comparison
 * based on impact scoring.
 *
 * @param amount - Dollar amount to compare
 * @param units - Array of available comparison units
 * @returns The best unit for this amount, or undefined if no units provided
 */
export function findBestComparison(
  amount: number,
  units: ComparisonUnit[],
): ComparisonUnit | undefined {
  if (units.length === 0) {
    return undefined;
  }

  let bestUnit: ComparisonUnit | undefined;
  let bestScore = -1;

  for (const unit of units) {
    const score = calculateImpactScore(amount, unit);

    if (score > bestScore) {
      bestScore = score;
      bestUnit = unit;
    }
  }

  return bestUnit;
}

/**
 * Get alternative comparison units for variety
 *
 * Returns 2-3 diverse alternatives to the selected unit, preferring:
 * - Different categories
 * - Good impact scores
 * - Variety in scale (mixing everyday items with infrastructure)
 *
 * @param amount - Dollar amount being compared
 * @param selectedUnit - Currently selected unit (will be excluded)
 * @param allUnits - All available comparison units
 * @returns Array of 2-3 alternative units
 */
export function getAlternatives(
  amount: number,
  selectedUnit: ComparisonUnit,
  allUnits: ComparisonUnit[],
): ComparisonUnit[] {
  // Filter out the selected unit
  const availableUnits = allUnits.filter((u) => u.id !== selectedUnit.id);

  if (availableUnits.length === 0) {
    return [];
  }

  // Score all available units
  const scoredUnits = availableUnits.map((unit) => ({
    unit,
    score: calculateImpactScore(amount, unit),
    category: unit.category,
  }));

  // Sort by score descending
  scoredUnits.sort((a, b) => b.score - a.score);

  // Select diverse alternatives
  const alternatives: ComparisonUnit[] = [];
  const usedCategories = new Set<string>();

  // First pass: get best unit from each unique category
  for (const scored of scoredUnits) {
    if (alternatives.length >= 3) break;

    if (!usedCategories.has(scored.category)) {
      alternatives.push(scored.unit);
      usedCategories.add(scored.category);
    }
  }

  // Second pass: fill remaining slots with highest scoring units
  if (alternatives.length < 2) {
    for (const scored of scoredUnits) {
      if (alternatives.length >= 3) break;

      if (!alternatives.includes(scored.unit)) {
        alternatives.push(scored.unit);
      }
    }
  }

  return alternatives.slice(0, 3);
}

/**
 * Get alternative budget items for comparison
 *
 * Returns 2-3 budget items that provide interesting comparison context,
 * preferring items with similar or contrasting amounts.
 *
 * @param selectedItem - Currently selected budget item
 * @param allItems - All available budget items
 * @returns Array of 2-3 alternative budget items with comparison info
 */
export function getAlternativeSpending(
  selectedItem: BudgetItem,
  allItems: BudgetItem[],
): AlternativeSpending[] {
  // Filter out the selected item
  const availableItems = allItems.filter((item) => item.id !== selectedItem.id);

  if (availableItems.length === 0) {
    return [];
  }

  const selectedAmount = selectedItem.amount;

  // Score items based on how interesting the comparison would be
  const scoredItems = availableItems.map((item) => {
    const ratio = item.amount / selectedAmount;
    const interestScore = calculateComparisonInterest(ratio);

    return {
      item,
      ratio,
      interestScore,
    };
  });

  // Sort by interest score descending
  scoredItems.sort((a, b) => b.interestScore - a.interestScore);

  // Take top 3 alternatives
  const topItems = scoredItems.slice(0, 3);

  // Create alternative spending objects
  return topItems.map(({ item, ratio }) => {
    // Format the comparison
    const formatted = formatRatioComparison(
      ratio,
      item.name,
      selectedItem.name,
    );

    return {
      item,
      comparisonCount: ratio,
      formatted,
      ratio,
    };
  });
}

/**
 * Calculate how interesting a ratio comparison is
 * Returns higher scores for ratios that are easy to communicate
 */
function calculateComparisonInterest(ratio: number): number {
  // Perfect matches are very interesting
  if (Math.abs(ratio - 1) < 0.01) {
    return 100;
  }

  // Nice round multiples are interesting
  const niceMultiples = [0.5, 2, 3, 4, 5, 10, 20, 50, 100];
  for (const multiple of niceMultiples) {
    if (Math.abs(ratio - multiple) < 0.1) {
      return 90;
    }
  }

  // Ratios between 0.1 and 10 are most relatable
  if (ratio >= 0.1 && ratio <= 10) {
    return 70;
  }

  // Ratios between 10 and 100 are okay
  if (ratio >= 10 && ratio <= 100) {
    return 50;
  }

  // Very large or very small ratios are less interesting
  return 20;
}

/**
 * Format a ratio comparison into a readable string
 */
function formatRatioComparison(
  ratio: number,
  itemName: string,
  comparedToName: string,
): string {
  if (Math.abs(ratio - 1) < 0.01) {
    return `${itemName} costs about the same as ${comparedToName}`;
  }

  if (ratio > 1) {
    const formattedRatio = formatDecimal(ratio);
    return `${itemName} is ${formattedRatio}x more than ${comparedToName}`;
  }

  const inverseRatio = 1 / ratio;
  const formattedRatio = formatDecimal(inverseRatio);
  return `${itemName} is ${formattedRatio}x less than ${comparedToName}`;
}

/**
 * Format a comparison result into a display object
 *
 * Creates a structured object with all the information needed to render
 * a comparison in the UI.
 *
 * @param amount - Dollar amount being compared
 * @param unit - Comparison unit used
 * @param count - Pre-calculated count (optional, will calculate if not provided)
 * @returns Formatted comparison result object
 */
export function formatComparisonResult(
  amount: number,
  unit: ComparisonUnit,
  count?: number,
): FormattedComparisonResult {
  const costPerUnit = getUnitCost(unit);
  const actualCount = count ?? (costPerUnit > 0 ? amount / costPerUnit : 0);
  const formattedCount = formatLargeNumber(actualCount);
  const unitName = getUnitName(unit, actualCount);
  const displayString = `${formattedCount} ${unitName}`;

  return {
    amount,
    unit,
    count: actualCount,
    formattedCount,
    unitName,
    displayString,
    icon: unit.icon,
  };
}

// =============================================================================
// Utility Exports
// =============================================================================

/**
 * Convert a ComparisonCalculation to a ComparisonResult
 * Useful for compatibility with existing store types
 */
export function toComparisonResult(
  calculation: ComparisonCalculation,
  unit: ComparisonUnit,
  dollarAmount: number,
): ComparisonResult {
  return {
    unitCount: calculation.count,
    formatted: calculation.formatted,
    unit,
    dollarAmount,
  };
}
