"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Tailwind CSS v4 default breakpoints
 * @see https://tailwindcss.com/docs/responsive-design
 */
export const TAILWIND_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type TailwindBreakpoint = keyof typeof TAILWIND_BREAKPOINTS;

/**
 * Custom hook that returns whether a CSS media query matches.
 *
 * @param query - CSS media query string (e.g., "(min-width: 768px)")
 * @param defaultValue - Default value for SSR and initial render (defaults to false)
 * @returns Boolean indicating whether the media query matches
 *
 * @example
 * ```tsx
 * const isWide = useMediaQuery("(min-width: 1024px)");
 * const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
 * const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
 * ```
 */
export function useMediaQuery(
  query: string,
  defaultValue: boolean = false,
): boolean {
  // Use a function to get the initial state to avoid SSR hydration mismatches
  const getMatches = useCallback((): boolean => {
    // Check if we're on the server or window is not available
    if (typeof window === "undefined") {
      return defaultValue;
    }
    return window.matchMedia(query).matches;
  }, [query, defaultValue]);

  const [matches, setMatches] = useState<boolean>(defaultValue);

  useEffect(() => {
    // Set the initial value on mount
    setMatches(getMatches());

    const mediaQueryList = window.matchMedia(query);

    // Handler for media query changes
    const handleChange = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };

    // Use the modern addEventListener API (supported in all modern browsers)
    // Falls back to addListener for older browsers (deprecated but still works)
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", handleChange);
    } else {
      // Fallback for older browsers (Safari < 14)
      mediaQueryList.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", handleChange);
      } else {
        // Fallback for older browsers
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query, getMatches]);

  return matches;
}

/**
 * Hook that returns true when viewport is below the mobile breakpoint (< 640px).
 * Matches Tailwind's `sm` breakpoint boundary.
 *
 * @param defaultValue - Default value for SSR (defaults to false)
 * @returns Boolean indicating if viewport is mobile-sized
 *
 * @example
 * ```tsx
 * const isMobile = useIsMobile();
 * return isMobile ? <MobileNav /> : <DesktopNav />;
 * ```
 */
export function useIsMobile(defaultValue: boolean = false): boolean {
  return useMediaQuery(
    `(max-width: ${TAILWIND_BREAKPOINTS.sm - 1}px)`,
    defaultValue,
  );
}

/**
 * Hook that returns true when viewport is in tablet range (640px - 1023px).
 * Between Tailwind's `sm` and `lg` breakpoints.
 *
 * @param defaultValue - Default value for SSR (defaults to false)
 * @returns Boolean indicating if viewport is tablet-sized
 *
 * @example
 * ```tsx
 * const isTablet = useIsTablet();
 * return <Grid cols={isTablet ? 2 : 1} />;
 * ```
 */
export function useIsTablet(defaultValue: boolean = false): boolean {
  return useMediaQuery(
    `(min-width: ${TAILWIND_BREAKPOINTS.sm}px) and (max-width: ${TAILWIND_BREAKPOINTS.lg - 1}px)`,
    defaultValue,
  );
}

/**
 * Hook that returns true when viewport is at or above desktop breakpoint (>= 1024px).
 * Matches Tailwind's `lg` breakpoint and above.
 *
 * @param defaultValue - Default value for SSR (defaults to false)
 * @returns Boolean indicating if viewport is desktop-sized
 *
 * @example
 * ```tsx
 * const isDesktop = useIsDesktop();
 * return isDesktop && <Sidebar />;
 * ```
 */
export function useIsDesktop(defaultValue: boolean = false): boolean {
  return useMediaQuery(
    `(min-width: ${TAILWIND_BREAKPOINTS.lg}px)`,
    defaultValue,
  );
}

/**
 * Hook that returns true when viewport matches or exceeds a Tailwind breakpoint.
 *
 * @param breakpoint - Tailwind breakpoint name ('sm' | 'md' | 'lg' | 'xl' | '2xl')
 * @param defaultValue - Default value for SSR (defaults to false)
 * @returns Boolean indicating if viewport is at or above the breakpoint
 *
 * @example
 * ```tsx
 * const isLargeScreen = useBreakpoint('xl');
 * const isMediumUp = useBreakpoint('md');
 * ```
 */
export function useBreakpoint(
  breakpoint: TailwindBreakpoint,
  defaultValue: boolean = false,
): boolean {
  return useMediaQuery(
    `(min-width: ${TAILWIND_BREAKPOINTS[breakpoint]}px)`,
    defaultValue,
  );
}

/**
 * Hook that returns true when viewport is below a Tailwind breakpoint.
 *
 * @param breakpoint - Tailwind breakpoint name ('sm' | 'md' | 'lg' | 'xl' | '2xl')
 * @param defaultValue - Default value for SSR (defaults to false)
 * @returns Boolean indicating if viewport is below the breakpoint
 *
 * @example
 * ```tsx
 * const isBelowLarge = useBreakpointDown('lg'); // true when < 1024px
 * ```
 */
export function useBreakpointDown(
  breakpoint: TailwindBreakpoint,
  defaultValue: boolean = false,
): boolean {
  return useMediaQuery(
    `(max-width: ${TAILWIND_BREAKPOINTS[breakpoint] - 1}px)`,
    defaultValue,
  );
}

/**
 * Hook that returns true when user prefers reduced motion.
 * Useful for disabling animations for accessibility.
 *
 * @param defaultValue - Default value for SSR (defaults to false)
 * @returns Boolean indicating if user prefers reduced motion
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = usePrefersReducedMotion();
 * const animationDuration = prefersReducedMotion ? 0 : 300;
 * ```
 */
export function usePrefersReducedMotion(
  defaultValue: boolean = false,
): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", defaultValue);
}

/**
 * Hook that returns true when user prefers dark color scheme.
 *
 * @param defaultValue - Default value for SSR (defaults to false)
 * @returns Boolean indicating if user prefers dark mode
 *
 * @example
 * ```tsx
 * const prefersDark = usePrefersDarkMode();
 * ```
 */
export function usePrefersDarkMode(defaultValue: boolean = false): boolean {
  return useMediaQuery("(prefers-color-scheme: dark)", defaultValue);
}
