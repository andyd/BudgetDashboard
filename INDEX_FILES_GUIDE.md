# Index Files Guide

This document describes the index files created to organize exports throughout the BudgetDashboard project.

## Overview

Index files enable cleaner, more organized imports by consolidating component and data exports into single entry points.

## Created Index Files

### 1. `/src/components/budget/index.ts`

Exports all budget-related components.

**Before:**

```typescript
import { BudgetTreemap } from "@/components/budget/BudgetTreemap";
import { BudgetBreadcrumb } from "@/components/budget/BudgetBreadcrumb";
import { SpotlightPanel } from "@/components/budget/SpotlightPanel";
```

**After:**

```typescript
import {
  BudgetTreemap,
  BudgetBreadcrumb,
  SpotlightPanel,
} from "@/components/budget";
```

**Available Exports:**

- `BudgetBreadcrumb`
- `BudgetItemCard`
- `BudgetLevelIndicator`
- `BudgetSearch`
- `BudgetTooltip`
- `BudgetTreemap`
- `BudgetTreemapSkeleton`
- `ContextualComparison`
- `DataFreshnessIndicator`
- `DrillDownPanel`
- `DrillDownSkeleton`
- `PercentageBar`
- `SpotlightPanel` (with types: `SpotlightSource`, `SpotlightPanelProps`)
- `YearOverYearIndicator`

### 2. `/src/components/comparison/index.ts`

Exports all comparison-related components.

**Before:**

```typescript
import { ComparisonCard } from "@/components/comparison/ComparisonCard";
import { ShareButton } from "@/components/comparison/ShareButton";
import { UnitSelector } from "@/components/comparison/UnitSelector";
```

**After:**

```typescript
import {
  ComparisonCard,
  ShareButton,
  UnitSelector,
} from "@/components/comparison";
```

**Available Exports:**

- `ComparisonBuilder`
- `ComparisonCard`
- `ComparisonCardSkeleton`
- `ComparisonPresets`
- `ComparisonResult`
- `FeaturedCarousel`
- `ShareButton`
- `ShareModal`
- `UnitSelector`

### 3. `/src/components/admin/index.ts`

Exports all admin dashboard components.

**Before:**

```typescript
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import AdminSidebarNav from "@/components/admin/admin-sidebar";
```

**After:**

```typescript
import { AdminDataTable, AdminSidebarNav } from "@/components/admin";
```

**Available Exports:**

- `AdminAuthForm` (default export re-exported as named)
- `AdminSidebarNav` (default export re-exported as named)
- `AdminDataTable`
- `AdminSidebar`

### 4. `/src/lib/mock-data/index.ts`

Exports all mock data for development and testing.

**Before:**

```typescript
import { MOCK_BUDGET_DATA } from "@/lib/mock-data/budget";
import { mockUnits, getUnits } from "@/lib/mock-data/units";
import { FEATURED_COMPARISONS } from "@/lib/mock-data/featured-comparisons";
import { SPOTLIGHT_CONTENT } from "@/lib/mock-data/spotlights";
```

**After:**

```typescript
import {
  MOCK_BUDGET_DATA,
  mockUnits,
  getUnits,
  FEATURED_COMPARISONS,
  SPOTLIGHT_CONTENT,
} from "@/lib/mock-data";
```

**Available Exports:**

**Budget Data:**

- `MOCK_BUDGET_DATA`

**Comparison Units:**

- `mockUnits`
- `getUnits(category?)`
- `getUnitById(id)`
- `getCategories()`

**Featured Comparisons:**

- `FEATURED_COMPARISONS`
- `FEATURED_COMPARISON_CONTEXT`
- `getFeaturedComparisons()`
- `getRandomFeaturedComparison()`
- `getFeaturedComparisonsByBudgetItem(budgetItemId)`

**Spotlight Content:**

- `SPOTLIGHT_CONTENT`
- Types: `SpotlightSource`, `SpotlightContent`

**Healthcare Spending:**

- `HEALTHCARE_SPENDING_DATA`
- `TOTAL_HHS_SPENDING`
- `TOTAL_HEALTHCARE_BENEFICIARIES`
- `AVERAGE_PER_BENEFICIARY_COST`
- `SPENDING_BY_CATEGORY`
- `formatBillions(amount)`
- `formatPerBeneficiary(cost)`
- `getProgramByName(name)`
- Types: `HealthcareProgram`, `HealthcareSubcategory`

**ICE Spending:**

- `ICE_SPENDING_DATA`
- `ICE_SPENDING_DATA_DEFAULT` (default export)
- `getCategoryTotal(categoryId)`
- `getYoYChangePercent(currentYear, previousYear)`
- `calculateAnnualDetentionCost(...)`
- Types: `ICESpendingCategory`, `ICESpendingSubcategory`, `ICEHistoricalData`, `ICESpendingData`

## Benefits

1. **Cleaner Imports**: Single-line imports for multiple components
2. **Better Organization**: Clear entry points for each module
3. **Easier Refactoring**: Internal file moves don't break imports
4. **Improved Discoverability**: All exports visible in one place
5. **Tree-Shaking Friendly**: Modern bundlers can still optimize unused exports

## Migration Guide

To update existing imports:

1. **Find and Replace Pattern:**

   ```bash
   # Example for budget components
   Find: from '@/components/budget/ComponentName'
   Replace: from '@/components/budget'
   ```

2. **Group Multiple Imports:**

   ```typescript
   // Before
   import { Component1 } from "@/components/budget/Component1";
   import { Component2 } from "@/components/budget/Component2";

   // After
   import { Component1, Component2 } from "@/components/budget";
   ```

## Examples

### Budget Page Component

```typescript
import {
  BudgetTreemap,
  BudgetBreadcrumb,
  SpotlightPanel,
  YearOverYearIndicator,
} from "@/components/budget";

import {
  MOCK_BUDGET_DATA,
  SPOTLIGHT_CONTENT,
  mockUnits,
} from "@/lib/mock-data";
```

### Comparison Feature

```typescript
import {
  ComparisonCard,
  ComparisonBuilder,
  ShareButton,
  UnitSelector,
} from "@/components/comparison";

import {
  FEATURED_COMPARISONS,
  getUnits,
  getFeaturedComparisons,
} from "@/lib/mock-data";
```

### Admin Dashboard

```typescript
import {
  AdminDataTable,
  AdminSidebar,
  AdminAuthForm,
} from "@/components/admin";
```

## Notes

- All index files preserve TypeScript types and interfaces
- Example files (`.example.tsx`) are intentionally excluded from exports
- Demo files (`*-demo.tsx`) are intentionally excluded from exports
- Both named and type exports are available where applicable
