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
  nameSingular: string;

  /** Cost per unit in dollars */
  costPerUnit: number;

  /** Category for grouping units */
  category: 'infrastructure' | 'everyday' | 'vehicles' | 'buildings' | 'misc';

  /** Short description */
  description?: string;

  /** Icon name or emoji */
  icon?: string;
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
