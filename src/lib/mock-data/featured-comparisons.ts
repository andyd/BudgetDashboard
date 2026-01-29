/**
 * Featured Comparisons for Budget Dashboard
 *
 * Curated comparisons that highlight surprising or important budget allocations
 * by comparing them to tangible real-world reference points.
 *
 * All calculations are based on realistic 2024-2025 federal budget data.
 */

/**
 * Featured comparisons with curated headlines
 * These will be displayed prominently on the dashboard
 */
// Temporary simplified structure for mock data
// This will be replaced with proper database queries in production
export interface SimpleFeaturedComparison {
  budgetItemId: string;
  budgetAmount: number;
  unitId: string;
  unitCount: number;
  headline: string;
  isFeatured: boolean;
  displayOrder: number;
}

export const FEATURED_COMPARISONS: SimpleFeaturedComparison[] = [
  {
    // ICE detention daily costs: ~$210/day per detainee × 35,000 detainees = $7.35M/day
    // Annual: $2.68B
    // Teacher salaries at $65k each: $2.68B / $65k = 41,230 teachers
    budgetItemId: 'ice-detention-operations',
    budgetAmount: 2680000000, // $2.68 billion
    unitId: 'teacher-salary',
    unitCount: 41230,
    headline: 'ICE detention daily costs could pay 41,000 teacher salaries',
    isFeatured: true,
    displayOrder: 1,
  },
  {
    // F-35 total program cost: ~$1.7 trillion over lifetime
    // Using annual procurement: ~$12B per year
    // Family health insurance at $22k each: $12B / $22k = 545,454 families
    budgetItemId: 'f35-procurement',
    budgetAmount: 12000000000, // $12 billion annual procurement
    unitId: 'health-insurance-family',
    unitCount: 545454,
    headline: 'F-35 annual procurement = 545,000 families\' health insurance',
    isFeatured: true,
    displayOrder: 2,
  },
  {
    // Gerald R. Ford class aircraft carrier: ~$13 billion
    // Pell Grant max: $7,395 per student
    // Total Pell recipients: ~6.6 million students = $48.8B total annual Pell spending
    // 2 years = $97.6B, but carrier is $13B
    // Actually: $13B / $7,395 = 1,758,485 student-years
    // For 2 years of all recipients: carrier cost / (annual Pell budget / 2)
    // $13B represents about 6 months of total Pell Grant spending
    budgetItemId: 'aircraft-carrier-ford-class',
    budgetAmount: 13000000000, // $13 billion
    unitId: 'pell-grant',
    unitCount: 1758485,
    headline: 'One aircraft carrier = 1.7 million Pell Grant years',
    isFeatured: true,
    displayOrder: 3,
  },
  {
    // ICE facility expansion (FY2024 request): ~$420M for new facilities
    // Annual insulin cost: $3,600 per person
    // $420M / $3,600 = 116,666 people's annual insulin
    budgetItemId: 'ice-facility-expansion',
    budgetAmount: 420000000, // $420 million
    unitId: 'annual-insulin-cost',
    unitCount: 116667,
    headline: 'ICE facility expansion = 116,000 years of insulin coverage',
    isFeatured: true,
    displayOrder: 4,
  },
  {
    // Defense R&D budget: ~$140B annually
    // EPA budget: ~$10B annually
    // $140B / $10B = 14x
    // Note: This comparison uses a different pattern - comparing two budget items
    // For now, we'll use EPA budget as the "unit" reference point
    budgetItemId: 'defense-rnd',
    budgetAmount: 140000000000, // $140 billion
    unitId: 'median-household-income', // Using as proxy - 140B / 75k = 1.87M households
    unitCount: 1866667,
    headline: 'Defense R&D budget = nearly 2 million median household incomes',
    isFeatured: true,
    displayOrder: 5,
  },
];

/**
 * Additional context and sources for featured comparisons
 */
export const FEATURED_COMPARISON_CONTEXT = {
  'ice-detention-operations': {
    source: 'U.S. Immigration and Customs Enforcement FY2024 Budget',
    sourceUrl: 'https://www.ice.gov/budget',
    methodology: 'Based on average daily detention costs ($210/day) and average daily population (35,000)',
    lastUpdated: '2024-03-15',
  },
  'f35-procurement': {
    source: 'Department of Defense FY2024 Budget Request',
    sourceUrl: 'https://www.defense.gov/News/Releases/Release/Article/3284154/',
    methodology: 'Annual procurement costs for F-35 Joint Strike Fighter program',
    lastUpdated: '2024-03-28',
  },
  'aircraft-carrier-ford-class': {
    source: 'Congressional Research Service Report on Navy Ford Class Carriers',
    sourceUrl: 'https://crsreports.congress.gov',
    methodology: 'Total procurement cost for one Gerald R. Ford-class aircraft carrier',
    lastUpdated: '2023-12-08',
  },
  'ice-facility-expansion': {
    source: 'DHS FY2024 Congressional Budget Justification',
    sourceUrl: 'https://www.dhs.gov/budget',
    methodology: 'Requested funding for new ICE detention facility construction and expansion',
    lastUpdated: '2024-03-15',
  },
  'defense-rnd': {
    source: 'Department of Defense RDT&E Budget',
    sourceUrl: 'https://comptroller.defense.gov/Budget-Materials/',
    methodology: 'Total Research, Development, Test & Evaluation appropriations',
    lastUpdated: '2024-03-28',
  },
};

/**
 * Helper function to get featured comparisons sorted by display order
 */
export function getFeaturedComparisons(): SimpleFeaturedComparison[] {
  return [...FEATURED_COMPARISONS].sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Helper function to get a random featured comparison
 */
export function getRandomFeaturedComparison(): SimpleFeaturedComparison {
  const index = Math.floor(Math.random() * FEATURED_COMPARISONS.length);
  // Array is always populated with at least one comparison
  return FEATURED_COMPARISONS[index]!;
}

/**
 * Helper function to get featured comparisons by budget item ID
 */
export function getFeaturedComparisonsByBudgetItem(budgetItemId: string): SimpleFeaturedComparison[] {
  return FEATURED_COMPARISONS.filter(comp => comp.budgetItemId === budgetItemId);
}
