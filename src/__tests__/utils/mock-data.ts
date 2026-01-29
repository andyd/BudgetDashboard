/**
 * Mock Data Fixtures
 *
 * Pre-built mock data for unit tests. These are simpler than the full
 * mock factories and provide realistic test data for common scenarios.
 */

import type {
  BudgetItem,
  LineItem,
  Program,
  Agency,
  Department,
  BudgetHierarchy,
} from '@/types/budget';
import type {
  Comparison,
  ComparisonUnit,
  FeaturedComparison,
  ComparisonResult,
} from '@/types/comparison';

/**
 * Sample comparison units representing real-world items
 */
export const mockUnits: ComparisonUnit[] = [
  {
    id: 'unit-latte',
    name: 'Starbucks Latte',
    costPerUnit: 5.95,
    category: 'food',
    source: 'Starbucks menu prices',
    sourceUrl: 'https://www.starbucks.com',
  },
  {
    id: 'unit-netflix',
    name: 'Netflix Subscription (monthly)',
    costPerUnit: 15.49,
    category: 'entertainment',
    source: 'Netflix pricing',
    sourceUrl: 'https://www.netflix.com',
  },
  {
    id: 'unit-iphone',
    name: 'iPhone 15 Pro',
    costPerUnit: 999.00,
    category: 'products',
    source: 'Apple Store',
    sourceUrl: 'https://www.apple.com',
  },
  {
    id: 'unit-tesla',
    name: 'Tesla Model 3',
    costPerUnit: 40_000.00,
    category: 'transportation',
    source: 'Tesla pricing',
    sourceUrl: 'https://www.tesla.com',
  },
  {
    id: 'unit-house',
    name: 'Median US Home',
    costPerUnit: 412_000.00,
    category: 'products',
    source: 'US Census Bureau',
    sourceUrl: 'https://www.census.gov',
  },
];

/**
 * Sample line items (most granular budget level)
 */
export const mockLineItems: LineItem[] = [
  {
    id: 'line-salaries',
    name: 'Employee Salaries',
    amount: 5_000_000,
    parentId: 'program-operations',
    fiscalYear: 2024,
    percentOfParent: 50,
    yearOverYearChange: 3.2,
    description: 'Salaries and wages for program staff',
    source: 'USAspending.gov',
    lastUpdated: new Date('2024-01-15'),
  },
  {
    id: 'line-equipment',
    name: 'Equipment & Supplies',
    amount: 2_000_000,
    parentId: 'program-operations',
    fiscalYear: 2024,
    percentOfParent: 20,
    yearOverYearChange: -1.5,
    description: 'Office equipment and operational supplies',
    source: 'USAspending.gov',
    lastUpdated: new Date('2024-01-15'),
  },
  {
    id: 'line-facilities',
    name: 'Facility Maintenance',
    amount: 3_000_000,
    parentId: 'program-operations',
    fiscalYear: 2024,
    percentOfParent: 30,
    yearOverYearChange: 5.0,
    description: 'Building maintenance and utilities',
    source: 'USAspending.gov',
    lastUpdated: new Date('2024-01-15'),
  },
];

/**
 * Sample programs (collections of line items)
 */
export const mockPrograms: Program[] = [
  {
    id: 'program-operations',
    name: 'Operations & Maintenance',
    amount: 10_000_000,
    parentId: 'agency-test',
    fiscalYear: 2024,
    percentOfParent: 40,
    yearOverYearChange: 2.5,
    lineItems: mockLineItems,
  },
  {
    id: 'program-research',
    name: 'Research & Development',
    amount: 15_000_000,
    parentId: 'agency-test',
    fiscalYear: 2024,
    percentOfParent: 60,
    yearOverYearChange: 8.3,
    lineItems: [],
  },
];

/**
 * Sample agencies (collections of programs)
 */
export const mockAgencies: Agency[] = [
  {
    id: 'agency-test',
    name: 'Test Federal Agency',
    amount: 25_000_000,
    parentId: 'dept-test',
    fiscalYear: 2024,
    percentOfParent: 100,
    yearOverYearChange: 4.7,
    programs: mockPrograms,
  },
];

/**
 * Sample departments (top-level budget categories)
 */
export const mockDepartments: Department[] = [
  {
    id: 'dept-defense',
    name: 'Department of Defense',
    amount: 800_000_000_000,
    parentId: null,
    fiscalYear: 2024,
    percentOfParent: null,
    yearOverYearChange: 2.1,
    agencies: [],
  },
  {
    id: 'dept-education',
    name: 'Department of Education',
    amount: 79_000_000_000,
    parentId: null,
    fiscalYear: 2024,
    percentOfParent: null,
    yearOverYearChange: 3.8,
    agencies: [],
  },
  {
    id: 'dept-health',
    name: 'Department of Health & Human Services',
    amount: 1_700_000_000_000,
    parentId: null,
    fiscalYear: 2024,
    percentOfParent: null,
    yearOverYearChange: 5.2,
    agencies: [],
  },
];

/**
 * Sample root budget item
 */
export const mockRootBudget: BudgetItem = {
  id: 'budget-root',
  name: 'Federal Budget FY2024',
  amount: 6_000_000_000_000, // $6 trillion
  parentId: null,
  fiscalYear: 2024,
  percentOfParent: null,
  yearOverYearChange: 3.5,
};

/**
 * Complete budget hierarchy for integration testing
 */
export const mockBudgetHierarchy: BudgetHierarchy = {
  root: mockRootBudget,
  departments: mockDepartments,
  totalAmount: 6_000_000_000_000,
  fiscalYear: 2024,
};

/**
 * Sample comparisons linking budget items to units
 */
export const mockComparisons: Comparison[] = [
  {
    id: 'comp-defense-lattes',
    budgetItemId: 'dept-defense',
    budgetAmount: 800_000_000_000,
    unitId: 'unit-latte',
    unitCount: Math.floor(800_000_000_000 / 5.95),
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'comp-education-teslas',
    budgetItemId: 'dept-education',
    budgetAmount: 79_000_000_000,
    unitId: 'unit-tesla',
    unitCount: Math.floor(79_000_000_000 / 40_000),
    createdAt: new Date('2024-01-20'),
  },
];

/**
 * Sample featured comparisons with headlines
 */
export const mockFeaturedComparisons: FeaturedComparison[] = [
  {
    id: 'featured-defense-iphones',
    budgetItemId: 'dept-defense',
    budgetAmount: 800_000_000_000,
    unitId: 'unit-iphone',
    unitCount: Math.floor(800_000_000_000 / 999),
    headline: 'Defense budget could buy 800 million iPhones',
    isFeatured: true,
    displayOrder: 1,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'featured-health-homes',
    budgetItemId: 'dept-health',
    budgetAmount: 1_700_000_000_000,
    unitId: 'unit-house',
    unitCount: Math.floor(1_700_000_000_000 / 412_000),
    headline: 'HHS budget equals 4.1 million median homes',
    isFeatured: true,
    displayOrder: 2,
    createdAt: new Date('2024-01-20'),
  },
];

/**
 * Sample comparison results (denormalized for display)
 */
export const mockComparisonResults: ComparisonResult[] = [
  {
    budgetItemName: 'Department of Defense',
    budgetAmount: 800_000_000_000,
    unitName: 'Starbucks Lattes',
    unitCount: Math.floor(800_000_000_000 / 5.95),
    formattedString:
      'Department of Defense equals 134 billion Starbucks Lattes',
    category: 'food',
  },
  {
    budgetItemName: 'Department of Education',
    budgetAmount: 79_000_000_000,
    unitName: 'Tesla Model 3s',
    unitCount: Math.floor(79_000_000_000 / 40_000),
    formattedString: 'Department of Education equals 1.9 million Tesla Model 3s',
    category: 'transportation',
  },
];

/**
 * Helper to get a unit by ID
 */
export function getUnitById(id: string): ComparisonUnit | undefined {
  return mockUnits.find((unit) => unit.id === id);
}

/**
 * Helper to get a department by ID
 */
export function getDepartmentById(id: string): Department | undefined {
  return mockDepartments.find((dept) => dept.id === id);
}

/**
 * Helper to create a custom comparison with realistic data
 */
export function createCustomComparison(
  budgetAmount: number,
  unitCost: number
): Comparison {
  return {
    id: `comp-custom-${Date.now()}`,
    budgetItemId: 'custom-item',
    budgetAmount,
    unitId: 'custom-unit',
    unitCount: Math.floor(budgetAmount / unitCost),
    createdAt: new Date(),
  };
}

/**
 * Budget amounts for common US federal spending categories (FY2024)
 * Useful for testing realistic scenarios
 */
export const BUDGET_AMOUNTS = {
  TOTAL_FEDERAL: 6_000_000_000_000, // $6 trillion
  DEFENSE: 800_000_000_000, // $800 billion
  SOCIAL_SECURITY: 1_400_000_000_000, // $1.4 trillion
  MEDICARE: 900_000_000_000, // $900 billion
  MEDICAID: 600_000_000_000, // $600 billion
  EDUCATION: 79_000_000_000, // $79 billion
  VETERANS_AFFAIRS: 300_000_000_000, // $300 billion
  TRANSPORTATION: 100_000_000_000, // $100 billion
  NASA: 25_000_000_000, // $25 billion
} as const;

/**
 * Common unit costs for testing
 * All values in USD
 */
export const UNIT_COSTS = {
  COFFEE: 5.95,
  NETFLIX: 15.49,
  IPHONE: 999.00,
  MACBOOK: 1_299.00,
  TESLA_MODEL_3: 40_000.00,
  MEDIAN_HOME: 412_000.00,
  FERRARI: 250_000.00,
  PRIVATE_JET: 5_000_000.00,
} as const;
