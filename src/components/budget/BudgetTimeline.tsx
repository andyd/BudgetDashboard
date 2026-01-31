"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { formatCurrency } from "@/lib/format";

export interface BudgetTimelineDataPoint {
  year: number;
  amount: number;
}

export interface BudgetTimelineProps {
  /** Array of year-over-year budget data points */
  data: BudgetTimelineDataPoint[];
  /** Threshold percentage for significant change annotation (default: 10) */
  significantChangeThreshold?: number;
  /** Height of the chart in pixels (default: 300) */
  height?: number;
  /** Optional title for the chart */
  title?: string;
  /** Line color (default: primary color) */
  lineColor?: string;
  /** Show grid lines (default: true) */
  showGrid?: boolean;
}

interface SignificantChange {
  year: number;
  amount: number;
  percentChange: number;
  direction: "increase" | "decrease";
}

/**
 * Custom tooltip component for the budget timeline
 */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: BudgetTimelineDataPoint }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const amount = payload[0]?.value;
  if (amount === undefined) return null;

  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
      <p className="text-sm font-medium text-foreground">FY {label}</p>
      <p className="text-lg font-semibold text-primary">
        {formatCurrency(amount, { compact: true })}
      </p>
      <p className="text-xs text-muted-foreground">{formatCurrency(amount)}</p>
    </div>
  );
}

/**
 * Annotation component for significant changes
 */
function AnnotationLabel({
  cx,
  cy,
  change,
}: {
  cx?: number;
  cy?: number;
  change: SignificantChange;
}) {
  if (cx === undefined || cy === undefined) return null;

  const isIncrease = change.direction === "increase";
  const color = isIncrease ? "text-green-600" : "text-red-600";
  const sign = isIncrease ? "+" : "";

  return (
    <g>
      <foreignObject x={cx - 40} y={cy - 45} width={80} height={40}>
        <div
          className={`flex flex-col items-center rounded bg-background/95 px-2 py-1 text-xs shadow-sm border ${color}`}
        >
          <span className="font-semibold">
            {sign}
            {change.percentChange.toFixed(1)}%
          </span>
        </div>
      </foreignObject>
    </g>
  );
}

/**
 * BudgetTimeline Component
 *
 * Displays year-over-year budget changes as a line chart with
 * annotations for significant changes.
 *
 * @example
 * ```tsx
 * <BudgetTimeline
 *   data={[
 *     { year: 2020, amount: 4790000000000 },
 *     { year: 2021, amount: 6820000000000 },
 *     { year: 2022, amount: 6270000000000 },
 *     { year: 2023, amount: 6370000000000 },
 *     { year: 2024, amount: 6750000000000 },
 *   ]}
 *   title="Federal Budget Over Time"
 * />
 * ```
 */
export function BudgetTimeline({
  data,
  significantChangeThreshold = 10,
  height = 300,
  title,
  lineColor = "hsl(var(--primary))",
  showGrid = true,
}: BudgetTimelineProps) {
  // Sort data by year
  const sortedData = useMemo(
    () => [...data].sort((a, b) => a.year - b.year),
    [data],
  );

  // Calculate significant changes
  const significantChanges = useMemo<SignificantChange[]>(() => {
    const changes: SignificantChange[] = [];

    for (let i = 1; i < sortedData.length; i++) {
      const prev = sortedData[i - 1];
      const curr = sortedData[i];

      if (!prev || !curr || prev.amount === 0) continue;

      const percentChange = ((curr.amount - prev.amount) / prev.amount) * 100;

      if (Math.abs(percentChange) >= significantChangeThreshold) {
        changes.push({
          year: curr.year,
          amount: curr.amount,
          percentChange,
          direction: percentChange > 0 ? "increase" : "decrease",
        });
      }
    }

    return changes;
  }, [sortedData, significantChangeThreshold]);

  // Format Y-axis tick values
  const formatYAxis = (value: number): string => {
    return formatCurrency(value, { compact: true });
  };

  // Calculate Y-axis domain with padding
  const yDomain = useMemo(() => {
    if (sortedData.length === 0) return [0, 100];

    const amounts = sortedData.map((d) => d.amount);
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);
    const padding = (max - min) * 0.15;

    return [Math.max(0, min - padding), max + padding];
  }, [sortedData]);

  if (sortedData.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border bg-muted/50"
        style={{ height }}
        role="img"
        aria-label="No budget data available"
      >
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div
      className="w-full"
      role="figure"
      aria-label={title || "Budget timeline chart"}
    >
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.5}
            />
          )}

          <XAxis
            dataKey="year"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickLine={{ stroke: "hsl(var(--border))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickFormatter={(year) => `${year}`}
          />

          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickLine={{ stroke: "hsl(var(--border))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickFormatter={formatYAxis}
            domain={yDomain}
            width={70}
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="amount"
            stroke={lineColor}
            strokeWidth={2}
            dot={{
              fill: lineColor,
              stroke: "hsl(var(--background))",
              strokeWidth: 2,
              r: 4,
            }}
            activeDot={{
              fill: lineColor,
              stroke: "hsl(var(--background))",
              strokeWidth: 2,
              r: 6,
            }}
          />

          {/* Render annotations for significant changes */}
          {significantChanges.map((change) => (
            <ReferenceDot
              key={change.year}
              x={change.year}
              y={change.amount}
              r={0}
              label={<AnnotationLabel change={change} />}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Screen reader description */}
      <div className="sr-only">
        <p>
          Budget timeline from {sortedData[0]?.year} to{" "}
          {sortedData[sortedData.length - 1]?.year}.
        </p>
        <ul>
          {sortedData.map((point) => (
            <li key={point.year}>
              Fiscal Year {point.year}: {formatCurrency(point.amount)}
            </li>
          ))}
        </ul>
        {significantChanges.length > 0 && (
          <>
            <p>Significant changes:</p>
            <ul>
              {significantChanges.map((change) => (
                <li key={change.year}>
                  {change.year}: {change.percentChange.toFixed(1)}%{" "}
                  {change.direction}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
