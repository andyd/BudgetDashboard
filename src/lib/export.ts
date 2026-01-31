/**
 * Data Export Utilities
 * Functions for exporting budget and comparison data to various formats
 */

import type {
  ComparisonResult,
  ComparisonUnit,
  FeaturedComparison,
  CustomComparison,
} from "@/types/comparison";
import type { BudgetItem, BudgetCategory } from "@/types/budget";

/**
 * Supported MIME types for file downloads
 */
type MimeType = "text/csv" | "application/json" | "text/plain";

/**
 * Data record type for generic export operations
 * Objects must have string keys with serializable values
 */
type DataRecord = { [key: string]: unknown };

/**
 * Primitive value types that can be serialized to CSV
 */
type CSVValue = string | number | boolean | null | undefined | Date;

/**
 * Trigger a browser file download
 * Creates a temporary anchor element to initiate the download
 *
 * @param content - The file content as a string
 * @param filename - The desired filename with extension
 * @param mimeType - The MIME type of the content
 *
 * @example
 * downloadFile('{"data": 123}', 'export.json', 'application/json');
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: MimeType,
): void {
  // Guard for server-side rendering
  if (typeof window === "undefined" || typeof document === "undefined") {
    console.warn(
      "downloadFile: Cannot download file outside browser environment",
    );
    return;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Escape a value for CSV format
 * Handles quotes, commas, and newlines
 */
function escapeCSVValue(value: CSVValue): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "number") {
    return String(value);
  }

  const stringValue = String(value);

  // If the value contains special characters, wrap in quotes and escape internal quotes
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Flatten a nested object for CSV export
 * Converts nested properties to dot-notation keys
 *
 * @example
 * flattenObject({ a: { b: 1 } }) // { 'a.b': 1 }
 */
function flattenObject(obj: DataRecord, prefix = ""): Record<string, CSVValue> {
  const result: Record<string, CSVValue> = {};

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value === null || value === undefined) {
      result[newKey] = value;
    } else if (value instanceof Date) {
      result[newKey] = value;
    } else if (Array.isArray(value)) {
      // Convert arrays to JSON string for CSV
      result[newKey] = JSON.stringify(value);
    } else if (typeof value === "object") {
      // Recursively flatten nested objects
      const nested = flattenObject(value as DataRecord, newKey);
      Object.assign(result, nested);
    } else {
      result[newKey] = value as CSVValue;
    }
  }

  return result;
}

/**
 * Export an array of data to CSV format and trigger download
 * Automatically extracts headers from the data and handles nested objects
 *
 * @param data - Array of objects to export
 * @param filename - The filename for the download (should end with .csv)
 *
 * @example
 * exportToCSV([
 *   { name: 'Item 1', amount: 1000 },
 *   { name: 'Item 2', amount: 2000 }
 * ], 'budget-items.csv');
 */
export function exportToCSV<T extends object>(
  data: T[],
  filename: string,
): void {
  if (!data || data.length === 0) {
    console.warn("exportToCSV: No data to export");
    return;
  }

  // Flatten all objects and collect all possible headers
  const flattenedData = data.map((item) => flattenObject(item as DataRecord));
  const headerSet = new Set<string>();

  for (const item of flattenedData) {
    for (const key of Object.keys(item)) {
      headerSet.add(key);
    }
  }

  const headers = Array.from(headerSet).sort();

  // Build CSV content
  const headerRow = headers.map(escapeCSVValue).join(",");

  const dataRows = flattenedData.map((item) =>
    headers.map((header) => escapeCSVValue(item[header])).join(","),
  );

  const csvContent = [headerRow, ...dataRows].join("\n");

  // Ensure filename has .csv extension
  const finalFilename = filename.endsWith(".csv")
    ? filename
    : `${filename}.csv`;

  downloadFile(csvContent, finalFilename, "text/csv");
}

/**
 * Export data to JSON format and trigger download
 * Pretty-prints the JSON with 2-space indentation
 *
 * @param data - Any data structure to export
 * @param filename - The filename for the download (should end with .json)
 *
 * @example
 * exportToJSON({ budgetItems: [...], metadata: {...} }, 'budget-data.json');
 */
export function exportToJSON<T>(data: T, filename: string): void {
  if (data === undefined) {
    console.warn("exportToJSON: No data to export");
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);

  // Ensure filename has .json extension
  const finalFilename = filename.endsWith(".json")
    ? filename
    : `${filename}.json`;

  downloadFile(jsonContent, finalFilename, "application/json");
}

/**
 * Formatted comparison data for export
 */
export interface ExportedComparison {
  /** Title or headline of the comparison */
  title: string;
  /** The spending item name */
  spendingItem: string;
  /** The dollar amount being compared */
  dollarAmount: number;
  /** Formatted dollar amount string */
  formattedAmount: string;
  /** The comparison unit name */
  unitName: string;
  /** Cost per unit */
  unitCost: number | null;
  /** Number of units the amount equals */
  unitCount: number;
  /** Formatted comparison string */
  comparisonText: string;
  /** Unit category */
  category: string | null;
  /** Source attribution */
  source: string | null;
  /** Export timestamp */
  exportedAt: string;
}

/**
 * Format a dollar amount for display
 */
function formatDollarAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a comparison for export
 * Extracts and normalizes data from FeaturedComparison or CustomComparison objects
 *
 * @param comparison - A featured or custom comparison object
 * @returns Normalized comparison data ready for export
 *
 * @example
 * const data = exportComparison(featuredComparison);
 * exportToJSON(data, 'my-comparison.json');
 */
export function exportComparison(
  comparison: FeaturedComparison | CustomComparison,
): ExportedComparison {
  const now = new Date().toISOString();

  // Type guard to check if it's a FeaturedComparison
  const isFeatured = (
    comp: FeaturedComparison | CustomComparison,
  ): comp is FeaturedComparison => {
    return "budgetItemName" in comp && "headline" in comp;
  };

  if (isFeatured(comparison)) {
    const result = comparison.result;
    const unit = comparison.unit;

    return {
      title: comparison.headline,
      spendingItem: comparison.budgetItemName,
      dollarAmount: comparison.budgetAmount,
      formattedAmount: formatDollarAmount(comparison.budgetAmount),
      unitName: unit.name,
      unitCost: unit.costPerUnit ?? unit.cost ?? null,
      unitCount: result.unitCount,
      comparisonText: result.formatted,
      category: unit.category,
      source: comparison.source ?? unit.source ?? null,
      exportedAt: now,
    };
  }

  // Handle CustomComparison
  const result = comparison.result;

  if (!result) {
    return {
      title: "Custom Comparison",
      spendingItem: comparison.leftItemId,
      dollarAmount: 0,
      formattedAmount: "$0",
      unitName: comparison.selectedUnitId,
      unitCost: null,
      unitCount: 0,
      comparisonText: "No result calculated",
      category: null,
      source: null,
      exportedAt: now,
    };
  }

  return {
    title: "Custom Comparison",
    spendingItem: result.budgetItemName ?? comparison.leftItemId,
    dollarAmount: result.dollarAmount,
    formattedAmount: formatDollarAmount(result.dollarAmount),
    unitName: result.unit.name,
    unitCost: result.unit.costPerUnit ?? result.unit.cost ?? null,
    unitCount: result.unitCount,
    comparisonText: result.formatted,
    category: result.unit.category,
    source: result.unit.source ?? null,
    exportedAt: now,
  };
}

/**
 * Export multiple comparisons to CSV
 *
 * @param comparisons - Array of comparisons to export
 * @param filename - The filename for the download
 */
export function exportComparisonsToCSV(
  comparisons: (FeaturedComparison | CustomComparison)[],
  filename: string,
): void {
  const exportedData = comparisons.map(exportComparison);
  exportToCSV(exportedData, filename);
}

/**
 * Export budget items to CSV with formatted data
 *
 * @param items - Array of budget items to export
 * @param filename - The filename for the download
 */
export function exportBudgetItemsToCSV(
  items: BudgetItem[],
  filename: string,
): void {
  const formattedItems = items.map((item) => ({
    id: item.id,
    name: item.name,
    amount: item.amount,
    formattedAmount: formatDollarAmount(item.amount),
    parentId: item.parentId,
    fiscalYear: item.fiscalYear,
    percentOfParent: item.percentOfParent,
    yearOverYearChange: item.yearOverYearChange,
    level: item.level ?? 0,
  }));

  exportToCSV(formattedItems, filename);
}

/**
 * Export budget categories to CSV
 *
 * @param categories - Array of budget categories to export
 * @param filename - The filename for the download
 */
export function exportBudgetCategoriesToCSV(
  categories: BudgetCategory[],
  filename: string,
): void {
  // Flatten the category hierarchy for CSV export
  const flattenCategories = (
    cats: BudgetCategory[],
    level = 0,
    parentName = "",
  ): DataRecord[] => {
    const result: DataRecord[] = [];

    for (const cat of cats) {
      result.push({
        id: cat.id,
        name: cat.name,
        parentName,
        level,
        categoryType: cat.categoryType,
        allocated: cat.allocated,
        formattedAllocated: formatDollarAmount(cat.allocated),
        spent: cat.spent,
        formattedSpent: formatDollarAmount(cat.spent),
        changeFromPriorYear: cat.changeFromPriorYear,
        description: cat.description ?? "",
      });

      if (cat.subcategories && cat.subcategories.length > 0) {
        result.push(
          ...flattenCategories(cat.subcategories, level + 1, cat.name),
        );
      }
    }

    return result;
  };

  const flatData = flattenCategories(categories);
  exportToCSV(flatData, filename);
}

/**
 * Export comparison units to CSV
 *
 * @param units - Array of comparison units to export
 * @param filename - The filename for the download
 */
export function exportComparisonUnitsToCSV(
  units: ComparisonUnit[],
  filename: string,
): void {
  const formattedUnits = units.map((unit) => ({
    id: unit.id,
    name: unit.name,
    nameSingular: unit.nameSingular ?? "",
    category: unit.category,
    costPerUnit: unit.costPerUnit ?? unit.cost ?? "",
    period: unit.period ?? "unit",
    description: unit.description ?? "",
    source: unit.source ?? "",
  }));

  exportToCSV(formattedUnits, filename);
}
