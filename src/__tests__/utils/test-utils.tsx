/**
 * Test Utilities
 *
 * React Testing Library utilities with providers and mock factories
 * for testing Budget Dashboard components
 */

import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { BudgetItem, LineItem, Program, Agency, Department } from '@/types/budget';
import {
  Comparison,
  ComparisonUnit,
  FeaturedComparison,
  ComparisonResult
} from '@/types/comparison';

/**
 * All providers wrapper for testing
 * Add any global providers here (Theme, Router, etc.)
 */
interface AllProvidersProps {
  children: ReactNode;
}

function AllProviders({ children }: AllProvidersProps) {
  // Add providers as needed (e.g., ThemeProvider, QueryClientProvider)
  // For now, just return children as this project uses Zustand (no provider needed)
  return <>{children}</>;
}

/**
 * Custom render function that wraps components with all necessary providers
 *
 * @example
 * ```tsx
 * const { getByRole } = renderWithProviders(<MyComponent />);
 * ```
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

/**
 * Mock BudgetItem factory
 * Creates a minimal valid BudgetItem for testing
 *
 * @example
 * ```tsx
 * const item = mockBudgetItem({ name: 'Defense', amount: 800_000_000_000 });
 * ```
 */
export function mockBudgetItem(
  overrides: Partial<BudgetItem> = {}
): BudgetItem {
  return {
    id: `budget-item-${Date.now()}-${Math.random()}`,
    name: 'Test Budget Item',
    amount: 1_000_000,
    parentId: null,
    fiscalYear: 2024,
    percentOfParent: null,
    yearOverYearChange: null,
    ...overrides,
  };
}

/**
 * Mock LineItem factory
 * Creates a minimal valid LineItem (most granular budget level)
 *
 * @example
 * ```tsx
 * const lineItem = mockLineItem({
 *   description: 'Office Supplies',
 *   amount: 50_000
 * });
 * ```
 */
export function mockLineItem(
  overrides: Partial<LineItem> = {}
): LineItem {
  return {
    id: `line-item-${Date.now()}-${Math.random()}`,
    name: 'Test Line Item',
    amount: 100_000,
    parentId: 'program-1',
    fiscalYear: 2024,
    percentOfParent: 5,
    yearOverYearChange: 2.5,
    description: 'Test line item description',
    source: 'USAspending.gov',
    lastUpdated: new Date('2024-01-01'),
    ...overrides,
  };
}

/**
 * Mock Program factory
 * Creates a minimal valid Program with line items
 *
 * @example
 * ```tsx
 * const program = mockProgram({
 *   name: 'Space Exploration',
 *   lineItems: [mockLineItem(), mockLineItem()]
 * });
 * ```
 */
export function mockProgram(
  overrides: Partial<Program> = {}
): Program {
  return {
    id: `program-${Date.now()}-${Math.random()}`,
    name: 'Test Program',
    amount: 500_000,
    parentId: 'agency-1',
    fiscalYear: 2024,
    percentOfParent: 10,
    yearOverYearChange: 3.2,
    lineItems: [],
    ...overrides,
  };
}

/**
 * Mock Agency factory
 * Creates a minimal valid Agency with programs
 *
 * @example
 * ```tsx
 * const agency = mockAgency({
 *   name: 'NASA',
 *   programs: [mockProgram(), mockProgram()]
 * });
 * ```
 */
export function mockAgency(
  overrides: Partial<Agency> = {}
): Agency {
  return {
    id: `agency-${Date.now()}-${Math.random()}`,
    name: 'Test Agency',
    amount: 5_000_000,
    parentId: 'department-1',
    fiscalYear: 2024,
    percentOfParent: 20,
    yearOverYearChange: 1.8,
    programs: [],
    ...overrides,
  };
}

/**
 * Mock Department factory
 * Creates a minimal valid Department (top-level category)
 *
 * @example
 * ```tsx
 * const dept = mockDepartment({
 *   name: 'Defense',
 *   amount: 800_000_000_000,
 *   agencies: [mockAgency(), mockAgency()]
 * });
 * ```
 */
export function mockDepartment(
  overrides: Partial<Department> = {}
): Department {
  return {
    id: `department-${Date.now()}-${Math.random()}`,
    name: 'Test Department',
    amount: 50_000_000,
    parentId: null,
    fiscalYear: 2024,
    percentOfParent: null,
    yearOverYearChange: 2.1,
    agencies: [],
    ...overrides,
  };
}

/**
 * Mock ComparisonUnit factory
 * Creates a minimal valid comparison unit
 *
 * @example
 * ```tsx
 * const unit = mockUnit({
 *   name: 'Starbucks Latte',
 *   costPerUnit: 5.95,
 *   category: 'food'
 * });
 * ```
 */
export function mockUnit(
  overrides: Partial<ComparisonUnit> = {}
): ComparisonUnit {
  return {
    id: `unit-${Date.now()}-${Math.random()}`,
    name: 'Test Unit',
    costPerUnit: 10.00,
    category: 'products',
    source: undefined,
    sourceUrl: undefined,
    ...overrides,
  };
}

/**
 * Mock Comparison factory
 * Creates a minimal valid comparison between budget item and unit
 *
 * @example
 * ```tsx
 * const comparison = mockComparison({
 *   budgetAmount: 1_000_000,
 *   unitId: 'latte-id',
 *   unitCount: 168_067  // 1M / 5.95
 * });
 * ```
 */
export function mockComparison(
  overrides: Partial<Comparison> = {}
): Comparison {
  const budgetAmount = overrides.budgetAmount ?? 1_000_000;
  const unitId = overrides.unitId ?? 'unit-1';
  const unitCount = overrides.unitCount ?? 100_000;

  return {
    id: `comparison-${Date.now()}-${Math.random()}`,
    budgetItemId: 'budget-item-1',
    budgetAmount,
    unitId,
    unitCount,
    createdAt: new Date('2024-01-01'),
    ...overrides,
  };
}

/**
 * Mock FeaturedComparison factory
 * Creates a comparison with featured display properties
 *
 * @example
 * ```tsx
 * const featured = mockFeaturedComparison({
 *   headline: 'The Pentagon spends enough to buy 50 million lattes per day',
 *   isFeatured: true,
 *   displayOrder: 1
 * });
 * ```
 */
export function mockFeaturedComparison(
  overrides: Partial<FeaturedComparison> = {}
): FeaturedComparison {
  const baseComparison = mockComparison(overrides);

  return {
    ...baseComparison,
    headline: 'Featured Comparison Headline',
    isFeatured: true,
    displayOrder: 1,
    ...overrides,
  };
}

/**
 * Mock ComparisonResult factory
 * Creates a denormalized comparison result for display
 *
 * @example
 * ```tsx
 * const result = mockComparisonResult({
 *   budgetItemName: 'Coffee Budget',
 *   unitName: 'Lattes',
 *   unitCount: 150
 * });
 * ```
 */
export function mockComparisonResult(
  overrides: Partial<ComparisonResult> = {}
): ComparisonResult {
  const budgetItemName = overrides.budgetItemName ?? 'Test Budget Item';
  const unitName = overrides.unitName ?? 'Test Units';
  const unitCount = overrides.unitCount ?? 100;

  return {
    budgetItemName,
    budgetAmount: 1_000_000,
    unitName,
    unitCount,
    formattedString: `${budgetItemName} equals ${unitCount.toLocaleString()} ${unitName}`,
    category: 'products',
    ...overrides,
  };
}

/**
 * Helper to create a complete budget hierarchy for testing
 * Creates Department -> Agency -> Program -> LineItem structure
 *
 * @example
 * ```tsx
 * const hierarchy = createMockBudgetHierarchy();
 * expect(hierarchy.department.agencies[0].programs[0].lineItems).toHaveLength(2);
 * ```
 */
export function createMockBudgetHierarchy() {
  const lineItem1 = mockLineItem({
    id: 'line-1',
    name: 'Line Item 1',
    amount: 50_000,
    parentId: 'program-1',
  });

  const lineItem2 = mockLineItem({
    id: 'line-2',
    name: 'Line Item 2',
    amount: 50_000,
    parentId: 'program-1',
  });

  const program = mockProgram({
    id: 'program-1',
    name: 'Test Program',
    amount: 100_000,
    parentId: 'agency-1',
    lineItems: [lineItem1, lineItem2],
  });

  const agency = mockAgency({
    id: 'agency-1',
    name: 'Test Agency',
    amount: 100_000,
    parentId: 'department-1',
    programs: [program],
  });

  const department = mockDepartment({
    id: 'department-1',
    name: 'Test Department',
    amount: 100_000,
    parentId: null,
    agencies: [agency],
  });

  return {
    department,
    agency,
    program,
    lineItem1,
    lineItem2,
  };
}

/**
 * Helper to wait for async state updates in tests
 * Useful when testing Zustand stores or async operations
 *
 * @example
 * ```tsx
 * await waitForNextUpdate();
 * expect(store.getState().isLoading).toBe(false);
 * ```
 */
export const waitForNextUpdate = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

/**
 * Re-export everything from React Testing Library for convenience
 * Note: userEvent should be imported directly from '@testing-library/user-event'
 * when needed, as re-exporting causes module resolution issues in some environments.
 *
 * @example
 * ```tsx
 * import { renderWithProviders, screen } from '@/__tests__/utils';
 * import userEvent from '@testing-library/user-event';
 *
 * const user = userEvent.setup();
 * await user.click(screen.getByRole('button'));
 * ```
 */
export * from '@testing-library/react';
