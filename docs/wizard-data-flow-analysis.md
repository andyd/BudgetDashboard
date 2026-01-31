# Wizard Data Flow Analysis

**Date:** 2026-01-30
**Test File:** `src/lib/__tests__/wizard-data-flow.test.ts`
**Status:** 28/29 tests passing (1 failure due to duplicate IDs)

## Executive Summary

End-to-end data flow validation test created to verify wizard comparison generation. The test suite validates:

1. Category ID definitions
2. Budget item mappings
3. Comparison unit mappings
4. Budget total calculations
5. Wizard comparison generation
6. Data integrity

## Issues Found

### Critical: Duplicate Budget Item IDs

**Issue:** Two budget items have duplicate IDs, causing data integrity issues.

**Duplicates Found:**

1. **`prog-pell-grants`** (appears 2 times)
   - Location 1: `src/lib/data/budget-items/programs-education.ts` (line 5)
   - Location 2: `src/lib/data/budget-items/programs-social.ts` (line 60)
   - Value: $22,000,000,000
   - Name: "Pell Grants"

2. **`prog-head-start`** (appears 2 times)
   - Location 1: `src/lib/data/budget-items/programs-education.ts` (line 49)
   - Location 2: `src/lib/data/budget-items/programs-social.ts` (line 93)
   - Value: $12,000,000,000
   - Name: "Head Start"

**Impact:**

- `getItemById()` will return only the first match
- Budget calculations may double-count these items
- Wizard comparisons may produce inconsistent results

**Recommendation:**
Remove duplicates from one of the files. Since both programs are education-related, keep them in `programs-education.ts` and remove from `programs-social.ts`.

**Fix:**

```typescript
// Remove these items from programs-social.ts:
// - prog-pell-grants (line 60)
// - prog-head-start (line 93)
```

## Test Results

### Category ID Validation (2/2 passing)

All priority and wasteful categories properly defined:

**Priority Categories:**

- education
- healthcare
- veterans
- infrastructure
- environment
- housing
- science
- social-security

**Wasteful Categories:**

- defense
- foreign-aid
- admin
- farm-subsidies
- interest
- other

### Budget Items Mapping (7/7 passing)

All wasteful categories successfully map to valid budget items:

| Category       | Budget Items Found | Expected IDs                                                                                                                       |
| -------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| defense        | Multiple           | dept-defense, program-f35, program-aircraft-carrier, program-nuclear-weapons, program-missile-defense, program-overseas-operations |
| foreign-aid    | 1+                 | dept-state                                                                                                                         |
| admin          | 1+                 | dept-justice                                                                                                                       |
| farm-subsidies | 1+                 | dept-usda                                                                                                                          |
| interest       | 1+                 | dept-treasury                                                                                                                      |
| other          | 0 (expected)       | -                                                                                                                                  |

**Status:** All referenced budget item IDs exist in the data files.

### Comparison Units Mapping (8/8 passing)

All priority categories successfully map to valid comparison units:

| Priority Category | Unit Category  | Units Found                 |
| ----------------- | -------------- | --------------------------- |
| education         | education      | Yes                         |
| healthcare        | healthcare     | Yes                         |
| veterans          | veterans       | Yes                         |
| infrastructure    | transportation | Yes                         |
| environment       | environment    | Yes                         |
| housing           | housing        | Yes                         |
| science           | education      | Yes (shares with education) |
| social-security   | income         | Yes                         |

**Status:** All priority categories have at least one comparison unit available.

### Category Budget Totals (2/2 passing)

Budget total calculations work for both priority and wasteful categories:

- All priority categories return valid totals > 0
- All wasteful categories (except "other") return valid totals > 0

### Wizard Comparison Generation (4/4 passing)

Comparison generation engine works correctly:

**Test Case 1: Typical User Input**

- Priorities: ["education", "healthcare"]
- Wasteful: ["defense", "foreign-aid"]
- Top Priority: "education"
- Result: Generated 1-5 valid comparisons

**Test Case 2: Top Priority Prioritization**

- First comparison matches top priority: ✓
- isTopPriority flag set correctly: ✓

**Test Case 3: All Wasteful Categories**

- All wasteful categories generate comparisons: ✓
- "other" category correctly returns empty: ✓

**Test Case 4: All Priority Categories**

- All priority categories generate comparisons: ✓
- All have matching comparison units: ✓

### Data Integrity (3/4 passing, 1 failure)

| Check                         | Status | Details                                |
| ----------------------------- | ------ | -------------------------------------- |
| Duplicate budget item IDs     | FAIL   | 2 duplicates found (see above)         |
| Duplicate comparison unit IDs | PASS   | No duplicates                          |
| Valid cost fields in units    | PASS   | All units have costPerUnit or cost > 0 |
| Valid amounts in budget items | PASS   | All items have amount > 0              |

### Missing Data Detection (3/3 passing)

**Budget Item IDs:**
All referenced IDs exist in data files:

- Defense category: All 6 IDs present
- Other wasteful categories: All department IDs present
- Priority department mappings: All 9 department IDs present

**Comparison Units:**
All priority categories have comparison units available.

**Budget Items:**
All wasteful categories (except "other") have budget items available.

## Test Coverage

### What the Test Validates

1. **Category Definitions:** All wizard category IDs are properly defined
2. **ID References:** All category mappings reference valid data IDs
3. **Data Retrieval:** Helper functions return correct items/units
4. **Budget Calculations:** Total calculations work for all categories
5. **Comparison Generation:** End-to-end wizard flow produces valid results
6. **Data Integrity:** No duplicates, all costs/amounts valid
7. **Missing Data:** Reports any missing IDs or empty categories

### What the Test Does NOT Validate

1. UI rendering of wizard steps
2. User interaction flows
3. Comparison display formatting
4. Share/export functionality
5. Database persistence
6. API endpoint behavior

## Running the Test

### Unit Test (Recommended)

```bash
pnpm test:unit src/lib/__tests__/wizard-data-flow.test.ts
```

### Browser Console Test

For quick validation in the browser:

```javascript
// 1. Import the functions
import {
  PRIORITY_CATEGORIES,
  WASTEFUL_CATEGORIES,
  getBudgetItemsForCategory,
  getComparisonUnitsForCategory,
} from "@/lib/wizard-categories";
import { generateWizardComparisons } from "@/lib/wizard-comparisons";

// 2. Check category definitions
console.log("Priority Categories:", PRIORITY_CATEGORIES);
console.log("Wasteful Categories:", WASTEFUL_CATEGORIES);

// 3. Check budget items for defense
const defenseItems = getBudgetItemsForCategory("defense");
console.log("Defense budget items:", defenseItems);

// 4. Check comparison units for education
const eduUnits = getComparisonUnitsForCategory("education");
console.log("Education comparison units:", eduUnits);

// 5. Generate sample comparisons
const comparisons = generateWizardComparisons(
  ["education", "healthcare"],
  ["defense"],
  "education",
);
console.log("Generated comparisons:", comparisons);
```

## Recommendations

### Immediate Actions

1. **Fix Duplicate IDs** (Critical)
   - Remove `prog-pell-grants` from `programs-social.ts`
   - Remove `prog-head-start` from `programs-social.ts`
   - Keep both items in `programs-education.ts`
   - Re-run tests to verify fix

2. **Add Validation Script**
   - Add `scripts/validate-data.ts` to check for duplicates
   - Run as part of pre-commit hook or CI

### Future Enhancements

1. **Expand Test Coverage**
   - Add tests for comparison formatting functions
   - Add tests for edge cases (empty inputs, missing data)
   - Add tests for performance (large category selections)

2. **Add Integration Tests**
   - Test full wizard flow in browser
   - Test API endpoints for comparison generation
   - Test database persistence

3. **Add Monitoring**
   - Log when categories return 0 items/units
   - Track most common wizard selections
   - Monitor comparison generation performance

## Files Created

1. **Test Suite:** `/src/lib/__tests__/wizard-data-flow.test.ts`
   - 29 tests covering all aspects of wizard data flow
   - Can be run with `pnpm test:unit`

2. **Analysis Script:** `/scripts/find-duplicates.ts`
   - Utility to find duplicate budget item IDs
   - Can be run with `npx tsx scripts/find-duplicates.ts`

3. **Documentation:** `/docs/wizard-data-flow-analysis.md` (this file)
   - Complete analysis of test results
   - Issue tracking and recommendations

## Conclusion

The wizard data flow is **mostly working correctly** with one critical issue:

**Working:**

- All category definitions are valid
- All budget item mappings work
- All comparison unit mappings work
- Comparison generation produces valid results
- No missing data detected

**Not Working:**

- Duplicate budget item IDs causing data integrity issues

**Next Step:** Fix the duplicate IDs and re-run the test suite to achieve 100% pass rate.
