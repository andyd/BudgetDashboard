"use client";

import * as React from "react";
import { motion, AnimatePresence } from "@/lib/framer-client";
import { CategoryCard } from "./CategoryCard";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface WizardStepProps {
  /** Step number (1, 2, or 3) */
  step: 1 | 2 | 3;

  /** Main title for the step */
  title: string;

  /** Optional subtitle */
  subtitle?: string;

  /** Categories to display */
  categories: Category[];

  /** Currently selected category IDs */
  selectedIds: string[];

  /** Selection handler */
  onSelect: (id: string) => void;

  /** Minimum number of selections required */
  minSelections: number;

  /** Maximum number of selections allowed */
  maxSelections: number;

  /** Card size variant */
  cardSize?: "default" | "large";

  /** Single select mode (clicking new card deselects previous) */
  singleSelect?: boolean;

  /** Additional CSS classes */
  className?: string;
}

export function WizardStep({
  step,
  title,
  subtitle,
  categories,
  selectedIds,
  onSelect,
  minSelections,
  maxSelections,
  cardSize = "default",
  singleSelect = false,
  className,
}: WizardStepProps) {
  const selectedCount = selectedIds.length;
  const isMaxReached = selectedCount >= maxSelections;
  const isMinReached = selectedCount >= minSelections;

  // Live region for announcing selection changes to screen readers
  const [announcement, setAnnouncement] = React.useState("");

  const handleSelect = React.useCallback(
    (id: string) => {
      const category = categories.find((c) => c.id === id);
      const categoryName = category?.name || "category";
      const wasSelected = selectedIds.includes(id);

      // In single select mode, always allow selection (it will deselect previous)
      if (singleSelect) {
        onSelect(id);
        setAnnouncement(`${categoryName} selected`);
        return;
      }

      // If already selected, allow deselection
      if (wasSelected) {
        onSelect(id);
        setAnnouncement(
          `${categoryName} deselected. ${selectedCount - 1} of ${maxSelections} selected`,
        );
        return;
      }

      // If not selected and we haven't reached max, allow selection
      if (!isMaxReached) {
        onSelect(id);
        const newCount = selectedCount + 1;
        setAnnouncement(
          `${categoryName} selected. ${newCount} of ${maxSelections} selected${
            newCount >= minSelections
              ? ". Ready to continue"
              : `. Select at least ${minSelections - newCount} more`
          }`,
        );
      } else {
        setAnnouncement(
          `Maximum selections reached. Deselect a category before selecting ${categoryName}`,
        );
      }
    },
    [
      selectedIds,
      onSelect,
      isMaxReached,
      singleSelect,
      categories,
      selectedCount,
      maxSelections,
      minSelections,
    ],
  );

  return (
    <div className={cn("space-y-8", className)}>
      {/* Live region for screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
      {/* Header */}
      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs sm:text-sm font-semibold shrink-0">
              {step}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              {title}
            </h2>
          </div>

          {subtitle && (
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed px-1">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Selection counter and validation message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCount}-${isMaxReached}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-muted-foreground">Selected:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {selectedCount}
                </span>
                <span className="text-muted-foreground">
                  {singleSelect
                    ? "/ 1"
                    : `/ ${maxSelections}${minSelections > 0 ? ` (min ${minSelections})` : ""}`}
                </span>
              </div>

              {/* Validation indicators */}
              {!singleSelect && (
                <div className="text-xs sm:text-sm">
                  {isMaxReached && (
                    <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                      <AlertCircle className="w-4 h-4" />
                      Maximum reached
                    </span>
                  )}
                  {!isMinReached && selectedCount > 0 && (
                    <span className="text-muted-foreground">
                      Select {minSelections - selectedCount} more
                    </span>
                  )}
                  {isMinReached && !isMaxReached && (
                    <span className="text-green-700 dark:text-green-400">
                      Ready to continue
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Categories grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className={cn(
          "grid gap-4",
          cardSize === "large"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        )}
        role="group"
        aria-label={`${title} options`}
      >
        {categories.map((category, index) => {
          const isSelected = selectedIds.includes(category.id);
          const isDisabled = !isSelected && isMaxReached && !singleSelect;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.1 + index * 0.05,
              }}
              style={{
                // Slightly dim disabled cards
                filter: isDisabled ? "brightness(0.8) opacity(0.7)" : "none",
                pointerEvents: isDisabled ? "none" : "auto",
              }}
            >
              <CategoryCard
                id={category.id}
                name={category.name}
                description={category.description}
                icon={category.icon}
                selected={isSelected}
                onClick={() => handleSelect(category.id)}
                size={cardSize}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty state */}
      {categories.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No categories available for this step.</p>
        </div>
      )}
    </div>
  );
}
