/**
 * Wizard Category Mappings
 *
 * Maps wizard categories to specific budget items and comparison units.
 * Used to generate personalized comparisons based on user priorities.
 */

import type { BudgetSpendingItem } from "./data/budget-items";
import type { ComparisonUnit } from "./data/comparison-units";
import { ALL_BUDGET_ITEMS } from "./data/budget-items";
import { ALL_COMPARISON_UNITS } from "./data/comparison-units";

/**
 * Wizard category for "needs more investment" question
 */
export type PriorityCategory =
  | "education"
  | "healthcare"
  | "veterans"
  | "infrastructure"
  | "environment"
  | "housing"
  | "science"
  | "social-security";

/**
 * Wizard category for "wasteful spending" question
 */
export type WastefulCategory =
  | "defense"
  | "foreign-aid"
  | "admin"
  | "farm-subsidies"
  | "interest"
  | "other";

/**
 * Category definition with display metadata
 */
export interface CategoryDefinition {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

/**
 * Priority categories shown in Step 1
 */
export const PRIORITY_CATEGORIES: Record<PriorityCategory, CategoryDefinition> =
  {
    education: {
      id: "education",
      name: "Education",
      description: "Schools, teachers, student aid",
      icon: "GraduationCap",
    },
    healthcare: {
      id: "healthcare",
      name: "Healthcare",
      description: "Medicare, Medicaid, public health",
      icon: "Heart",
    },
    veterans: {
      id: "veterans",
      name: "Veterans",
      description: "VA healthcare, benefits, services",
      icon: "Medal",
    },
    infrastructure: {
      id: "infrastructure",
      name: "Infrastructure",
      description: "Roads, bridges, transit",
      icon: "Truck",
    },
    environment: {
      id: "environment",
      name: "Environment",
      description: "Clean energy, EPA, climate",
      icon: "Leaf",
    },
    housing: {
      id: "housing",
      name: "Housing",
      description: "Affordable housing, Section 8",
      icon: "Home",
    },
    science: {
      id: "science",
      name: "Science & Research",
      description: "NASA, NSF, NIH, research",
      icon: "FlaskConical",
    },
    "social-security": {
      id: "social-security",
      name: "Social Security",
      description: "Retirement, disability benefits",
      icon: "HandHeart",
    },
  };

/**
 * Wasteful categories shown in Step 2
 */
export const WASTEFUL_CATEGORIES: Record<WastefulCategory, CategoryDefinition> =
  {
    defense: {
      id: "defense",
      name: "Defense/Military",
      description: "DOD, weapons, overseas bases",
      icon: "Shield",
    },
    "foreign-aid": {
      id: "foreign-aid",
      name: "Foreign Aid",
      description: "International assistance",
      icon: "Globe",
    },
    admin: {
      id: "admin",
      name: "Government Admin",
      description: "Bureaucracy, overhead",
      icon: "Landmark",
    },
    "farm-subsidies": {
      id: "farm-subsidies",
      name: "Farm Subsidies",
      description: "Agricultural subsidies",
      icon: "Wheat",
    },
    interest: {
      id: "interest",
      name: "Interest on Debt",
      description: "National debt payments",
      icon: "DollarSign",
    },
    other: {
      id: "other",
      name: "Other",
      description: "Miscellaneous spending",
      icon: "MoreHorizontal",
    },
  };

/**
 * Get budget items for a wasteful category
 */
export function getBudgetItemsForCategory(
  category: WastefulCategory,
): BudgetSpendingItem[] {
  const mapping: Record<WastefulCategory, string[]> = {
    defense: [
      "dept-defense",
      "program-f35",
      "program-aircraft-carrier",
      "program-nuclear-weapons",
      "program-missile-defense",
      "program-overseas-operations", // Fixed: was "program-overseas-bases"
    ],
    "foreign-aid": ["dept-state"],
    admin: ["dept-justice"], // Could add more admin-related items
    "farm-subsidies": ["dept-usda"],
    interest: ["dept-treasury"],
    other: [], // Empty for now
  };

  const itemIds = mapping[category] || [];
  return ALL_BUDGET_ITEMS.filter((item) => itemIds.includes(item.id));
}

/**
 * Get comparison units for a priority category
 */
export function getComparisonUnitsForCategory(
  category: PriorityCategory,
): ComparisonUnit[] {
  const mapping: Record<PriorityCategory, string> = {
    education: "education",
    healthcare: "healthcare",
    veterans: "veterans",
    infrastructure: "transportation",
    environment: "environment",
    housing: "housing",
    science: "education", // Maps to education category for research-related units
    "social-security": "income",
  };

  const unitCategory = mapping[category];
  return ALL_COMPARISON_UNITS.filter((unit) => unit.category === unitCategory);
}

/**
 * Get display name for a category
 */
export function getCategoryName(
  category: PriorityCategory | WastefulCategory,
): string {
  if (category in PRIORITY_CATEGORIES) {
    return PRIORITY_CATEGORIES[category as PriorityCategory].name;
  }
  if (category in WASTEFUL_CATEGORIES) {
    return WASTEFUL_CATEGORIES[category as WastefulCategory].name;
  }
  return category;
}

/**
 * Get total budget amount for a category
 */
export function getCategoryBudgetTotal(
  category: PriorityCategory | WastefulCategory,
): number {
  let items: BudgetSpendingItem[] = [];

  if (category in WASTEFUL_CATEGORIES) {
    items = getBudgetItemsForCategory(category as WastefulCategory);
  } else {
    // For priority categories, map to departments
    const deptMapping: Record<PriorityCategory, string[]> = {
      education: ["dept-education"],
      healthcare: ["dept-hhs"],
      veterans: ["dept-va"],
      infrastructure: ["dept-dot"],
      environment: ["dept-epa", "dept-energy"],
      housing: ["dept-hud"],
      science: ["dept-nasa"],
      "social-security": ["dept-ssa"],
    };

    const deptIds = deptMapping[category as PriorityCategory] || [];
    items = ALL_BUDGET_ITEMS.filter((item) => deptIds.includes(item.id));
  }

  return items.reduce((sum, item) => sum + item.amount, 0);
}

/**
 * Get the icon name for a category
 */
export function getCategoryIcon(
  category: PriorityCategory | WastefulCategory,
): string {
  if (category in PRIORITY_CATEGORIES) {
    return (
      PRIORITY_CATEGORIES[category as PriorityCategory].icon || "HelpCircle"
    );
  }
  if (category in WASTEFUL_CATEGORIES) {
    return (
      WASTEFUL_CATEGORIES[category as WastefulCategory].icon || "HelpCircle"
    );
  }
  return "HelpCircle";
}

/**
 * Get the description for a category
 */
export function getCategoryDescription(
  category: PriorityCategory | WastefulCategory,
): string {
  if (category in PRIORITY_CATEGORIES) {
    return PRIORITY_CATEGORIES[category as PriorityCategory].description;
  }
  if (category in WASTEFUL_CATEGORIES) {
    return WASTEFUL_CATEGORIES[category as WastefulCategory].description;
  }
  return "";
}
