"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useSpring,
  useMotionValue,
} from "@/lib/framer-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/format";
import {
  getRandomComparison,
  getRandomComparisonExcluding,
  type RandomComparison,
} from "@/lib/random-comparison";

// Shuffle icon component
function ShuffleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
      <path d="m18 2 4 4-4 4" />
      <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
      <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
      <path d="m18 14 4 4-4 4" />
    </svg>
  );
}

// Arrow right icon for link
function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/**
 * Animated number component that smoothly transitions between values
 */
function AnimatedNumber({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const [displayValue, setDisplayValue] = React.useState(value);

  React.useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  React.useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return <span className={className}>{formatNumber(displayValue)}</span>;
}

interface QuickCompareProps {
  /** Additional CSS classes */
  className?: string;
  /** Auto-shuffle interval in ms (default: 30000, set to 0 to disable) */
  autoShuffleInterval?: number;
  /** Show the link to full comparison page */
  showLink?: boolean;
}

/**
 * QuickCompare Widget
 *
 * A compact widget for embedding in sidebars that shows a single
 * budget comparison. Features shuffle functionality and smooth
 * number animations.
 */
export function QuickCompare({
  className,
  autoShuffleInterval = 30000,
  showLink = true,
}: QuickCompareProps) {
  const [comparison, setComparison] = React.useState<RandomComparison | null>(
    null,
  );
  const [isHovered, setIsHovered] = React.useState(false);
  const [direction, setDirection] = React.useState(1);

  // Initialize with a random comparison
  React.useEffect(() => {
    const initial = getRandomComparison();
    setComparison(initial);
  }, []);

  // Shuffle function using functional update to avoid stale closure
  const handleShuffle = React.useCallback(() => {
    setDirection(1);
    setComparison((current) => {
      const next = current
        ? getRandomComparisonExcluding(current.budgetItemId)
        : getRandomComparison();
      return next;
    });
  }, []);

  // Auto-shuffle timer
  React.useEffect(() => {
    if (autoShuffleInterval <= 0 || isHovered) {
      return;
    }

    const timer = setInterval(() => {
      handleShuffle();
    }, autoShuffleInterval);

    return () => clearInterval(timer);
  }, [autoShuffleInterval, isHovered, handleShuffle]);

  if (!comparison) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="h-3 bg-muted rounded w-1/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const formattedBudget = formatCurrency(comparison.budgetAmount, {
    compact: true,
  });
  const unitName =
    comparison.unitCount === 1
      ? comparison.unit.nameSingular || comparison.unit.name
      : comparison.unit.name;

  return (
    <Card
      className={cn(
        "overflow-hidden transition-shadow hover:shadow-md",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header with shuffle button */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Did you know?
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={handleShuffle}
            aria-label="Show another comparison"
          >
            <ShuffleIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Animated comparison content */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={comparison.budgetItemId}
            initial={{ opacity: 0, x: direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-2"
          >
            {/* Icon and main stat */}
            <div className="flex items-center gap-3">
              {comparison.unit.icon && (
                <span
                  className="text-3xl"
                  role="img"
                  aria-label={comparison.unit.name}
                >
                  {comparison.unit.icon}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xl font-bold leading-tight">
                  <AnimatedNumber
                    value={comparison.unitCount}
                    className="text-primary"
                  />{" "}
                  <span className="text-foreground">{unitName}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  = {formattedBudget}
                </p>
              </div>
            </div>

            {/* Headline */}
            <p className="text-sm text-muted-foreground leading-snug line-clamp-2">
              {comparison.headline}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Link to full comparison */}
        {showLink && (
          <Link
            href={`/compare/${comparison.budgetItemId}/${comparison.unit.id}`}
            className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              "text-primary hover:text-primary/80 transition-colors",
              "group",
            )}
          >
            See full comparison
            <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
