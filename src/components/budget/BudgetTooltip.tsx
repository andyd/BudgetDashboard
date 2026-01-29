"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BudgetItem } from "@/types/budget";
import { useEffect, useState } from "react";

interface Position {
  x: number;
  y: number;
}

interface BudgetTooltipProps {
  /** Budget item to display information for */
  item: BudgetItem | null;
  /** Mouse position for tooltip placement */
  position: Position | null;
}

/**
 * Formats a dollar amount into a human-readable string with appropriate suffixes
 * @param amount - Dollar amount to format
 * @returns Formatted string (e.g., "$1.2B", "$45.6M", "$5.3K")
 */
function formatCurrency(amount: number): string {
  const absAmount = Math.abs(amount);

  if (absAmount >= 1_000_000_000_000) {
    return `$${(amount / 1_000_000_000_000).toFixed(1)}T`;
  }
  if (absAmount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (absAmount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (absAmount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`;
  }
  return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

/**
 * Formats a percentage value with appropriate styling
 * @param value - Percentage value (can be null)
 * @returns Formatted string with sign (e.g., "+5.2%", "-3.1%", "—")
 */
function formatPercentage(value: number | null): string {
  if (value === null) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

/**
 * Calculates tooltip position to keep it within viewport bounds
 */
function calculateTooltipPosition(
  mouseX: number,
  mouseY: number,
  tooltipWidth: number = 280,
  tooltipHeight: number = 160
): { x: number; y: number } {
  const padding = 16; // Distance from cursor
  const viewportPadding = 8; // Distance from viewport edge

  let x = mouseX + padding;
  let y = mouseY + padding;

  // Check right edge
  if (x + tooltipWidth > window.innerWidth - viewportPadding) {
    x = mouseX - tooltipWidth - padding; // Show on left side of cursor
  }

  // Check bottom edge
  if (y + tooltipHeight > window.innerHeight - viewportPadding) {
    y = mouseY - tooltipHeight - padding; // Show above cursor
  }

  // Ensure not off left edge
  if (x < viewportPadding) {
    x = viewportPadding;
  }

  // Ensure not off top edge
  if (y < viewportPadding) {
    y = viewportPadding;
  }

  return { x, y };
}

export function BudgetTooltip({ item, position }: BudgetTooltipProps) {
  const [tooltipPosition, setTooltipPosition] = useState<Position | null>(null);

  useEffect(() => {
    if (position) {
      const adjusted = calculateTooltipPosition(position.x, position.y);
      setTooltipPosition(adjusted);
    }
  }, [position]);

  const isVisible = item !== null && position !== null && tooltipPosition !== null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 min-w-[280px] max-w-[320px]">
            {/* Item Name */}
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base mb-2 leading-tight">
              {item.name}
            </h3>

            {/* Amount */}
            <div className="mb-3">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(item.amount)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                FY {item.fiscalYear}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
              {/* Percentage of Parent */}
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  % of Parent
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {item.percentOfParent !== null
                    ? `${item.percentOfParent.toFixed(1)}%`
                    : "—"
                  }
                </div>
              </div>

              {/* Year-over-Year Change */}
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  YoY Change
                </div>
                <div
                  className={`text-sm font-semibold ${
                    item.yearOverYearChange === null
                      ? "text-gray-500 dark:text-gray-400"
                      : item.yearOverYearChange >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {formatPercentage(item.yearOverYearChange)}
                </div>
              </div>
            </div>

            {/* Click Hint */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
              <span>Click to explore</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
