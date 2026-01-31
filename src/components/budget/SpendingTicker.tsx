"use client";

import * as React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import { TrendingUp, Clock, X, ChevronDown, ChevronUp } from "lucide-react";

interface SpendingTickerProps {
  /** Annual budget amount in dollars */
  annualBudget: number;
  /** Optional title for the ticker */
  title?: string;
  /** Display mode: sticky header or floating widget */
  variant?: "sticky" | "floating";
  /** Position for floating variant */
  position?: "top-right" | "bottom-right" | "top-left" | "bottom-left";
  /** Whether the ticker can be dismissed */
  dismissible?: boolean;
  /** Whether to show detailed rate breakdown */
  showRates?: boolean;
  /** Custom className */
  className?: string;
}

interface SpendingRates {
  perSecond: number;
  perMinute: number;
  perHour: number;
  perDay: number;
}

/**
 * Calculate spending rates based on annual budget
 */
function calculateSpendingRates(annualBudget: number): SpendingRates {
  const secondsPerYear = 365.25 * 24 * 60 * 60; // Account for leap years
  const perSecond = annualBudget / secondsPerYear;

  return {
    perSecond,
    perMinute: perSecond * 60,
    perHour: perSecond * 60 * 60,
    perDay: perSecond * 60 * 60 * 24,
  };
}

/**
 * Animated number display component
 */
function AnimatedCounter({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);

  useEffect(() => {
    // Smooth animation between values
    const startValue = previousValue.current;
    const endValue = value;
    const duration = 100; // 100ms for smooth updates
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    previousValue.current = value;
  }, [value]);

  return (
    <span className={cn("tabular-nums", className)}>
      {formatCurrency(displayValue, { showCents: true })}
    </span>
  );
}

/**
 * Rate display row component
 */
function RateRow({
  label,
  rate,
  highlight = false,
}: {
  label: string;
  rate: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-1 text-sm",
        highlight && "font-medium",
      )}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className={cn(highlight && "text-primary")}>
        {formatCurrency(rate, { compact: rate >= 1_000_000 })}
      </span>
    </div>
  );
}

/**
 * SpendingTicker Component
 *
 * A real-time spending counter that shows how much has been spent
 * since the user opened the page, based on annual budget rates.
 */
export function SpendingTicker({
  annualBudget,
  title = "Federal Spending",
  variant = "sticky",
  position = "bottom-right",
  dismissible = true,
  showRates = true,
  className,
}: SpendingTickerProps) {
  const [spentSinceOpen, setSpentSinceOpen] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const startTimeRef = useRef<number>(Date.now());

  const rates = React.useMemo(
    () => calculateSpendingRates(annualBudget),
    [annualBudget],
  );

  // Update spending counter every 50ms for smooth animation
  const updateSpending = useCallback(() => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    setSecondsElapsed(elapsed);
    setSpentSinceOpen(elapsed * rates.perSecond);
  }, [rates.perSecond]);

  useEffect(() => {
    // Start the counter
    startTimeRef.current = Date.now();

    const intervalId = setInterval(updateSpending, 50);

    return () => clearInterval(intervalId);
  }, [updateSpending]);

  if (isDismissed) {
    return null;
  }

  const positionClasses = {
    "top-right": "top-4 right-4",
    "bottom-right": "bottom-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-left": "bottom-4 left-4",
  };

  const formatElapsedTime = () => {
    const totalSeconds = Math.floor(secondsElapsed);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const content = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <TrendingUp className="size-5 text-primary" />
            {/* Pulsing indicator */}
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-green-500">
              <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
            </span>
          </div>
          <span className="font-semibold text-sm">{title}</span>
        </div>

        <div className="flex items-center gap-1">
          {showRates && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-md hover:bg-muted transition-colors"
              aria-label={isExpanded ? "Collapse rates" : "Expand rates"}
            >
              {isExpanded ? (
                <ChevronUp className="size-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="size-4 text-muted-foreground" />
              )}
            </button>
          )}
          {dismissible && (
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-md hover:bg-muted transition-colors"
              aria-label="Dismiss spending ticker"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Main counter display */}
      <div className="mt-3">
        <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
          <Clock className="size-3" />
          <span>Spent since you opened this page ({formatElapsedTime()})</span>
        </div>
        <div className="text-2xl font-bold tracking-tight text-primary">
          <AnimatedCounter value={spentSinceOpen} />
        </div>
      </div>

      {/* Spending rates breakdown */}
      {showRates && isExpanded && (
        <div className="mt-4 pt-3 border-t border-border/50 space-y-0.5">
          <div className="text-xs text-muted-foreground font-medium mb-2">
            Spending Rate
          </div>
          <RateRow label="Per second" rate={rates.perSecond} highlight />
          <RateRow label="Per minute" rate={rates.perMinute} />
          <RateRow label="Per hour" rate={rates.perHour} />
          <RateRow label="Per day" rate={rates.perDay} />
        </div>
      )}

      {/* Annual budget reference */}
      <div className="mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Annual Budget</span>
          <span className="font-medium">
            {formatCurrency(annualBudget, { compact: true })}
          </span>
        </div>
      </div>
    </>
  );

  if (variant === "sticky") {
    return (
      <div
        className={cn(
          "sticky top-0 z-50 w-full bg-card/95 backdrop-blur-sm border-b border-border shadow-sm",
          className,
        )}
      >
        <div className="container mx-auto px-4 py-3">{content}</div>
      </div>
    );
  }

  // Floating widget variant
  return (
    <div
      className={cn(
        "fixed z-50 w-80 max-w-[calc(100vw-2rem)]",
        "bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-lg",
        "p-4",
        positionClasses[position],
        // Entry animation
        "animate-in fade-in-0 slide-in-from-bottom-4 duration-300",
        className,
      )}
      role="complementary"
      aria-label="Live spending counter"
    >
      {content}
    </div>
  );
}

/**
 * Minimal inline ticker for embedding in other components
 */
export function SpendingTickerInline({
  annualBudget,
  className,
}: {
  annualBudget: number;
  className?: string;
}) {
  const [spentSinceOpen, setSpentSinceOpen] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  const rates = React.useMemo(
    () => calculateSpendingRates(annualBudget),
    [annualBudget],
  );

  useEffect(() => {
    startTimeRef.current = Date.now();

    const intervalId = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setSpentSinceOpen(elapsed * rates.perSecond);
    }, 50);

    return () => clearInterval(intervalId);
  }, [rates.perSecond]);

  return (
    <span
      className={cn("inline-flex items-center gap-1.5 font-medium", className)}
    >
      <span className="relative flex size-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full size-2 bg-green-500" />
      </span>
      <AnimatedCounter value={spentSinceOpen} />
      <span className="text-muted-foreground text-sm">spent</span>
    </span>
  );
}
