# Migration Guide: Adding Loading States to Existing Pages

This guide shows how to migrate existing pages to use the new module skeleton loaders.

## Quick Migration Checklist

- [ ] Add Suspense boundaries around async components
- [ ] Use module-specific skeletons as fallbacks
- [ ] Create `loading.tsx` at route level
- [ ] Test loading states with throttled network
- [ ] Add Error Boundaries for robustness

---

## Before & After Examples

### Example 1: Homepage

#### Before (No Loading States)

```tsx
// app/page.tsx
import { ComparisonBuilderModule } from "@/components/modules";

export default async function HomePage() {
  // This blocks rendering until data is fetched
  const budgetItems = await getBudgetItems();

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-10">
        <ComparisonBuilderModule
          budgetItems={budgetItems}
          lastUpdated={new Date()}
        />
      </section>
    </div>
  );
}
```

**Problems:**

- No loading feedback to user
- Entire page blocks until data loads
- Poor perceived performance
- Layout shift when content appears

#### After (With Loading States)

**Option A: Using Suspense Wrapper**

```tsx
// app/page.tsx
import { ComparisonBuilderModuleWithSuspense } from "@/components/modules";

export default async function HomePage() {
  const budgetItems = await getBudgetItems();

  return (
    <div className="min-h-screen bg-slate-950">
      <section className="container mx-auto px-4 py-10">
        {/* Automatic loading state with skeleton */}
        <ComparisonBuilderModuleWithSuspense
          budgetItems={budgetItems}
          lastUpdated={new Date()}
        />
      </section>
    </div>
  );
}
```

**Option B: Using loading.tsx (Recommended)**

```tsx
// app/page.tsx
import { ComparisonBuilderModule } from "@/components/modules";

export default async function HomePage() {
  const budgetItems = await getBudgetItems();

  return (
    <div className="min-h-screen bg-slate-950">
      <section className="container mx-auto px-4 py-10">
        <ComparisonBuilderModule
          budgetItems={budgetItems}
          lastUpdated={new Date()}
        />
      </section>
    </div>
  );
}

// app/loading.tsx (NEW FILE)
import { ComparisonBuilderModuleSkeleton } from "@/components/modules";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950">
      <section className="container mx-auto px-4 py-10">
        <ComparisonBuilderModuleSkeleton />
      </section>
    </div>
  );
}
```

**Benefits:**

- Immediate visual feedback
- Progressive rendering
- No layout shift
- Better UX with skeleton matching exact layout

---

### Example 2: Multi-Module Page

#### Before

```tsx
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const budgetItems = await getBudgetItems();
  const budgetData = await getBudgetHierarchy();
  const stats = await getStats();

  return (
    <div>
      <StatsBar {...stats} />
      <ComparisonBuilderModule
        budgetItems={budgetItems}
        lastUpdated={new Date()}
      />
      <BudgetOverviewModule budgetData={budgetData} />
    </div>
  );
}
```

**Problems:**

- All data must load before any content shows
- Slow queries block fast queries
- No parallel data fetching
- Poor waterfall performance

#### After

```tsx
// app/dashboard/page.tsx
import { Suspense } from "react";
import {
  StatsBar,
  StatsBarSkeleton,
  ComparisonBuilderModule,
  ComparisonBuilderModuleSkeleton,
  BudgetOverviewModule,
  BudgetOverviewModuleSkeleton,
} from "@/components/modules";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Stats load fast, show first */}
      <Suspense fallback={<StatsBarSkeleton />}>
        <StatsBarAsync />
      </Suspense>

      {/* Comparison builder loads in parallel */}
      <Suspense fallback={<ComparisonBuilderModuleSkeleton />}>
        <ComparisonBuilderAsync />
      </Suspense>

      {/* Budget overview might be slow, doesn't block others */}
      <Suspense fallback={<BudgetOverviewModuleSkeleton />}>
        <BudgetOverviewAsync />
      </Suspense>
    </div>
  );
}

async function StatsBarAsync() {
  const stats = await getStats(); // Fast query
  return <StatsBar {...stats} />;
}

async function ComparisonBuilderAsync() {
  const budgetItems = await getBudgetItems(); // Medium query
  return (
    <ComparisonBuilderModule
      budgetItems={budgetItems}
      lastUpdated={new Date()}
    />
  );
}

async function BudgetOverviewAsync() {
  const budgetData = await getBudgetHierarchy(); // Slow query
  return <BudgetOverviewModule budgetData={budgetData} />;
}
```

**Benefits:**

- Each section loads independently
- Fast content shows immediately
- Slow content doesn't block fast content
- Better perceived performance
- Parallel data fetching

---

### Example 3: Nested Routes

#### Before

```tsx
// app/budget/[id]/page.tsx
export default async function BudgetDetailPage({ params }) {
  const budgetItem = await getBudgetItem(params.id);
  const comparisons = await getComparisons(params.id);

  return (
    <div>
      <h1>{budgetItem.name}</h1>
      <ComparisonGrid comparisons={comparisons} />
    </div>
  );
}
```

#### After

```tsx
// app/budget/[id]/page.tsx
import { ComparisonGrid } from "@/components/comparison";

export default async function BudgetDetailPage({ params }) {
  const budgetItem = await getBudgetItem(params.id);
  const comparisons = await getComparisons(params.id);

  return (
    <div>
      <h1>{budgetItem.name}</h1>
      <ComparisonGrid comparisons={comparisons} />
    </div>
  );
}

// app/budget/[id]/loading.tsx (NEW FILE)
import { Skeleton } from "@/components/ui/skeleton";
import { GridSkeleton } from "@/components/ui/Skeletons";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="mb-8 h-12 w-64 bg-slate-800" />
      <GridSkeleton count={6} columns={3} cardType="comparison" />
    </div>
  );
}
```

---

## Step-by-Step Migration Process

### Step 1: Identify Async Data Fetching

Find all `await` calls in your page component:

```tsx
// Look for these patterns
const data = await fetchData();
const result = await apiCall();
```

### Step 2: Separate Fast and Slow Queries

Profile your data fetching to understand what's fast and what's slow:

```tsx
// Fast (< 100ms): Static data, cached data
const units = await getComparisonUnits(); // Cached

// Medium (100-500ms): Database queries with indexes
const budgetItems = await getBudgetItems(); // Indexed query

// Slow (> 500ms): Complex aggregations, external APIs
const budgetData = await getBudgetHierarchy(); // Complex join
```

### Step 3: Add Suspense Boundaries

Wrap each async section in Suspense with matching skeleton:

```tsx
import { Suspense } from "react";
import { ModuleSkeleton } from "@/components/modules";

<Suspense fallback={<ModuleSkeleton />}>
  <AsyncComponent />
</Suspense>;
```

### Step 4: Create loading.tsx

Add route-level loading state:

```bash
touch app/your-route/loading.tsx
```

### Step 5: Test Loading States

Use Chrome DevTools Network throttling:

1. Open DevTools
2. Network tab
3. Throttling: "Slow 3G"
4. Reload page
5. Verify skeletons appear before content

### Step 6: Measure Improvement

Compare before/after metrics:

- **TTFB** (Time to First Byte)
- **FCP** (First Contentful Paint)
- **LCP** (Largest Contentful Paint)
- **CLS** (Cumulative Layout Shift) - should be 0 with proper skeletons

---

## Common Patterns

### Pattern 1: Static + Dynamic Content

```tsx
// Static header, dynamic content
export default function Page() {
  return (
    <div>
      {/* Static - renders immediately */}
      <header>
        <h1>Budget Dashboard</h1>
      </header>

      {/* Dynamic - streams in */}
      <Suspense fallback={<Skeleton />}>
        <AsyncContent />
      </Suspense>
    </div>
  );
}
```

### Pattern 2: Waterfall Prevention

```tsx
// BAD: Sequential loading
async function Page() {
  const a = await fetchA(); // Waits
  const b = await fetchB(); // Then waits
  return (
    <div>
      {a} {b}
    </div>
  );
}

// GOOD: Parallel loading
function Page() {
  return (
    <div>
      <Suspense fallback={<SkeletonA />}>
        <AsyncA />
      </Suspense>
      <Suspense fallback={<SkeletonB />}>
        <AsyncB />
      </Suspense>
    </div>
  );
}
```

### Pattern 3: Dependent Data

```tsx
// When data depends on other data
export default async function Page({ params }) {
  // Parent data must load first
  const budget = await getBudget(params.id);

  return (
    <div>
      <h1>{budget.name}</h1>

      {/* Child data streams in */}
      <Suspense fallback={<Skeleton />}>
        <BudgetDetails budgetId={budget.id} />
      </Suspense>
    </div>
  );
}

async function BudgetDetails({ budgetId }: { budgetId: string }) {
  const details = await getBudgetDetails(budgetId);
  return <div>{/* render details */}</div>;
}
```

---

## Troubleshooting

### Problem: Skeleton doesn't match content

**Solution:** Update skeleton to match exact component structure

```tsx
// Make sure dimensions match
<Skeleton className="h-[400px]" /> // Match parent height
```

### Problem: Layout shift when content loads

**Solution:** Ensure skeleton has same dimensions as content

```tsx
// Skeleton
<div className="h-64 w-full rounded-xl" />

// Component
<div className="h-64 w-full rounded-xl" />
```

### Problem: Loading state flashes briefly

**Solution:** Add minimum loading delay or use startTransition

```tsx
import { startTransition } from "react";

// Delay state updates
startTransition(() => {
  setData(newData);
});
```

### Problem: Loading state never resolves

**Solution:** Check async component for errors

```tsx
// Add error boundary
<ErrorBoundary fallback={<ErrorMessage />}>
  <Suspense fallback={<Skeleton />}>
    <AsyncComponent />
  </Suspense>
</ErrorBoundary>
```

---

## Migration Checklist

For each page you migrate:

- [ ] Profile data fetching performance
- [ ] Identify fast vs slow queries
- [ ] Add Suspense boundaries
- [ ] Create matching skeletons
- [ ] Add loading.tsx file
- [ ] Test with network throttling
- [ ] Add error boundaries
- [ ] Measure performance improvement
- [ ] Document any custom patterns
- [ ] Update related tests

---

## Resources

- [Module Components README](./README.md)
- [Usage Examples](./USAGE_EXAMPLES.md)
- [Next.js Loading UI Docs](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [React Suspense Docs](https://react.dev/reference/react/Suspense)
