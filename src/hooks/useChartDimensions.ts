"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// Breakpoint values matching the project's media query hooks
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

// Default dimensions for SSR and initial hydration
const DEFAULT_DIMENSIONS: ChartDimensions = {
  width: 0,
  height: 0,
  isMobile: false,
  isTablet: false,
};

/**
 * Dimensions object returned by the useChartDimensions hook
 */
export interface ChartDimensions {
  /** Container width in pixels */
  width: number;
  /** Container height in pixels */
  height: number;
  /** True if viewport width is <= 768px */
  isMobile: boolean;
  /** True if viewport width is between 769px and 1024px */
  isTablet: boolean;
}

/**
 * Options for configuring the useChartDimensions hook
 */
export interface UseChartDimensionsOptions {
  /** Debounce delay in milliseconds (default: 150) */
  debounceMs?: number;
  /** Initial width to use during SSR (default: 0) */
  initialWidth?: number;
  /** Initial height to use during SSR (default: 0) */
  initialHeight?: number;
}

/**
 * Return type of the useChartDimensions hook
 */
export interface UseChartDimensionsResult extends ChartDimensions {
  /** Ref to attach to the container element */
  ref: React.RefCallback<HTMLElement>;
}

/**
 * Debounce utility function
 */
function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
): ((...args: Args) => void) & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = ((...args: Args) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  }) as ((...args: Args) => void) & { cancel: () => void };

  debouncedFn.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFn;
}

/**
 * Hook to track container dimensions for responsive charts.
 * Uses ResizeObserver for efficient updates and debounces resize events.
 * Handles SSR gracefully by returning default values during hydration.
 *
 * @example
 * ```tsx
 * function ChartComponent() {
 *   const { ref, width, height, isMobile } = useChartDimensions();
 *
 *   return (
 *     <div ref={ref} style={{ width: '100%', height: 400 }}>
 *       {width > 0 && (
 *         <svg width={width} height={height}>
 *           {isMobile ? <MobileChart /> : <DesktopChart />}
 *         </svg>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useChartDimensions(
  options: UseChartDimensionsOptions = {},
): UseChartDimensionsResult {
  const { debounceMs = 150, initialWidth = 0, initialHeight = 0 } = options;

  // Track hydration state to handle SSR
  const [isHydrated, setIsHydrated] = useState(false);

  const [dimensions, setDimensions] = useState<ChartDimensions>(() => ({
    width: initialWidth,
    height: initialHeight,
    isMobile: false,
    isTablet: false,
  }));

  // Keep track of the current element and observer
  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const debouncedUpdateRef = useRef<
    (((width: number, height: number) => void) & { cancel: () => void }) | null
  >(null);

  // Create the dimension update function
  const updateDimensions = useCallback((width: number, height: number) => {
    setDimensions({
      width: Math.floor(width),
      height: Math.floor(height),
      isMobile: width <= MOBILE_BREAKPOINT,
      isTablet: width > MOBILE_BREAKPOINT && width <= TABLET_BREAKPOINT,
    });
  }, []);

  // Create debounced version of update function
  useEffect(() => {
    debouncedUpdateRef.current = debounce(updateDimensions, debounceMs);
    return () => {
      debouncedUpdateRef.current?.cancel();
    };
  }, [updateDimensions, debounceMs]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  // Mark as hydrated after mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Callback ref to attach to container element
  const ref = useCallback(
    (element: HTMLElement | null) => {
      // Clean up previous observer if element changes
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      elementRef.current = element;

      if (!element || typeof window === "undefined") {
        return;
      }

      // Get initial dimensions immediately (no debounce for first read)
      const { width, height } = element.getBoundingClientRect();
      updateDimensions(width, height);

      // Create ResizeObserver for subsequent updates
      if (typeof ResizeObserver !== "undefined") {
        observerRef.current = new ResizeObserver((entries) => {
          const entry = entries[0];
          if (entry) {
            const { width: newWidth, height: newHeight } = entry.contentRect;
            // Use debounced update for resize events
            debouncedUpdateRef.current?.(newWidth, newHeight);
          }
        });

        observerRef.current.observe(element);
      }
    },
    [updateDimensions],
  );

  // Return defaults during SSR/hydration
  const result = useMemo<UseChartDimensionsResult>(() => {
    if (!isHydrated) {
      return {
        ...DEFAULT_DIMENSIONS,
        width: initialWidth,
        height: initialHeight,
        ref,
      };
    }

    return {
      ...dimensions,
      ref,
    };
  }, [isHydrated, dimensions, ref, initialWidth, initialHeight]);

  return result;
}

export default useChartDimensions;
