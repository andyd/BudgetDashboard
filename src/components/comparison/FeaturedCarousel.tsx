"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ComparisonCard } from "./ComparisonCard";
import { Button } from "@/components/ui/button";
import type { FeaturedComparison } from "@/types/comparison";

interface FeaturedCarouselProps {
  /** Array of featured comparisons to display */
  comparisons: FeaturedComparison[];
  /** Auto-rotation interval in milliseconds (default: 8000) */
  autoRotateMs?: number;
}

/**
 * FeaturedCarousel
 *
 * Auto-rotating carousel that displays one featured comparison at a time.
 *
 * Features:
 * - Auto-rotation with configurable interval (default 8000ms)
 * - Manual navigation with prev/next buttons
 * - Dot indicators showing current position
 * - Pause rotation on hover
 * - Smooth transitions using Framer Motion
 * - Keyboard navigation support
 */
export function FeaturedCarousel({
  comparisons,
  autoRotateMs = 8000,
}: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  // Sort comparisons by priority (higher priority shown first)
  const sortedComparisons = [...comparisons].sort(
    (a, b) => b.priority - a.priority
  );

  const totalComparisons = sortedComparisons.length;

  // Navigation functions
  const goToNext = useCallback(() => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % totalComparisons);
  }, [totalComparisons]);

  const goToPrevious = useCallback(() => {
    setDirection("left");
    setCurrentIndex((prev) =>
      prev === 0 ? totalComparisons - 1 : prev - 1
    );
  }, [totalComparisons]);

  const goToIndex = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? "right" : "left");
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  // Auto-rotation effect
  useEffect(() => {
    if (totalComparisons <= 1 || isHovered) return;

    const intervalId = setInterval(goToNext, autoRotateMs);

    return () => clearInterval(intervalId);
  }, [autoRotateMs, goToNext, isHovered, totalComparisons]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious]);

  // Animation variants
  const slideVariants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? -1000 : 1000,
      opacity: 0,
    }),
  };

  // If no comparisons, show empty state
  if (totalComparisons === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">
          No featured comparisons available
        </p>
      </div>
    );
  }

  const currentComparison = sortedComparisons[currentIndex];

  if (!currentComparison) {
    return null;
  }

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel Content */}
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            <ComparisonCard
              budgetAmount={currentComparison.budgetAmount}
              unitCount={currentComparison.result.unitCount}
              unit={currentComparison.unit}
              headline={currentComparison.headline}
              context={currentComparison.context}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls - Only show if more than one comparison */}
      {totalComparisons > 1 && (
        <>
          {/* Previous Button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full shadow-lg transition-opacity hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
            onClick={goToPrevious}
            aria-label="Previous comparison"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Next Button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full shadow-lg transition-opacity hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
            onClick={goToNext}
            aria-label="Next comparison"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Dot Indicators */}
          <div className="mt-6 flex justify-center gap-2">
            {sortedComparisons.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to comparison ${index + 1}`}
                aria-current={index === currentIndex ? "true" : "false"}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
