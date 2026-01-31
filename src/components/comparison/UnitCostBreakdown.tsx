"use client";

/**
 * UnitCostBreakdown Component
 *
 * Displays a visual breakdown of what makes up a unit's cost.
 * Uses a horizontal stacked bar chart or pie chart to show cost components.
 * Gracefully handles units without breakdown data.
 */

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { ExternalLink, Info, BarChart3, PieChartIcon } from "lucide-react";
import type { ComparisonUnit } from "@/types/comparison";
import { formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Cost breakdown item representing a component of the unit cost
 */
export interface CostBreakdownItem {
  /** Unique identifier */
  id: string;
  /** Display name of the cost component */
  name: string;
  /** Dollar amount for this component */
  amount: number;
  /** Optional color override */
  color?: string;
  /** Optional description/tooltip text */
  description?: string;
}

/**
 * Extended unit type with optional breakdown data
 */
export interface UnitWithBreakdown extends ComparisonUnit {
  /** Optional cost breakdown components */
  breakdown?: CostBreakdownItem[];
  /** Source URL for the cost data */
  sourceUrl?: string;
}

export interface UnitCostBreakdownProps {
  /** The comparison unit to display breakdown for */
  unit: UnitWithBreakdown;
  /** Height of the chart (default: 60 for bar, 200 for pie) */
  height?: number;
  /** Additional CSS classes */
  className?: string;
  /** Show legend (default: true for pie, false for bar) */
  showLegend?: boolean;
  /** Initial chart type (default: 'bar') */
  defaultChartType?: "bar" | "pie";
  /** Allow toggling between chart types (default: true) */
  allowToggle?: boolean;
}

/** Default colors for breakdown segments */
const BREAKDOWN_COLORS = [
  "#3B82F6", // blue-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#06B6D4", // cyan-500
  "#84CC16", // lime-500
];

/**
 * Custom tooltip for the breakdown charts
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      id: string;
      name: string;
      amount: number;
      percent: number;
      description?: string;
      color: string;
    };
    dataKey?: string;
    value?: number;
    name?: string;
  }>;
  totalCost: number;
}

function CustomTooltip({ active, payload, totalCost }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const firstPayload = payload[0];
  if (!firstPayload) {
    return null;
  }

  const data = firstPayload.payload;

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="h-2.5 w-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: data.color }}
        />
        <span className="text-sm font-semibold text-popover-foreground">
          {data.name}
        </span>
      </div>
      <div className="text-lg font-bold text-popover-foreground">
        {formatCurrency(data.amount, { compact: true })}
      </div>
      <div className="text-xs text-muted-foreground">
        {formatPercent(data.amount / totalCost, 1)} of total
      </div>
      {data.description && (
        <div className="mt-2 text-xs text-muted-foreground/80 max-w-[200px]">
          {data.description}
        </div>
      )}
    </div>
  );
}

/**
 * Custom legend for the pie chart
 */
interface CustomLegendProps {
  payload?: Array<{
    value: string;
    color: string;
    payload: {
      percent: number;
      amount: number;
    };
  }>;
}

function CustomLegend({ payload }: CustomLegendProps) {
  if (!payload) return null;

  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 px-2 pt-2">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5 text-xs">
          <span
            className="h-2 w-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.value}</span>
          <span className="text-muted-foreground/70">
            ({formatPercent(entry.payload.percent / 100, 0)})
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Empty state when no breakdown data is available
 */
function NoBreakdownState({ unit }: { unit: ComparisonUnit }) {
  const unitCost = unit.costPerUnit ?? unit.cost ?? 0;

  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <Info className="h-8 w-8 text-muted-foreground/50 mb-2" />
      <p className="text-sm text-muted-foreground mb-1">
        No cost breakdown available
      </p>
      <p className="text-xs text-muted-foreground/70 max-w-[200px]">
        The total cost of {formatCurrency(unitCost, { compact: true })} for a{" "}
        {unit.nameSingular || unit.name} is shown as a single value.
      </p>
    </div>
  );
}

/**
 * Source attribution display
 */
function SourceAttribution({
  source,
  sourceUrl,
}: {
  source?: string;
  sourceUrl?: string;
}) {
  if (!source && !sourceUrl) return null;

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3 pt-2 border-t border-border/50">
      <span className="text-muted-foreground/70">Source:</span>
      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors underline decoration-muted-foreground/30 underline-offset-2 hover:decoration-foreground/50"
        >
          <span>{source || "View source"}</span>
          <ExternalLink className="h-3 w-3 flex-shrink-0" />
        </a>
      ) : (
        <span>{source}</span>
      )}
    </div>
  );
}

/**
 * UnitCostBreakdown Component
 *
 * Displays a visual breakdown of a unit's cost components using either
 * a horizontal stacked bar chart or a pie chart.
 *
 * @example
 * ```tsx
 * const unitWithBreakdown = {
 *   id: 'teacher-salary',
 *   name: 'Teacher Salaries',
 *   costPerUnit: 65000,
 *   category: 'salary',
 *   breakdown: [
 *     { id: 'base', name: 'Base Salary', amount: 52000 },
 *     { id: 'benefits', name: 'Benefits', amount: 10000 },
 *     { id: 'pension', name: 'Pension', amount: 3000 },
 *   ],
 *   source: 'Bureau of Labor Statistics',
 *   sourceUrl: 'https://bls.gov',
 * };
 *
 * <UnitCostBreakdown unit={unitWithBreakdown} />
 * ```
 */
export function UnitCostBreakdown({
  unit,
  height,
  className,
  showLegend,
  defaultChartType = "bar",
  allowToggle = true,
}: UnitCostBreakdownProps) {
  const [chartType, setChartType] = useState<"bar" | "pie">(defaultChartType);

  const unitCost = unit.costPerUnit ?? unit.cost ?? 0;
  const breakdown = unit.breakdown;

  // Calculate chart height based on type
  const chartHeight = height ?? (chartType === "bar" ? 60 : 200);
  const legendEnabled = showLegend ?? chartType === "pie";

  // Prepare chart data with colors and percentages
  const chartData = useMemo(() => {
    if (!breakdown || breakdown.length === 0) {
      return [];
    }

    return breakdown.map((item, index) => ({
      id: item.id,
      name: item.name,
      amount: item.amount,
      percent: (item.amount / unitCost) * 100,
      color: item.color || BREAKDOWN_COLORS[index % BREAKDOWN_COLORS.length],
      description: item.description,
    }));
  }, [breakdown, unitCost]);

  // If no breakdown data, show empty state
  if (!breakdown || breakdown.length === 0) {
    return (
      <div className={cn("rounded-lg border bg-card p-4", className)}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-foreground">
            Cost Breakdown
          </h4>
          <span className="text-sm font-semibold text-foreground">
            {formatCurrency(unitCost, { compact: true })}
          </span>
        </div>
        <NoBreakdownState unit={unit} />
        <SourceAttribution source={unit.source} sourceUrl={unit.sourceUrl} />
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border bg-card p-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-medium text-foreground">
            Cost Breakdown
          </h4>
          <p className="text-xs text-muted-foreground">
            {unit.nameSingular || unit.name}:{" "}
            <span className="font-medium">
              {formatCurrency(unitCost, { compact: true })}
            </span>
          </p>
        </div>
        {allowToggle && (
          <div className="flex gap-1">
            <Button
              variant={chartType === "bar" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setChartType("bar")}
              title="Stacked bar chart"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span className="sr-only">Bar chart</span>
            </Button>
            <Button
              variant={chartType === "pie" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setChartType("pie")}
              title="Pie chart"
            >
              <PieChartIcon className="h-3.5 w-3.5" />
              <span className="sr-only">Pie chart</span>
            </Button>
          </div>
        )}
      </div>

      {/* Chart */}
      {chartType === "bar" ? (
        <div className="w-full">
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={[
                {
                  name: "breakdown",
                  ...Object.fromEntries(chartData.map((d) => [d.id, d.amount])),
                },
              ]}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              barSize={chartHeight - 16}
            >
              <XAxis type="number" hide domain={[0, unitCost]} />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip
                content={<CustomTooltip totalCost={unitCost} />}
                cursor={false}
              />
              {chartData.map((item) => (
                <Bar
                  key={item.id}
                  dataKey={item.id}
                  stackId="breakdown"
                  fill={item.color}
                  radius={0}
                  className="cursor-pointer"
                  name={item.name}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>

          {/* Inline legend for bar chart */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {chartData.map((item) => (
              <div key={item.id} className="flex items-center gap-1.5 text-xs">
                <span
                  className="h-2 w-2 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground">{item.name}</span>
                <span className="text-foreground font-medium">
                  {formatCurrency(item.amount, { compact: true })}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="80%"
              paddingAngle={2}
              dataKey="amount"
              nameKey="name"
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.id}
                  fill={entry.color}
                  stroke="white"
                  strokeWidth={1}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip totalCost={unitCost} />} />
            {legendEnabled && (
              <Legend content={<CustomLegend />} verticalAlign="bottom" />
            )}
          </PieChart>
        </ResponsiveContainer>
      )}

      {/* Source attribution */}
      <SourceAttribution source={unit.source} sourceUrl={unit.sourceUrl} />
    </div>
  );
}

export default UnitCostBreakdown;
