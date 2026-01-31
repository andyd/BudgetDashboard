"use client";

/**
 * ComparisonStats Component
 * Displays statistics about a budget comparison including:
 * - Total units that could be funded
 * - Percentage of total federal budget
 * - Per-capita amount (based on US population)
 * - Time to earn at median income
 */

import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency, formatNumber } from "@/lib/format";

// Constants for calculations
const US_POPULATION = 330_000_000; // 330 million
const MEDIAN_ANNUAL_INCOME = 59_540; // 2023 US median household income
const FEDERAL_BUDGET_FY2024 = 6_130_000_000_000; // $6.13 trillion FY2024

interface ComparisonStatsProps {
  /** The budget amount being compared */
  budgetAmount: number;
  /** Number of units this budget could fund */
  unitCount: number;
  /** Name of the unit (for display) */
  unitName: string;
  /** Cost per unit */
  costPerUnit: number;
  /** Optional: custom total budget for percentage calculation */
  totalBudget?: number;
  /** Optional: additional CSS classes */
  className?: string;
}

interface StatItemProps {
  label: string;
  value: string;
  tooltip: string;
}

function StatItem({ label, value, tooltip }: StatItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full hover:bg-muted/50 p-0.5 cursor-help"
              aria-label={`Info about ${label}`}
            >
              <Info className="size-3 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}

/**
 * Calculate time to earn a given amount at median income
 * Returns a human-readable string
 */
function calculateTimeToEarn(amount: number): string {
  const hoursPerYear = 2080; // 40 hours/week * 52 weeks
  const hourlyRate = MEDIAN_ANNUAL_INCOME / hoursPerYear;

  const hoursNeeded = amount / hourlyRate;
  const daysNeeded = hoursNeeded / 8;
  const weeksNeeded = daysNeeded / 5;
  const monthsNeeded = weeksNeeded / 4.33;
  const yearsNeeded = monthsNeeded / 12;

  if (yearsNeeded >= 1000000) {
    return `${formatNumber(Math.round(yearsNeeded / 1000000))}M years`;
  }
  if (yearsNeeded >= 1000) {
    return `${formatNumber(Math.round(yearsNeeded / 1000))}K years`;
  }
  if (yearsNeeded >= 1) {
    return `${formatNumber(Math.round(yearsNeeded))} ${yearsNeeded >= 2 ? "years" : "year"}`;
  }
  if (monthsNeeded >= 1) {
    return `${formatNumber(Math.round(monthsNeeded))} ${monthsNeeded >= 2 ? "months" : "month"}`;
  }
  if (weeksNeeded >= 1) {
    return `${formatNumber(Math.round(weeksNeeded))} ${weeksNeeded >= 2 ? "weeks" : "week"}`;
  }
  if (daysNeeded >= 1) {
    return `${formatNumber(Math.round(daysNeeded))} ${daysNeeded >= 2 ? "days" : "day"}`;
  }
  return `${formatNumber(Math.round(hoursNeeded))} ${hoursNeeded >= 2 ? "hours" : "hour"}`;
}

export function ComparisonStats({
  budgetAmount,
  unitCount,
  unitName,
  costPerUnit,
  totalBudget = FEDERAL_BUDGET_FY2024,
  className,
}: ComparisonStatsProps) {
  // Calculate statistics
  const percentOfBudget = (budgetAmount / totalBudget) * 100;
  const perCapita = budgetAmount / US_POPULATION;
  const timeToEarn = calculateTimeToEarn(budgetAmount);

  // Format percentage with appropriate precision
  const formattedPercent =
    percentOfBudget < 0.01
      ? "<0.01%"
      : percentOfBudget < 1
        ? `${percentOfBudget.toFixed(2)}%`
        : `${percentOfBudget.toFixed(1)}%`;

  return (
    <TooltipProvider>
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Comparison Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatItem
              label="Total Units"
              value={formatNumber(unitCount)}
              tooltip={`This budget of ${formatCurrency(budgetAmount, { compact: true })} could fund ${formatNumber(unitCount)} ${unitName} at ${formatCurrency(costPerUnit, { compact: true })} each.`}
            />
            <StatItem
              label="% of Budget"
              value={formattedPercent}
              tooltip={`This represents ${formattedPercent} of the federal budget (${formatCurrency(totalBudget, { compact: true })} in FY2024).`}
            />
            <StatItem
              label="Per Capita"
              value={formatCurrency(perCapita, { showCents: perCapita < 100 })}
              tooltip={`If divided equally among all ${formatNumber(US_POPULATION / 1_000_000)} million US residents, each person's share would be ${formatCurrency(perCapita, { showCents: true })}.`}
            />
            <StatItem
              label="Time to Earn"
              value={timeToEarn}
              tooltip={`At the US median household income of ${formatCurrency(MEDIAN_ANNUAL_INCOME)} per year, it would take ${timeToEarn} to earn this amount.`}
            />
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
