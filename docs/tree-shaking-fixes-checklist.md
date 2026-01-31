# Tree-Shaking Fixes Checklist

Quick reference for implementing bundle size optimizations.

## High Priority Fixes

### ✅ Fix 1: D3 Namespace Import

**File**: `/src/components/budget/BudgetTreemapD3.tsx:4`

**Current**:

```typescript
import * as d3 from "d3";
```

**Replace with**:

```typescript
import { select } from "d3-selection";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { hierarchy, treemap, treemapSquarify } from "d3-hierarchy";
import { format } from "d3-format";
import { interpolate } from "d3-interpolate";
import { transition } from "d3-transition";
```

**Est. Savings**: ~200KB

**Note**: Review the component to determine exact D3 modules needed. Update imports based on actual usage.

---

### ✅ Fix 2: Replace Wildcard Barrel Export

**File**: `/src/components/index.ts:108`

**Current**:

```typescript
export * from "./modules";
```

**Replace with**:

```typescript
export {
  BudgetOverviewModule,
  ComparisonBuilderModule,
  ExamplesSidebar,
  StatsBar,
} from "./modules";
```

**Est. Savings**: ~20KB

---

## Medium Priority Fixes

### ✅ Fix 3: Lazy Load BudgetTreemapD3

**Affected Files**: Any page/component that imports BudgetTreemapD3

**Pattern**:

```typescript
import { lazy, Suspense } from "react";
import { BudgetTreemapSkeleton } from "@/components/budget/BudgetTreemapSkeleton";

const BudgetTreemapD3 = lazy(() =>
  import("@/components/budget/BudgetTreemapD3").then((mod) => ({
    default: mod.BudgetTreemapD3
  }))
);

// In render:
<Suspense fallback={<BudgetTreemapSkeleton />}>
  <BudgetTreemapD3 {...props} />
</Suspense>
```

**Est. Savings**: ~100KB from initial bundle

---

### ✅ Fix 4: Lazy Load BudgetSankey

**Where Used**: Check with grep to find all imports

```bash
grep -r "BudgetSankey" src/app --include="*.tsx"
```

**Pattern**: Same as Fix 3, use lazy loading

**Est. Savings**: ~150KB from initial bundle

---

### ✅ Fix 5: Lazy Load PrintableComparison

**Strategy**: Load only when print button is clicked

**Pattern**:

```typescript
const [showPrintable, setShowPrintable] = useState(false);

const PrintableComparison = useMemo(
  () => lazy(() => import("@/components/comparison/PrintableComparison")),
  []
);

// In render, only when showPrintable is true:
{showPrintable && (
  <Suspense fallback={<div>Loading...</div>}>
    <PrintableComparison {...props} />
  </Suspense>
)}
```

**Est. Savings**: ~30KB from initial bundle

---

## Verification Commands

### 1. Build and Check Bundle Size

```bash
pnpm build

# Check output for chunk sizes
# Look for lines like:
# ƒ λ  First Load JS shared by all  250 kB
```

### 2. Analyze Bundle Composition

```bash
pnpm analyze

# Opens bundle analyzer in browser
# Check for:
# - D3 modules (should only see specific ones, not full d3 package)
# - Recharts (should be tree-shaken)
# - Lazy chunks (should see separate chunks for lazy components)
```

### 3. Check Import Statements

```bash
# Find all D3 imports
grep -r "import.*from.*['\"]d3['\"]" src/components --include="*.tsx"

# Find all namespace imports (potential issues)
grep -r "import \* as" src/components --include="*.tsx" | grep -v "React"

# Find all wildcard exports
grep -r "export \* from" src/components --include="*.ts"
```

### 4. Lighthouse Performance Check

```bash
pnpm build
pnpm start

# In another terminal:
npx lighthouse http://localhost:3000 \
  --only-categories=performance \
  --view

# Look for:
# - Total Blocking Time (should decrease)
# - Time to Interactive (should improve)
# - JavaScript execution time (should decrease)
```

---

## Expected Results

### Before Optimizations

- Initial Bundle: ~450-550KB
- First Load JS: ~450-550KB
- Lighthouse Performance: 70-80

### After High Priority Fixes

- Initial Bundle: ~350-400KB
- First Load JS: ~350-400KB
- Lighthouse Performance: 75-85
- **Improvement**: ~150KB (27%)

### After All Fixes

- Initial Bundle: ~250-300KB
- First Load JS: ~250-300KB
- Lighthouse Performance: 85-95
- **Improvement**: ~250KB (45%)

---

## Testing Checklist

After each fix:

- [ ] TypeScript compiles without errors (`pnpm type-check`)
- [ ] No ESLint errors (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Bundle size decreased (check build output)
- [ ] App runs without errors in dev mode (`pnpm dev`)
- [ ] Production build runs correctly (`pnpm start`)
- [ ] All lazy-loaded components render correctly
- [ ] Loading states appear appropriately
- [ ] No console errors in browser

---

## Common Pitfalls

### ❌ Don't do this:

```typescript
// Bad: Still imports full library
import { select } from "d3";

// Bad: Breaks tree-shaking
export * from "./components";

// Bad: Lazy loading synchronous components
const Button = lazy(() => import("./ui/button"));
```

### ✅ Do this:

```typescript
// Good: Specific module import
import { select } from "d3-selection";

// Good: Named exports
export { ComponentA, ComponentB } from "./components";

// Good: Lazy load heavy/conditional components only
const HeavyChart = lazy(() => import("./charts/HeavyChart"));
```

---

## Rollback Plan

If issues arise:

1. Git commit before making changes:

   ```bash
   git add .
   git commit -m "Before tree-shaking optimizations"
   ```

2. If build breaks, revert:

   ```bash
   git revert HEAD
   ```

3. If bundle size increases unexpectedly:
   - Check bundle analyzer output
   - Verify import statements
   - Review lazy loading implementation

---

## Next Steps After Fixes

1. **Monitor bundle size** - Set up bundle size CI checks
2. **Add bundle budgets** - Configure Next.js bundle size limits
3. **Regular audits** - Quarterly review of dependencies and imports
4. **Documentation** - Update CLAUDE.md with import best practices

---

## Resources

- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [D3 Module Imports](https://github.com/d3/d3/blob/main/CHANGES.md#d3-version-4)
- [Tree-Shaking Best Practices](https://webpack.js.org/guides/tree-shaking/)
