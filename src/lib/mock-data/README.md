# Mock Data Directory

This directory contains mock data for the Federal Budget Dashboard application. All files are designed to be **server-component compatible** and can be safely imported in Next.js Server Components.

## Server Component Compatibility

All files in this directory:
- ✅ Use only TypeScript type imports (no runtime dependencies)
- ✅ Export pure data constants and helper functions
- ✅ Have no browser API dependencies (window, document, localStorage, etc.)
- ✅ Have no React hooks (useState, useEffect, etc.)
- ✅ Are not marked with 'use client' directive
- ✅ Can be tree-shaken by bundlers

## Files

### Core Data Files

#### `budget.ts`
- **Description**: Mock federal budget data for FY 2025 (~$6.5 trillion)
- **Exports**: `MOCK_BUDGET_DATA` - Array of `BudgetCategory` objects with nested subcategories
- **Usage**: Primary budget hierarchy data for treemap visualization and drill-down views
- **Server Safe**: ✅ Yes

#### `units.ts`
- **Description**: Comparison units for translating budget amounts into tangible references
- **Exports**:
  - `mockUnits` - Array of comparison units (e.g., "Eiffel Towers", "Teacher Salaries")
  - `getUnits(category?)` - Get units, optionally filtered by category
  - `getUnitById(id)` - Get single unit by ID
  - `getCategories()` - Get all unique categories
- **Server Safe**: ✅ Yes

#### `featured-comparisons.ts`
- **Description**: Curated editorial comparisons highlighting budget allocations
- **Exports**:
  - `SimpleFeaturedComparison` - Simplified type for mock data
  - `FEATURED_COMPARISONS` - Array of featured comparisons
  - `FEATURED_COMPARISON_CONTEXT` - Source attribution and methodology
  - `getFeaturedComparisons()` - Get sorted comparisons
  - `getRandomFeaturedComparison()` - Get random comparison
  - `getFeaturedComparisonsByBudgetItem(id)` - Filter by budget item
- **Server Safe**: ✅ Yes

#### `spotlights.ts`
- **Description**: Editorial spotlight content for high-profile budget items
- **Exports**:
  - `SpotlightContent` - Type definition
  - `SPOTLIGHT_CONTENT` - Array of spotlight articles
- **Coverage**: F-35, ICE detention, Medicare, NIH, Aircraft carriers
- **Server Safe**: ✅ Yes

#### `healthcare-spending.ts`
- **Description**: Department of Health and Human Services budget breakdown
- **Exports**:
  - `HEALTHCARE_SPENDING_DATA` - Array of healthcare programs
  - `TOTAL_HHS_SPENDING` - Total across all programs
  - `TOTAL_HEALTHCARE_BENEFICIARIES` - Total beneficiaries
  - `AVERAGE_PER_BENEFICIARY_COST` - Average cost per person
  - `SPENDING_BY_CATEGORY` - Breakdown by entitlement/discretionary/grant
  - Helper functions: `formatBillions()`, `formatPerBeneficiary()`, `getProgramByName()`
- **Server Safe**: ✅ Yes

#### `ice-spending.ts`
- **Description**: U.S. Immigration and Customs Enforcement detailed budget
- **Exports**:
  - `ICE_SPENDING_DATA` - Complete ICE budget structure for FY2025
  - `getCategoryTotal(categoryId)` - Get spending by category
  - `getYoYChangePercent(current, previous)` - Calculate year-over-year change
  - `calculateAnnualDetentionCost(avgPop, dailyCost)` - Calculate annual detention costs
- **Server Safe**: ✅ Yes

#### `defense-spending.ts`
- **Description**: Department of Defense budget breakdown (~$850B)
- **Exports**:
  - `DEFENSE_SPENDING_DATA` - Complete DoD budget structure
  - `getCategoryTotal(categoryId)` - Get spending by category
  - `getAllPrograms()` - Get all programs across categories
  - `getTopPrograms(n)` - Get top N programs by spending
  - `formatDefenseAmount(amount)` - Format currency for display
- **Server Safe**: ✅ Yes

### Index File

#### `index.ts`
- **Description**: Central export point for all mock data
- **Usage**: Import from `@/lib/mock-data` instead of individual files
- **Server Safe**: ✅ Yes

## Usage in Server Components

```typescript
// ✅ CORRECT - Import in Server Component
import { MOCK_BUDGET_DATA } from '@/lib/mock-data';
import { getFeaturedComparisons } from '@/lib/mock-data';

export default async function Page() {
  const budgetData = MOCK_BUDGET_DATA;
  const featured = getFeaturedComparisons();

  return (
    <div>
      <h1>Budget: ${budgetData[0].allocated}</h1>
      {featured.map(comp => (
        <p key={comp.budgetItemId}>{comp.headline}</p>
      ))}
    </div>
  );
}
```

## Usage in Client Components

```typescript
// ✅ CORRECT - Import in Client Component
'use client';

import { mockUnits } from '@/lib/mock-data';
import { useState } from 'react';

export function ComparisonBuilder() {
  const [selectedUnit, setSelectedUnit] = useState(mockUnits[0]);

  return (
    <select onChange={(e) => setSelectedUnit(mockUnits[e.target.selectedIndex])}>
      {mockUnits.map(unit => (
        <option key={unit.id} value={unit.id}>{unit.name}</option>
      ))}
    </select>
  );
}
```

## Type Safety

All data exports use strict TypeScript types from:
- `@/types/budget` - Budget hierarchy types
- `@/types/comparison` - Comparison and unit types

## Migration to Database

These mock data files are temporary development fixtures. In production, this data should be:
1. Stored in PostgreSQL (Drizzle ORM schema in `src/lib/schema.ts`)
2. Fetched via API routes or direct database queries
3. Updated via admin interface
4. Cached appropriately for performance

## Verification

To verify server-component compatibility, run:

```bash
npm run type-check
```

All files should compile without errors related to client-side dependencies.
