"use client";

import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface YearOverYearIndicatorProps {
  /** Percentage change (e.g., 5.2 for +5.2%, -3.1 for -3.1%) */
  change: number;
  /** Previous year amount in dollars (will be calculated if not provided) */
  previousAmount?: number;
  /** Current year amount in dollars */
  currentAmount: number;
}

/**
 * Calculate previous year amount from current amount and YoY percentage change
 * Formula: previous = current / (1 + change/100)
 */
function calculatePreviousAmount(
  currentAmount: number,
  yoyChange: number
): number {
  return currentAmount / (1 + yoyChange / 100);
}

/**
 * Displays year-over-year percentage change with color-coded arrow indicators.
 * Shows green up arrow for increases, red down arrow for decreases, and gray minus for neutral changes.
 * Tooltip displays actual dollar amounts for previous and current year.
 */
export function YearOverYearIndicator({
  change,
  previousAmount: providedPreviousAmount,
  currentAmount,
}: YearOverYearIndicatorProps) {
  // Calculate previous amount if not provided
  const previousAmount =
    providedPreviousAmount ?? calculatePreviousAmount(currentAmount, change);

  // Determine change type
  const isNeutral = Math.abs(change) < 1;
  const isIncrease = change >= 1;

  // Format percentage display
  const percentageDisplay = `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;

  // Format dollar amounts for tooltip
  const formatDollar = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Determine icon and color
  const Icon = isNeutral ? Minus : isIncrease ? ArrowUp : ArrowDown;
  const colorClass = isNeutral
    ? "text-gray-500"
    : isIncrease
      ? "text-green-600"
      : "text-red-600";

  const bgClass = isNeutral
    ? "bg-gray-100"
    : isIncrease
      ? "bg-green-50"
      : "bg-red-50";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-md ${bgClass} ${colorClass}`}
          role="status"
          aria-label={`Year over year change: ${percentageDisplay}`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-sm font-medium tabular-nums">
            {percentageDisplay}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <div className="flex flex-col gap-1">
          <div className="text-xs">
            <span className="opacity-70">Previous:</span>{" "}
            <span className="font-medium">{formatDollar(previousAmount)}</span>
          </div>
          <div className="text-xs">
            <span className="opacity-70">Current:</span>{" "}
            <span className="font-medium">{formatDollar(currentAmount)}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
