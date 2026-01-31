/**
 * Wizard Comparison Generation
 *
 * Generates personalized budget comparisons based on user wizard answers.
 * Takes their priority categories and wasteful categories to create
 * impactful comparisons showing how wasteful spending could fund their priorities.
 */

import type { BudgetSpendingItem } from "./data/budget-items";
import type { ComparisonUnit } from "./data/comparison-units";
import type { PriorityCategory, WastefulCategory } from "./wizard-categories";
import {
  getBudgetItemsForCategory,
  getComparisonUnitsForCategory,
} from "./wizard-categories";

/**
 * Generated comparison for wizard results
 */
export interface WizardComparison {
  /** Budget item being compared */
  budgetItem: BudgetSpendingItem;

  /** Comparison unit */
  unit: ComparisonUnit;

  /** Number of units the budget could buy */
  unitCount: number;

  /** Whether this matches the user's top priority */
  isTopPriority: boolean;

  /** Priority category this relates to */
  priorityCategory: PriorityCategory;

  /** Wasteful category this relates to */
  wastefulCategory: WastefulCategory;
}

/**
 * Generate personalized comparisons based on wizard answers
 *
 * @param priorities - User's priority categories (education, healthcare, etc.)
 * @param wasteful - User's wasteful categories (defense, foreign-aid, etc.)
 * @param topPriority - User's single most important priority
 * @returns Array of 3-5 comparison results, sorted by relevance
 */
export function generateWizardComparisons(
  priorities: PriorityCategory[],
  wasteful: WastefulCategory[],
  topPriority: PriorityCategory,
): WizardComparison[] {
  const comparisons: WizardComparison[] = [];

  // Generate comparisons for each wasteful category
  for (const wasteCategory of wasteful) {
    const wasteItems = getBudgetItemsForCategory(wasteCategory);

    // Generate comparisons for each priority category
    for (const priorityCategory of priorities) {
      const units = getComparisonUnitsForCategory(priorityCategory);

      // Create comparisons for each budget item and unit combination
      for (const budgetItem of wasteItems) {
        for (const unit of units) {
          const costPerUnit = unit.costPerUnit ?? unit.cost ?? 0;

          // Skip if no valid cost
          if (costPerUnit <= 0) continue;

          const unitCount = budgetItem.amount / costPerUnit;

          // Only include if we get at least 1 unit
          if (unitCount < 1) continue;

          comparisons.push({
            budgetItem,
            unit,
            unitCount,
            isTopPriority: priorityCategory === topPriority,
            priorityCategory,
            wastefulCategory: wasteCategory,
          });
        }
      }
    }
  }

  // Sort comparisons:
  // 1. Top priority matches first
  // 2. Then by highest unit count (most impactful)
  // 3. Then by budget item amount (larger budgets more interesting)
  const sortedComparisons = comparisons.sort((a, b) => {
    // Top priority matches first
    if (a.isTopPriority !== b.isTopPriority) {
      return a.isTopPriority ? -1 : 1;
    }

    // Higher unit counts are more impactful
    if (Math.abs(b.unitCount - a.unitCount) > 100) {
      return b.unitCount - a.unitCount;
    }

    // Larger budget amounts are more interesting
    return b.budgetItem.amount - a.budgetItem.amount;
  });

  // Return top 5 comparisons
  return sortedComparisons.slice(0, 5);
}

/**
 * Format a wizard comparison as a readable headline
 *
 * @example
 * formatComparisonHeadline(comparison)
 * // "The F-35 Program could fund 194,117 teacher salaries"
 */
export function formatComparisonHeadline(comparison: WizardComparison): string {
  const unitCount = Math.floor(comparison.unitCount);
  const unitName =
    unitCount === 1
      ? comparison.unit.nameSingular || comparison.unit.name
      : comparison.unit.name;

  return `${comparison.budgetItem.name} could fund ${unitCount.toLocaleString()} ${unitName}`;
}
