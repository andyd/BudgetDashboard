/**
 * BudgetBarChart Component
 *
 * Horizontal bar chart displaying budget items sorted by amount.
 * Uses Recharts for visualization with click-to-select functionality.
 */

"use client";

import React, { useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { BudgetItem } from "@/types/budget";
import { formatCurrency, formatPercent } from "@/lib/format";

export interface BudgetBarChartProps {
  /** Array of budget items to display */
  items: BudgetItem[];
  /** Currently selected item ID */
  selectedId?: string;
  /** Callback when an item is clicked */
  onItemClick?: (item: BudgetItem) => void;
  /** Height of each bar in pixels */
  barHeight?: number;
  /** Color for unselected bars */
  barColor?: string;
  /** Color for selected bar */
  selectedColor?: string;
  /** Show percentage labels on bars */
  showPercentages?: boolean;
  /** Maximum number of items to display */
  maxItems?: number;
  /** Custom class name for container */
  className?: string;
}

interface ChartDataItem {
  id: string;
  name: string;
  amount: number;
  percentOfTotal: number;
  originalItem: BudgetItem;
}

/**
 * Custom tooltip component for the bar chart
 */
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartDataItem }>;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const firstPayload = payload[0];
  if (!firstPayload) {
    return null;
  }

  const data = firstPayload.payload;

  return (
    <div className="rounded-lg border bg-background p-3 shadow-lg">
      <p className="font-semibold text-foreground">{data.name}</p>
      <p className="text-sm text-muted-foreground">
        {formatCurrency(data.amount, { compact: true })}
      </p>
      <p className="text-sm text-muted-foreground">
        {formatPercent(data.percentOfTotal / 100, 1)} of total
      </p>
    </div>
  );
}

/**
 * Custom label component for percentage display
 */
function PercentageLabel(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
}) {
  const { x = 0, y = 0, width = 0, height = 0, value = 0 } = props;

  // Only show label if bar is wide enough
  if (width < 50) return null;

  return (
    <text
      x={x + width - 8}
      y={y + height / 2}
      fill="white"
      textAnchor="end"
      dominantBaseline="middle"
      className="text-xs font-medium"
    >
      {formatPercent(value / 100, 1)}
    </text>
  );
}

export function BudgetBarChart({
  items,
  selectedId,
  onItemClick,
  barHeight = 40,
  barColor = "hsl(var(--primary))",
  selectedColor = "hsl(var(--primary) / 0.8)",
  showPercentages = true,
  maxItems = 10,
  className = "",
}: BudgetBarChartProps) {
  // Calculate total for percentage computation
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.amount, 0),
    [items],
  );

  // Sort items by amount descending and prepare chart data
  const chartData: ChartDataItem[] = useMemo(() => {
    return items
      .slice()
      .sort((a, b) => b.amount - a.amount)
      .slice(0, maxItems)
      .map((item) => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        percentOfTotal: total > 0 ? (item.amount / total) * 100 : 0,
        originalItem: item,
      }));
  }, [items, maxItems, total]);

  // Calculate dynamic height based on number of items
  const chartHeight = useMemo(() => {
    return Math.max(200, chartData.length * barHeight + 60);
  }, [chartData.length, barHeight]);

  // Handle bar click
  const handleBarClick = useCallback(
    (data: ChartDataItem) => {
      if (onItemClick) {
        onItemClick(data.originalItem);
      }
    },
    [onItemClick],
  );

  // Truncate name for Y-axis display
  const formatYAxisLabel = useCallback((value: string) => {
    return value.length > 25 ? `${value.slice(0, 22)}...` : value;
  }, []);

  if (items.length === 0) {
    return (
      <div
        className={`flex items-center justify-center h-48 text-muted-foreground ${className}`}
      >
        No budget items to display
      </div>
    );
  }

  return (
    <div
      className={`w-full ${className}`}
      role="img"
      aria-label={`Bar chart showing ${chartData.length} budget items sorted by amount`}
    >
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
        >
          <XAxis
            type="number"
            tickFormatter={(value) => formatCurrency(value, { compact: true })}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={{ stroke: "hsl(var(--border))" }}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tickFormatter={formatYAxisLabel}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={false}
            tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
          />
          <Bar
            dataKey="amount"
            radius={[0, 4, 4, 0]}
            animationDuration={800}
            animationEasing="ease-out"
            onClick={(_, index) => {
              const item = chartData[index];
              if (item) {
                handleBarClick(item);
              }
            }}
            style={{ cursor: onItemClick ? "pointer" : "default" }}
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.id}
                fill={entry.id === selectedId ? selectedColor : barColor}
                className="transition-opacity hover:opacity-80"
              />
            ))}
            {showPercentages && (
              <LabelList
                dataKey="percentOfTotal"
                content={<PercentageLabel />}
              />
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BudgetBarChart;
