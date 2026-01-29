/**
 * Federal Budget Dashboard Type Definitions
 * Strict TypeScript types for hierarchical budget data
 */

/**
 * Base budget item with common properties
 */
export interface BudgetItem {
  /** Unique identifier for the budget item */
  id: string;

  /** Display name of the budget item */
  name: string;

  /** Budget amount in dollars */
  amount: number;

  /** ID of parent item in hierarchy (null for root items) */
  parentId: string | null;

  /** Fiscal year for this budget data */
  fiscalYear: number;

  /** Percentage of parent's budget (0-100, null for root items) */
  percentOfParent: number | null;

  /** Year-over-year change as percentage (null if no prior year data) */
  yearOverYearChange: number | null;
}

/**
 * Line item - most granular budget allocation
 */
export interface LineItem extends BudgetItem {
  /** Detailed description of the line item */
  description: string;

  /** Data source or reference */
  source: string;

  /** Last update timestamp */
  lastUpdated: Date;
}

/**
 * Program - collection of line items
 */
export interface Program extends BudgetItem {
  /** Line items within this program */
  lineItems: LineItem[];
}

/**
 * Agency - collection of programs
 */
export interface Agency extends BudgetItem {
  /** Programs within this agency */
  programs: Program[];
}

/**
 * Department - top-level budget category
 */
export interface Department extends BudgetItem {
  /** Agencies within this department */
  agencies: Agency[];
}

/**
 * Complete budget hierarchy structure
 */
export interface BudgetHierarchy {
  /** Root budget item (typically "Federal Budget") */
  root: BudgetItem;

  /** Top-level departments */
  departments: Department[];

  /** Total budget amount across all departments */
  totalAmount: number;

  /** Fiscal year for this hierarchy */
  fiscalYear: number;
}

/**
 * Budget item type discriminator
 */
export type BudgetItemType = 'department' | 'agency' | 'program' | 'lineItem';

/**
 * Union type for any budget item in the hierarchy
 */
export type AnyBudgetItem = Department | Agency | Program | LineItem;

/**
 * Metadata for budget data source
 */
export interface BudgetDataSource {
  /** Source name (e.g., "USAspending.gov") */
  name: string;

  /** Source URL */
  url: string;

  /** Last data refresh timestamp */
  lastRefreshed: Date;

  /** Data version or identifier */
  version: string;
}

/**
 * Filter options for budget queries
 */
export interface BudgetFilter {
  /** Filter by fiscal year(s) */
  fiscalYears?: number[];

  /** Filter by department ID(s) */
  departmentIds?: string[];

  /** Filter by minimum amount */
  minAmount?: number;

  /** Filter by maximum amount */
  maxAmount?: number;

  /** Search term for name matching */
  searchTerm?: string;
}

/**
 * Sort options for budget items
 */
export interface BudgetSort {
  /** Field to sort by */
  field: 'name' | 'amount' | 'percentOfParent' | 'yearOverYearChange';

  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * Budget category type (department, agency, program, etc.)
 */
export type CategoryType =
  | 'department'
  | 'agency'
  | 'program'
  | 'branch'
  | 'operations'
  | 'lineItem';

/**
 * Budget category with recursive subcategories
 * Alternative flatter structure for budget data
 */
export interface BudgetCategory {
  /** Unique identifier */
  id: string;

  /** Display name */
  name: string;

  /** Allocated amount in dollars */
  allocated: number;

  /** Amount spent in dollars */
  spent: number;

  /** Category type */
  categoryType: CategoryType;

  /** Optional description */
  description?: string;

  /** Year-over-year change as decimal (0.045 = 4.5% increase) */
  changeFromPriorYear?: number;

  /** Nested subcategories */
  subcategories?: BudgetCategory[];
}
