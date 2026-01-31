"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/**
 * Options for the useDebounce hook
 */
interface UseDebounceOptions {
  /** Delay in milliseconds (default: 300) */
  delay?: number;
  /** If true, trigger on the leading edge instead of trailing (default: false) */
  immediate?: boolean;
}

/**
 * Return type for the useDebounce hook
 */
interface UseDebounceResult<T> {
  /** The debounced value */
  debouncedValue: T;
  /** Function to cancel any pending debounce */
  cancel: () => void;
  /** Whether a debounce is currently pending */
  isPending: boolean;
}

/**
 * Debounce any value with configurable delay
 *
 * @param value - The value to debounce
 * @param options - Configuration options
 * @returns Object with debounced value, cancel function, and pending state
 *
 * @example
 * ```tsx
 * // Basic usage with search input
 * const [query, setQuery] = useState('');
 * const { debouncedValue } = useDebounce(query, { delay: 500 });
 *
 * useEffect(() => {
 *   if (debouncedValue) {
 *     fetchSearchResults(debouncedValue);
 *   }
 * }, [debouncedValue]);
 *
 * // With immediate option (leading edge)
 * const { debouncedValue, cancel, isPending } = useDebounce(value, {
 *   delay: 300,
 *   immediate: true,
 * });
 *
 * // Cancel pending debounce
 * const handleReset = () => {
 *   cancel();
 *   setValue('');
 * };
 * ```
 */
export function useDebounce<T>(
  value: T,
  options: UseDebounceOptions = {},
): UseDebounceResult<T> {
  const { delay = 300, immediate = false } = options;

  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPending(false);
  }, []);

  useEffect(() => {
    // Handle immediate mode on first value change
    if (immediate && isFirstRender.current) {
      isFirstRender.current = false;
      setDebouncedValue(value);
      return;
    }

    // If immediate mode is enabled and there's no pending timeout,
    // update immediately on the leading edge
    if (immediate && !timeoutRef.current) {
      setDebouncedValue(value);
    }

    setIsPending(true);

    timeoutRef.current = setTimeout(() => {
      if (!immediate) {
        setDebouncedValue(value);
      }
      setIsPending(false);
      timeoutRef.current = null;
    }, delay);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, immediate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return useMemo(
    () => ({
      debouncedValue,
      cancel,
      isPending,
    }),
    [debouncedValue, cancel, isPending],
  );
}

/**
 * Options for the useDebouncedCallback hook
 */
interface UseDebouncedCallbackOptions {
  /** Delay in milliseconds (default: 300) */
  delay?: number;
  /** If true, trigger on the leading edge instead of trailing (default: false) */
  immediate?: boolean;
  /** Maximum time to wait before forcing invocation (optional) */
  maxWait?: number;
}

/**
 * Return type for the useDebouncedCallback hook
 */
interface UseDebouncedCallbackResult<
  T extends (...args: unknown[]) => unknown,
> {
  /** The debounced callback function */
  debouncedCallback: (...args: Parameters<T>) => void;
  /** Function to cancel any pending debounce */
  cancel: () => void;
  /** Function to immediately invoke the pending callback */
  flush: () => void;
  /** Whether a debounce is currently pending */
  isPending: boolean;
}

/**
 * Debounce a callback function directly
 *
 * @param callback - The function to debounce
 * @param options - Configuration options
 * @returns Object with debounced callback, cancel, flush, and pending state
 *
 * @example
 * ```tsx
 * // Basic usage with input handler
 * const handleSearch = (query: string) => {
 *   fetchSearchResults(query);
 * };
 *
 * const { debouncedCallback } = useDebouncedCallback(handleSearch, { delay: 500 });
 *
 * return <input onChange={(e) => debouncedCallback(e.target.value)} />;
 *
 * // With immediate option and flush
 * const { debouncedCallback, cancel, flush, isPending } = useDebouncedCallback(
 *   saveData,
 *   { delay: 1000, immediate: true }
 * );
 *
 * // Force save before navigation
 * const handleNavigate = () => {
 *   flush();
 *   navigate('/next');
 * };
 *
 * // With maxWait to ensure periodic updates
 * const { debouncedCallback } = useDebouncedCallback(syncToServer, {
 *   delay: 500,
 *   maxWait: 2000, // Will sync at least every 2 seconds during rapid typing
 * });
 * ```
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  options: UseDebouncedCallbackOptions = {},
): UseDebouncedCallbackResult<T> {
  const { delay = 300, immediate = false, maxWait } = options;

  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxWaitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const lastInvokeTimeRef = useRef<number>(0);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const invokeCallback = useCallback(() => {
    if (lastArgsRef.current !== null) {
      callbackRef.current(...lastArgsRef.current);
      lastArgsRef.current = null;
      lastInvokeTimeRef.current = Date.now();
    }
    setIsPending(false);
  }, []);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxWaitTimeoutRef.current) {
      clearTimeout(maxWaitTimeoutRef.current);
      maxWaitTimeoutRef.current = null;
    }
    lastArgsRef.current = null;
    setIsPending(false);
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxWaitTimeoutRef.current) {
      clearTimeout(maxWaitTimeoutRef.current);
      maxWaitTimeoutRef.current = null;
    }
    invokeCallback();
  }, [invokeCallback]);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      lastArgsRef.current = args;

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Handle immediate mode (leading edge)
      if (immediate && !timeoutRef.current && !isPending) {
        invokeCallback();
      }

      setIsPending(true);

      // Set up maxWait timeout if specified and not already set
      if (maxWait && !maxWaitTimeoutRef.current) {
        const timeSinceLastInvoke = Date.now() - lastInvokeTimeRef.current;
        const remainingMaxWait = Math.max(0, maxWait - timeSinceLastInvoke);

        maxWaitTimeoutRef.current = setTimeout(() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          maxWaitTimeoutRef.current = null;
          invokeCallback();
        }, remainingMaxWait);
      }

      // Set up regular debounce timeout
      timeoutRef.current = setTimeout(() => {
        if (maxWaitTimeoutRef.current) {
          clearTimeout(maxWaitTimeoutRef.current);
          maxWaitTimeoutRef.current = null;
        }
        timeoutRef.current = null;
        if (!immediate) {
          invokeCallback();
        } else {
          setIsPending(false);
        }
      }, delay);
    },
    [delay, immediate, maxWait, isPending, invokeCallback],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return useMemo(
    () => ({
      debouncedCallback,
      cancel,
      flush,
      isPending,
    }),
    [debouncedCallback, cancel, flush, isPending],
  );
}
