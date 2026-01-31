# Module Components - Usage Examples

This document provides real-world examples of using module components with proper loading states and Suspense boundaries.

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [With Suspense Boundaries](#with-suspense-boundaries)
3. [Custom Loading States](#custom-loading-states)
4. [Route-Level Loading](#route-level-loading)
5. [Streaming with Parallel Data](#streaming-with-parallel-data)
6. [Error Boundaries](#error-boundaries)

---

## Basic Usage

### Simple Component Rendering

```tsx
// app/page.tsx
import { StatsBar, ComparisonBuilderModule } from "@/components/modules";

export default async function HomePage() {
  const budgetItems = await getBudgetItems();

  return (
    <div>
      <ComparisonBuilderModule
        budgetItems={budgetItems}
        lastUpdated={new Date()}
      />
      <StatsBar
        totalBudget="$7.0T"
        budgetItemsCount="100+"
        comparisonUnitsCount="75+"
        fiscalYear={2025}
      />
    </div>
  );
}
```

---

## With Suspense Boundaries

### Using Pre-configured Wrappers

The easiest way to add loading states is using the pre-configured wrapper components:

```tsx
// app/page.tsx
import {
  ComparisonBuilderModuleWithSuspense,
  ExamplesSidebarWithSuspense,
  BudgetOverviewModuleWithSuspense,
  StatsBarWithSuspense,
} from "@/components/modules";

export default async function HomePage() {
  const budgetItems = await getBudgetItems();
  const budgetData = await getBudgetHierarchy();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main comparison module with automatic loading state */}
          <div className="lg:col-span-8">
            <ComparisonBuilderModuleWithSuspense
              budgetItems={budgetItems}
              lastUpdated={new Date()}
            />
          </div>

          {/* Sidebar with examples */}
          <div className="lg:col-span-4">
            <ExamplesSidebarWithSuspense />
          </div>
        </div>
      </section>

      {/* Budget visualization */}
      <BudgetOverviewModuleWithSuspense budgetData={budgetData} />

      {/* Statistics bar */}
      <StatsBarWithSuspense fiscalYear={2025} />
    </div>
  );
}
```

### Manual Suspense Configuration

For more control, use Suspense directly with skeleton components:

```tsx
// app/page.tsx
import { Suspense } from "react";
import {
  ComparisonBuilderModule,
  ComparisonBuilderModuleSkeleton,
  BudgetOverviewModule,
  BudgetOverviewModuleSkeleton,
} from "@/components/modules";

export default function HomePage() {
  return (
    <div>
      {/* Comparison builder */}
      <Suspense fallback={<ComparisonBuilderModuleSkeleton />}>
        <AsyncComparisonBuilder />
      </Suspense>

      {/* Budget overview */}
      <Suspense fallback={<BudgetOverviewModuleSkeleton />}>
        <AsyncBudgetOverview />
      </Suspense>
    </div>
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

async function AsyncBudgetOverview() {
  const budgetData = await getBudgetHierarchy();
  return <BudgetOverviewModule budgetData={budgetData} />;
}
```

---

## Custom Loading States

### Custom Skeleton with Branding

```tsx
// components/CustomComparisonSkeleton.tsx
import { ComparisonBuilderModuleSkeleton } from "@/components/modules";

export function CustomComparisonSkeleton() {
  return (
    <div className="relative">
      {/* Custom loading indicator */}
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-sm text-slate-400">Loading budget data...</p>
        </div>
      </div>

      {/* Use standard skeleton beneath */}
      <ComparisonBuilderModuleSkeleton />
    </div>
  );
}

// app/page.tsx
import { ComparisonBuilderModuleWithSuspense } from "@/components/modules";
import { CustomComparisonSkeleton } from "@/components/CustomComparisonSkeleton";

export default function Page() {
  return (
    <ComparisonBuilderModuleWithSuspense
      budgetItems={budgetItems}
      lastUpdated={new Date()}
      fallback={<CustomComparisonSkeleton />}
    />
  );
}
```

### Skeleton with Progress Indicator

```tsx
// components/ProgressSkeleton.tsx
import { useState, useEffect } from "react";
import { ComparisonBuilderModuleSkeleton } from "@/components/modules";

export function ProgressSkeleton() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      <div
        className="absolute left-0 top-0 h-1 bg-blue-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
      <ComparisonBuilderModuleSkeleton />
    </div>
  );
}
```

---

## Route-Level Loading

### Using loading.tsx

Next.js automatically shows `loading.tsx` while the page loads:

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
    <div className="min-h-screen bg-slate-950">
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ComparisonBuilderModuleSkeleton />
          </div>
          <div className="lg:col-span-4">
            <ExamplesSidebarSkeleton />
          </div>
        </div>
      </section>

      <BudgetOverviewModuleSkeleton />
      <StatsBarSkeleton />
    </div>
  );
}
```

### Nested Routes

For nested routes, create loading.tsx at each level:

```
app/
├── loading.tsx                 # Root loading state
├── budget/
│   ├── loading.tsx            # Budget page loading
│   ├── page.tsx
│   └── [id]/
│       ├── loading.tsx        # Budget detail loading
│       └── page.tsx
└── compare/
    ├── loading.tsx            # Compare page loading
    └── page.tsx
```

---

## Streaming with Parallel Data

### Independent Data Streams

Stream different sections independently for faster perceived load times:

```tsx
// app/page.tsx
import { Suspense } from "react";
import {
  ComparisonBuilderModule,
  ComparisonBuilderModuleSkeleton,
  ExamplesSidebar,
  ExamplesSidebarSkeleton,
  BudgetOverviewModule,
  BudgetOverviewModuleSkeleton,
  StatsBar,
  StatsBarSkeleton,
} from "@/components/modules";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Each section loads independently */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Fast-loading comparison builder */}
          <div className="lg:col-span-8">
            <Suspense fallback={<ComparisonBuilderModuleSkeleton />}>
              <ComparisonBuilderAsync />
            </Suspense>
          </div>

          {/* Examples can load separately */}
          <div className="lg:col-span-4">
            <Suspense fallback={<ExamplesSidebarSkeleton />}>
              <ExamplesSidebar />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Budget overview streams separately (might be slow) */}
      <Suspense fallback={<BudgetOverviewModuleSkeleton />}>
        <BudgetOverviewAsync />
      </Suspense>

      {/* Stats load fast */}
      <Suspense fallback={<StatsBarSkeleton />}>
        <StatsBarAsync />
      </Suspense>
    </div>
  );
}

async function ComparisonBuilderAsync() {
  const budgetItems = await getBudgetItems(); // Fast query
  return (
    <ComparisonBuilderModule
      budgetItems={budgetItems}
      lastUpdated={new Date()}
    />
  );
}

async function BudgetOverviewAsync() {
  const budgetData = await getBudgetHierarchy(); // Slower query
  return <BudgetOverviewModule budgetData={budgetData} />;
}

async function StatsBarAsync() {
  const stats = await getStats(); // Fast query
  return <StatsBar {...stats} />;
}
```

---

## Error Boundaries

### Graceful Error Handling

Combine Suspense with Error Boundaries for robust loading states:

```tsx
// app/page.tsx
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  ComparisonBuilderModule,
  ComparisonBuilderModuleSkeleton,
} from "@/components/modules";

function ComparisonErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="rounded-3xl border border-red-500/30 bg-slate-900 p-8 text-center">
      <h3 className="mb-2 text-lg font-semibold text-red-400">
        Failed to load comparison builder
      </h3>
      <p className="mb-4 text-sm text-slate-400">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        Try Again
      </button>
    </div>
  );
}

export default function HomePage() {
  return (
    <ErrorBoundary FallbackComponent={ComparisonErrorFallback}>
      <Suspense fallback={<ComparisonBuilderModuleSkeleton />}>
        <ComparisonBuilderAsync />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### Per-Module Error Handling

```tsx
// components/SafeModule.tsx
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface SafeModuleProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  errorMessage?: string;
}

export function SafeModule({
  children,
  fallback,
  errorMessage = "Failed to load component",
}: SafeModuleProps) {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div className="rounded-xl border border-red-500/30 bg-slate-900 p-6">
          <p className="text-sm text-red-400">{errorMessage}</p>
          <button
            onClick={resetErrorBoundary}
            className="mt-2 text-xs text-slate-400 hover:text-white"
          >
            Retry
          </button>
        </div>
      )}
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

// Usage
import { SafeModule } from "@/components/SafeModule";
import {
  ComparisonBuilderModule,
  ComparisonBuilderModuleSkeleton,
} from "@/components/modules";

export default function Page() {
  return (
    <SafeModule
      fallback={<ComparisonBuilderModuleSkeleton />}
      errorMessage="Unable to load comparison builder"
    >
      <ComparisonBuilderAsync />
    </SafeModule>
  );
}
```

---

## Best Practices Summary

1. **Always use Suspense** - Never render async components without boundaries
2. **Match skeletons to content** - Use the module-specific skeletons for consistency
3. **Stream independently** - Separate fast and slow data sources
4. **Handle errors gracefully** - Combine Suspense with Error Boundaries
5. **Use loading.tsx** - Leverage Next.js automatic loading states at route boundaries
6. **Progressive enhancement** - Show critical content first, defer non-critical
7. **Avoid layout shift** - Ensure skeletons match exact component dimensions

---

## Performance Tips

1. **Prefetch data** - Use Next.js prefetching for faster navigation
2. **Cache aggressively** - Cache stable data like comparison units
3. **Lazy load modules** - Split code for better initial load times
4. **Stream HTML** - Leverage Next.js streaming for faster TTI
5. **Minimize waterfalls** - Fetch parallel data in parallel components

---

## Related Documentation

- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [React Suspense](https://react.dev/reference/react/Suspense)
- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
