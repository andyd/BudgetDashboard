# Testing Wizard Data Flow

This document explains how to test the wizard data flow validation.

## Quick Start

### Run Unit Tests (Recommended)

```bash
pnpm test:unit src/lib/__tests__/wizard-data-flow.test.ts
```

This runs 29 comprehensive tests covering:

- Category definitions
- Budget item mappings
- Comparison unit mappings
- Budget calculations
- Comparison generation
- Data integrity

### Run in Browser Console

If you prefer to test in the browser:

1. Start the dev server:

   ```bash
   pnpm dev
   ```

2. Open the app in your browser (http://localhost:3000)

3. Open the browser console (F12)

4. Copy and paste the contents of `/public/test-wizard-data-flow.js`

5. Check the console output for test results

## What Gets Tested

### 1. Category ID Validation

- All priority categories exist (education, healthcare, veterans, etc.)
- All wasteful categories exist (defense, foreign-aid, admin, etc.)
- Each category has required metadata (name, description, icon)

### 2. Budget Items Mapping

- Each wasteful category maps to valid budget items
- Referenced budget item IDs actually exist
- No categories are unexpectedly empty

### 3. Comparison Units Mapping

- Each priority category maps to valid comparison units
- Referenced unit categories exist
- All categories have at least one unit available

### 4. Budget Total Calculations

- `getCategoryBudgetTotal()` returns valid amounts
- Totals are greater than 0 for all categories (except "other")

### 5. Wizard Comparison Generation

- `generateWizardComparisons()` produces valid results
- Top priority matches are prioritized
- All wasteful and priority categories work
- Generated comparisons have valid data

### 6. Data Integrity

- No duplicate budget item IDs
- No duplicate comparison unit IDs
- All comparison units have valid costs (> 0)
- All budget items have valid amounts (> 0)

### 7. Missing Data Detection

- Reports any missing budget item IDs
- Reports any categories with no comparison units
- Reports any categories with no budget items

## Test Results

See `/docs/wizard-data-flow-analysis.md` for detailed test results.

**Current Status:** 28/29 tests passing

**Known Issue:** Duplicate budget item IDs

- `prog-pell-grants` appears in both `programs-education.ts` and `programs-social.ts`
- `prog-head-start` appears in both `programs-education.ts` and `programs-social.ts`

## Fixing Issues

### Fix Duplicate IDs

Edit the following files:

**Remove from:** `/src/lib/data/budget-items/programs-social.ts`

```typescript
// Remove these two items:
{
  id: "prog-pell-grants", // Line ~60
  ...
}

{
  id: "prog-head-start", // Line ~93
  ...
}
```

**Keep in:** `/src/lib/data/budget-items/programs-education.ts` (no changes needed)

### Verify Fix

After fixing, re-run the tests:

```bash
pnpm test:unit src/lib/__tests__/wizard-data-flow.test.ts
```

You should see: **29/29 tests passing**

## Running Specific Tests

### Test only category validation

```bash
pnpm test:unit src/lib/__tests__/wizard-data-flow.test.ts -t "Category ID Validation"
```

### Test only budget item mappings

```bash
pnpm test:unit src/lib/__tests__/wizard-data-flow.test.ts -t "Budget Items Mapping"
```

### Test only data integrity

```bash
pnpm test:unit src/lib/__tests__/wizard-data-flow.test.ts -t "Data Integrity"
```

## Finding Duplicates

Run the duplicate finder script:

```bash
npx tsx scripts/find-duplicates.ts
```

Output:

```
Total items: 88
Unique IDs: 86

Duplicate IDs:
  prog-pell-grants: appears 2 times
    [1] Pell Grants - $22,000,000,000
    [2] Pell Grants - $22,000,000,000
  prog-head-start: appears 2 times
    [1] Head Start - $12,000,000,000
    [2] Head Start - $12,000,000,000
```

## Adding New Tests

To add new tests, edit `/src/lib/__tests__/wizard-data-flow.test.ts`:

```typescript
describe("Your Test Group", () => {
  it("should test something new", () => {
    // Your test code
    expect(something).toBe(expected);
  });
});
```

## CI Integration

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
- name: Run wizard data flow tests
  run: pnpm test:unit src/lib/__tests__/wizard-data-flow.test.ts
```

## Related Files

| File                                          | Purpose                     |
| --------------------------------------------- | --------------------------- |
| `/src/lib/__tests__/wizard-data-flow.test.ts` | Unit test suite (29 tests)  |
| `/public/test-wizard-data-flow.js`            | Browser console test script |
| `/scripts/find-duplicates.ts`                 | Duplicate ID finder         |
| `/docs/wizard-data-flow-analysis.md`          | Detailed test results       |
| `/src/lib/wizard-categories.ts`               | Category mappings           |
| `/src/lib/wizard-comparisons.ts`              | Comparison generation       |

## Troubleshooting

### "Module not found" errors

Make sure you're running from the project root:

```bash
cd /Users/andyd/code/1-Web-Apps/BudgetDashboard
```

### "Cannot find name 'expect'" errors

Make sure Vitest is installed:

```bash
pnpm install
```

### Browser console test shows "undefined"

Make sure you're on a page that imports the wizard modules, or the modules are available globally.

### Tests pass but wizard doesn't work in UI

The unit tests only validate data flow. Check:

1. React component rendering
2. State management (Zustand)
3. Router configuration
4. API endpoints

## Next Steps

1. Fix duplicate IDs (see "Fixing Issues" above)
2. Re-run tests to verify fix
3. Add tests to CI pipeline
4. Consider adding E2E tests for wizard UI
