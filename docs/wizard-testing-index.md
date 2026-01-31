# Wizard Data Flow Testing - Documentation Index

This directory contains comprehensive documentation for wizard data flow validation testing.

## Quick Links

| Document                                                         | Purpose                     | Start Here?                |
| ---------------------------------------------------------------- | --------------------------- | -------------------------- |
| [wizard-test-results.txt](./wizard-test-results.txt)             | Visual test results summary | ⭐ YES - Start here        |
| [testing-wizard-data-flow.md](./testing-wizard-data-flow.md)     | How to run tests            | ⭐ YES - For running tests |
| [wizard-data-flow-analysis.md](./wizard-data-flow-analysis.md)   | Detailed analysis           | For deep dive              |
| [../WIZARD_DATA_FLOW_SUMMARY.md](../WIZARD_DATA_FLOW_SUMMARY.md) | Executive summary           | For overview               |

## Test Files

| File                                         | Purpose                                        |
| -------------------------------------------- | ---------------------------------------------- |
| `src/lib/__tests__/wizard-data-flow.test.ts` | 29 unit tests (run with `pnpm test:unit`)      |
| `public/test-wizard-data-flow.js`            | Browser console test (copy/paste into console) |
| `scripts/find-duplicates.ts`                 | Find duplicate IDs (run with `npx tsx`)        |

## Quick Start

### 1. See Results

```bash
cat docs/wizard-test-results.txt
```

### 2. Run Tests

```bash
pnpm test:unit src/lib/__tests__/wizard-data-flow.test.ts
```

### 3. Find Duplicates

```bash
npx tsx scripts/find-duplicates.ts
```

## Current Status

**Tests:** 28/29 passing (96.6%)

**Known Issue:** 2 duplicate budget item IDs

- `prog-pell-grants` in both programs-education.ts and programs-social.ts
- `prog-head-start` in both programs-education.ts and programs-social.ts

**Fix:** Remove both items from programs-social.ts

## What Gets Tested

1. Category definitions (8 priority + 6 wasteful)
2. Budget item mappings (all categories)
3. Comparison unit mappings (all categories)
4. Budget total calculations
5. Wizard comparison generation
6. Data integrity (no duplicates, valid costs/amounts)
7. Missing data detection

## Documentation Structure

```
docs/
├── wizard-testing-index.md           ← You are here
├── wizard-test-results.txt           ← Visual summary (start here)
├── testing-wizard-data-flow.md       ← How to run tests
└── wizard-data-flow-analysis.md      ← Detailed analysis

Root:
└── WIZARD_DATA_FLOW_SUMMARY.md       ← Executive summary

Tests:
├── src/lib/__tests__/wizard-data-flow.test.ts
├── public/test-wizard-data-flow.js
└── scripts/find-duplicates.ts
```

## Key Findings

### Working ✓

- All category definitions valid
- All budget item mappings work
- All comparison unit mappings work
- Comparison generation produces valid results
- No missing data

### Not Working ✗

- Duplicate budget item IDs (2 duplicates affecting 4 entries)

## Next Steps

1. Review [wizard-test-results.txt](./wizard-test-results.txt) for visual summary
2. Read [testing-wizard-data-flow.md](./testing-wizard-data-flow.md) for how to run tests
3. Fix duplicate IDs in `src/lib/data/budget-items/programs-social.ts`
4. Re-run tests to verify 29/29 passing
5. Add tests to CI pipeline

## Related Code

| File                             | What It Does                      |
| -------------------------------- | --------------------------------- |
| `src/lib/wizard-categories.ts`   | Category definitions and mappings |
| `src/lib/wizard-comparisons.ts`  | Comparison generation logic       |
| `src/lib/data/budget-items/`     | Budget item data files            |
| `src/lib/data/comparison-units/` | Comparison unit data files        |
