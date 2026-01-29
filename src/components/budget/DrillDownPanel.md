# DrillDownPanel Component

## Overview

The `DrillDownPanel` component displays a sortable table view of child budget items, enabling users to navigate through the budget hierarchy. Each row shows the item's name, formatted amount, visual percentage bar, and year-over-year change indicator.

## Features

- **Sortable Columns**: Click column headers to sort by name, amount, or YoY change
- **Visual Percentage Bars**: Animated bars showing relative size within parent
- **YoY Change Indicators**: Color-coded badges with detailed tooltips
- **Spotlight Indicators**: Optional sparkle icons for items with editorial content
- **Keyboard Navigation**: Full keyboard support (Enter/Space to drill down)
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Proper ARIA labels and semantic HTML

## Usage

```tsx
import { DrillDownPanel } from "@/components/budget";
import { BudgetItem } from "@/types/budget";

function MyBudgetView() {
  const handleDrillDown = (item: BudgetItem) => {
    // Navigate to child items or update state
    console.log("Drilling into:", item.name);
  };

  const checkSpotlight = (item: BudgetItem) => {
    // Return true if item has spotlight content
    return spotlightIds.includes(item.id);
  };

  return (
    <DrillDownPanel
      items={childBudgetItems}
      parentItem={currentItem}
      onItemClick={handleDrillDown}
      hasSpotlights={checkSpotlight}
    />
  );
}
```

## Props

| Prop            | Type                            | Required | Description                                       |
| --------------- | ------------------------------- | -------- | ------------------------------------------------- |
| `items`         | `BudgetItem[]`                  | Yes      | Array of child budget items to display            |
| `parentItem`    | `BudgetItem`                    | No       | Parent item for context (shows header with total) |
| `onItemClick`   | `(item: BudgetItem) => void`    | Yes      | Callback when user clicks/selects an item         |
| `hasSpotlights` | `(item: BudgetItem) => boolean` | No       | Function to check if item has spotlight content   |

## Behavior

### Sorting

- **Default Sort**: Amount descending (largest first)
- **Toggle Behavior**: Clicking the same column header toggles between ascending/descending
- **Sort Indicator**: Arrow icon rotates to show current direction
- **Null Handling**: Items with null values sort to the end

### Percentage Calculation

Percentages are calculated based on:

- Parent item amount (if `parentItem` is provided)
- Sum of all items (if no parent provided)

### YoY Change Display

- **Positive**: Green background with up arrow
- **Negative**: Red background with down arrow
- **Neutral** (<1%): Gray background with minus icon
- **Null**: Shows "N/A" text
- **Tooltip**: Hover to see previous and current amounts

### Spotlight Indicators

If `hasSpotlights` function is provided:

- Shows amber sparkle icon next to items with spotlights
- Tooltip indicates "Spotlight available"
- Helps users find items with editorial context

## Styling

The component uses:

- **shadcn/ui** Table components
- **Tailwind CSS** for styling
- **Custom animations** for percentage bars
- **Focus states** for accessibility

## Example Data

```typescript
const items: BudgetItem[] = [
  {
    id: "army",
    name: "Department of the Army",
    amount: 185_000_000_000,
    parentId: "dept-defense",
    fiscalYear: 2024,
    percentOfParent: 22.0,
    yearOverYearChange: 2.5,
  },
  // ... more items
];

const parentItem: BudgetItem = {
  id: "dept-defense",
  name: "Department of Defense",
  amount: 842_000_000_000,
  parentId: null,
  fiscalYear: 2024,
  percentOfParent: null,
  yearOverYearChange: 3.2,
};
```

## Integration

This component is designed to work with:

- **BudgetTreemap**: Primary visualization (click → drill down panel)
- **BudgetBreadcrumb**: Navigation context (shows current path)
- **SpotlightPanel**: Editorial content for highlighted items
- **Budget Store**: Zustand state management for navigation

## Accessibility

- Uses semantic `<table>` structure
- Sortable headers are `<button>` elements
- Rows have `role="button"` and `tabIndex={0}`
- Keyboard navigation with Enter/Space
- ARIA labels on icons and progress bars
- Tooltips provide additional context

## Performance

- Sorts items client-side (efficient for <1000 items)
- Percentage bars use CSS transitions (hardware accelerated)
- Memoization potential for large datasets (add `useMemo` for sorted items)

## Related Components

- `PercentageBar`: Visual progress indicator
- `YearOverYearIndicator`: Change badge with tooltip
- `SpotlightPanel`: Editorial content display
- `BudgetBreadcrumb`: Hierarchical navigation

## Testing

See `docs/component-examples/DrillDownPanel.example.tsx` for interactive examples and usage patterns.
