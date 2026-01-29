# Comparison Components

This directory contains components for displaying budget comparisons that translate dollar amounts into tangible, real-world units.

## Components

### ComparisonResult

Large, animated display of a comparison result showing how a budget amount translates to real-world units.

**Location:** `src/components/comparison/ComparisonResult.tsx`

**Features:**

- Animated number counting using Framer Motion
- Responsive typography with large, readable numbers
- Shows calculation breakdown
- Displays unit category and description
- Intersection Observer triggers animation when scrolled into view
- Smooth spring physics for number animation

**Props:**

```typescript
interface ComparisonResultProps {
  result: ComparisonResult;
  budgetItemName?: string; // Optional budget item name for display
}
```

**Example Usage:**

```tsx
import { ComparisonResult } from "@/components/comparison/ComparisonResult";
import type { ComparisonResult as ComparisonResultType } from "@/types/comparison";

const result: ComparisonResultType = {
  unitCount: 15384.6,
  formatted: "$1,000,000,000 = 15,384.6 Tesla Model 3s",
  unit: {
    id: "tesla-model-3",
    name: "Tesla Model 3s",
    nameSingular: "Tesla Model 3",
    costPerUnit: 65000,
    category: "vehicles",
    description: "Average price of a Tesla Model 3 electric vehicle",
  },
  dollarAmount: 1000000000,
};

<ComparisonResult
  result={result}
  budgetItemName="Department of Defense Budget"
/>;
```

**Display Format:**

```
[Budget Item Name]
$1,000,000,000
=
15,384.6
Tesla Model 3s

Calculation:
$1,000,000,000 ÷ $65,000.00/unit = 15,384.6 units

[Unit Description]
[Category Badge]
```

### ComparisonCard

Simple card display for featured comparisons in a carousel.

**Location:** `src/components/comparison/ComparisonCard.tsx`

## Type Definitions

All comparison types are defined in `src/types/comparison.ts`:

- `ComparisonResult` - Result of a comparison calculation
- `ComparisonUnit` - A real-world unit for comparison
- `FeaturedComparison` - Extended comparison with headline and metadata

## Animation Details

### Number Counter Animation

The ComparisonResult component uses Framer Motion's `useMotionValue` and `useSpring` to create a smooth counting animation:

1. Initial state: Number shows 0
2. On scroll into view: Triggers animation
3. Spring physics: Numbers smoothly count up to final value
4. Duration: ~1-2 seconds with damping
5. Format: Numbers formatted with proper thousand separators and decimal places

### Staggered Entrance

Elements animate in sequence:

1. Budget item name (0.1s delay)
2. Dollar amount (0.2s delay)
3. Equals sign (0.3s delay)
4. Unit count with animation (0.4s delay)
5. Divider line (0.5s delay)
6. Calculation explanation (0.6s delay)
7. Description and category (0.7s delay)

## Styling

Uses shadcn/ui components and Tailwind CSS with responsive breakpoints:

- Mobile: Base font sizes
- Tablet (md): Increased sizes
- Desktop (lg): Maximum sizes for impact

Color scheme:

- Primary: Large numbers and amounts
- Foreground: Text content
- Muted foreground: Labels and descriptions
- Secondary: Category badges
- Border: Divider lines
