/**
 * Wizard Category Definitions
 * Maps user-friendly categories to budget items and comparison units
 */

export interface WizardCategory {
  id: string;
  name: string;
  icon: string; // Lucide icon name (e.g., "GraduationCap", "Heart")
  description: string;
  budgetItemIds: string[];
  comparisonUnitIds: string[];
}

/**
 * Step 1: "What needs more investment?"
 * Categories the user wants to see funded MORE
 */
export const NEEDS_MORE_CATEGORIES: WizardCategory[] = [
  {
    id: "education",
    name: "Education",
    icon: "GraduationCap",
    description: "Schools, teachers, student aid",
    budgetItemIds: ["dept-education"],
    comparisonUnitIds: ["teacher-salary", "pell-grant", "school-supplies"],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "Heart",
    description: "Medicare, Medicaid, public health",
    budgetItemIds: ["dept-hhs"],
    comparisonUnitIds: [
      "health-insurance-premium",
      "hospital-bed",
      "medicare-enrollment",
    ],
  },
  {
    id: "veterans",
    name: "Veterans",
    icon: "Medal",
    description: "VA healthcare, benefits, housing",
    budgetItemIds: ["dept-va"],
    comparisonUnitIds: [
      "va-healthcare-year",
      "veteran-housing-voucher",
      "gi-bill-student",
    ],
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    icon: "Truck",
    description: "Roads, bridges, transit",
    budgetItemIds: ["dept-transportation"],
    comparisonUnitIds: ["mile-interstate", "bridge-repair", "subway-car"],
  },
  {
    id: "environment",
    name: "Environment",
    icon: "Leaf",
    description: "Clean energy, EPA, climate",
    budgetItemIds: ["dept-energy", "dept-epa"],
    comparisonUnitIds: [
      "solar-panel-installation",
      "ev-charging-station",
      "wind-turbine",
    ],
  },
  {
    id: "housing",
    name: "Housing",
    icon: "Home",
    description: "Affordable housing, rent assistance",
    budgetItemIds: ["dept-hud"],
    comparisonUnitIds: [
      "affordable-housing-unit",
      "section-8-voucher",
      "homeless-shelter-bed",
    ],
  },
  {
    id: "science",
    name: "Science & Research",
    icon: "FlaskConical",
    description: "NSF, NIH, NASA",
    budgetItemIds: ["dept-nasa", "dept-nsf"],
    comparisonUnitIds: ["nsf-research-grant", "nasa-mars-mission", "nih-grant"],
  },
  {
    id: "social-security",
    name: "Social Security",
    icon: "HandHeart",
    description: "Retirement, disability benefits",
    budgetItemIds: ["dept-ssa"],
    comparisonUnitIds: [
      "social-security-check",
      "disability-benefit-year",
      "retirement-benefit-year",
    ],
  },
];

/**
 * Step 2: "What's overfunded or wasteful?"
 * Categories the user thinks spend too much
 */
export const WASTEFUL_CATEGORIES: WizardCategory[] = [
  {
    id: "defense",
    name: "Defense & Military",
    icon: "Shield",
    description: "Pentagon, weapons, overseas bases",
    budgetItemIds: ["dept-defense", "f35-program", "aircraft-carrier"],
    comparisonUnitIds: [],
  },
  {
    id: "foreign-aid",
    name: "Foreign Aid",
    icon: "Globe",
    description: "International assistance",
    budgetItemIds: ["dept-state-foreign"],
    comparisonUnitIds: [],
  },
  {
    id: "government-admin",
    name: "Government Admin",
    icon: "Landmark",
    description: "Bureaucracy, overhead",
    budgetItemIds: ["dept-gsa", "dept-opm"],
    comparisonUnitIds: [],
  },
  {
    id: "farm-subsidies",
    name: "Farm Subsidies",
    icon: "Wheat",
    description: "Agricultural subsidies",
    budgetItemIds: ["dept-agriculture-subsidies"],
    comparisonUnitIds: [],
  },
  {
    id: "debt-interest",
    name: "Interest on Debt",
    icon: "DollarSign",
    description: "Treasury interest payments",
    budgetItemIds: ["dept-treasury"],
    comparisonUnitIds: [],
  },
  {
    id: "other",
    name: "Other Spending",
    icon: "MoreHorizontal",
    description: "Miscellaneous programs",
    budgetItemIds: ["dept-commerce", "dept-justice"],
    comparisonUnitIds: [],
  },
];

/**
 * Get category by ID from either list
 */
export function getCategoryById(id: string): WizardCategory | undefined {
  return (
    NEEDS_MORE_CATEGORIES.find((cat) => cat.id === id) ||
    WASTEFUL_CATEGORIES.find((cat) => cat.id === id)
  );
}

/**
 * Validate category IDs
 */
export function isValidNeedsMoreCategory(id: string): boolean {
  return NEEDS_MORE_CATEGORIES.some((cat) => cat.id === id);
}

export function isValidWastefulCategory(id: string): boolean {
  return WASTEFUL_CATEGORIES.some((cat) => cat.id === id);
}
