# Skeleton Components Documentation

## Overview

Three loading skeleton components have been created to provide visual feedback while data is loading. All components use shadcn/ui's `Skeleton` component with pulse animation.

## Created Files

### 1. BudgetTreemapSkeleton

**Location:** `/Users/andyd/code/1-Web-Apps/BudgetDashboard/src/components/budget/BudgetTreemapSkeleton.tsx`

**Purpose:** Animated skeleton matching the treemap visualization layout

**Features:**

- Grid-based layout simulating treemap boxes
- Variable box sizes (large, medium, small) matching typical budget proportions
- Responsive design with proper spacing
- Pulse animation on all elements

**Usage:**

```tsx
import { BudgetTreemapSkeleton } from "@/components/budget";

function BudgetView() {
  const { data, isLoading } = useBudgetData();

  if (isLoading) {
    return <BudgetTreemapSkeleton />;
  }

  return <BudgetTreemap data={data} />;
}
```

---

### 2. ComparisonCardSkeleton

**Location:** `/Users/andyd/code/1-Web-Apps/BudgetDashboard/src/components/comparison/ComparisonCardSkeleton.tsx`

**Purpose:** Skeleton matching the comparison card layout

**Features:**

- Uses shadcn/ui Card components for structure
- Mimics title, description, value, visual representation, and source citation
- Includes icon/image placeholder (16x16 rounded)
- Progress bar-style visual elements

**Usage:**

```tsx
import { ComparisonCardSkeleton } from "@/components/comparison";

function ComparisonList() {
  const { comparisons, isLoading } = useComparisons();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComparisonCardSkeleton />
        <ComparisonCardSkeleton />
        <ComparisonCardSkeleton />
      </div>
    );
  }

  return comparisons.map((c) => <ComparisonCard key={c.id} comparison={c} />);
}
```

---

### 3. DrillDownSkeleton

**Location:** `/Users/andyd/code/1-Web-Apps/BudgetDashboard/src/components/budget/DrillDownSkeleton.tsx`

**Purpose:** Full page skeleton for drill-down views

**Features:**

- Complete page structure skeleton including:
  - Breadcrumb navigation
  - Page title and key statistics (3 stat blocks)
  - Main treemap visualization area (500px height)
  - Spotlight/info panels (2-column grid on desktop)
  - Sub-items table with header and 5 rows
- Fully responsive layout
- Comprehensive visual feedback for entire page load

**Usage:**

```tsx
import { DrillDownSkeleton } from "@/components/budget";

export default async function BudgetDetailPage({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;

  return (
    <Suspense fallback={<DrillDownSkeleton />}>
      <BudgetDetail path={path} />
    </Suspense>
  );
}
```

---

## Export Structure

All skeleton components are exported from their respective index files:

### Budget Components Index

`/Users/andyd/code/1-Web-Apps/BudgetDashboard/src/components/budget/index.ts`

```ts
export { BudgetTreemapSkeleton } from "./BudgetTreemapSkeleton";
export { DrillDownSkeleton } from "./DrillDownSkeleton";
export { PercentageBar } from "./PercentageBar";
```

### Comparison Components Index

`/Users/andyd/code/1-Web-Apps/BudgetDashboard/src/components/comparison/index.ts`

```ts
export { ComparisonCardSkeleton } from "./ComparisonCardSkeleton";
export { UnitSelector } from "./UnitSelector";
```

### Main Components Index

`/Users/andyd/code/1-Web-Apps/BudgetDashboard/src/components/index.ts`

All skeletons are re-exported from the main components index for convenient access:

```ts
// Budget Components
export { BudgetTreemapSkeleton } from "./budget/BudgetTreemapSkeleton";
export { DrillDownSkeleton } from "./budget/DrillDownSkeleton";

// Comparison Components
export { ComparisonCardSkeleton } from "./comparison/ComparisonCardSkeleton";
```

---

## Design Principles

1. **Accurate Layout Matching**: Each skeleton closely matches the structure and proportions of its corresponding component
2. **Consistent Animation**: All use the same pulse animation from shadcn/ui Skeleton component
3. **Responsive Design**: Skeletons adapt to different screen sizes using Tailwind responsive utilities
4. **Semantic Structure**: Uses proper HTML structure and Tailwind classes for maintainability
5. **Accessibility**: Skeletons are purely visual (no ARIA required for loading states)

---

## Technical Details

### Dependencies

- `@/components/ui/skeleton` - shadcn/ui Skeleton component
- `@/components/ui/card` - For ComparisonCardSkeleton structure
- `@/lib/utils` - cn() utility for class merging

### Styling

- All skeletons use Tailwind CSS for styling
- Default skeleton appearance: gray background (`bg-accent`) with pulse animation
- Rounded corners matching component design
- Proper spacing using Tailwind spacing scale

### TypeScript

- All components are fully typed
- Optional `className` prop for custom styling
- No type errors in strict mode

---

## Next Steps

When implementing data loading:

1. **Server Components (Recommended)**:

   ```tsx
   import { Suspense } from "react";
   import { BudgetTreemapSkeleton } from "@/components/budget";

   export default function Page() {
     return (
       <Suspense fallback={<BudgetTreemapSkeleton />}>
         <AsyncBudgetComponent />
       </Suspense>
     );
   }
   ```

2. **Client Components**:

   ```tsx
   'use client';

   import { ComparisonCardSkeleton } from '@/components/comparison';

   export function ComparisonDisplay() {
     const { data, isLoading } = useQuery(...);

     if (isLoading) {
       return <ComparisonCardSkeleton />;
     }

     return <ComparisonCard data={data} />;
   }
   ```

3. **Multiple Instances**:
   ```tsx
   {
     isLoading
       ? Array.from({ length: 3 }).map((_, i) => (
           <ComparisonCardSkeleton key={i} />
         ))
       : data.map((item) => <ComparisonCard key={item.id} data={item} />);
   }
   ```
