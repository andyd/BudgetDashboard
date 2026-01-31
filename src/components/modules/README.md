# Module Components

Reusable module components for the Federal Budget Dashboard with built-in loading states and Suspense boundaries.

## Components

### Core Modules

- **StatsBar** - Statistics bar showing budget totals and counts
- **ComparisonBuilderModule** - Interactive comparison builder with budget item and unit selection
- **BudgetOverviewModule** - Budget visualization with pie chart
- **ExamplesSidebar** - Sidebar with example comparisons

### Loading Skeletons

Each module has a corresponding skeleton component that matches its layout:

- `StatsBarSkeleton`
- `ComparisonBuilderModuleSkeleton`
- `BudgetOverviewModuleSkeleton`
- `ExamplesSidebarSkeleton`

### Suspense Wrappers

Pre-configured Suspense wrappers with default loading states:

- `StatsBarWithSuspense`
- `ComparisonBuilderModuleWithSuspense`
- `BudgetOverviewModuleWithSuspense`
- `ExamplesSidebarWithSuspense`

## Usage Examples

### Basic Usage

```tsx
import { ComparisonBuilderModule } from "@/components/modules";

export default function Page() {
  const budgetItems = await getBudgetItems();

  return (
    <ComparisonBuilderModule
      budgetItems={budgetItems}
      lastUpdated={new Date()}
    />
  );
}
```

### With Custom Loading State

```tsx
import { Suspense } from "react";
import {
  ComparisonBuilderModule,
  ComparisonBuilderModuleSkeleton,
} from "@/components/modules";

export default function Page() {
  return (
    <Suspense fallback={<ComparisonBuilderModuleSkeleton />}>
      <AsyncComparisonBuilder />
    </Suspense>
  );
}

async function AsyncComparisonBuilder() {
  const budgetItems = await getBudgetItems();

  return (
    <ComparisonBuilderModule
      budgetItems={budgetItems}
      lastUpdated={new Date()}
    />
  );
}
```

### Using Pre-configured Suspense Wrappers

```tsx
import { ComparisonBuilderModuleWithSuspense } from "@/components/modules";

export default async function Page() {
  const budgetItems = await getBudgetItems();

  return (
    <ComparisonBuilderModuleWithSuspense
      budgetItems={budgetItems}
      lastUpdated={new Date()}
    />
  );
}
```

### Custom Fallback

```tsx
import { ComparisonBuilderModuleWithSuspense } from "@/components/modules";

export default function Page() {
  return (
    <ComparisonBuilderModuleWithSuspense
      budgetItems={budgetItems}
      lastUpdated={new Date()}
      fallback={<CustomLoadingComponent />}
    />
  );
}
```

### In loading.tsx Files

```tsx
// app/loading.tsx
import {
  ComparisonBuilderModuleSkeleton,
  ExamplesSidebarSkeleton,
  BudgetOverviewModuleSkeleton,
  StatsBarSkeleton,
} from "@/components/modules";

export default function Loading() {
  return (
    <div>
      <ComparisonBuilderModuleSkeleton />
      <ExamplesSidebarSkeleton />
      <BudgetOverviewModuleSkeleton />
      <StatsBarSkeleton />
    </div>
  );
}
```

## Design Principles

1. **Matching Layouts** - Skeletons precisely match the layout of their corresponding components to prevent layout shift
2. **Consistent Styling** - Uses the same spacing, borders, and background colors as real components
3. **Progressive Enhancement** - Components work with or without Suspense boundaries
4. **Composable** - Can be used independently or combined in larger layouts
5. **Flexible** - Supports custom fallbacks when needed

## Implementation Details

### Skeleton Components

Skeletons use the base `Skeleton` component from `@/components/ui/skeleton` and replicate the structure of their parent components:

```tsx
export function ComparisonBuilderModuleSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-700/50 bg-gradient-to-b from-slate-900 to-slate-900/80 p-6">
      {/* Matches exact structure of ComparisonBuilderModule */}
      <Skeleton className="h-4 w-72 bg-slate-800" />
      {/* ... */}
    </div>
  );
}
```

### Suspense Wrappers

Wrappers provide convenience for async data loading:

```tsx
export function ComparisonBuilderModuleWithSuspense({
  fallback,
  ...props
}: ComparisonBuilderModuleWithSuspenseProps) {
  return (
    <Suspense fallback={fallback || <ComparisonBuilderModuleSkeleton />}>
      <ComparisonBuilderModule {...props} />
    </Suspense>
  );
}
```

## Best Practices

1. **Use in Route Segments** - Add `loading.tsx` files at route boundaries for automatic loading states
2. **Granular Suspense** - Wrap individual async components rather than entire pages when possible
3. **Streaming** - Leverage Next.js streaming for faster initial page loads
4. **Consistent Experience** - Always use the matching skeleton for each module component

## Related Components

- See `@/components/ui/Skeletons.tsx` for additional skeleton utilities
- See `@/components/ui/skeleton.tsx` for the base Skeleton component
