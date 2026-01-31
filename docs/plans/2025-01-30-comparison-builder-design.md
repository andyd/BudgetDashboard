# Smart Comparison Builder Design

**Date:** 2025-01-30
**Status:** Approved
**Goal:** Allow users to compare government spending to tangible, meaningful items that help Americans understand where their tax dollars go.

---

## Overview

A flexible comparison system that lets users explore government spending by comparing budget items to relatable alternatives (healthcare, education, housing, etc.). The system auto-suggests smart matches and offers alternatives on both sides of the comparison.

### Design Principles

- **Neutral/factual tone** - Let numbers speak for themselves
- **Hardcoded, vetted data** - Curated costs with sources, not AI-generated
- **Smart defaults** - System picks good comparisons, user refines
- **Shareable** - Easy to share links and visual cards
- **Trust through sources** - Subtle but visible citations

---

## 1. Comparison Unit Library

**Size:** 75-100 vetted items across 9 categories

### Data Structure

```typescript
interface ComparisonUnit {
  id: string; // "teacher-salary"
  name: string; // "Teacher Salaries"
  nameSingular: string; // "Teacher Salary"
  cost: number; // 68000
  category: UnitCategory; // "education"
  icon: string; // "👩‍🏫"
  source: string; // "BLS Occupational Outlook 2024"
  description: string; // "Average annual K-12 public school teacher salary"
}

type UnitCategory =
  | "healthcare"
  | "education"
  | "housing"
  | "food"
  | "transportation"
  | "income"
  | "public-services"
  | "veterans"
  | "environment";
```

### Categories (~10-15 items each)

**Healthcare & Medical**

- Annual health insurance premium ($8,500)
- Emergency room visit ($2,200)
- Insulin annual supply ($6,000)
- Childbirth hospital cost ($18,000)
- Cancer treatment course ($150,000)
- Mental health therapy session ($150)
- Ambulance ride ($1,200)
- Prescription drug annual cost ($1,300)
- Medicare per-beneficiary ($15,000)
- Medicaid per-beneficiary ($9,000)

**Education & Childcare**

- Teacher salary ($68,000)
- Year of public college tuition ($10,500)
- Year of childcare/preschool ($12,000)
- Pell Grant max ($7,395)
- School lunch for a year ($1,000)
- Student loan average debt ($37,000)
- Public school per-pupil spending ($15,000)
- School bus ($100,000)
- Community college year ($3,800)
- Head Start slot ($12,000)

**Housing & Shelter**

- Median home price ($420,000)
- Year of rent ($18,000)
- Down payment 20% ($84,000)
- Affordable housing unit ($200,000)
- Section 8 voucher/year ($12,000)
- Homeless shelter bed/year ($25,000)
- Home weatherization ($7,500)
- First-time buyer assistance ($10,000)

**Food & Nutrition**

- Family grocery bill/year ($12,000)
- School meals for child/year ($1,000)
- SNAP benefits/person/year ($2,400)
- Food bank meal ($3)
- WIC benefits/family/year ($600)
- Senior meal delivery/year ($3,000)

**Transportation**

- Used car ($28,000)
- Year of gas ($2,500)
- Monthly transit pass ($100)
- Electric vehicle ($45,000)
- Public bus ($500,000)
- Mile of road repair ($1,000,000)
- EV charging station ($50,000)

**Income & Wages**

- Federal minimum wage hour ($7.25)
- Median household income ($75,000)
- Living wage annual ($45,000)
- Social Security check/year ($22,800)
- Unemployment benefit/week ($380)

**Public Services**

- Firefighter salary ($55,000)
- Police officer salary ($65,000)
- 911 dispatcher salary ($45,000)
- Mile of broadband ($30,000)
- Library annual budget ($500,000)
- Park ranger salary ($45,000)

**Veterans**

- VA healthcare/veteran/year ($15,000)
- GI Bill tuition benefit ($25,000)
- Veteran disability payment/year ($20,000)
- Veteran housing assistance ($10,000)

**Environment & Energy**

- Solar panel installation ($20,000)
- Tree planting ($50)
- Clean water for household/year ($500)
- Wind turbine ($3,000,000)
- Home energy efficiency upgrade ($7,500)

---

## 2. Budget Items Library

**Size:** 75-100 items across 3 tiers

### Data Structure

```typescript
interface BudgetSpendingItem {
  id: string; // "ice-budget"
  name: string; // "ICE Budget"
  amount: number; // 9520000000
  tier: "department" | "program" | "current-event";
  parentId?: string; // "homeland-security"
  fiscalYear: number; // 2025
  source: string; // "DHS Budget FY2025"
  description: string; // "Immigration and Customs Enforcement total budget"
}
```

### Tier 1: Departments (~15 items)

- Defense ($895B)
- Health & Human Services ($1.802T)
- Social Security Administration ($1.5T)
- Treasury / Net Interest ($1.05T)
- Veterans Affairs ($323B)
- Agriculture ($224B)
- Homeland Security ($116B)
- Education ($35B)
- etc.

### Tier 2: Programs & Line Items (~50-75 items)

- F-35 Fighter Program ($13.2B)
- ICE Budget ($9.52B)
- ICE Detention Operations ($3.5B)
- SNAP Benefits ($119B)
- Pell Grants ($22B)
- Section 8 Housing ($30B)
- Border Wall Construction ($1.2B)
- NASA ($25B)
- NIH Research ($48B)
- Head Start ($12B)
- etc.

### Tier 3: Current Events (~10-20 items, updated periodically)

- Trump Inaugural Balls ($25M)
- Presidential travel (annual estimate)
- Specific contracts in the news
- Recently passed spending bills
- etc.

---

## 3. Smart Comparison Builder

### User Flow

1. **Entry:** User picks spending item, comparison unit, or both
2. **Auto-fill:** System intelligently selects missing side
3. **Result:** Shows comparison with calculation
4. **Alternatives:** Both sides show 2-3 clickable alternatives
5. **Iterate:** Clicking alternative instantly recalculates

### Smart Matching Logic

When auto-selecting a comparison:

1. Calculate result for all units
2. Prefer results with "memorable" numbers (round-ish, impressive scale)
3. Diversify categories in alternatives (don't show 3 education options)
4. Consider impact factor (bigger contrast = more compelling)

```typescript
function findBestComparison(
  amount: number,
  units: ComparisonUnit[],
): ComparisonUnit {
  // Score each unit based on:
  // - Resulting count is a "nice" number (not 1.3 or 10,000,000)
  // - Category variety
  // - Relatable scale (thousands to millions preferred)

  return units
    .map((unit) => ({
      unit,
      count: amount / unit.cost,
      score: calculateImpactScore(amount, unit),
    }))
    .sort((a, b) => b.score - a.score)[0].unit;
}

function getAlternatives(
  amount: number,
  selectedUnit: ComparisonUnit,
  units: ComparisonUnit[],
): ComparisonUnit[] {
  // Return 2-3 alternatives from different categories
  return units
    .filter((u) => u.id !== selectedUnit.id)
    .filter((u) => u.category !== selectedUnit.category)
    .sort(
      (a, b) =>
        calculateImpactScore(amount, b) - calculateImpactScore(amount, a),
    )
    .slice(0, 3);
}
```

### UI Layout

```
┌─────────────────────────────────────────────────────────┐
│  [Pick a spending item ▼]    or    [Pick comparison ▼]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│       F-35 Program  =  194,000 Teacher Salaries         │
│           $13.2B            @ $68K/year                 │
│                                                         │
│       Source: DoD FY2025, BLS 2024                      │
│                                                         │
├─────────────────────────┬───────────────────────────────┤
│  TRY OTHER SPENDING     │  TRY OTHER COMPARISONS        │
│  • ICE Budget           │  • Healthcare (155K people)   │
│  • Border Wall          │  • Pell Grants (1.78M)        │
│  • SNAP Benefits        │  • Housing Units (66K)        │
│  [Browse all...]        │  [Browse all...]              │
├─────────────────────────┴───────────────────────────────┤
│           [ Copy Link ]  [ Download Card ]              │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Shareable Cards

### Generated Image Spec

- **Size:** 1200x630 (OG image standard)
- **Format:** PNG via Next.js OG Image API
- **Style:** Clean, high-contrast, neutral

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              F-35 Program = 194,000                     │
│              Teacher Salaries                           │
│                                                         │
│         $13.2B          =         194K 👩‍🏫              │
│                                                         │
│         Source: DoD FY2025, BLS 2024                   │
│         budgetdashboard.vercel.app                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Share Options

1. **Copy Link:** `/compare/f35-program/teacher-salary`
2. **Download Image:** PNG card for manual sharing
3. **Share to X/Twitter:** Pre-filled tweet with link

### URL Structure

```
/compare/[spendingId]/[unitId]
/compare/f35-program/teacher-salary
/compare/ice-budget/healthcare
```

### OG Image API Route

```
/api/og?spending=f35-program&unit=teacher-salary
```

---

## 5. Homepage Redesign

### New Hierarchy

1. **ICE Spotlight Bar** (top) - Timely, attention-grabbing
2. **Comparison Builder** (hero) - Main interactive feature
3. **Pie Chart + Carousel** (below fold) - Supporting context

### Wireframe

```
┌─────────────────────────────────────────────────────────┐
│  Header / Navigation                                    │
├─────────────────────────────────────────────────────────┤
│  ICE Spotlight Bar                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│        What Could Your Tax Dollars Buy?                 │
│        Fiscal Year 2025 · $7.0 Trillion                 │
│                                                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │         COMPARISON BUILDER (hero)                  │ │
│  │         [Full interactive widget]                  │ │
│  └────────────────────────────────────────────────────┘ │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   EXPLORE FULL BUDGET        FEATURED COMPARISONS      │
│   ┌─────────────────┐        ┌─────────────────┐       │
│   │   Pie Chart     │        │    Carousel     │       │
│   │   (smaller)     │        │                 │       │
│   └─────────────────┘        └─────────────────┘       │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Footer                                                 │
└─────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Data Foundation

- Create comparison units library (75-100 items)
- Create budget items library (75-100 items)
- Add smart matching utility functions

### Phase 2: Comparison Builder Component

- Build two-panel selector UI
- Implement auto-fill logic
- Add alternatives on both sides
- Wire up instant recalculation

### Phase 3: Sharing Features

- Create shareable comparison page route
- Build OG image generation API
- Add copy link / download card buttons

### Phase 4: Homepage Integration

- Redesign homepage with builder as hero
- Move pie chart below fold
- Keep ICE spotlight bar and carousel

---

## Success Criteria

- Users can build a comparison in under 10 seconds
- Shareable cards look professional on social media
- All costs have visible source citations
- Alternatives encourage exploration (users try 2+ comparisons)
- Mobile-friendly responsive design
