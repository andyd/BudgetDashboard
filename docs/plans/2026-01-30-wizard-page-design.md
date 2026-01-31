# Wizard Page Design

**Date:** 2026-01-30
**Status:** Approved for implementation

## Overview

A personalization wizard that asks 3 quick questions to understand user budget priorities, then generates personalized comparisons showing how money spent on areas they consider wasteful could fund things they care about.

## User Flow

### Step 1: "What needs more investment?"

- Grid of 8 category cards: Education, Healthcare, Veterans, Infrastructure, Environment, Housing, Science/Research, Social Security
- User selects 2-3 cards (tap to toggle)
- "Next" button appears after 2+ selections

### Step 2: "What's overfunded or wasteful?"

- Grid of 6 category cards: Defense/Military, Foreign Aid, Government Admin, Farm Subsidies, Interest on Debt, Other
- User selects 1-2 cards
- "Next" button

### Step 3: "What matters MOST to you?"

- Shows only their Q1 selections as larger cards
- Single select - pick ONE priority
- "See My Results" button

### Progress Indicator

Simple dots or "1 of 3" at top of wizard

## Results Page

**URL Structure:** `/wizard?priorities=education,veterans&wasteful=defense&top=education`

Answers encoded in URL params for sharing.

### Layout

**Top Section - "Your Budget Priorities"**
Two-column summary:

- Left: "You want more in:" - lists their selections with actual budget amounts
- Right: "You think is too much:" - lists their selections with actual budget amounts
- Below: "Your #1 Priority: [selection]"

**Main Section - "Comparisons For You"**
3-5 comparison cards generated from their answers:

- Format: "[Wasteful item] = [X] [units of thing they care about]"
- Example: "The F-35 Program ($13.2B) = 194,117 teacher salaries"
- Cards clickable → link to full comparison on home page

**Bottom - Share**

- "Share Your Priorities" button → copies URL to clipboard
- Social share buttons (optional)

## Technical Implementation

### State Management

- URL search params as source of truth (shareable, back button works)
- `useSearchParams()` to read/write wizard state
- No server-side storage needed

### Data Mapping

Each wizard category maps to:

1. Relevant budget items from `ALL_BUDGET_ITEMS` / `DEPARTMENT_ITEMS`
2. Relevant comparison units from `ALL_COMPARISON_UNITS`

### Category Definitions

**"Needs More" Categories:**
| Category | Budget Items | Comparison Units |
|----------|--------------|------------------|
| Education | Dept of Education programs | teacher salaries, pell grants, school supplies |
| Healthcare | HHS, Medicare, Medicaid | health insurance premiums, hospital beds |
| Veterans | VA programs | VA healthcare years, veteran housing |
| Infrastructure | DOT, Corps of Engineers | miles of road, bridges |
| Environment | EPA, clean energy | solar panels, EV charging stations |
| Housing | HUD programs | affordable housing units, rent assistance |
| Science/Research | NSF, NIH, NASA | research grants, NASA missions |
| Social Security | SSA programs | social security checks |

**"Wasteful" Categories:**
| Category | Budget Items |
|----------|--------------|
| Defense/Military | DOD, F-35, aircraft carriers, overseas bases |
| Foreign Aid | State Dept foreign assistance |
| Government Admin | GSA, overhead, bureaucracy |
| Farm Subsidies | USDA subsidies |
| Interest on Debt | Treasury interest payments |
| Other | Miscellaneous |

### Comparison Generation Logic

```typescript
function generateComparisons(
  priorities: string[],
  wasteful: string[],
  topPriority: string,
) {
  const comparisons = [];

  for (const wasteCategory of wasteful) {
    const wasteItems = getBudgetItemsForCategory(wasteCategory);

    for (const priorityCategory of priorities) {
      const units = getComparisonUnitsForCategory(priorityCategory);

      for (const item of wasteItems) {
        for (const unit of units) {
          comparisons.push({
            budgetItem: item,
            unit: unit,
            count: Math.floor(item.amount / unit.costPerUnit),
            isTopPriority: priorityCategory === topPriority,
          });
        }
      }
    }
  }

  // Sort: top priority first, then by impact (highest count)
  return comparisons
    .sort((a, b) => {
      if (a.isTopPriority !== b.isTopPriority) return b.isTopPriority ? 1 : -1;
      return b.count - a.count;
    })
    .slice(0, 5);
}
```

### Files to Create

1. `src/app/wizard/page.tsx` - Server component with metadata
2. `src/app/wizard/WizardClient.tsx` - Main client component
3. `src/app/wizard/WizardStep.tsx` - Reusable step component
4. `src/app/wizard/WizardResults.tsx` - Results display component
5. `src/app/wizard/CategoryCard.tsx` - Selectable category card
6. `src/app/wizard/ResultCard.tsx` - Comparison result card
7. `src/app/wizard/PrioritySummary.tsx` - Budget priorities summary
8. `src/lib/wizard-categories.ts` - Category → budget/unit mappings
9. `src/lib/wizard-comparisons.ts` - Comparison generation logic

### Nav Update

Add "Wizard" to `navigationLinks` array in `src/components/layout/header.tsx`

## UI/UX Notes

- Mobile-first design
- Large tap targets for category cards (min 44px)
- Visual feedback on selection (border highlight, checkmark)
- Smooth transitions between steps
- Progress indicator always visible
- Back button to return to previous step
- Results should feel personalized and impactful
