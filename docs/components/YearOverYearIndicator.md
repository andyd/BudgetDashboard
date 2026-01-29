# YearOverYearIndicator Component

## Overview

The `YearOverYearIndicator` component displays year-over-year percentage changes with color-coded arrow indicators and a tooltip showing actual dollar amounts.

## Location

`/Users/andyd/code/1-Web-Apps/BudgetDashboard/src/components/budget/YearOverYearIndicator.tsx`

## Features

- **Visual Indicators**:
  - Green up arrow (ArrowUp) for increases (≥1%)
  - Red down arrow (ArrowDown) for decreases (≤-1%)
  - Gray minus (Minus) for neutral changes (<1%)

- **Compact Display**: Inline badge-style component with icon and percentage
- **Tooltip**: Hover to see previous and current dollar amounts
- **Auto-calculation**: Automatically calculates previous amount if not provided
- **Accessibility**: Proper ARIA labels and semantic HTML

## Props

```typescript
interface YearOverYearIndicatorProps {
  /** Percentage change (e.g., 5.2 for +5.2%, -3.1 for -3.1%) */
  change: number;

  /** Previous year amount in dollars (will be calculated if not provided) */
  previousAmount?: number;

  /** Current year amount in dollars */
  currentAmount: number;
}
```

## Usage Examples

### With Previous Amount

```tsx
import { YearOverYearIndicator } from "@/components/budget/YearOverYearIndicator";

<YearOverYearIndicator
  change={5.2}
  previousAmount={500000000}
  currentAmount={526000000}
/>;
```

### Auto-calculate Previous Amount

If you only have the current amount and the percentage change, the component will automatically calculate the previous amount:

```tsx
<YearOverYearIndicator change={5.2} currentAmount={526000000} />
```

### Real-world Example from BudgetItemCard

```tsx
{
  item.yearOverYearChange !== null && previousAmount !== null && (
    <YearOverYearIndicator
      change={item.yearOverYearChange}
      previousAmount={previousAmount}
      currentAmount={item.amount}
    />
  );
}
```

## Visual States

### Increase (+5.2%)

- Green background (`bg-green-50`)
- Green text (`text-green-600`)
- Up arrow icon

### Decrease (-3.1%)

- Red background (`bg-red-50`)
- Red text (`text-red-600`)
- Down arrow icon

### Neutral (0.5%)

- Gray background (`bg-gray-100`)
- Gray text (`text-gray-500`)
- Minus icon

## Tooltip Content

When hovering over the indicator, a tooltip displays:

```
Previous: $500,000,000
Current:  $526,000,000
```

Dollar amounts are formatted using `Intl.NumberFormat` with:

- Currency: USD
- No decimal places
- Comma separators

## Implementation Details

### Previous Amount Calculation

If `previousAmount` is not provided, it's calculated using:

```typescript
previousAmount = currentAmount / (1 + change / 100);
```

For example:

- Current: $526,000,000
- Change: +5.2%
- Previous: $526,000,000 / 1.052 = $500,000,000

### Neutral Threshold

Changes less than 1% in absolute value are considered neutral:

```typescript
const isNeutral = Math.abs(change) < 1;
```

This prevents minor fluctuations from showing red/green indicators.

## Dependencies

- `lucide-react`: Icon components (ArrowUp, ArrowDown, Minus)
- `@/components/ui/tooltip`: shadcn/ui Tooltip components

## Demo Page

A demo page is available at `/demo-yoy` showing various usage examples:

`/Users/andyd/code/1-Web-Apps/BudgetDashboard/src/app/demo-yoy/page.tsx`

To view: `pnpm dev` and navigate to `http://localhost:3000/demo-yoy`

## Design System Alignment

- Uses Tailwind CSS utility classes
- Follows shadcn/ui design patterns
- Compact inline display for easy integration
- Consistent with project color scheme (green for positive, red for negative)

## Accessibility

- `role="status"` for screen readers
- `aria-label` describing the change
- `aria-hidden="true"` on decorative icons
- Keyboard-accessible tooltip trigger
