"use client";

import * as React from "react";
import { formatNumber } from "@/lib/format";

export interface AnimatedCounterProps {
  /** The target value to animate to */
  value: number;
  /** Animation duration in milliseconds (default: 1000) */
  duration?: number;
  /** Custom formatter function (default: formatNumber from @/lib/format) */
  format?: (value: number) => string;
  /** CSS class name for styling */
  className?: string;
  /** Prefix to display before the number (e.g., "$") */
  prefix?: string;
  /** Suffix to display after the number (e.g., "%") */
  suffix?: string;
  /** Whether to animate on mount (default: true) */
  animateOnMount?: boolean;
  /** Delay before starting animation in milliseconds (default: 0) */
  delay?: number;
}

/**
 * Easing function for natural animation feel
 * Uses ease-out cubic for smooth deceleration
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * AnimatedCounter - Smoothly animates number changes
 *
 * Uses requestAnimationFrame for smooth 60fps animation and supports
 * very large numbers (billions/trillions) with proper formatting.
 *
 * @example
 * // Basic usage
 * <AnimatedCounter value={1234567} />
 *
 * // With currency formatting
 * <AnimatedCounter value={1500000} prefix="$" />
 *
 * // Custom duration and format
 * <AnimatedCounter
 *   value={99.5}
 *   duration={2000}
 *   format={(v) => v.toFixed(1)}
 *   suffix="%"
 * />
 */
function AnimatedCounter({
  value,
  duration = 1000,
  format = formatNumber,
  className,
  prefix = "",
  suffix = "",
  animateOnMount = true,
  delay = 0,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = React.useState(
    animateOnMount ? 0 : value,
  );
  const previousValueRef = React.useRef(animateOnMount ? 0 : value);
  const animationFrameRef = React.useRef<number | null>(null);
  const startTimeRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const startValue = previousValueRef.current;
    const endValue = value;
    const difference = endValue - startValue;

    // Skip animation if no change
    if (difference === 0) {
      return;
    }

    // Cancel any existing animation
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const startAnimation = () => {
      startTimeRef.current = null;

      const animate = (currentTime: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = currentTime;
        }

        const elapsed = currentTime - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // Use easing for natural feel
        const easedProgress = easeOutCubic(progress);

        // Calculate current value
        // For very large numbers, ensure we don't lose precision
        const currentValue = startValue + difference * easedProgress;
        setDisplayValue(currentValue);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          // Ensure we end exactly on the target value
          setDisplayValue(endValue);
          previousValueRef.current = endValue;
          animationFrameRef.current = null;
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Handle delay
    if (delay > 0) {
      const timeoutId = setTimeout(startAnimation, delay);
      return () => {
        clearTimeout(timeoutId);
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    } else {
      startAnimation();
    }

    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration, delay]);

  // Update previous value ref when value changes (for non-animated updates)
  React.useEffect(() => {
    return () => {
      previousValueRef.current = value;
    };
  }, [value]);

  return (
    <span className={className} aria-live="polite">
      {prefix}
      {format(displayValue)}
      {suffix}
    </span>
  );
}

export default AnimatedCounter;
