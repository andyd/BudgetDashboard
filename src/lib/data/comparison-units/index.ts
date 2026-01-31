/**
 * Comparison Units Index
 *
 * Aggregates all category-specific comparison unit arrays and provides
 * utility functions for accessing units by category or ID.
 */

import type { ComparisonUnit } from "@/types/comparison";
import { HEALTHCARE_UNITS } from "./healthcare";
import { HOUSING_UNITS } from "./housing";

// Re-export the ComparisonUnit interface from the main types
export type { ComparisonUnit } from "@/types/comparison";

// Define and export the UnitCategory type based on available categories
export type UnitCategory = ComparisonUnit["category"];

/**
 * Combined array of all comparison units from all categories
 */
export const ALL_COMPARISON_UNITS: ComparisonUnit[] = [
  ...HEALTHCARE_UNITS,
  ...HOUSING_UNITS,
];

/**
 * Re-export individual category arrays for direct access
 */
export { HEALTHCARE_UNITS } from "./healthcare";
export { HOUSING_UNITS } from "./housing";

/**
 * Get all comparison units for a specific category
 * @param category - The category to filter by
 * @returns Array of comparison units in that category
 */
export function getUnitsByCategory(category: UnitCategory): ComparisonUnit[] {
  return ALL_COMPARISON_UNITS.filter((unit) => unit.category === category);
}

/**
 * Get a single comparison unit by its ID
 * @param id - The unique identifier of the unit
 * @returns The comparison unit if found, undefined otherwise
 */
export function getUnitById(id: string): ComparisonUnit | undefined {
  return ALL_COMPARISON_UNITS.find((unit) => unit.id === id);
}
