# ComparisonBuilder Component

## Overview

The `ComparisonBuilder` component provides an interactive "Compare **_ to _**" interface for creating custom budget comparisons. Users can select any budget item and compare it to real-world costs (teacher salaries, healthcare premiums, etc.) with real-time calculation results.

## Files Created

### 1. Component

- **`/Users/andyd/code/1-Web-Apps/BudgetDashboard/src/components/comparison/ComparisonBuilder.tsx`**
  - Main comparison builder component
  - Real-time calculation display
  - Preset quick-select buttons
  - Share functionality

### 2. Library Functions

- **`/Users/andyd/code/1-Web-Apps/BudgetDashboard/src/lib/unit-converter.ts`**
  - Budget-to-unit conversion logic
  - Pre-defined comparison units (8 units)
  - Currency and number formatting
  - Formula generation

### 3. Type Definitions

- **`/Users/andyd/code/1-Web-Apps/BudgetDashboard/src/types/index.ts`** (updated)
  - `Unit` interface: Comparison unit definition
  - `Comparison` interface: Comparison result
  - `BudgetItem` interface: Budget item structure

### 4. Demo Page

- **`/Users/andyd/code/1-Web-Apps/BudgetDashboard/src/app/demo-comparison/page.tsx`**
  - Live demo with sample data
  - Usage instructions
  - Integration examples

## Features

### Core Functionality

1. **Budget Item Selection**: Dropdown to select from available budget items
2. **Unit Selection**: Categorized dropdown of comparison units (salary, healthcare, education, housing, general)
3. **Real-time Results**: Instant calculation as users make selections
4. **Formula Display**: Shows the math: `$12.4B ÷ $65,000/year = 190,769 Teacher Salaries`
5. **Summary Text**: Human-readable result summary
6. **Source Citations**: Links to data sources for each unit

### Quick Presets

Three preset quick-select buttons:

- **ICE vs Healthcare**: ICE Detention vs Health Insurance Premiums
- **Defense vs Education**: Defense Department vs College Tuition
- **What could $1B buy?**: One Billion Dollars vs Teacher Salaries

### Share Functionality

- Optional `onShare` callback for sharing comparisons
- Generates shareable links
- Copy to clipboard integration

## Comparison Units

Eight pre-defined units with real-world costs:

| Unit                          | Cost    | Period | Category   | Source                     |
| ----------------------------- | ------- | ------ | ---------- | -------------------------- |
| Teacher Salary                | $65,000 | year   | salary     | Bureau of Labor Statistics |
| Health Insurance (Individual) | $8,500  | year   | healthcare | Kaiser Family Foundation   |
| Health Insurance (Family)     | $22,000 | year   | healthcare | Kaiser Family Foundation   |
| Monthly Insulin               | $300    | month  | healthcare | HHS                        |
| School Lunch                  | $3.50   | unit   | education  | USDA                       |
| Section 8 Housing Voucher     | $1,200  | month  | housing    | HUD                        |
| Median Household Income       | $75,000 | year   | general    | US Census Bureau           |
| Public College Tuition        | $10,560 | year   | education  | College Board              |

## Usage

### Basic Usage

```tsx
import { ComparisonBuilder } from "@/components/comparison/ComparisonBuilder";
import type { BudgetItem } from "@/types";

export default function MyPage() {
  const budgetItems: BudgetItem[] = [
    {
      id: "defense-department",
      name: "Department of Defense",
      amount: 816_000_000_000,
      parentId: null,
      fiscalYear: 2024,
      percentOfParent: null,
      yearOverYearChange: 3.2,
    },
    // ... more items
  ];

  return <ComparisonBuilder budgetItems={budgetItems} />;
}
```

### With Share Functionality

```tsx
import { ComparisonBuilder } from "@/components/comparison/ComparisonBuilder";
import { toast } from "sonner";

export default function MyPage() {
  const handleShare = (budgetItemId: string, unitId: string) => {
    // Save comparison to database
    // Generate shareable URL
    const shareUrl = `/compare/${budgetItemId}-${unitId}`;

    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  return <ComparisonBuilder budgetItems={budgetItems} onShare={handleShare} />;
}
```

## Props

### ComparisonBuilder

| Prop          | Type                                             | Required | Description                      |
| ------------- | ------------------------------------------------ | -------- | -------------------------------- |
| `budgetItems` | `BudgetItem[]`                                   | Yes      | Array of budget items to compare |
| `onShare`     | `(budgetItemId: string, unitId: string) => void` | No       | Callback when user clicks share  |

### BudgetItem Type

```typescript
interface BudgetItem {
  id: string; // Unique identifier
  name: string; // Display name
  amount: number; // Dollar amount
  parentId: string | null; // Parent in hierarchy
  fiscalYear: number; // Fiscal year
  percentOfParent: number | null; // Percentage of parent budget
  yearOverYearChange: number | null; // YoY change percentage
}
```

## Utility Functions

The `unit-converter.ts` library provides these exported functions:

### Core Conversion

```typescript
convertBudgetToUnits(budgetAmount: number, unit: Unit): number
// Converts a budget amount to number of units

createComparison(budgetItem: BudgetItem, unit: Unit): Omit<Comparison, 'id' | 'createdAt' | 'updatedAt'>
// Creates a complete comparison object
```

### Formatting

```typescript
formatCurrency(amount: number): string
// Formats as $1.2B, $500M, $75K, etc.

formatNumber(num: number): string
// Formats with commas: 1,234,567

createFormula(budgetAmount: number, unit: Unit, result: number): string
// Creates human-readable formula string
```

### Data Access

```typescript
getUnitById(id: string): Unit | undefined
// Retrieves a specific unit

getUnitsByCategory(category: string): Unit[]
// Retrieves all units in a category

generateComparisonSummary(comparison: Comparison): string
// Generates shareable summary text
```

## Styling

The component uses:

- **shadcn/ui components**: Card, Select, Button
- **Tailwind CSS**: Responsive layout, spacing, colors
- **Lucide icons**: Share2 icon

### Customization

To customize styling, modify classes in:

- Card header/content sections
- Select dropdowns
- Result display areas
- Share button

## Demo

Visit `/demo-comparison` to see the component in action with sample data.

The demo includes:

- Sample budget items (Defense, Medicare, Education, etc.)
- All comparison units
- Working share functionality
- Integration code examples

## Architecture Notes

### Application-Level Component

This is an **application-specific component** for the Budget Dashboard. It's tightly coupled to:

- Federal budget data structure
- Comparison unit library
- Budget visualization context

### Why Not Platform-Level?

While the comparison builder pattern could theoretically be abstracted, the specific units, calculations, and data structure are unique to this federal budget application. A truly generic comparison builder would require significantly different abstractions.

### Future Enhancements

If similar comparison functionality is needed in other projects, consider extracting:

1. Generic "A vs B" comparison UI pattern
2. Configurable unit system
3. Formula calculation engine

But for now, this lives at the application level where it can evolve with budget-specific requirements.

## Dependencies

- React 18+
- TypeScript 5+
- shadcn/ui (Select, Button, Card)
- Lucide React (icons)
- Tailwind CSS

## Next Steps

1. **Connect to Real Data**: Replace sample budget items with API calls
2. **Persistence**: Save comparisons to database when shared
3. **URL Generation**: Create shareable comparison URLs
4. **Social Sharing**: Add Twitter/Facebook share buttons
5. **More Units**: Expand the comparison units library
6. **Categories**: Add unit filtering by category
7. **Favorites**: Let users save favorite comparisons

## Related Files

- `/src/components/budget/BudgetTreemap.tsx` - Budget visualization
- `/src/stores/budget-store.ts` - Budget state management
- `/src/types/budget.ts` - Budget type definitions
- `/docs/plans/2026-01-29-federal-budget-dashboard-design.md` - Design doc
