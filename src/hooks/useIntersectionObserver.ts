"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type RefObject,
} from "react";

/**
 * Options for the useIntersectionObserver hook
 */
export interface UseIntersectionObserverOptions {
  /**
   * A number between 0 and 1 indicating what percentage of the target
   * should be visible before triggering. Can also be an array of thresholds.
   * @default 0
   */
  threshold?: number | number[];

  /**
   * Margin around the root element. Values serve to grow or shrink each side
   * of the root element's bounding box before computing intersections.
   * @default '0px'
   */
  rootMargin?: string;

  /**
   * The element used as the viewport for checking visibility.
   * If null, defaults to the browser viewport.
   * @default null
   */
  root?: Element | null;

  /**
   * If true, the observer will disconnect after the first intersection.
   * Useful for lazy loading where you only need to detect visibility once.
   * @default false
   */
  triggerOnce?: boolean;

  /**
   * Initial value for isIntersecting before observation begins.
   * Useful for SSR where IntersectionObserver is not available.
   * @default false
   */
  initialIsIntersecting?: boolean;

  /**
   * Whether the observer should be active. Set to false to temporarily
   * disable observation without unmounting.
   * @default true
   */
  enabled?: boolean;
}

/**
 * Return type for the useIntersectionObserver hook
 */
export interface UseIntersectionObserverReturn<T extends Element> {
  /**
   * Ref to attach to the element you want to observe
   */
  ref: RefObject<T | null>;

  /**
   * Whether the element is currently intersecting the viewport
   */
  isIntersecting: boolean;

  /**
   * The full IntersectionObserverEntry, available after first observation
   */
  entry: IntersectionObserverEntry | null;
}

/**
 * Hook to track element visibility in the viewport using IntersectionObserver.
 *
 * @example
 * // Basic usage for lazy loading
 * const { ref, isIntersecting } = useIntersectionObserver({ triggerOnce: true });
 *
 * return (
 *   <div ref={ref}>
 *     {isIntersecting && <ExpensiveComponent />}
 *   </div>
 * );
 *
 * @example
 * // Scroll animation with threshold
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   threshold: 0.5,
 *   rootMargin: '-50px',
 * });
 *
 * return (
 *   <motion.div
 *     ref={ref}
 *     animate={{ opacity: isIntersecting ? 1 : 0 }}
 *   />
 * );
 */
export function useIntersectionObserver<T extends Element = Element>(
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverReturn<T> {
  const {
    threshold = 0,
    rootMargin = "0px",
    root = null,
    triggerOnce = false,
    initialIsIntersecting = false,
    enabled = true,
  } = options;

  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(initialIsIntersecting);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  // Track if we've already triggered (for triggerOnce mode)
  const hasTriggered = useRef(false);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [observerEntry] = entries;

      if (!observerEntry) return;

      setEntry(observerEntry);
      setIsIntersecting(observerEntry.isIntersecting);

      // If triggerOnce and now intersecting, mark as triggered
      if (triggerOnce && observerEntry.isIntersecting) {
        hasTriggered.current = true;
      }
    },
    [triggerOnce],
  );

  useEffect(() => {
    // SSR check - IntersectionObserver is not available on server
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const element = ref.current;

    // Don't observe if disabled, no element, or already triggered once
    if (!enabled || !element || (triggerOnce && hasTriggered.current)) {
      return;
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
      root,
    });

    observer.observe(element);

    // Cleanup: disconnect observer on unmount or when dependencies change
    return () => {
      observer.disconnect();
    };
  }, [enabled, threshold, rootMargin, root, triggerOnce, handleIntersection]);

  return { ref, isIntersecting, entry };
}

/**
 * Convenience hook for lazy loading - triggers only once when element enters viewport
 */
export function useLazyLoad<T extends Element = Element>(
  options: Omit<UseIntersectionObserverOptions, "triggerOnce"> = {},
): UseIntersectionObserverReturn<T> {
  return useIntersectionObserver<T>({
    ...options,
    triggerOnce: true,
  });
}

/**
 * Convenience hook for scroll animations with common defaults
 */
export function useScrollAnimation<T extends Element = Element>(
  options: Omit<UseIntersectionObserverOptions, "threshold" | "rootMargin"> & {
    threshold?: number;
    rootMargin?: string;
  } = {},
): UseIntersectionObserverReturn<T> {
  return useIntersectionObserver<T>({
    threshold: 0.2,
    rootMargin: "-50px",
    ...options,
  });
}

export default useIntersectionObserver;
