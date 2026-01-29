import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { BudgetItem } from '@/types/budget';

interface BudgetState {
  // Core state
  budgetData: BudgetItem | null;
  selectedItemId: string | null;
  breadcrumbPath: string[]; // Array of IDs representing the navigation path
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;

  // Actions
  setBudgetData: (data: BudgetItem) => void;
  selectItem: (id: string | null) => void;
  navigateToItem: (id: string) => void;
  goBack: () => void;
  goToRoot: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Derived getters
  getSelectedItem: () => BudgetItem | null;
  getChildrenOfSelected: () => BudgetItem[];
  getPercentageOfTotal: (amount: number) => number;
  getBreadcrumbItems: () => BudgetItem[];
}

/**
 * Recursively finds a budget item by ID
 */
const findItemById = (item: BudgetItem, id: string): BudgetItem | null => {
  if (item.id === id) return item;

  if (item.children) {
    for (const child of item.children) {
      const found = findItemById(child, id);
      if (found) return found;
    }
  }

  return null;
};

/**
 * Builds the path from root to a specific item ID
 */
const buildPathToItem = (root: BudgetItem, targetId: string): string[] => {
  const path: string[] = [];

  const traverse = (item: BudgetItem, currentPath: string[]): boolean => {
    if (item.id === targetId) {
      path.push(...currentPath, item.id);
      return true;
    }

    if (item.children) {
      for (const child of item.children) {
        if (traverse(child, [...currentPath, item.id])) {
          return true;
        }
      }
    }

    return false;
  };

  traverse(root, []);
  return path;
};

/**
 * Syncs breadcrumb path to URL query parameters
 */
const syncPathToUrl = (path: string[]) => {
  const url = new URL(window.location.href);

  if (path.length === 0) {
    url.searchParams.delete('path');
  } else {
    url.searchParams.set('path', path.join(','));
  }

  window.history.replaceState({}, '', url.toString());
};

/**
 * Reads breadcrumb path from URL query parameters
 */
const getPathFromUrl = (): string[] => {
  const params = new URLSearchParams(window.location.search);
  const pathParam = params.get('path');
  return pathParam ? pathParam.split(',').filter(Boolean) : [];
};

export const useBudgetStore = create<BudgetState>()(
  devtools(
    (set, get) => ({
      // Initial state
      budgetData: null,
      selectedItemId: null,
      breadcrumbPath: getPathFromUrl(),
      isLoading: false,
      error: null,
      lastUpdated: null,

      // Actions
      setBudgetData: (data) => {
        const _state = get();
        const urlPath = getPathFromUrl();

        // Validate URL path against new data
        let validatedPath: string[] = [];
        let selectedId: string | null = null;

        if (urlPath.length > 0) {
          // Check if the path is still valid with the new data
          const lastId = urlPath[urlPath.length - 1];
          const item = findItemById(data, lastId);

          if (item) {
            validatedPath = urlPath;
            selectedId = lastId;
          } else {
            // Invalid path, reset to root
            syncPathToUrl([]);
          }
        }

        set({
          budgetData: data,
          breadcrumbPath: validatedPath,
          selectedItemId: selectedId,
          lastUpdated: Date.now(),
          error: null,
        });
      },

      selectItem: (id) => {
        const state = get();

        if (!id) {
          // Deselect - go to root
          set({ selectedItemId: null, breadcrumbPath: [] });
          syncPathToUrl([]);
          return;
        }

        if (!state.budgetData) return;

        const item = findItemById(state.budgetData, id);
        if (!item) {
          set({ error: `Item with id "${id}" not found` });
          return;
        }

        const newPath = buildPathToItem(state.budgetData, id);
        set({ selectedItemId: id, breadcrumbPath: newPath, error: null });
        syncPathToUrl(newPath);
      },

      navigateToItem: (id) => {
        // Alias for selectItem for clarity in navigation contexts
        get().selectItem(id);
      },

      goBack: () => {
        const state = get();

        if (state.breadcrumbPath.length <= 1) {
          // Already at root or one level deep
          get().goToRoot();
          return;
        }

        // Remove the last item from the path
        const newPath = state.breadcrumbPath.slice(0, -1);
        const newSelectedId = newPath[newPath.length - 1] || null;

        set({
          breadcrumbPath: newPath,
          selectedItemId: newSelectedId,
          error: null,
        });
        syncPathToUrl(newPath);
      },

      goToRoot: () => {
        set({ selectedItemId: null, breadcrumbPath: [], error: null });
        syncPathToUrl([]);
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      // Derived getters
      getSelectedItem: () => {
        const state = get();

        if (!state.budgetData) return null;
        if (!state.selectedItemId) return state.budgetData;

        return findItemById(state.budgetData, state.selectedItemId);
      },

      getChildrenOfSelected: () => {
        const selectedItem = get().getSelectedItem();
        return selectedItem?.children || [];
      },

      getPercentageOfTotal: (amount) => {
        const state = get();

        if (!state.budgetData || state.budgetData.amount === 0) return 0;

        return (amount / state.budgetData.amount) * 100;
      },

      getBreadcrumbItems: () => {
        const state = get();

        if (!state.budgetData || state.breadcrumbPath.length === 0) {
          return [];
        }

        const items: BudgetItem[] = [];

        for (const id of state.breadcrumbPath) {
          const item = findItemById(state.budgetData, id);
          if (item) {
            items.push(item);
          }
        }

        return items;
      },
    }),
    { name: 'BudgetStore' }
  )
);

// Convenience hooks for common derived values
export const useSelectedItem = () => useBudgetStore((state) => state.getSelectedItem());
export const useChildrenOfSelected = () => useBudgetStore((state) => state.getChildrenOfSelected());
export const useBreadcrumbItems = () => useBudgetStore((state) => state.getBreadcrumbItems());
