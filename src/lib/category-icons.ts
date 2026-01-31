// Category configuration with icons, colors, and labels

export type Category =
  | "healthcare"
  | "education"
  | "housing"
  | "food"
  | "transportation"
  | "income"
  | "public-services"
  | "veterans"
  | "environment";

export type SpendingTier = "department" | "program" | "current-event";

interface CategoryConfig {
  icon: string;
  color: string;
  label: string;
}

export const CATEGORY_CONFIG: Record<Category, CategoryConfig> = {
  healthcare: {
    icon: "Heart",
    color: "#ef4444", // red-500
    label: "Healthcare",
  },
  education: {
    icon: "GraduationCap",
    color: "#3b82f6", // blue-500
    label: "Education",
  },
  housing: {
    icon: "Home",
    color: "#f97316", // orange-500
    label: "Housing",
  },
  food: {
    icon: "Utensils",
    color: "#22c55e", // green-500
    label: "Food & Nutrition",
  },
  transportation: {
    icon: "Car",
    color: "#6366f1", // indigo-500
    label: "Transportation",
  },
  income: {
    icon: "DollarSign",
    color: "#10b981", // emerald-500
    label: "Income Support",
  },
  "public-services": {
    icon: "Building2",
    color: "#8b5cf6", // violet-500
    label: "Public Services",
  },
  veterans: {
    icon: "Shield",
    color: "#0ea5e9", // sky-500
    label: "Veterans Affairs",
  },
  environment: {
    icon: "Leaf",
    color: "#84cc16", // lime-500
    label: "Environment",
  },
};

export const SPENDING_TIER_CONFIG: Record<SpendingTier, CategoryConfig> = {
  department: {
    icon: "Building",
    color: "#64748b", // slate-500
    label: "Department",
  },
  program: {
    icon: "FolderOpen",
    color: "#71717a", // zinc-500
    label: "Program",
  },
  "current-event": {
    icon: "Newspaper",
    color: "#f59e0b", // amber-500
    label: "Current Event",
  },
};

/**
 * Get the icon name for a category
 */
export function getCategoryIcon(category: Category): string {
  return CATEGORY_CONFIG[category]?.icon ?? "Circle";
}

/**
 * Get the color for a category
 */
export function getCategoryColor(category: Category): string {
  return CATEGORY_CONFIG[category]?.color ?? "#6b7280";
}

/**
 * Get the display label for a category
 */
export function getCategoryLabel(category: Category): string {
  return CATEGORY_CONFIG[category]?.label ?? category;
}

/**
 * Get the icon name for a spending tier
 */
export function getSpendingTierIcon(tier: SpendingTier): string {
  return SPENDING_TIER_CONFIG[tier]?.icon ?? "Circle";
}

/**
 * Get the color for a spending tier
 */
export function getSpendingTierColor(tier: SpendingTier): string {
  return SPENDING_TIER_CONFIG[tier]?.color ?? "#6b7280";
}

/**
 * Get the display label for a spending tier
 */
export function getSpendingTierLabel(tier: SpendingTier): string {
  return SPENDING_TIER_CONFIG[tier]?.label ?? tier;
}
