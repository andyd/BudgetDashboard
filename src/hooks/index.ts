/**
 * Hooks Index
 *
 * Central export point for all custom React hooks in the Budget Dashboard.
 * Hooks are organized by category for easier discovery and maintainability.
 */

// ============================================================================
// State Management Hooks
// ============================================================================

/**
 * Hook for persisting state to localStorage with SSR support.
 * Provides useState-like API with automatic serialization.
 */
export { useLocalStorage } from "./use-local-storage";

/**
 * Hook for fetching budget hierarchy data with loading/error states.
 * Supports drill-down paths for navigating budget structure.
 */
export {
  useBudgetData,
  useComparisons,
  useUnits,
  useFeatured,
} from "./useBudgetData";

/**
 * Hook for managing user's favorite comparisons.
 * Uses useSyncExternalStore for proper hydration and cross-tab sync.
 */
export {
  useFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  getFavorites,
  clearFavorites,
  toggleFavorite,
} from "./useFavorites";
export type { FavoriteItem } from "./useFavorites";

/**
 * Hook for building comparisons between spending items and units.
 * Provides smart auto-fill and alternatives suggestions.
 */
export {
  useComparisonBuilder,
  budgetCategoryToSpendingItem,
} from "./useComparisonBuilder";
export type {
  SpendingItem,
  BuilderComparisonResult,
  Alternative,
  ComparisonBuilderState,
} from "./useComparisonBuilder";

/**
 * Hook for displaying toast notifications.
 * Supports success and error message types.
 */
export { useToast } from "./useToast";

// ============================================================================
// DOM / Layout Hooks
// ============================================================================

/**
 * Hook for responsive media query matching.
 * Includes common breakpoint helpers (isMobile, isTablet, isDesktop).
 */
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLargeScreen,
} from "./use-media-query";

/**
 * Hook for tracking container dimensions with ResizeObserver.
 * Handles SSR gracefully and debounces resize events.
 */
export { useChartDimensions } from "./useChartDimensions";
export type {
  ChartDimensions,
  UseChartDimensionsOptions,
  UseChartDimensionsResult,
} from "./useChartDimensions";

// ============================================================================
// Keyboard / Accessibility Hooks
// ============================================================================

/**
 * Hook for keyboard navigation in lists and grids.
 * Supports arrow keys, Home/End, Enter/Escape for drill-down navigation.
 */
export {
  useKeyboardNav,
  canDrillInto,
  getKeyboardShortcuts,
} from "./useKeyboardNav";
export type {
  KeyboardNavItem,
  UseKeyboardNavOptions,
  UseKeyboardNavReturn,
} from "./useKeyboardNav";

/**
 * Hook for registering global keyboard shortcuts.
 * Platform-aware (Cmd on Mac, Ctrl on Windows).
 */
export {
  useKeyboardShortcuts,
  useKeyboardShortcutsContext,
  KeyboardShortcutsProvider,
  createSearchShortcut,
  createNavigationShortcuts,
  createSelectionShortcut,
  createEscapeShortcut,
  getModifierSymbol,
  formatShortcut,
  getKeyboardShortcutsInfo,
} from "./useKeyboardShortcuts";
export type {
  ModifierKey,
  KeyboardShortcut,
  KeyboardShortcutsContextValue,
  KeyboardShortcutsProviderProps,
  UseKeyboardShortcutsOptions,
} from "./useKeyboardShortcuts";
