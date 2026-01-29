/**
 * Comparison Store
 * Zustand store for managing comparison units and calculations
 */

import { create } from 'zustand';
import type {
  ComparisonUnit,
  FeaturedComparison,
  CustomComparison,
  ComparisonResult,
} from '@/types/comparison';

/**
 * Comparison store state
 */
interface ComparisonState {
  /** Available comparison units */
  units: ComparisonUnit[];

  /** Featured comparisons from editors */
  featuredComparisons: FeaturedComparison[];

  /** User's custom comparison */
  customComparison: CustomComparison | null;

  /** Loading state */
  isLoading: boolean;

  /** Error message */
  error: string | null;

  // Actions
  /** Set comparison units */
  setUnits: (units: ComparisonUnit[]) => void;

  /** Set featured comparisons */
  setFeatured: (comparisons: FeaturedComparison[]) => void;

  /** Set custom comparison inputs */
  setCustomComparison: (
    leftItemId: string,
    rightItemId: string,
    selectedUnitId: string
  ) => void;

  /** Calculate and update comparison result */
  calculateComparison: (dollarAmount: number, unitId: string) => void;

  /** Clear custom comparison */
  clearCustom: () => void;

  /** Set loading state */
  setLoading: (loading: boolean) => void;

  /** Set error state */
  setError: (error: string | null) => void;
}

/**
 * Format large numbers with appropriate suffix
 */
function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)} million`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)} thousand`;
  }
  return num.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  });
}

/**
 * Format comparison result string
 */
function formatComparisonString(
  unitCount: number,
  unit: ComparisonUnit
): string {
  const formattedCount = formatNumber(unitCount);
  const unitName = unitCount === 1 ? unit.nameSingular : unit.name;
  return `${formattedCount} ${unitName}`;
}

/**
 * Create comparison store
 */
export const useComparisonStore = create<ComparisonState>((set, get) => ({
  // Initial state
  units: [],
  featuredComparisons: [],
  customComparison: null,
  isLoading: false,
  error: null,

  // Actions
  setUnits: (units) => {
    set({ units, error: null });
  },

  setFeatured: (comparisons) => {
    set({ featuredComparisons: comparisons, error: null });
  },

  setCustomComparison: (leftItemId, rightItemId, selectedUnitId) => {
    const { units } = get();
    const unit = units.find((u) => u.id === selectedUnitId);

    if (!unit) {
      set({
        error: `Unit with ID ${selectedUnitId} not found`,
        customComparison: null,
      });
      return;
    }

    set({
      customComparison: {
        leftItemId,
        rightItemId,
        selectedUnitId,
        result: null,
      },
      error: null,
    });
  },

  calculateComparison: (dollarAmount, unitId) => {
    const { units, customComparison } = get();
    const unit = units.find((u) => u.id === unitId);

    if (!unit) {
      set({
        error: `Unit with ID ${unitId} not found`,
      });
      return;
    }

    if (unit.costPerUnit <= 0) {
      set({
        error: 'Unit cost must be greater than zero',
      });
      return;
    }

    // Calculate unit count
    const unitCount = dollarAmount / unit.costPerUnit;

    // Format result string
    const formatted = formatComparisonString(unitCount, unit);

    // Create result object
    const result: ComparisonResult = {
      unitCount,
      formatted,
      unit,
      dollarAmount,
    };

    // Update custom comparison if it exists
    if (customComparison) {
      set({
        customComparison: {
          ...customComparison,
          result,
        },
        error: null,
      });
    }
  },

  clearCustom: () => {
    set({
      customComparison: null,
      error: null,
    });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },
}));
