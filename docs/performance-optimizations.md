# Performance Optimizations - HomePageClient

## Overview

The HomePageClient component and its child modules have been optimized for better initial load performance and runtime efficiency through React memoization techniques and code splitting.

## Optimizations Applied

### 1. Code Splitting & Lazy Loading

**File:** `/src/components/home/HomePageClient.tsx`

- **BudgetOverviewModule** - Lazy loaded (below-the-fold component)
- **StatsBar** - Lazy loaded (below-the-fold component)

These components are loaded only when needed, reducing the initial JavaScript bundle size. The pie chart visualization (D3.js/Recharts) is particularly heavy, so deferring its load improves Time to Interactive (TTI).

```tsx
const BudgetOverviewModule = lazy(() =>
  import("@/components/modules").then((mod) => ({
    default: mod.BudgetOverviewModule,
  })),
);

const StatsBar = lazy(() =>
  import("@/components/modules").then((mod) => ({
    default: mod.StatsBar,
  })),
);
```

**Loading State:** Custom spinner fallback provides visual feedback during lazy load.

### 2. React.memo for Component Memoization

All components in the tree have been wrapped with `React.memo` to prevent unnecessary re-renders:

- **HomePageClient** - Parent component
- **PageLayout** - Layout wrapper
- **ComparisonBuilderModule** - Main interactive module
- **ExamplesSidebar** - Sidebar examples
- **BudgetOverviewModule** - Pie chart section
- **StatsBar** - Stats display
- **SecondaryContent** - Wrapper for lazy-loaded modules

**Impact:** Components only re-render when their props actually change, not when parent state unrelated to them updates.

### 3. useCallback for Event Handlers

All callback functions have been memoized with `useCallback` to prevent recreation on every render:

**HomePageClient:**

```tsx
const handleSelectionChange = useCallback(
  (budgetItemId: string, unitId: string) => {
    setSelectedBudgetItemId(budgetItemId);
    setSelectedUnitId(unitId);
  },
  [],
);
```

**ComparisonBuilderModule:**

```tsx
const handleBudgetItemChange = useCallback(
  (id: string) => {
    setSelectedBudgetItemId(id);
    onSelectionChange?.(id, selectedUnitId);
  },
  [onSelectionChange, selectedUnitId],
);
```

**Impact:** Prevents child components from re-rendering due to prop reference changes.

### 4. useMemo for Computed Values

Expensive calculations are now memoized:

**ComparisonBuilderModule:**

```tsx
// Unit lookup map
const unitMap = useMemo(() => {
  const map = new Map<string, ComparisonUnit>();
  ALL_COMPARISON_UNITS.forEach((unit) => map.set(unit.id, unit));
  return map;
}, []);

// Selected budget item
const selectedBudgetItem = useMemo(
  () =>
    budgetItems.find((item) => item.id === selectedBudgetItemId) || {
      id: DEFAULT_BUDGET_ITEM.id,
      name: DEFAULT_BUDGET_ITEM.name,
      amount: DEFAULT_BUDGET_ITEM.amount,
    },
  [budgetItems, selectedBudgetItemId],
);

// Comparison calculation
const comparison = useMemo(
  () =>
    selectedUnit
      ? calculateComparison(selectedBudgetItem.amount, selectedUnit)
      : null,
  [selectedBudgetItem.amount, selectedUnit],
);
```

**Impact:** Avoids redundant array searches, object creation, and comparison calculations on every render.

### 5. Optimized Data Structures

**Map instead of Array.find():**

```tsx
const unitMap = useMemo(() => {
  const map = new Map<string, ComparisonUnit>();
  ALL_COMPARISON_UNITS.forEach((unit) => map.set(unit.id, unit));
  return map;
}, []);
```

**Impact:** O(1) lookup time instead of O(n) for unit lookups.

## Performance Metrics Expected

### Initial Load

- **Reduced bundle size:** ~50-100KB reduction in initial JS (pie chart code lazy loaded)
- **Faster TTI:** Interactive elements load first, heavy visualizations defer
- **Better FCP/LCP:** Critical content renders faster

### Runtime Performance

- **Fewer re-renders:** React.memo prevents cascade re-renders
- **Faster updates:** Memoized callbacks prevent prop change detection
- **Optimized calculations:** useMemo avoids redundant computations

## Files Modified

```
src/components/home/HomePageClient.tsx
src/components/modules/ComparisonBuilderModule.tsx
src/components/modules/BudgetOverviewModule.tsx
src/components/modules/ExamplesSidebar.tsx
src/components/modules/StatsBar.tsx
src/components/layout/PageLayout.tsx
```

## Testing Recommendations

1. **Bundle Analysis:** Run `pnpm build` and check bundle sizes in `.next/static`
2. **Lighthouse:** Measure FCP, LCP, TTI before/after
3. **React DevTools Profiler:** Verify components only re-render when necessary
4. **Network Tab:** Confirm lazy chunks load on demand

## Future Optimizations

1. **Preload Critical CSS:** Inline critical styles for above-the-fold content
2. **Image Optimization:** Ensure all images use Next.js Image component
3. **Prefetch Routes:** Use `next/link` prefetch for common navigation paths
4. **Virtual Scrolling:** If budget items list grows large, implement virtualization
5. **Web Workers:** Move heavy calculations (e.g., comparison engine) to background thread

## Notes

- All optimizations maintain 100% backward compatibility
- No API changes to component interfaces
- TypeScript strict mode still passes
- Existing functionality preserved
