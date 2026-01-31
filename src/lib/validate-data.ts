/**
 * Data Validation Script
 *
 * Validates ALL_BUDGET_ITEMS and ALL_COMPARISON_UNITS data integrity.
 * Checks for required fields, duplicate IDs, and valid amounts.
 *
 * @example
 * import { validateBudgetItems, validateComparisonUnits } from '@/lib/validate-data';
 *
 * const budgetErrors = validateBudgetItems();
 * const unitErrors = validateComparisonUnits();
 */

import { ALL_BUDGET_ITEMS } from "./data/budget-items";
import { ALL_COMPARISON_UNITS } from "./data/comparison-units";
import type { BudgetSpendingItem } from "./data/budget-items/departments";
import type { ComparisonUnit } from "@/types/comparison";

// ============================================================================
// Types
// ============================================================================

export interface ValidationError {
  itemId: string;
  itemName: string;
  field: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  totalItems: number;
  validItems: number;
}

// ============================================================================
// Budget Items Validation
// ============================================================================

/**
 * Required fields for BudgetSpendingItem
 */
const REQUIRED_BUDGET_FIELDS: (keyof BudgetSpendingItem)[] = [
  "id",
  "name",
  "amount",
  "tier",
  "fiscalYear",
  "source",
  "description",
];

/**
 * Valid tier values for budget items
 */
const VALID_TIERS = ["department", "program", "current-event"] as const;

/**
 * Validates a single budget item
 */
function validateBudgetItem(item: BudgetSpendingItem): ValidationError[] {
  const errors: ValidationError[] = [];
  const itemId = item.id || "unknown";
  const itemName = item.name || "Unknown Item";

  // Check required fields
  for (const field of REQUIRED_BUDGET_FIELDS) {
    const value = item[field];
    if (value === undefined || value === null || value === "") {
      errors.push({
        itemId,
        itemName,
        field,
        message: `Missing required field: ${field}`,
        severity: "error",
      });
    }
  }

  // Validate amount is a positive number
  if (typeof item.amount !== "number") {
    errors.push({
      itemId,
      itemName,
      field: "amount",
      message: `Amount must be a number, got: ${typeof item.amount}`,
      severity: "error",
    });
  } else if (item.amount <= 0) {
    errors.push({
      itemId,
      itemName,
      field: "amount",
      message: `Amount must be positive, got: ${item.amount}`,
      severity: "error",
    });
  } else if (!Number.isFinite(item.amount)) {
    errors.push({
      itemId,
      itemName,
      field: "amount",
      message: `Amount must be a finite number, got: ${item.amount}`,
      severity: "error",
    });
  }

  // Validate tier value
  if (
    item.tier &&
    !VALID_TIERS.includes(item.tier as (typeof VALID_TIERS)[number])
  ) {
    errors.push({
      itemId,
      itemName,
      field: "tier",
      message: `Invalid tier value: ${item.tier}. Must be one of: ${VALID_TIERS.join(", ")}`,
      severity: "error",
    });
  }

  // Validate fiscalYear is a reasonable year
  if (typeof item.fiscalYear === "number") {
    if (item.fiscalYear < 2000 || item.fiscalYear > 2100) {
      errors.push({
        itemId,
        itemName,
        field: "fiscalYear",
        message: `Fiscal year ${item.fiscalYear} seems unreasonable (expected 2000-2100)`,
        severity: "warning",
      });
    }
  }

  // Validate id format (should be a non-empty string)
  if (typeof item.id === "string" && item.id.length > 0) {
    if (!/^[a-z0-9-]+$/.test(item.id)) {
      errors.push({
        itemId,
        itemName,
        field: "id",
        message: `ID should be lowercase with hyphens only, got: ${item.id}`,
        severity: "warning",
      });
    }
  }

  return errors;
}

/**
 * Validates all budget items
 * @returns ValidationResult with errors and warnings
 */
export function validateBudgetItems(): ValidationResult {
  const allErrors: ValidationError[] = [];
  const seenIds = new Map<string, number>();
  let validItems = 0;

  // Validate each item
  ALL_BUDGET_ITEMS.forEach((item, i) => {
    const itemErrors = validateBudgetItem(item);

    if (itemErrors.length === 0) {
      validItems++;
    }

    allErrors.push(...itemErrors);

    // Track duplicate IDs
    if (item.id) {
      const existingIndex = seenIds.get(item.id);
      if (existingIndex !== undefined) {
        allErrors.push({
          itemId: item.id,
          itemName: item.name || "Unknown",
          field: "id",
          message: `Duplicate ID found at indices ${existingIndex} and ${i}`,
          severity: "error",
        });
      } else {
        seenIds.set(item.id, i);
      }
    }
  });

  // Separate errors and warnings
  const errors = allErrors.filter((e) => e.severity === "error");
  const warnings = allErrors.filter((e) => e.severity === "warning");

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    totalItems: ALL_BUDGET_ITEMS.length,
    validItems,
  };
}

// ============================================================================
// Comparison Units Validation
// ============================================================================

/**
 * Required fields for ComparisonUnit
 */
const REQUIRED_UNIT_FIELDS: (keyof ComparisonUnit)[] = [
  "id",
  "name",
  "category",
];

/**
 * Valid category values for comparison units
 */
const VALID_CATEGORIES = [
  "infrastructure",
  "everyday",
  "vehicles",
  "buildings",
  "misc",
  "food",
  "entertainment",
  "products",
  "transportation",
  "salary",
  "healthcare",
  "education",
  "general",
  "housing",
  "environment",
  "public-services",
  "income",
  "veterans",
] as const;

/**
 * Validates a single comparison unit
 */
function validateComparisonUnit(unit: ComparisonUnit): ValidationError[] {
  const errors: ValidationError[] = [];
  const itemId = unit.id || "unknown";
  const itemName = unit.name || "Unknown Unit";

  // Check required fields
  for (const field of REQUIRED_UNIT_FIELDS) {
    const value = unit[field];
    if (value === undefined || value === null || value === "") {
      errors.push({
        itemId,
        itemName,
        field,
        message: `Missing required field: ${field}`,
        severity: "error",
      });
    }
  }

  // Validate that at least one cost field is present
  const hasCost = unit.costPerUnit !== undefined || unit.cost !== undefined;
  if (!hasCost) {
    errors.push({
      itemId,
      itemName,
      field: "costPerUnit/cost",
      message: "Unit must have either costPerUnit or cost defined",
      severity: "error",
    });
  }

  // Validate cost is a positive number
  const costValue = unit.costPerUnit ?? unit.cost;
  if (costValue !== undefined) {
    if (typeof costValue !== "number") {
      errors.push({
        itemId,
        itemName,
        field: "cost",
        message: `Cost must be a number, got: ${typeof costValue}`,
        severity: "error",
      });
    } else if (costValue <= 0) {
      errors.push({
        itemId,
        itemName,
        field: "cost",
        message: `Cost must be positive, got: ${costValue}`,
        severity: "error",
      });
    } else if (!Number.isFinite(costValue)) {
      errors.push({
        itemId,
        itemName,
        field: "cost",
        message: `Cost must be a finite number, got: ${costValue}`,
        severity: "error",
      });
    }
  }

  // Validate category value
  if (
    unit.category &&
    !VALID_CATEGORIES.includes(
      unit.category as (typeof VALID_CATEGORIES)[number],
    )
  ) {
    errors.push({
      itemId,
      itemName,
      field: "category",
      message: `Invalid category value: ${unit.category}. Must be one of: ${VALID_CATEGORIES.join(", ")}`,
      severity: "error",
    });
  }

  // Validate id format (should be a non-empty string)
  if (typeof unit.id === "string" && unit.id.length > 0) {
    if (!/^[a-z0-9-]+$/.test(unit.id)) {
      errors.push({
        itemId,
        itemName,
        field: "id",
        message: `ID should be lowercase with hyphens only, got: ${unit.id}`,
        severity: "warning",
      });
    }
  }

  // Validate period if present
  const validPeriods = ["year", "month", "day", "unit"];
  if (unit.period && !validPeriods.includes(unit.period)) {
    errors.push({
      itemId,
      itemName,
      field: "period",
      message: `Invalid period value: ${unit.period}. Must be one of: ${validPeriods.join(", ")}`,
      severity: "error",
    });
  }

  return errors;
}

/**
 * Validates all comparison units
 * @returns ValidationResult with errors and warnings
 */
export function validateComparisonUnits(): ValidationResult {
  const allErrors: ValidationError[] = [];
  const seenIds = new Map<string, number>();
  let validItems = 0;

  // Validate each unit
  ALL_COMPARISON_UNITS.forEach((unit, i) => {
    const unitErrors = validateComparisonUnit(unit);

    if (unitErrors.length === 0) {
      validItems++;
    }

    allErrors.push(...unitErrors);

    // Track duplicate IDs
    if (unit.id) {
      const existingIndex = seenIds.get(unit.id);
      if (existingIndex !== undefined) {
        allErrors.push({
          itemId: unit.id,
          itemName: unit.name || "Unknown",
          field: "id",
          message: `Duplicate ID found at indices ${existingIndex} and ${i}`,
          severity: "error",
        });
      } else {
        seenIds.set(unit.id, i);
      }
    }
  });

  // Separate errors and warnings
  const errors = allErrors.filter((e) => e.severity === "error");
  const warnings = allErrors.filter((e) => e.severity === "warning");

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    totalItems: ALL_COMPARISON_UNITS.length,
    validItems,
  };
}

// ============================================================================
// Combined Validation
// ============================================================================

/**
 * Validates all data (budget items and comparison units)
 */
export function validateAllData(): {
  budgetItems: ValidationResult;
  comparisonUnits: ValidationResult;
  isValid: boolean;
} {
  const budgetItems = validateBudgetItems();
  const comparisonUnits = validateComparisonUnits();

  return {
    budgetItems,
    comparisonUnits,
    isValid: budgetItems.isValid && comparisonUnits.isValid,
  };
}

/**
 * Logs validation results to console
 */
export function logValidationResults(
  result: ValidationResult,
  label: string,
): void {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`${label} Validation Results`);
  console.log("=".repeat(60));
  console.log(`Total items: ${result.totalItems}`);
  console.log(`Valid items: ${result.validItems}`);
  console.log(`Errors: ${result.errors.length}`);
  console.log(`Warnings: ${result.warnings.length}`);
  console.log(`Status: ${result.isValid ? "PASSED" : "FAILED"}`);

  if (result.errors.length > 0) {
    console.log("\nErrors:");
    for (const error of result.errors) {
      console.log(`  - [${error.itemId}] ${error.itemName}: ${error.message}`);
    }
  }

  if (result.warnings.length > 0) {
    console.log("\nWarnings:");
    for (const warning of result.warnings) {
      console.log(
        `  - [${warning.itemId}] ${warning.itemName}: ${warning.message}`,
      );
    }
  }
}

// ============================================================================
// Run Validation (if executed directly)
// ============================================================================

// This will run when the file is imported or executed
const budgetResult = validateBudgetItems();
const unitResult = validateComparisonUnits();

logValidationResults(budgetResult, "Budget Items");
logValidationResults(unitResult, "Comparison Units");

console.log("\n" + "=".repeat(60));
console.log("Overall Validation Summary");
console.log("=".repeat(60));
console.log(`Budget Items: ${budgetResult.isValid ? "PASSED" : "FAILED"}`);
console.log(`Comparison Units: ${unitResult.isValid ? "PASSED" : "FAILED"}`);
console.log(
  `Overall: ${budgetResult.isValid && unitResult.isValid ? "PASSED" : "FAILED"}`,
);
