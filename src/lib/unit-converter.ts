/**
 * Unit Converter for Budget Comparisons
 * Converts budget amounts into tangible units (teacher salaries, healthcare premiums, etc.)
 */

import type { Unit, Comparison, BudgetItem } from '@/types';

/**
 * Pre-defined comparison units with real-world costs
 */
export const COMPARISON_UNITS: Unit[] = [
  {
    id: 'teacher-salary',
    name: 'Teacher Salary',
    pluralName: 'Teacher Salaries',
    cost: 65000,
    period: 'year',
    category: 'salary',
    source: 'Bureau of Labor Statistics',
    sourceUrl: 'https://www.bls.gov',
  },
  {
    id: 'health-insurance-individual',
    name: 'Health Insurance Premium (Individual)',
    pluralName: 'Health Insurance Premiums (Individual)',
    cost: 8500,
    period: 'year',
    category: 'healthcare',
    source: 'Kaiser Family Foundation',
    sourceUrl: 'https://www.kff.org',
  },
  {
    id: 'health-insurance-family',
    name: 'Health Insurance Premium (Family)',
    pluralName: 'Health Insurance Premiums (Family)',
    cost: 22000,
    period: 'year',
    category: 'healthcare',
    source: 'Kaiser Family Foundation',
    sourceUrl: 'https://www.kff.org',
  },
  {
    id: 'insulin-monthly',
    name: 'Monthly Insulin Cost',
    pluralName: 'Monthly Insulin Supplies',
    cost: 300,
    period: 'month',
    category: 'healthcare',
    source: 'HHS',
    sourceUrl: 'https://www.hhs.gov',
  },
  {
    id: 'school-lunch',
    name: 'School Lunch',
    pluralName: 'School Lunches',
    cost: 3.5,
    period: 'unit',
    category: 'education',
    source: 'USDA',
    sourceUrl: 'https://www.usda.gov',
  },
  {
    id: 'section-8-voucher',
    name: 'Section 8 Housing Voucher',
    pluralName: 'Section 8 Housing Vouchers',
    cost: 1200,
    period: 'month',
    category: 'housing',
    source: 'HUD',
    sourceUrl: 'https://www.hud.gov',
  },
  {
    id: 'median-household-income',
    name: 'Median Household Income',
    pluralName: 'Median Household Incomes',
    cost: 75000,
    period: 'year',
    category: 'general',
    source: 'US Census Bureau',
    sourceUrl: 'https://www.census.gov',
  },
  {
    id: 'college-tuition',
    name: 'Public College Tuition (Annual)',
    pluralName: 'Public College Tuitions (Annual)',
    cost: 10560,
    period: 'year',
    category: 'education',
    source: 'College Board',
    sourceUrl: 'https://www.collegeboard.org',
  },
];

/**
 * Converts a budget amount to a number of units
 */
export function convertBudgetToUnits(
  budgetAmount: number,
  unit: Unit
): number {
  const unitCostPerYear = normalizeUnitCostToYear(unit);
  return Math.floor(budgetAmount / unitCostPerYear);
}

/**
 * Normalizes unit cost to annual basis for consistent comparison
 */
function normalizeUnitCostToYear(unit: Unit): number {
  switch (unit.period) {
    case 'year':
      return unit.cost;
    case 'month':
      return unit.cost * 12;
    case 'day':
      return unit.cost * 365;
    case 'unit':
      return unit.cost;
  }
}

/**
 * Creates a human-readable formula string
 */
export function createFormula(
  budgetAmount: number,
  unit: Unit,
  result: number
): string {
  const formattedBudget = formatCurrency(budgetAmount);
  const formattedUnitCost = formatCurrency(unit.cost);
  const formattedResult = formatNumber(result);

  const periodText =
    unit.period === 'unit' ? '' : `/${unit.period}`;

  return `${formattedBudget} ÷ ${formattedUnitCost}${periodText} = ${formattedResult} ${result === 1 ? unit.name : unit.pluralName}`;
}

/**
 * Creates a comparison object from a budget item and unit
 */
export function createComparison(
  budgetItem: BudgetItem,
  unit: Unit
): Omit<Comparison, 'id' | 'createdAt' | 'updatedAt'> {
  const result = convertBudgetToUnits(budgetItem.amount, unit);
  const formula = createFormula(budgetItem.amount, unit, result);

  return {
    budgetItemId: budgetItem.id,
    budgetItemName: budgetItem.name,
    budgetAmount: budgetItem.amount,
    unitId: unit.id,
    unitName: unit.name,
    unitCost: unit.cost,
    result,
    formula,
    isFeatured: false,
  };
}

/**
 * Formats a number as currency (billions or millions)
 */
export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  } else if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  } else if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`;
  } else {
    return `$${amount.toFixed(0)}`;
  }
}

/**
 * Formats a large number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Gets a unit by ID
 */
export function getUnitById(id: string): Unit | undefined {
  return COMPARISON_UNITS.find((unit) => unit.id === id);
}

/**
 * Gets all units in a specific category
 */
export function getUnitsByCategory(category: string): Unit[] {
  return COMPARISON_UNITS.filter((unit) => unit.category === category);
}

/**
 * Generates a shareable summary text for a comparison
 */
export function generateComparisonSummary(comparison: Comparison): string {
  const formattedAmount = formatCurrency(comparison.budgetAmount);
  const formattedResult = formatNumber(comparison.result);
  const unitName =
    comparison.result === 1
      ? comparison.unitName
      : COMPARISON_UNITS.find((u) => u.id === comparison.unitId)
          ?.pluralName || comparison.unitName;

  return `${comparison.budgetItemName} (${formattedAmount}) could fund ${formattedResult} ${unitName}`;
}
