"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import {
  TrendingUp,
  TrendingDown,
  Building2,
  DollarSign,
  Users,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Summary data for the budget dashboard
 */
export interface BudgetSummaryData {
  /** Total budget amount in dollars */
  totalBudget: number;
  /** Name of the department with the largest budget */
  largestDepartmentName: string;
  /** Amount of the largest department's budget */
  largestDepartmentAmount: number;
  /** Year-over-year change as a percentage (e.g., 5.2 for 5.2% increase) */
  yearOverYearChange: number;
  /** Per capita spending amount */
  perCapita: number;
  /** Current fiscal year */
  fiscalYear?: number;
  /** Previous fiscal year for comparison */
  previousFiscalYear?: number;
}

interface BudgetSummaryCardsProps {
  /** Budget summary data to display */
  data: BudgetSummaryData;
  /** Optional className for the container */
  className?: string;
}

/**
 * Animated number component that counts up on mount
 */
function AnimatedNumber({
  value,
  formatter,
  duration = 1000,
}: {
  value: number;
  formatter: (n: number) => string;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (value - startValue) * easeOut;

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{formatter(displayValue)}</span>;
}

/**
 * Trend indicator component showing up/down arrow with percentage
 */
function TrendIndicator({
  value,
  showSign = true,
}: {
  value: number;
  showSign?: boolean;
}) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn(
        "flex items-center gap-1 text-sm font-medium",
        isPositive && "text-emerald-600 dark:text-emerald-400",
        !isPositive && !isNeutral && "text-red-600 dark:text-red-400",
        isNeutral && "text-muted-foreground",
      )}
    >
      {!isNeutral && <Icon className="h-4 w-4" aria-hidden="true" />}
      <span>
        {showSign && isPositive && "+"}
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

/**
 * Single summary card component
 */
function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  formatter = (n: number) => formatCurrency(n, { compact: true }),
}: {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: number;
  formatter?: (n: number) => string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <AnimatedNumber value={value} formatter={formatter} />
        </div>
        <div className="flex items-center justify-between mt-1">
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate mr-2">
              {subtitle}
            </p>
          )}
          {trend !== undefined && <TrendIndicator value={trend} />}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Budget Summary Cards Component
 *
 * Displays key budget metrics in a responsive card grid with animated numbers
 * and trend indicators.
 *
 * @example
 * ```tsx
 * <BudgetSummaryCards
 *   data={{
 *     totalBudget: 6_750_000_000_000,
 *     largestDepartmentName: "Health and Human Services",
 *     largestDepartmentAmount: 1_700_000_000_000,
 *     yearOverYearChange: 4.2,
 *     perCapita: 20150,
 *   }}
 * />
 * ```
 */
export function BudgetSummaryCards({
  data,
  className,
}: BudgetSummaryCardsProps) {
  const {
    totalBudget,
    largestDepartmentName,
    largestDepartmentAmount,
    yearOverYearChange,
    perCapita,
    fiscalYear,
    previousFiscalYear,
  } = data;

  const yearLabel = fiscalYear ? `FY${fiscalYear}` : "Current Year";
  const comparisonLabel = previousFiscalYear
    ? `vs FY${previousFiscalYear}`
    : "vs Prior Year";

  return (
    <div
      className={cn("grid gap-4 grid-cols-2 lg:grid-cols-4", className)}
      role="region"
      aria-label="Budget summary statistics"
    >
      <SummaryCard
        title="Total Budget"
        value={totalBudget}
        subtitle={yearLabel}
        icon={DollarSign}
      />

      <SummaryCard
        title="Largest Department"
        value={largestDepartmentAmount}
        subtitle={largestDepartmentName}
        icon={Building2}
      />

      <SummaryCard
        title="YoY Change"
        value={Math.abs(yearOverYearChange)}
        subtitle={comparisonLabel}
        icon={BarChart3}
        trend={yearOverYearChange}
        formatter={(n: number) =>
          `${yearOverYearChange >= 0 ? "+" : "-"}${n.toFixed(1)}%`
        }
      />

      <SummaryCard
        title="Per Capita"
        value={perCapita}
        subtitle="Per U.S. resident"
        icon={Users}
        formatter={(n: number) => formatCurrency(n)}
      />
    </div>
  );
}

export default BudgetSummaryCards;
