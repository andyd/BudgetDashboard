/**
 * Data Index
 *
 * Master index that re-exports all comparison units and budget items.
 * Import from this file for convenient access to all data and utilities.
 *
 * @example
 * import {
 *   ALL_COMPARISON_UNITS,
 *   ALL_BUDGET_ITEMS,
 *   getUnitById,
 *   getItemById
 * } from '@/lib/data';
 */

// ============================================================================
// Comparison Units
// ============================================================================

// Main exports from comparison-units
export {
  ALL_COMPARISON_UNITS,
  getUnitsByCategory,
  getUnitById,
} from "./comparison-units";

// Re-export type
export type { UnitCategory } from "./comparison-units";

// Individual category arrays
export { EDUCATION_UNITS } from "./comparison-units/education";
export { ENVIRONMENT_UNITS } from "./comparison-units/environment";
export { FOOD_UNITS } from "./comparison-units/food";
export { HEALTHCARE_UNITS } from "./comparison-units/healthcare";
export { HOUSING_UNITS } from "./comparison-units/housing";
export { INCOME_UNITS } from "./comparison-units/income";
export { PUBLIC_SERVICES_UNITS } from "./comparison-units/public-services";
export { TRANSPORTATION_UNITS } from "./comparison-units/transportation";
export { VETERANS_UNITS } from "./comparison-units/veterans";

// ============================================================================
// Budget Items
// ============================================================================

// Main exports from budget-items
export {
  ALL_BUDGET_ITEMS,
  getItemsByTier,
  getItemById,
  getItemsByParent,
} from "./budget-items";

// Individual item arrays
export { DEPARTMENT_ITEMS } from "./budget-items/departments";
export { CURRENT_EVENT_ITEMS } from "./budget-items/current-events";
export { DEFENSE_PROGRAMS } from "./budget-items/programs-defense";
export { HOMELAND_PROGRAMS } from "./budget-items/programs-homeland";
export { SOCIAL_PROGRAMS } from "./budget-items/programs-social";

// ============================================================================
// Type Exports
// ============================================================================

// Re-export types from the canonical type definitions
export type {
  ComparisonUnit,
  ComparisonResult,
  FeaturedComparison,
  CustomComparison,
  ShareableComparison,
  Comparison,
} from "@/types/comparison";

export type { BudgetSpendingItem } from "./budget-items/departments";
