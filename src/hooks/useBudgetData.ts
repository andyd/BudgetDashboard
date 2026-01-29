'use client';

import { useState, useEffect } from 'react';
import type { BudgetItem, Comparison, Unit } from '@/types';
import type {
  BudgetHierarchy,
  AnyBudgetItem,
} from '@/types/budget';

/**
 * Hook state interface for data fetching
 */
interface UseDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Fetch budget hierarchy or specific item by path
 *
 * @param path - Optional path array to drill down (e.g., ['department-id', 'agency-id'])
 * @returns Budget data with loading and error states
 *
 * @example
 * ```tsx
 * // Fetch entire budget hierarchy
 * const { data, loading, error } = useBudgetData();
 *
 * // Fetch specific department
 * const { data, loading, error } = useBudgetData(['dept-defense']);
 *
 * // Fetch specific program
 * const { data, loading, error } = useBudgetData(['dept-defense', 'army', 'personnel']);
 * ```
 */
export function useBudgetData(path?: string[]): UseDataState<BudgetHierarchy | AnyBudgetItem> {
  const [state, setState] = useState<UseDataState<BudgetHierarchy | AnyBudgetItem>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchBudgetData() {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const pathParam = path && path.length > 0 ? `?path=${path.join('/')}` : '';
        const response = await fetch(`/api/budget${pathParam}`, {
          cache: 'force-cache',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch budget data: ${response.statusText}`);
        }

        const result = await response.json();

        if (!cancelled) {
          setState({
            data: result.data,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error : new Error('Unknown error occurred'),
          });
        }
      }
    }

    fetchBudgetData();

    return () => {
      cancelled = true;
    };
  }, [path?.join('/')]);

  return state;
}

/**
 * Fetch comparisons with optional filter for featured only
 *
 * @param featured - If true, only return featured comparisons
 * @returns Array of comparisons with loading and error states
 *
 * @example
 * ```tsx
 * // Fetch all comparisons
 * const { data, loading, error } = useComparisons();
 *
 * // Fetch only featured comparisons
 * const { data, loading, error } = useComparisons(true);
 * ```
 */
export function useComparisons(featured?: boolean): UseDataState<Comparison[]> {
  const [state, setState] = useState<UseDataState<Comparison[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchComparisons() {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const featuredParam = featured ? '?featured=true' : '';
        const response = await fetch(`/api/comparisons${featuredParam}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch comparisons: ${response.statusText}`);
        }

        const result = await response.json();

        if (!cancelled) {
          setState({
            data: result.data || [],
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error : new Error('Unknown error occurred'),
          });
        }
      }
    }

    fetchComparisons();

    return () => {
      cancelled = true;
    };
  }, [featured]);

  return state;
}

/**
 * Fetch all available comparison units
 *
 * @returns Array of comparison units with loading and error states
 *
 * @example
 * ```tsx
 * const { data: units, loading, error } = useUnits();
 *
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 *
 * return (
 *   <select>
 *     {units?.map(unit => (
 *       <option key={unit.id} value={unit.id}>
 *         {unit.name} (${unit.cost})
 *       </option>
 *     ))}
 *   </select>
 * );
 * ```
 */
export function useUnits(): UseDataState<Unit[]> {
  const [state, setState] = useState<UseDataState<Unit[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchUnits() {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const response = await fetch('/api/units', {
          cache: 'force-cache',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch units: ${response.statusText}`);
        }

        const result = await response.json();

        if (!cancelled) {
          setState({
            data: result.data || [],
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error : new Error('Unknown error occurred'),
          });
        }
      }
    }

    fetchUnits();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

/**
 * Fetch featured comparisons only (convenience hook)
 *
 * @returns Array of featured comparisons with loading and error states
 *
 * @example
 * ```tsx
 * const { data: featured, loading, error } = useFeatured();
 *
 * return (
 *   <FeaturedCarousel comparisons={featured || []} />
 * );
 * ```
 */
export function useFeatured(): UseDataState<Comparison[]> {
  return useComparisons(true);
}
