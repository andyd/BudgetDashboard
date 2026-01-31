# Tree-Shaking Analysis Report

**Date**: 2026-01-30
**Project**: Federal Budget Dashboard

## Executive Summary

Analysis of the component import structure reveals good practices overall with some opportunities for optimization. The project is already using lazy loading for heavy components, but there are specific issues with barrel exports and D3 imports that could impact bundle size.

---

## Critical Issues

### 1. D3 Library - Namespace Import

**Location**: `/src/components/budget/BudgetTreemapD3.tsx:4`

```typescript
import * as d3 from "d3";
```

**Issue**: This imports the entire D3 library (~300KB), even though only specific modules are needed.

**Impact**: HIGH - D3 is one of the largest dependencies

- Full D3 bundle: ~300KB
- Tree-shakeable selective imports: ~50-100KB (estimated based on usage)

**Fix**: Replace with specific module imports:

```typescript
// Instead of: import * as d3 from "d3";
import { select } from "d3-selection";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { hierarchy, treemap } from "d3-hierarchy";
import { format } from "d3-format";
// etc. - only import what's needed
```

**Files Affected**:

- `/src/components/budget/BudgetTreemapD3.tsx` - Uses D3 for treemap visualization

---

### 2. Barrel Export with Wildcard Re-export

**Location**: `/src/components/index.ts:108`

```typescript
export * from "./modules";
```

**Issue**: Wildcard re-exports prevent tree-shaking because bundlers can't statically analyze what's being used.

**Impact**: MEDIUM - Forces inclusion of all module components even if only one is imported

- Affects: BudgetOverviewModule, ComparisonBuilderModule, ExamplesSidebar, StatsBar

**Fix**: Replace with explicit named exports:

```typescript
// Instead of: export * from "./modules";
export {
  BudgetOverviewModule,
  ComparisonBuilderModule,
  ExamplesSidebar,
  StatsBar,
} from "./modules";
```

---

## Moderate Issues

### 3. React Namespace Imports (Multiple files)

**Locations**: 50+ component files use `import * as React from "react"`

**Issue**: While modern bundlers handle this well, direct imports are more explicit and guaranteed to tree-shake.

**Impact**: LOW-MEDIUM - React exports are usually handled well by bundlers, but explicit imports are cleaner

- Estimated savings: Minimal (5-10KB) since React core is needed anyway

**Fix** (Optional): Replace namespace imports with named imports where possible:

```typescript
// Instead of: import * as React from "react";
import { useState, useCallback, memo } from "react";
```

**Note**: This is already done correctly in many newer components. Consider updating older components over time.

**Files Affected**: See grep output for full list (50+ files)

---

## Good Practices Found

### 1. Lazy Loading Heavy Components ✅

**Location**: `/src/components/home/HomePageClient.tsx:9-19`

```typescript
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

**Benefit**: Below-the-fold components are code-split and loaded on demand

- Reduces initial bundle size
- Improves Time to Interactive (TTI)
- Proper use of Suspense with loading fallback

### 2. Framer Motion Client Wrapper ✅

**Location**: `/src/lib/framer-client.tsx`

```typescript
"use client";

export {
  motion,
  AnimatePresence,
  useMotionValue,
  // ... explicit named exports
} from "framer-motion";
```

**Benefit**:

- Centralizes framer-motion imports
- Ensures proper "use client" directive
- Allows tree-shaking of unused Framer Motion features

### 3. Proper Barrel Export Structure (Most Files) ✅

**Locations**:

- `/src/components/budget/index.ts` - All named exports
- `/src/components/comparison/index.ts` - All named exports
- `/src/components/a11y/index.ts` - Named exports with types

**Example**:

```typescript
export { BudgetBarChart } from "./BudgetBarChart";
export type { BudgetBarChartProps } from "./BudgetBarChart";
```

**Benefit**: Named exports allow bundlers to eliminate unused components

---

## Component Dependency Analysis

### Heavy Dependencies (Candidates for Lazy Loading)

| Component               | Dependencies                | Estimated Size | Currently Lazy Loaded           |
| ----------------------- | --------------------------- | -------------- | ------------------------------- |
| BudgetTreemapD3         | D3 (~300KB)                 | 320KB          | ❌ No (loaded in module)        |
| BudgetSankey            | D3-sankey, Framer Motion    | 150KB          | ❌ No                           |
| BudgetPieChart          | Recharts (~150KB)           | 160KB          | ❌ No (in BudgetOverviewModule) |
| BudgetBarChart          | Recharts                    | 155KB          | ❌ No                           |
| BudgetOverviewModule    | Recharts via BudgetPieChart | 160KB          | ✅ Yes                          |
| ComparisonBuilderModule | Minimal                     | 20KB           | ❌ No (hero component)          |

### Lazy Loading Opportunities

**High Priority** (should be lazy loaded):

1. **BudgetTreemapD3** - Heavy D3 usage, only shown on drill-down pages
   - Location: Used in budget detail pages
   - Recommendation: Lazy load in parent component

2. **BudgetSankey** - D3-sankey + animations, specialized visualization
   - Location: Specialty visualization component
   - Recommendation: Lazy load on-demand

3. **Admin Components** - Only needed for admin users
   - Location: `/src/components/admin/`
   - Recommendation: Route-level code splitting (likely already happening via Next.js)

**Medium Priority** (consider lazy loading):

1. **BudgetBarChart** - Uses Recharts, shown in multiple places
   - Trade-off: Frequently used, lazy loading may cause loading flicker
   - Recommendation: Evaluate usage patterns

2. **PrintableComparison** - Print-specific component
   - Location: `/src/components/comparison/PrintableComparison.tsx`
   - Recommendation: Only load when print button is clicked

**Low Priority** (keep eager loaded):

1. **ComparisonBuilderModule** - Hero component on homepage
2. **ExamplesSidebar** - Above-the-fold content
3. **BudgetTable** - Lightweight, frequently used

---

## Chart Library Analysis

### Current Dependencies

```json
{
  "d3": "^7.9.0", // ~300KB full, ~50-150KB selective
  "d3-hierarchy": "^3.1.2", // ~15KB
  "d3-sankey": "^0.12.3", // ~8KB
  "d3-scale": "^4.0.2", // ~12KB
  "d3-selection": "^3.0.0", // ~10KB
  "recharts": "^3.7.0", // ~150KB
  "framer-motion": "^12.29.2" // ~100KB with tree-shaking
}
```

### Optimization Opportunities

1. **D3 Main Package**: Switch to selective imports (saves ~200KB)
2. **Recharts**: Already tree-shakeable, ensure selective imports
3. **Framer Motion**: Already optimized with client wrapper

---

## Recommendations

### Immediate Actions (High Impact)

1. **Fix D3 Namespace Import** (Est. savings: ~200KB)

   ```bash
   # Edit BudgetTreemapD3.tsx
   # Replace `import * as d3 from "d3"` with specific module imports
   ```

2. **Replace Wildcard Barrel Export** (Est. savings: ~20KB)

   ```bash
   # Edit src/components/index.ts line 108
   # Replace `export * from "./modules"` with named exports
   ```

3. **Lazy Load BudgetTreemapD3** (Est. savings: ~100KB from initial bundle)
   ```typescript
   // In pages that use BudgetTreemapD3
   const BudgetTreemapD3 = lazy(
     () => import("@/components/budget/BudgetTreemapD3"),
   );
   ```

### Secondary Actions (Medium Impact)

4. **Lazy Load BudgetSankey** (Est. savings: ~150KB from initial bundle)
   - Only load when user opens Sankey visualization

5. **Lazy Load PrintableComparison** (Est. savings: ~30KB from initial bundle)
   - Load on print button click

6. **Audit Recharts Usage** (Est. savings: ~20-50KB)
   - Ensure using tree-shakeable imports: `import { PieChart, Pie } from "recharts"`
   - Verify unused Recharts components aren't bundled

### Nice-to-Have Actions (Low Impact)

7. **Standardize React Imports** (Est. savings: ~5-10KB)
   - Gradually replace `import * as React` with named imports
   - Focus on new components first

8. **Split Heavy Page Routes** (Architecture improvement)
   - Use Next.js route-based code splitting for admin pages
   - Consider parallel routes for budget visualizations

---

## Bundle Size Projections

### Current Estimated Sizes (Production Build)

| Bundle                      | Estimated Size | Notes                              |
| --------------------------- | -------------- | ---------------------------------- |
| Initial JS                  | ~450-550KB     | Including D3 full, Recharts, React |
| BudgetOverviewModule (lazy) | ~160KB         | Recharts + PieChart                |
| Other Lazy Chunks           | ~50-100KB      | Various dynamic imports            |
| **Total First Load**        | **450-550KB**  | Before optimizations               |

### After Optimizations

| Bundle                      | Optimized Size | Savings                |
| --------------------------- | -------------- | ---------------------- |
| Initial JS                  | ~250-300KB     | -200KB (D3 selective)  |
| BudgetTreemapD3 (new lazy)  | ~100KB         | Moved to lazy chunk    |
| BudgetOverviewModule (lazy) | ~160KB         | No change              |
| **Total First Load**        | **250-300KB**  | **~250KB saved (45%)** |

---

## Verification Steps

After implementing fixes:

1. **Build and Analyze Bundle**:

   ```bash
   pnpm analyze
   # Check .next/analyze/ output
   ```

2. **Check Bundle Sizes**:

   ```bash
   pnpm build
   # Review .next/static/chunks/ sizes
   ```

3. **Verify Tree-Shaking**:
   - Search build output for unused D3 modules
   - Confirm Recharts components are selectively imported
   - Check that wildcard exports are resolved

4. **Performance Testing**:

   ```bash
   # Lighthouse CI
   npx lighthouse http://localhost:3000 --view

   # Bundle analyzer
   npx @next/bundle-analyzer
   ```

---

## Additional Notes

### Next.js Automatic Optimizations

Next.js 15 with Turbopack already provides:

- Automatic code splitting per route
- Dynamic imports for lazy components
- Tree-shaking for ES modules
- Dead code elimination

### What We Can't Control

- React core bundle size (~45KB)
- Core Next.js runtime (~80KB)
- Tailwind CSS generated styles (~50KB with purging)

These are framework essentials and already optimized.

---

## Files Requiring Changes

### High Priority

1. `/src/components/budget/BudgetTreemapD3.tsx` - Fix D3 import
2. `/src/components/index.ts` - Fix wildcard export (line 108)

### Medium Priority

3. `/src/app/budget/[...path]/page.tsx` - Add lazy loading for BudgetTreemapD3
4. `/src/components/budget/BudgetSankey.tsx` - Verify D3-sankey imports, add lazy loading

### Low Priority

5. Various component files - Gradual React import standardization

---

## Conclusion

The project demonstrates good awareness of performance optimization through strategic lazy loading. The primary issues are:

1. **D3 namespace import** - Most significant issue, easy fix
2. **Wildcard barrel export** - Minor issue, easy fix
3. **Missing lazy loads** - Some heavy components could benefit from code splitting

Implementing the high-priority fixes should reduce initial bundle size by approximately **200-250KB (40-45%)**, significantly improving Time to Interactive and Core Web Vitals scores.
