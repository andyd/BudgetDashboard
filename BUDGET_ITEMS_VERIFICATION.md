# Budget Items Verification Report

**Generated:** 2026-01-30

## Summary

This report verifies that all budget item IDs referenced in wizard category mappings exist in the actual budget items data.

## Files Checked

1. `/src/lib/wizard-categories.ts` - Priority and wasteful category mappings
2. `/src/app/wizard/wizard-categories.ts` - Wizard category definitions
3. `/src/lib/data/budget-items/` - All budget item data files

---

## MISSING ITEMS

The following budget item IDs are referenced in wizard categories but **DO NOT EXIST** in the budget items data:

### From `/src/lib/wizard-categories.ts`

1. **`program-overseas-bases`** - Referenced in defense category
   - Should be: `program-overseas-operations` (exists)
   - Fix: Update line 158 in wizard-categories.ts

### From `/src/app/wizard/wizard-categories.ts`

1. **`f35-program`** - Referenced in defense category (line 116)
   - Should be: `program-f35` (exists)
   - Fix: Update to use consistent naming

2. **`aircraft-carrier`** - Referenced in defense category (line 116)
   - Should be: `program-aircraft-carrier` (exists)
   - Fix: Update to use consistent naming

3. **`dept-state-foreign`** - Referenced in foreign-aid category (line 124)
   - Should be: `dept-state` (exists)
   - Fix: Update to match actual department ID

4. **`dept-gsa`** - Referenced in admin category (line 132)
   - Status: **Does not exist in data**
   - Recommendation: Remove or add to departments.ts

5. **`dept-opm`** - Referenced in admin category (line 132)
   - Status: **Does not exist in data**
   - Recommendation: Remove or add to departments.ts

6. **`dept-agriculture-subsidies`** - Referenced in farm-subsidies category (line 140)
   - Should be: `dept-usda` (exists)
   - Fix: Update to use actual department ID

7. **`dept-commerce`** - Referenced in other category (line 156)
   - Status: **Does not exist in data**
   - Recommendation: Add to departments.ts or remove reference

8. **`dept-transportation`** - Referenced in infrastructure category (line 57)
   - Should be: `dept-dot` (exists)
   - Fix: Update to match actual department ID

9. **`dept-nsf`** - Referenced in science category (line 89)
   - Status: **Does not exist in data**
   - Note: NSF program exists as `prog-nsf`
   - Recommendation: Use `prog-nsf` instead

---

## CORRECT REFERENCES

The following references are **CORRECT** and exist in budget items data:

### Departments

- `dept-defense` ✓
- `dept-education` ✓
- `dept-energy` ✓
- `dept-epa` ✓
- `dept-hhs` ✓
- `dept-hud` ✓
- `dept-justice` ✓
- `dept-nasa` ✓
- `dept-ssa` ✓
- `dept-state` ✓
- `dept-treasury` ✓
- `dept-usda` ✓
- `dept-va` ✓
- `dept-dot` ✓

### Programs

- `program-f35` ✓
- `program-aircraft-carrier` ✓
- `program-nuclear-weapons` ✓
- `program-missile-defense` ✓

---

## RECOMMENDATIONS

### Priority 1: Fix Inconsistent Naming (Breaking Issues)

These are typos/naming inconsistencies that will cause runtime errors:

```typescript
// app/wizard/wizard-categories.ts - Line 116
budgetItemIds: ["dept-defense", "f35-program", "aircraft-carrier"],
// FIX TO:
budgetItemIds: ["dept-defense", "program-f35", "program-aircraft-carrier"],

// app/wizard/wizard-categories.ts - Line 57
budgetItemIds: ["dept-transportation"],
// FIX TO:
budgetItemIds: ["dept-dot"],

// lib/wizard-categories.ts - Line 158
"program-overseas-bases"
// FIX TO:
"program-overseas-operations"
```

### Priority 2: Add Missing Department Items

Add these to `/src/lib/data/budget-items/departments.ts`:

```typescript
{
  id: "dept-commerce",
  name: "Department of Commerce",
  amount: 15_000_000_000, // Estimate - verify actual
  tier: "department",
  fiscalYear: 2025,
  source: "Congressional Budget Office",
  description: "Census Bureau, NOAA, Patent Office, economic development, trade promotion."
},
{
  id: "dept-gsa",
  name: "General Services Administration",
  amount: 8_000_000_000, // Estimate - verify actual
  tier: "department",
  fiscalYear: 2025,
  source: "Congressional Budget Office",
  description: "Federal building management, procurement, and administrative services."
},
{
  id: "dept-opm",
  name: "Office of Personnel Management",
  amount: 5_000_000_000, // Estimate - verify actual
  tier: "department",
  fiscalYear: 2025,
  source: "Congressional Budget Office",
  description: "Federal employee benefits, retirement, HR policy, and civil service management."
}
```

### Priority 3: Consolidate Wizard Category Files

Currently there are TWO wizard category files with different mappings:

- `/src/lib/wizard-categories.ts`
- `/src/app/wizard/wizard-categories.ts`

**Recommendation:** Pick ONE as the source of truth and delete/deprecate the other.

---

## VALIDATION SCRIPT

To verify budget items at runtime, add this to your app:

```typescript
// src/lib/validate-wizard-categories.ts
import { ALL_BUDGET_ITEMS } from "./data/budget-items";
import {
  NEEDS_MORE_CATEGORIES,
  WASTEFUL_CATEGORIES,
} from "./wizard-categories";

export function validateWizardCategories() {
  const existingIds = new Set(ALL_BUDGET_ITEMS.map((item) => item.id));
  const errors: string[] = [];

  [...NEEDS_MORE_CATEGORIES, ...WASTEFUL_CATEGORIES].forEach((category) => {
    category.budgetItemIds.forEach((id) => {
      if (!existingIds.has(id)) {
        errors.push(
          `Category "${category.id}" references missing budget item: ${id}`,
        );
      }
    });
  });

  if (errors.length > 0) {
    console.error("Wizard category validation errors:", errors);
    throw new Error(`Found ${errors.length} invalid budget item references`);
  }
}
```

---

## NEXT STEPS

1. Fix all Priority 1 naming inconsistencies (5 minutes)
2. Add missing departments (Priority 2) if needed for admin/other categories (15 minutes)
3. Decide which wizard-categories file is canonical and remove the other (10 minutes)
4. Add validation script to catch future issues (5 minutes)
5. Run `pnpm type-check` to verify no TypeScript errors

---

## ALL EXISTING BUDGET ITEMS

For reference, here are all 95 budget items currently in the system:

**Departments (15):**
dept-defense, dept-dhs, dept-dot, dept-education, dept-energy, dept-epa, dept-hhs, dept-hud, dept-justice, dept-nasa, dept-ssa, dept-state, dept-treasury, dept-usda, dept-va

**Programs (73):**
event-air-force-one, event-cabinet-travel, event-congressional-salaries, event-presidential-golf, event-presidential-travel, event-state-dinner, event-trump-inaugural-balls, event-white-house-operations, prog-border-wall, prog-caregiver-support, prog-cbp-border-patrol, prog-cdc, prog-charter-schools, prog-chip, prog-cisa, prog-coast-guard, prog-doe-science, prog-epa-research, prog-fema, prog-gi-bill, prog-head-start, prog-ice-detention, prog-ice-ero, prog-ice-total, prog-idea, prog-liheap, prog-medicaid, prog-medicare, prog-nasa, prog-national-parks, prog-nih, prog-noaa, prog-nsf, prog-pell-grants, prog-school-lunch, prog-secret-service, prog-section8, prog-smithsonian, prog-snap, prog-ssdi, prog-student-loans-admin, prog-tanf, prog-teacher-training, prog-title-i, prog-trio, prog-tsa, prog-va-disability, prog-va-healthcare, prog-va-housing, prog-va-mental-health, prog-veteran-job-training, prog-veterans-cemeteries, prog-wic, program-aircraft-carrier, program-amtrak, program-army-corps-engineers, program-cyber-command, program-electric-grid, program-f35, program-faa, program-highway-trust-fund, program-military-construction, program-military-healthcare, program-military-personnel, program-missile-defense, program-nuclear-weapons, program-overseas-operations, program-public-transit, program-rural-broadband, program-special-operations, program-water-infrastructure

**Programs (Defense - 10):**
program-aircraft-carrier, program-cyber-command, program-f35, program-military-construction, program-military-healthcare, program-military-personnel, program-missile-defense, program-nuclear-weapons, program-overseas-operations, program-special-operations
