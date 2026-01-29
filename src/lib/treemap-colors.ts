/**
 * Color mapping for budget category treemap visualization
 *
 * Each category has a primary color and a scale with light/dark variants
 * for nested visualizations or hover states.
 */

export type CategoryId =
  | 'defense'
  | 'healthcare'
  | 'hhs'
  | 'treasury'
  | 'finance'
  | 'education'
  | 'dhs'
  | 'ice'
  | 'veterans'
  | 'social-security'
  | 'agriculture'
  | 'transportation'
  | 'justice'
  | 'state'
  | 'labor'
  | 'energy'
  | 'housing'
  | 'interior'
  | 'commerce'
  | 'epa'
  | 'nasa'
  | 'other';

export interface CategoryColor {
  primary: string;
  light: string;
  dark: string;
  hover: string;
}

/**
 * Comprehensive category color mapping
 * Colors are chosen for visual distinction and semantic meaning
 */
export const CATEGORY_COLORS: Record<CategoryId, CategoryColor> = {
  // Defense - Red tones (urgency, strength)
  defense: {
    primary: '#DC2626', // red-600
    light: '#EF4444',   // red-500
    dark: '#B91C1C',    // red-700
    hover: '#F87171',   // red-400
  },

  // Healthcare/HHS - Blue tones (trust, health)
  healthcare: {
    primary: '#2563EB', // blue-600
    light: '#3B82F6',   // blue-500
    dark: '#1D4ED8',    // blue-700
    hover: '#60A5FA',   // blue-400
  },
  hhs: {
    primary: '#1E40AF', // blue-800
    light: '#2563EB',   // blue-600
    dark: '#1E3A8A',    // blue-900
    hover: '#3B82F6',   // blue-500
  },

  // Treasury/Finance - Green tones (money, growth)
  treasury: {
    primary: '#16A34A', // green-600
    light: '#22C55E',   // green-500
    dark: '#15803D',    // green-700
    hover: '#4ADE80',   // green-400
  },
  finance: {
    primary: '#059669', // emerald-600
    light: '#10B981',   // emerald-500
    dark: '#047857',    // emerald-700
    hover: '#34D399',   // emerald-400
  },

  // Education - Purple tones (knowledge, wisdom)
  education: {
    primary: '#9333EA', // purple-600
    light: '#A855F7',   // purple-500
    dark: '#7E22CE',    // purple-700
    hover: '#C084FC',   // purple-400
  },

  // DHS/ICE - Orange tones (alert, security)
  dhs: {
    primary: '#EA580C', // orange-600
    light: '#F97316',   // orange-500
    dark: '#C2410C',    // orange-700
    hover: '#FB923C',   // orange-400
  },
  ice: {
    primary: '#C2410C', // orange-700
    light: '#EA580C',   // orange-600
    dark: '#9A3412',    // orange-800
    hover: '#F97316',   // orange-500
  },

  // Veterans - Navy (honor, service)
  veterans: {
    primary: '#1E3A8A', // blue-900
    light: '#1E40AF',   // blue-800
    dark: '#1E293B',    // slate-800
    hover: '#2563EB',   // blue-600
  },

  // Social Security - Teal (stability, support)
  'social-security': {
    primary: '#0D9488', // teal-600
    light: '#14B8A6',   // teal-500
    dark: '#0F766E',    // teal-700
    hover: '#2DD4BF',   // teal-400
  },

  // Agriculture - Lime (nature, growth)
  agriculture: {
    primary: '#65A30D', // lime-600
    light: '#84CC16',   // lime-500
    dark: '#4D7C0F',    // lime-700
    hover: '#A3E635',   // lime-400
  },

  // Transportation - Cyan (movement, infrastructure)
  transportation: {
    primary: '#0891B2', // cyan-600
    light: '#06B6D4',   // cyan-500
    dark: '#0E7490',    // cyan-700
    hover: '#22D3EE',   // cyan-400
  },

  // Justice - Indigo (law, authority)
  justice: {
    primary: '#4F46E5', // indigo-600
    light: '#6366F1',   // indigo-500
    dark: '#4338CA',    // indigo-700
    hover: '#818CF8',   // indigo-400
  },

  // State - Rose (diplomacy)
  state: {
    primary: '#E11D48', // rose-600
    light: '#F43F5E',   // rose-500
    dark: '#BE123C',    // rose-700
    hover: '#FB7185',   // rose-400
  },

  // Labor - Amber (work, productivity)
  labor: {
    primary: '#D97706', // amber-600
    light: '#F59E0B',   // amber-500
    dark: '#B45309',    // amber-700
    hover: '#FBBF24',   // amber-400
  },

  // Energy - Yellow (power, electricity)
  energy: {
    primary: '#CA8A04', // yellow-600
    light: '#EAB308',   // yellow-500
    dark: '#A16207',    // yellow-700
    hover: '#FCD34D',   // yellow-400
  },

  // Housing - Sky (shelter, community)
  housing: {
    primary: '#0284C7', // sky-600
    light: '#0EA5E9',   // sky-500
    dark: '#075985',    // sky-700
    hover: '#38BDF8',   // sky-400
  },

  // Interior - Stone (land, resources)
  interior: {
    primary: '#78716C', // stone-600
    light: '#A8A29E',   // stone-400
    dark: '#57534E',    // stone-700
    hover: '#D6D3D1',   // stone-300
  },

  // Commerce - Violet (trade, business)
  commerce: {
    primary: '#7C3AED', // violet-600
    light: '#8B5CF6',   // violet-500
    dark: '#6D28D9',    // violet-700
    hover: '#A78BFA',   // violet-400
  },

  // EPA - Green (environment)
  epa: {
    primary: '#16A34A', // green-600
    light: '#22C55E',   // green-500
    dark: '#15803D',    // green-700
    hover: '#4ADE80',   // green-400
  },

  // NASA - Blue (space, innovation)
  nasa: {
    primary: '#1E40AF', // blue-800
    light: '#2563EB',   // blue-600
    dark: '#1E3A8A',    // blue-900
    hover: '#3B82F6',   // blue-500
  },

  // Other - Gray tones (neutral, miscellaneous)
  other: {
    primary: '#6B7280', // gray-500
    light: '#9CA3AF',   // gray-400
    dark: '#4B5563',    // gray-600
    hover: '#D1D5DB',   // gray-300
  },
};

/**
 * Get the primary color for a category
 *
 * @param categoryId - The category identifier
 * @returns Hex color string
 *
 * @example
 * getCategoryColor('defense') // '#DC2626'
 * getCategoryColor('healthcare') // '#2563EB'
 */
export function getCategoryColor(categoryId: string): string {
  const normalizedId = categoryId.toLowerCase().replace(/[\s_]/g, '-') as CategoryId;

  if (normalizedId in CATEGORY_COLORS) {
    return CATEGORY_COLORS[normalizedId].primary;
  }

  // Fallback to 'other' if category not found
  return CATEGORY_COLORS.other.primary;
}

/**
 * Get a light/dark color scale for a category
 * Useful for nested treemap visualizations or graduated fills
 *
 * @param categoryId - The category identifier
 * @returns Tuple of [light, dark] hex colors
 *
 * @example
 * const [light, dark] = getCategoryColorScale('defense');
 * // light = '#EF4444', dark = '#B91C1C'
 */
export function getCategoryColorScale(categoryId: string): [string, string] {
  const normalizedId = categoryId.toLowerCase().replace(/[\s_]/g, '-') as CategoryId;

  if (normalizedId in CATEGORY_COLORS) {
    const colors = CATEGORY_COLORS[normalizedId];
    return [colors.light, colors.dark];
  }

  // Fallback to 'other' if category not found
  return [CATEGORY_COLORS.other.light, CATEGORY_COLORS.other.dark];
}

/**
 * Get hover color for a category (typically lighter for visual feedback)
 *
 * @param categoryId - The category identifier
 * @returns Hex color string
 */
export function getCategoryHoverColor(categoryId: string): string {
  const normalizedId = categoryId.toLowerCase().replace(/[\s_]/g, '-') as CategoryId;

  if (normalizedId in CATEGORY_COLORS) {
    return CATEGORY_COLORS[normalizedId].hover;
  }

  return CATEGORY_COLORS.other.hover;
}

/**
 * Get all color variants for a category
 *
 * @param categoryId - The category identifier
 * @returns CategoryColor object with primary, light, dark, and hover colors
 */
export function getCategoryColorVariants(categoryId: string): CategoryColor {
  const normalizedId = categoryId.toLowerCase().replace(/[\s_]/g, '-') as CategoryId;

  if (normalizedId in CATEGORY_COLORS) {
    return CATEGORY_COLORS[normalizedId];
  }

  return CATEGORY_COLORS.other;
}

/**
 * Get list of all defined category IDs
 * Useful for iteration or validation
 */
export function getAllCategoryIds(): CategoryId[] {
  return Object.keys(CATEGORY_COLORS) as CategoryId[];
}

/**
 * Check if a category ID is valid/defined
 */
export function isValidCategoryId(categoryId: string): boolean {
  const normalizedId = categoryId.toLowerCase().replace(/[\s_]/g, '-');
  return normalizedId in CATEGORY_COLORS;
}
