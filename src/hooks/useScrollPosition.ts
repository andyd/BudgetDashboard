"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type ScrollDirection = "up" | "down" | null;

export interface ScrollPosition {
  x: number;
  y: number;
  scrollDirection: ScrollDirection;
  isAtTop: boolean;
  isAtBottom: boolean;
}

export interface UseScrollPositionOptions {
  /** Throttle delay in milliseconds. Default: 100 */
  throttleMs?: number;
  /** Threshold in pixels before direction change is registered. Default: 0 */
  threshold?: number;
  /** Offset in pixels from bottom to trigger isAtBottom. Default: 0 */
  bottomOffset?: number;
}

/**
 * Track window scroll position with throttled updates.
 * Useful for sticky headers and scroll-based animations.
 *
 * @example
 * ```tsx
 * const { y, scrollDirection, isAtTop } = useScrollPosition();
 *
 * // Hide header on scroll down, show on scroll up
 * const showHeader = scrollDirection !== 'down' || isAtTop;
 * ```
 */
export function useScrollPosition(
  options: UseScrollPositionOptions = {},
): ScrollPosition {
  const { throttleMs = 100, threshold = 0, bottomOffset = 0 } = options;

  const [position, setPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
    scrollDirection: null,
    isAtTop: true,
    isAtBottom: false,
  });

  const lastScrollY = useRef(0);
  const lastScrollX = useRef(0);
  const ticking = useRef(false);
  const lastUpdateTime = useRef(0);

  const getScrollPosition = useCallback((): ScrollPosition => {
    if (typeof window === "undefined") {
      return {
        x: 0,
        y: 0,
        scrollDirection: null,
        isAtTop: true,
        isAtBottom: false,
      };
    }

    const currentScrollY = window.scrollY;
    const currentScrollX = window.scrollX;

    // Calculate scroll direction with threshold
    let scrollDirection: ScrollDirection = null;
    const scrollDelta = currentScrollY - lastScrollY.current;

    if (Math.abs(scrollDelta) > threshold) {
      scrollDirection = scrollDelta > 0 ? "down" : "up";
    }

    // Calculate document boundaries
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const isAtTop = currentScrollY <= 0;
    const isAtBottom =
      currentScrollY + windowHeight >= documentHeight - bottomOffset;

    return {
      x: currentScrollX,
      y: currentScrollY,
      scrollDirection,
      isAtTop,
      isAtBottom,
    };
  }, [threshold, bottomOffset]);

  const updatePosition = useCallback(() => {
    const newPosition = getScrollPosition();

    // Update refs for next comparison
    lastScrollY.current = newPosition.y;
    lastScrollX.current = newPosition.x;

    setPosition(newPosition);
    ticking.current = false;
  }, [getScrollPosition]);

  const handleScroll = useCallback(() => {
    const now = Date.now();

    // Throttle updates
    if (now - lastUpdateTime.current < throttleMs) {
      if (!ticking.current) {
        ticking.current = true;
        window.requestAnimationFrame(() => {
          // Check again if enough time has passed
          if (Date.now() - lastUpdateTime.current >= throttleMs) {
            lastUpdateTime.current = Date.now();
            updatePosition();
          } else {
            ticking.current = false;
          }
        });
      }
      return;
    }

    lastUpdateTime.current = now;

    if (!ticking.current) {
      ticking.current = true;
      window.requestAnimationFrame(updatePosition);
    }
  }, [throttleMs, updatePosition]);

  useEffect(() => {
    // Initialize position on mount
    const initialPosition = getScrollPosition();
    lastScrollY.current = initialPosition.y;
    lastScrollX.current = initialPosition.x;
    setPosition(initialPosition);

    // Add scroll listener with passive option for performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, getScrollPosition]);

  return position;
}

/**
 * Convenience hook that only returns whether user is scrolling up or down.
 * Useful for simple hide/show header patterns.
 */
export function useScrollDirection(
  options?: UseScrollPositionOptions,
): ScrollDirection {
  const { scrollDirection } = useScrollPosition(options);
  return scrollDirection;
}

/**
 * Convenience hook for detecting when user has scrolled past a threshold.
 * Useful for sticky header transformations.
 */
export function useScrolledPast(
  scrollThreshold: number,
  options?: Omit<UseScrollPositionOptions, "threshold">,
): boolean {
  const { y } = useScrollPosition(options);
  return y > scrollThreshold;
}
