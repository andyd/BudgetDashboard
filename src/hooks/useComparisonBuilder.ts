"use client";

import { useState, useMemo, useCallback } from "react";
import type { ComparisonUnit } from "@/types/comparison";
import type { BudgetCategory } from "@/types/budget";
import { formatCurrency, formatNumber } from "@/lib/unit-converter";

/**
 * Spending item for comparison builder
 * Uses allocated amount from BudgetCategory
 */
export interface SpendingItem {
  id: string;
  name: string;
  amount: number;
  category?: string;
  source?: string;
}

/**
 * Computed comparison result
 */
export interface BuilderComparisonResult {
  spending: SpendingItem;
  unit: ComparisonUnit;
  quantity: number;
  formattedQuantity: string;
  formattedSpending: string;
  formattedUnitCost: string;
}

/**
 * Alternative option for either side
 */
export interface Alternative {
  item: SpendingItem | ComparisonUnit;
  previewQuantity: number;
  formattedPreview: string;
}

/**
 * Comparison builder hook state
 */
export interface ComparisonBuilderState {
  selectedSpending: SpendingItem | null;
  selectedUnit: ComparisonUnit | null;
  result: BuilderComparisonResult | null;
  spendingAlternatives: Alternative[];
  unitAlternatives: Alternative[];
  setSpending: (spending: SpendingItem | null) => void;
  setUnit: (unit: ComparisonUnit | null) => void;
  clear: () => void;
}

/**
 * Calculate an "impact score" for a unit comparison
 * Higher scores indicate more memorable/impactful comparisons
 *
 * Prefers:
 * - Round numbers (not too many decimal places)
 * - Relatable scale (thousands to millions)
 * - Not too small (> 1) or too large (< 1 billion)
 */
function calculateImpactScore(amount: number, unit: ComparisonUnit): number {
  const cost = unit.costPerUnit ?? unit.cost ?? 0;
  if (cost <= 0) return 0;

  const count = amount / cost;

  // Penalize very small counts
  if (count < 1) return 0;
  if (count < 10) return 10;

  // Penalize extremely large counts (harder to grasp)
  if (count > 1_000_000_000) return 5;

  // Score based on "nice" numbers
  let score = 50;

  // Prefer counts in the thousands to millions range
  if (count >= 1_000 && count <= 10_000_000) {
    score += 30;
  } else if (count >= 100 && count < 1_000) {
    score += 20;
  } else if (count > 10_000_000 && count <= 100_000_000) {
    score += 15;
  }

  // Bonus for round-ish numbers (low decimal component)
  const decimalPart = count - Math.floor(count);
  if (decimalPart < 0.1 || decimalPart > 0.9) {
    score += 10;
  }

  // Bonus for being close to a nice round number
  const log = Math.log10(count);
  const nearestPowerOf10 = Math.round(log);
  const distanceFromPower = Math.abs(log - nearestPowerOf10);
  if (distanceFromPower < 0.2) {
    score += 15;
  }

  return score;
}

/**
 * Find the best matching unit for a given spending amount
 */
function findBestUnit(
  amount: number,
  units: ComparisonUnit[],
  excludeId?: string,
): ComparisonUnit | null {
  if (units.length === 0) return null;

  const scored = units
    .filter((u) => u.id !== excludeId)
    .map((unit) => ({
      unit,
      score: calculateImpactScore(amount, unit),
    }))
    .sort((a, b) => b.score - a.score);

  return scored[0]?.unit ?? null;
}

/**
 * Find the best matching spending item for a given unit
 */
function findBestSpending(
  unit: ComparisonUnit,
  spendingItems: SpendingItem[],
  excludeId?: string,
): SpendingItem | null {
  if (spendingItems.length === 0) return null;

  const scored = spendingItems
    .filter((s) => s.id !== excludeId)
    .map((spending) => ({
      spending,
      score: calculateImpactScore(spending.amount, unit),
    }))
    .sort((a, b) => b.score - a.score);

  return scored[0]?.spending ?? null;
}

/**
 * Get alternatives for units (different categories preferred)
 */
function getUnitAlternatives(
  amount: number,
  selectedUnit: ComparisonUnit | null,
  units: ComparisonUnit[],
  maxAlternatives = 3,
): Alternative[] {
  const selectedCategory = selectedUnit?.category;
  const selectedId = selectedUnit?.id;

  // Score and sort all units
  const scored = units
    .filter((u) => u.id !== selectedId)
    .map((unit) => ({
      unit,
      score: calculateImpactScore(amount, unit),
      isDifferentCategory: unit.category !== selectedCategory,
    }))
    // Prefer different categories
    .sort((a, b) => {
      if (a.isDifferentCategory !== b.isDifferentCategory) {
        return a.isDifferentCategory ? -1 : 1;
      }
      return b.score - a.score;
    });

  // Take top alternatives, ensuring category diversity
  const alternatives: Alternative[] = [];
  const usedCategories = new Set<string>();

  for (const { unit } of scored) {
    if (alternatives.length >= maxAlternatives) break;

    // Skip if we already have one from this category (unless we need more)
    if (
      usedCategories.has(unit.category) &&
      alternatives.length < maxAlternatives - 1
    ) {
      continue;
    }

    const cost = unit.costPerUnit ?? unit.cost ?? 0;
    if (cost <= 0) continue;

    const quantity = amount / cost;
    alternatives.push({
      item: unit,
      previewQuantity: quantity,
      formattedPreview: `${formatNumber(Math.floor(quantity))} ${quantity === 1 ? unit.nameSingular : unit.name}`,
    });
    usedCategories.add(unit.category);
  }

  return alternatives;
}

/**
 * Get alternatives for spending items
 */
function getSpendingAlternatives(
  unit: ComparisonUnit | null,
  selectedSpending: SpendingItem | null,
  spendingItems: SpendingItem[],
  maxAlternatives = 3,
): Alternative[] {
  if (!unit) return [];

  const cost = unit.costPerUnit ?? unit.cost ?? 0;
  if (cost <= 0) return [];

  const selectedId = selectedSpending?.id;

  // Score and sort all spending items
  const scored = spendingItems
    .filter((s) => s.id !== selectedId)
    .map((spending) => ({
      spending,
      score: calculateImpactScore(spending.amount, unit),
    }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, maxAlternatives).map(({ spending }) => {
    const quantity = spending.amount / cost;
    return {
      item: spending,
      previewQuantity: quantity,
      formattedPreview: `${formatNumber(Math.floor(quantity))} ${quantity === 1 ? unit.nameSingular : unit.name}`,
    };
  });
}

/**
 * Convert BudgetCategory to SpendingItem
 */
export function budgetCategoryToSpendingItem(
  category: BudgetCategory,
): SpendingItem {
  return {
    id: category.id,
    name: category.name,
    amount: category.allocated,
    category: category.categoryType,
  };
}

/**
 * Custom hook for comparison builder state
 *
 * Manages the state for building comparisons between government spending
 * and tangible comparison units. Handles smart auto-fill logic and
 * provides alternatives for both sides of the comparison.
 *
 * @param units - Available comparison units
 * @param spendingItems - Available spending items to compare
 * @returns Comparison builder state and actions
 *
 * @example
 * ```tsx
 * const {
 *   selectedSpending,
 *   selectedUnit,
 *   result,
 *   spendingAlternatives,
 *   unitAlternatives,
 *   setSpending,
 *   setUnit,
 *   clear,
 * } = useComparisonBuilder(units, spendingItems);
 *
 * // When user selects a spending item, unit auto-fills
 * setSpending(spendingItems[0]);
 *
 * // When user selects a unit, spending auto-fills
 * setUnit(units[0]);
 * ```
 */
export function useComparisonBuilder(
  units: ComparisonUnit[],
  spendingItems: SpendingItem[],
): ComparisonBuilderState {
  const [selectedSpending, setSelectedSpending] = useState<SpendingItem | null>(
    null,
  );
  const [selectedUnit, setSelectedUnit] = useState<ComparisonUnit | null>(null);

  // Compute the comparison result when both sides are selected
  const result = useMemo((): BuilderComparisonResult | null => {
    if (!selectedSpending || !selectedUnit) return null;

    const cost = selectedUnit.costPerUnit ?? selectedUnit.cost ?? 0;
    if (cost <= 0) return null;

    const quantity = selectedSpending.amount / cost;

    return {
      spending: selectedSpending,
      unit: selectedUnit,
      quantity,
      formattedQuantity: formatNumber(Math.floor(quantity)),
      formattedSpending: formatCurrency(selectedSpending.amount),
      formattedUnitCost: formatCurrency(cost),
    };
  }, [selectedSpending, selectedUnit]);

  // Compute alternatives for units
  const unitAlternatives = useMemo((): Alternative[] => {
    if (!selectedSpending) return [];
    return getUnitAlternatives(selectedSpending.amount, selectedUnit, units);
  }, [selectedSpending, selectedUnit, units]);

  // Compute alternatives for spending items
  const spendingAlternatives = useMemo((): Alternative[] => {
    return getSpendingAlternatives(
      selectedUnit,
      selectedSpending,
      spendingItems,
    );
  }, [selectedUnit, selectedSpending, spendingItems]);

  // Set spending with auto-fill logic for unit
  const setSpending = useCallback(
    (spending: SpendingItem | null) => {
      setSelectedSpending(spending);

      // Auto-fill unit if spending is set and no unit is selected
      if (spending && !selectedUnit) {
        const bestUnit = findBestUnit(spending.amount, units);
        if (bestUnit) {
          setSelectedUnit(bestUnit);
        }
      }
    },
    [selectedUnit, units],
  );

  // Set unit with auto-fill logic for spending
  const setUnit = useCallback(
    (unit: ComparisonUnit | null) => {
      setSelectedUnit(unit);

      // Auto-fill spending if unit is set and no spending is selected
      if (unit && !selectedSpending) {
        const bestSpending = findBestSpending(unit, spendingItems);
        if (bestSpending) {
          setSelectedSpending(bestSpending);
        }
      }
    },
    [selectedSpending, spendingItems],
  );

  // Clear both selections
  const clear = useCallback(() => {
    setSelectedSpending(null);
    setSelectedUnit(null);
  }, []);

  return {
    selectedSpending,
    selectedUnit,
    result,
    spendingAlternatives,
    unitAlternatives,
    setSpending,
    setUnit,
    clear,
  };
}

export default useComparisonBuilder;
