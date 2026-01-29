/**
 * Budget Comparison Type Definitions
 * Types for translating budget amounts into tangible comparisons
 */

/**
 * Unit of measurement for comparisons
 * Examples: "Eiffel Towers", "Olympic Pools", "Football Fields"
 */
export interface ComparisonUnit {
  /** Unique identifier */
  id: string;

  /** Display name (plural form) */
  name: string;

  /** Singular form of the name */
  nameSingular?: string;

  /** Plural form of the name */
  pluralName?: string;

  /** Cost per unit in dollars */
  costPerUnit?: number;

  /** Alternative cost property name */
  cost?: number;

  /** Time period for recurring costs */
  period?: "year" | "month" | "day" | "unit";

  /** Category for grouping units */
  category:
    | "infrastructure"
    | "everyday"
    | "vehicles"
    | "buildings"
    | "misc"
    | "food"
    | "entertainment"
    | "products"
    | "transportation"
    | "salary"
    | "healthcare"
    | "education"
    | "general"
    | "housing";

  /** Short description */
  description?: string;

  /** Icon name or emoji */
  icon?: string;

  /** Source attribution */
  source?: string;

  /** Source URL (legacy) */
  sourceUrl?: string;
}

/**
 * Result of a comparison calculation
 */
export interface ComparisonResult {
  /** Number of units */
  unitCount: number;

  /** Formatted display string */
  formatted: string;

  /** The unit used for comparison */
  unit: ComparisonUnit;

  /** Original dollar amount */
  dollarAmount: number;

  /** Budget item name (legacy) */
  budgetItemName?: string;

  /** Unit name (legacy) */
  unitName?: string;

  /** Formatted string (legacy) */
  formattedString?: string;

  /** Budget amount (legacy) */
  budgetAmount?: number;
}

/**
 * Featured comparison defined by editors
 */
export interface FeaturedComparison {
  /** Unique identifier */
  id: string;

  /** Budget item being compared */
  budgetItemId: string;

  /** Budget item name */
  budgetItemName: string;

  /** Budget amount */
  budgetAmount: number;

  /** Unit for comparison */
  unit: ComparisonUnit;

  /** Calculated result */
  result: ComparisonResult;

  /** Editorial headline */
  headline: string;

  /** Additional context or explanation */
  context?: string;

  /** Source attribution */
  source?: string;

  /** Display priority (higher = shown first) */
  priority: number;

  /** Whether to show in featured carousel */
  isFeatured: boolean;

  /** Creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;

  /** Alternative unit ID field (legacy) */
  unitId?: string;

  /** Unit name (legacy) */
  unitName?: string;

  /** Unit cost (legacy) */
  unitCost?: number;

  /** Unit count (legacy) */
  unitCount?: number;

  /** Formula string (legacy) */
  formula?: string;

  /** Display order (legacy) */
  displayOrder?: number;
}

/**
 * Custom comparison built by users
 */
export interface CustomComparison {
  /** Left side budget item ID */
  leftItemId: string;

  /** Right side budget item ID */
  rightItemId: string;

  /** Selected comparison unit ID */
  selectedUnitId: string;

  /** Calculated comparison result */
  result: ComparisonResult | null;
}

/**
 * Shareable comparison for social sharing
 */
export interface ShareableComparison {
  /** Unique share ID */
  id: string;

  /** Featured or custom comparison data */
  comparison: FeaturedComparison | CustomComparison;

  /** Share URL */
  shareUrl: string;

  /** Preview image URL */
  previewImageUrl?: string;

  /** Creation timestamp */
  createdAt: Date;
}

/**
 * Type alias for Comparison (legacy)
 * Use FeaturedComparison instead
 */
export type Comparison = FeaturedComparison;
