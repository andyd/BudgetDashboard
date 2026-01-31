"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Represents the current window dimensions
 * Values are undefined during SSR or before hydration
 */
export interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

/**
 * Options for the useWindowSize hook
 */
interface UseWindowSizeOptions {
  /** Debounce delay in milliseconds (default: 150) */
  debounceMs?: number;
}

/**
 * Hook that returns the current window dimensions with debounced updates
 *
 * Features:
 * - SSR-safe with undefined initial values
 * - Debounced resize events to prevent excessive re-renders
 * - Handles orientation change events on mobile devices
 * - TypeScript strict mode compatible
 *
 * @param options - Configuration options
 * @returns Current window dimensions { width, height }
 *
 * @example
 * ```tsx
 * const { width, height } = useWindowSize();
 *
 * if (width === undefined) {
 *   return <div>Loading...</div>;
 * }
 *
 * return <div>Window: {width} x {height}</div>;
 * ```
 */
export function useWindowSize(options: UseWindowSizeOptions = {}): WindowSize {
  const { debounceMs = 150 } = options;

  // Initialize with undefined for SSR compatibility
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  // Ref to store the debounce timeout
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Memoized handler to get current window dimensions
  const getWindowSize = useCallback((): WindowSize => {
    if (typeof window === "undefined") {
      return { width: undefined, height: undefined };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }, []);

  // Debounced resize handler
  const handleResize = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setWindowSize(getWindowSize());
    }, debounceMs);
  }, [debounceMs, getWindowSize]);

  useEffect(() => {
    // Skip on server
    if (typeof window === "undefined") {
      return;
    }

    // Set initial size on mount
    setWindowSize(getWindowSize());

    // Add event listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [getWindowSize, handleResize]);

  return windowSize;
}

export default useWindowSize;
