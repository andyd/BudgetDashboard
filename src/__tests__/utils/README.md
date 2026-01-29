# Test Utilities

Comprehensive testing utilities for the Federal Budget Dashboard project.

## Overview

This directory provides:

- **test-utils.tsx**: React Testing Library setup with providers and mock factories
- **mock-data.ts**: Pre-built realistic test fixtures
- **index.ts**: Convenient re-exports

## Quick Start

```tsx
import {
  renderWithProviders,
  mockBudgetItem,
  mockComparison,
  mockUnits,
} from "@/__tests__/utils";

test("example component", () => {
  const item = mockBudgetItem({ name: "Defense", amount: 800_000_000_000 });
  const { getByText } = renderWithProviders(<MyComponent item={item} />);

  expect(getByText("Defense")).toBeInTheDocument();
});
```

## Mock Factories

Create test data on-demand with custom overrides.

### Budget Items

```tsx
// Basic budget item
const item = mockBudgetItem({
  name: "Defense",
  amount: 800_000_000_000,
});

// Line item (most granular)
const lineItem = mockLineItem({
  description: "Office supplies",
  source: "USAspending.gov",
});

// Program (collection of line items)
const program = mockProgram({
  name: "Space Exploration",
  lineItems: [mockLineItem(), mockLineItem()],
});

// Agency (collection of programs)
const agency = mockAgency({
  name: "NASA",
  programs: [program],
});

// Department (top-level)
const department = mockDepartment({
  name: "Defense",
  agencies: [agency],
});
```

### Comparisons

```tsx
// Comparison unit
const unit = mockUnit({
  name: "Starbucks Latte",
  costPerUnit: 5.95,
  category: "food",
});

// Basic comparison
const comparison = mockComparison({
  budgetAmount: 1_000_000,
  unitId: unit.id,
  unitCount: 168_067,
});

// Featured comparison with headline
const featured = mockFeaturedComparison({
  headline: "Defense budget equals 134 billion lattes",
  isFeatured: true,
  displayOrder: 1,
});

// Comparison result (denormalized for display)
const result = mockComparisonResult({
  budgetItemName: "Coffee Budget",
  unitName: "Lattes",
  unitCount: 150,
});
```

### Complete Hierarchies

```tsx
// Creates Department -> Agency -> Program -> LineItems
const hierarchy = createMockBudgetHierarchy();

console.log(hierarchy.department.name); // "Test Department"
console.log(hierarchy.agency.programs.length); // 1
console.log(hierarchy.program.lineItems.length); // 2
```

## Pre-built Fixtures

Use realistic mock data without creating it yourself.

### Budget Data

```tsx
import {
  mockDepartments,
  mockBudgetHierarchy,
  BUDGET_AMOUNTS,
} from "@/__tests__/utils";

// Use pre-built departments
const defense = mockDepartments.find((d) => d.id === "dept-defense");
console.log(defense.amount); // 800_000_000_000

// Complete budget hierarchy
console.log(mockBudgetHierarchy.totalAmount); // 6_000_000_000_000

// Constants for realistic amounts
const defenseAmount = BUDGET_AMOUNTS.DEFENSE; // 800 billion
```

### Comparison Data

```tsx
import { mockUnits, mockComparisons, UNIT_COSTS } from "@/__tests__/utils";

// Pre-built units
const latte = mockUnits.find((u) => u.id === "unit-latte");
console.log(latte.costPerUnit); // 5.95

// Pre-built comparisons
console.log(mockComparisons.length); // 2

// Constants for unit costs
const latteCost = UNIT_COSTS.COFFEE; // 5.95
```

## Rendering Components

```tsx
import { renderWithProviders, screen } from "@/__tests__/utils";
import userEvent from "@testing-library/user-event";

test("interactive component", async () => {
  const user = userEvent.setup();

  renderWithProviders(<MyComponent />);

  const button = screen.getByRole("button", { name: /submit/i });
  await user.click(button);

  expect(screen.getByText("Success")).toBeInTheDocument();
});
```

## Helper Functions

```tsx
import {
  waitForNextUpdate,
  getUnitById,
  getDepartmentById,
} from "@/__tests__/utils";

// Wait for async updates (Zustand stores)
await waitForNextUpdate();

// Find specific mock items
const latte = getUnitById("unit-latte");
const defense = getDepartmentById("dept-defense");
```

## Custom Matchers

All `@testing-library/jest-dom` matchers are available:

```tsx
expect(element).toBeInTheDocument();
expect(element).toHaveTextContent("Defense");
expect(button).toBeDisabled();
expect(input).toHaveValue("1000000");
```

## Testing Patterns

### Testing with Stores (Zustand)

```tsx
import { renderWithProviders, mockBudgetItem } from "@/__tests__/utils";
import { useBudgetStore } from "@/stores/budget-store";

test("updates store on interaction", async () => {
  const item = mockBudgetItem();

  renderWithProviders(<MyComponent />);

  // Zustand stores don't need providers - they're global
  const state = useBudgetStore.getState();
  state.setSelectedItem(item);

  await waitForNextUpdate();

  expect(useBudgetStore.getState().selectedItem).toBe(item);
});
```

### Testing Calculations

```tsx
test("calculates unit count correctly", () => {
  const comparison = mockComparison({
    budgetAmount: 1_000_000,
    unitCount: Math.floor(1_000_000 / 5.95), // 168,067 lattes
  });

  expect(comparison.unitCount).toBe(168_067);
});
```

### Testing Hierarchies

```tsx
test("navigates budget hierarchy", () => {
  const hierarchy = createMockBudgetHierarchy();

  expect(hierarchy.department.agencies).toContain(hierarchy.agency);
  expect(hierarchy.agency.programs).toContain(hierarchy.program);
  expect(hierarchy.program.lineItems).toHaveLength(2);
});
```

## Available Constants

### Budget Amounts

```tsx
BUDGET_AMOUNTS.TOTAL_FEDERAL; // $6 trillion
BUDGET_AMOUNTS.DEFENSE; // $800 billion
BUDGET_AMOUNTS.SOCIAL_SECURITY; // $1.4 trillion
BUDGET_AMOUNTS.MEDICARE; // $900 billion
BUDGET_AMOUNTS.EDUCATION; // $79 billion
BUDGET_AMOUNTS.NASA; // $25 billion
```

### Unit Costs

```tsx
UNIT_COSTS.COFFEE; // $5.95
UNIT_COSTS.NETFLIX; // $15.49
UNIT_COSTS.IPHONE; // $999
UNIT_COSTS.TESLA_MODEL_3; // $40,000
UNIT_COSTS.MEDIAN_HOME; // $412,000
UNIT_COSTS.PRIVATE_JET; // $5,000,000
```

## File Locations

```
src/__tests__/utils/
├── test-utils.tsx        # Mock factories, renderWithProviders
├── mock-data.ts          # Pre-built fixtures and constants
├── test-utils.test.tsx   # Example usage tests
├── index.ts              # Re-exports
└── README.md             # This file
```

## Import Paths

All utilities can be imported from a single path:

```tsx
import {
  // Rendering
  renderWithProviders,
  screen,

  // Mock Factories
  mockBudgetItem,
  mockComparison,
  mockUnit,

  // Fixtures
  mockDepartments,
  mockUnits,

  // Constants
  BUDGET_AMOUNTS,
  UNIT_COSTS,

  // Helpers
  waitForNextUpdate,
  getUnitById,
} from "@/__tests__/utils";

// Import userEvent separately
import userEvent from "@testing-library/user-event";
```

## Running Tests

```bash
# Run all unit tests
npm run test:unit

# Watch mode
npm run test:unit:watch

# Coverage report
npm run test:unit:coverage
```

## Adding Custom Providers

If you need to add global providers (e.g., ThemeProvider), update `AllProviders` in `test-utils.tsx`:

```tsx
function AllProviders({ children }: AllProvidersProps) {
  return (
    <ThemeProvider theme="dark">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
```
