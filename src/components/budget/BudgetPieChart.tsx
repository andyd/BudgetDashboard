"use client";

import { useMemo, useState, useCallback, memo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Sector,
} from "recharts";
import type { BudgetHierarchy, BudgetItem, Department } from "@/types/budget";
import { cn } from "@/lib/utils";

/**
 * Distinct color palette for pie chart segments
 * 20 visually distinct colors that work well on dark backgrounds
 */
const DISTINCT_COLORS = [
  { primary: "#3B82F6", hover: "#60A5FA" }, // blue
  { primary: "#EF4444", hover: "#F87171" }, // red
  { primary: "#10B981", hover: "#34D399" }, // emerald
  { primary: "#F59E0B", hover: "#FBBF24" }, // amber
  { primary: "#8B5CF6", hover: "#A78BFA" }, // violet
  { primary: "#EC4899", hover: "#F472B6" }, // pink
  { primary: "#06B6D4", hover: "#22D3EE" }, // cyan
  { primary: "#84CC16", hover: "#A3E635" }, // lime
  { primary: "#F97316", hover: "#FB923C" }, // orange
  { primary: "#6366F1", hover: "#818CF8" }, // indigo
  { primary: "#14B8A6", hover: "#2DD4BF" }, // teal
  { primary: "#E11D48", hover: "#FB7185" }, // rose
  { primary: "#22C55E", hover: "#4ADE80" }, // green
  { primary: "#A855F7", hover: "#C084FC" }, // purple
  { primary: "#0EA5E9", hover: "#38BDF8" }, // sky
  { primary: "#EAB308", hover: "#FCD34D" }, // yellow
  { primary: "#D946EF", hover: "#E879F9" }, // fuchsia
  { primary: "#64748B", hover: "#94A3B8" }, // slate
  { primary: "#78716C", hover: "#A8A29E" }, // stone
  { primary: "#71717A", hover: "#A1A1AA" }, // zinc
];

/**
 * Get color by index for guaranteed distinct colors
 */
function getColorByIndex(index: number): { primary: string; hover: string } {
  return DISTINCT_COLORS[index % DISTINCT_COLORS.length];
}

/**
 * Format currency for display
 */
function formatCurrency(amount: number): string {
  if (amount >= 1e12) return `$${(amount / 1e12).toFixed(1)}T`;
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
  return `$${amount.toFixed(0)}`;
}

/**
 * Pie slice data structure for Recharts
 */
interface PieSliceData {
  id: string;
  name: string;
  amount: number;
  percentOfParent: number | null;
  percentOfTotal: number;
  color: string;
  hoverColor: string;
}

/**
 * Props for the BudgetPieChart component
 */
export interface BudgetPieChartProps {
  /** Budget hierarchy data to visualize */
  data: BudgetHierarchy;
  /** Callback when a slice is clicked for drill-down */
  onItemClick?: (itemId: string, item: BudgetItem | Department) => void;
  /** Callback when a slice is hovered for highlighting */
  onItemHover?: (itemId: string | null) => void;
  /** Currently selected item ID (for highlighting) */
  selectedItemId?: string | null;
  /** Additional CSS classes */
  className?: string;
  /** Chart height (default: 400) */
  height?: number;
  /** Show legend (default: true) */
  showLegend?: boolean;
  /** Inner radius ratio for donut style (0-1, default: 0.4) */
  innerRadiusRatio?: number;
  /** Outer radius ratio (0-1, default: 0.8) */
  outerRadiusRatio?: number;
}

/**
 * Custom tooltip component for the pie chart
 */
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: PieSliceData;
  }>;
}

const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
}: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <div className="mb-1 text-sm font-semibold text-popover-foreground">
        {data.name}
      </div>
      <div className="mb-1 text-lg font-bold text-popover-foreground">
        {formatCurrency(data.amount)}
      </div>
      <div className="text-xs text-muted-foreground">
        {data.percentOfTotal.toFixed(1)}% of total budget
      </div>
      {data.percentOfParent !== null && (
        <div className="text-xs text-muted-foreground">
          {data.percentOfParent.toFixed(1)}% of parent
        </div>
      )}
      <div className="mt-2 text-xs text-muted-foreground/80">
        Click to explore
      </div>
    </div>
  );
});

/**
 * Custom legend component
 */
interface CustomLegendProps {
  payload?: Array<{
    value: string;
    color: string;
    payload: {
      id: string;
    };
  }>;
  onItemClick?: (itemId: string) => void;
  onItemHover?: (itemId: string | null) => void;
}

const CustomLegend = memo(function CustomLegend({
  payload,
  onItemClick,
  onItemHover,
}: CustomLegendProps) {
  if (!payload) return null;

  // Show top 8 items
  const visibleItems = payload.slice(0, 8);
  const remainingCount = payload.length - 8;

  return (
    <div className="flex flex-wrap justify-center gap-2 px-2 pt-4">
      {visibleItems.map((entry) => (
        <button
          key={entry.payload.id}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => onItemClick?.(entry.payload.id)}
          onMouseEnter={() => onItemHover?.(entry.payload.id)}
          onMouseLeave={() => onItemHover?.(null)}
        >
          <span
            className="h-2.5 w-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground truncate max-w-[120px]">
            {entry.value}
          </span>
        </button>
      ))}
      {remainingCount > 0 && (
        <span className="px-2 py-1 text-xs text-muted-foreground">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
});

/**
 * Active shape renderer for hover effect
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderActiveShape(props: any) {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
  } = props;

  return (
    <g>
      {/* Expanded outer slice */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={payload.hoverColor}
        stroke="white"
        strokeWidth={2}
      />
      {/* Inner slice for depth effect */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={innerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
}

/**
 * Minimum percentage threshold for showing labels
 * Segments smaller than this will not have callout labels
 * Higher threshold on mobile to reduce clutter
 */
const LABEL_MIN_PERCENT_MOBILE = 8;
const LABEL_MIN_PERCENT_DESKTOP = 3;

/**
 * Minimum vertical spacing between label groups (in pixels)
 */
const MIN_LABEL_SPACING = 28;

/**
 * Label position data structure for collision detection
 */
interface LabelPosition {
  index: number;
  angle: number;
  y: number;
  side: "left" | "right";
}

/**
 * Adjust label positions to prevent overlaps using collision detection
 * Spreads labels vertically when they would overlap
 */
function adjustLabelPositions(positions: LabelPosition[]): Map<number, number> {
  const adjusted = new Map<number, number>();

  // Sort by vertical position (y coordinate)
  const sortedPositions = [...positions].sort((a, b) => a.y - b.y);

  // Process each side separately
  const leftSide = sortedPositions.filter((p) => p.side === "left");
  const rightSide = sortedPositions.filter((p) => p.side === "right");

  // Adjust positions for each side
  [leftSide, rightSide].forEach((sidePositions) => {
    if (sidePositions.length === 0) return;

    // Start with original positions
    const newPositions = sidePositions.map((p) => ({ ...p, adjustedY: p.y }));

    // Iteratively resolve collisions
    let hasCollision = true;
    let iterations = 0;
    const maxIterations = 50;

    while (hasCollision && iterations < maxIterations) {
      hasCollision = false;
      iterations++;

      for (let i = 0; i < newPositions.length - 1; i++) {
        const current = newPositions[i];
        const next = newPositions[i + 1];

        const gap = next.adjustedY - current.adjustedY;

        if (gap < MIN_LABEL_SPACING) {
          hasCollision = true;

          // Calculate adjustment needed
          const adjustment = (MIN_LABEL_SPACING - gap) / 2;

          // Push labels apart
          current.adjustedY -= adjustment;
          next.adjustedY += adjustment;
        }
      }
    }

    // Store adjusted positions
    newPositions.forEach((p) => {
      adjusted.set(p.index, p.adjustedY);
    });
  });

  return adjusted;
}

/**
 * Custom label renderer with callout lines and collision detection
 * Shows label with leader line pointing to segment center
 * Labels are automatically spread apart to avoid overlaps
 */
const renderCustomLabel = (() => {
  let labelPositions: LabelPosition[] = [];
  let adjustedPositions: Map<number, number> | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function renderLabel(props: any) {
    const { cx, cy, midAngle, outerRadius, fill, payload, index, viewBox } =
      props;

    // Determine if mobile based on viewport width
    const isMobile = viewBox?.width < 640;
    const minPercent = isMobile
      ? LABEL_MIN_PERCENT_MOBILE
      : LABEL_MIN_PERCENT_DESKTOP;

    // Don't render label for small segments
    if (payload.percentOfTotal < minPercent) {
      return null;
    }

    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);

    // Adjust callout line length based on screen size
    const lineOffset = isMobile ? 8 : 10;
    const lineLength = isMobile ? 20 : 30;
    const horizontalExtension = isMobile ? 15 : 22;

    // Calculate positions for the callout line
    const sx = cx + (outerRadius + lineOffset) * cos;
    const sy = cy + (outerRadius + lineOffset) * sin;
    const mx = cx + (outerRadius + lineLength) * cos;
    const my = cy + (outerRadius + lineLength) * sin;

    // On first item of each render, reset and collect positions
    if (index === 0) {
      labelPositions = [];
      adjustedPositions = null;
    }

    // Collect all label positions during first pass
    if (!adjustedPositions) {
      labelPositions.push({
        index,
        angle: midAngle,
        y: my,
        side: cos >= 0 ? "right" : "left",
      });

      // After collecting all positions, calculate adjustments
      // We detect completion by checking if this is the last expected render
      if (labelPositions.length > index) {
        adjustedPositions = adjustLabelPositions(labelPositions);
      }
    }

    // Get adjusted Y position or use original
    const adjustedY = adjustedPositions?.get(index) ?? my;
    const ex = mx + (cos >= 0 ? 1 : -1) * horizontalExtension;
    const ey = adjustedY;
    const textAnchor = cos >= 0 ? "start" : "end";

    // Truncate long names - shorter on mobile
    const maxLength = isMobile ? 12 : 20;
    const displayName =
      payload.name.length > maxLength
        ? payload.name.substring(0, maxLength - 2) + "..."
        : payload.name;

    // Font sizes - smaller on mobile
    const nameFontSize = isMobile ? 9 : 11;
    const percentFontSize = isMobile ? 8 : 10;

    return (
      <g key={`label-${index}`}>
        {/* Leader line from slice to label with elbow at adjusted position */}
        <path
          d={`M${sx},${sy}L${mx},${my}L${mx},${adjustedY}L${ex},${ey}`}
          stroke={fill}
          strokeWidth={isMobile ? 1 : 1.5}
          fill="none"
          opacity={0.8}
        />
        {/* Dot at the slice edge */}
        <circle cx={sx} cy={sy} r={isMobile ? 2 : 3} fill={fill} />
        {/* Category name */}
        <text
          x={ex + (cos >= 0 ? 4 : -4)}
          y={ey}
          textAnchor={textAnchor}
          fill="#e5e7eb"
          fontSize={nameFontSize}
          fontWeight={500}
          dominantBaseline="middle"
        >
          {displayName}
        </text>
        {/* Percentage */}
        <text
          x={ex + (cos >= 0 ? 4 : -4)}
          y={ey + (isMobile ? 11 : 14)}
          textAnchor={textAnchor}
          fill="#9ca3af"
          fontSize={percentFontSize}
        >
          {payload.percentOfTotal.toFixed(1)}%
        </text>
      </g>
    );
  };
})();

/**
 * BudgetPieChart Component
 *
 * A responsive pie/donut chart visualization for budget data using Recharts.
 * Displays department spending as slices with interactive tooltips and
 * drill-down capability.
 *
 * @example
 * ```tsx
 * <BudgetPieChart
 *   data={budgetData}
 *   onItemClick={(id, item) => router.push(`/budget/${id}`)}
 *   onItemHover={(id) => setHighlightedId(id)}
 * />
 * ```
 */
export function BudgetPieChart({
  data,
  onItemClick,
  onItemHover,
  selectedItemId,
  className,
  height = 400,
  showLegend = true,
  innerRadiusRatio = 0.4,
  outerRadiusRatio = 0.8,
}: BudgetPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // Get budget items from hierarchy (departments or items)
  const budgetItems = useMemo(() => {
    if (data.departments && data.departments.length > 0) {
      return data.departments;
    }
    if (data.items && data.items.length > 0) {
      return data.items;
    }
    return [];
  }, [data]);

  // Prepare slice data for Recharts with index-based distinct colors
  const sliceData = useMemo<PieSliceData[]>(() => {
    const sorted = budgetItems
      .map((item) => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        percentOfParent: item.percentOfParent,
        percentOfTotal: (item.amount / data.totalAmount) * 100,
        color: "", // Will be set below
        hoverColor: "", // Will be set below
      }))
      .sort((a, b) => b.amount - a.amount);

    // Assign distinct colors by index after sorting
    return sorted.map((item, index) => {
      const colors = getColorByIndex(index);
      return {
        ...item,
        color: colors.primary,
        hoverColor: colors.hover,
      };
    });
  }, [budgetItems, data.totalAmount]);

  // Find the original item for click callback
  const findOriginalItem = useCallback(
    (itemId: string): BudgetItem | Department | undefined => {
      return budgetItems.find((item) => item.id === itemId);
    },
    [budgetItems],
  );

  // Handle slice click
  const handleSliceClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data: any, index: number) => {
      const slice = sliceData[index];
      if (slice && onItemClick) {
        const originalItem = findOriginalItem(slice.id);
        if (originalItem) {
          onItemClick(slice.id, originalItem);
        }
      }
    },
    [sliceData, onItemClick, findOriginalItem],
  );

  // Handle slice hover
  const handleSliceEnter = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_: any, index: number) => {
      setActiveIndex(index);
      const slice = sliceData[index];
      if (slice) {
        onItemHover?.(slice.id);
      }
    },
    [sliceData, onItemHover],
  );

  const handleSliceLeave = useCallback(() => {
    setActiveIndex(undefined);
    onItemHover?.(null);
  }, [onItemHover]);

  // Handle legend click
  const handleLegendClick = useCallback(
    (itemId: string) => {
      const originalItem = findOriginalItem(itemId);
      if (originalItem && onItemClick) {
        onItemClick(itemId, originalItem);
      }
    },
    [findOriginalItem, onItemClick],
  );

  // Handle legend hover
  const handleLegendHover = useCallback(
    (itemId: string | null) => {
      if (itemId) {
        const index = sliceData.findIndex((s) => s.id === itemId);
        setActiveIndex(index >= 0 ? index : undefined);
      } else {
        setActiveIndex(undefined);
      }
      onItemHover?.(itemId);
    },
    [sliceData, onItemHover],
  );

  // Find selected index
  const selectedIndex = useMemo(() => {
    if (!selectedItemId) return undefined;
    const index = sliceData.findIndex((s) => s.id === selectedItemId);
    return index >= 0 ? index : undefined;
  }, [selectedItemId, sliceData]);

  // Use selected index if no active hover
  const effectiveActiveIndex = activeIndex ?? selectedIndex;

  if (sliceData.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted/20",
          className,
        )}
        style={{ height }}
      >
        <p className="text-muted-foreground">No budget data available</p>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={sliceData}
            cx="50%"
            cy="50%"
            innerRadius={`${innerRadiusRatio * 100}%`}
            outerRadius={`${outerRadiusRatio * 100}%`}
            paddingAngle={2}
            dataKey="amount"
            nameKey="name"
            onClick={handleSliceClick}
            onMouseEnter={handleSliceEnter}
            onMouseLeave={handleSliceLeave}
            activeIndex={effectiveActiveIndex}
            activeShape={renderActiveShape}
            label={renderCustomLabel}
            labelLine={false}
            className="cursor-pointer focus-visible:outline-none"
          >
            {sliceData.map((entry, index) => (
              <Cell
                key={entry.id}
                fill={entry.color}
                stroke="white"
                strokeWidth={1}
                className="transition-opacity duration-200"
                style={{
                  opacity:
                    effectiveActiveIndex !== undefined &&
                    effectiveActiveIndex !== index
                      ? 0.6
                      : 1,
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              content={
                <CustomLegend
                  onItemClick={handleLegendClick}
                  onItemHover={handleLegendHover}
                />
              }
              verticalAlign="bottom"
            />
          )}
        </PieChart>
      </ResponsiveContainer>

      {/* Center label showing total */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
        style={{
          marginTop: showLegend ? -24 : 0,
        }}
      >
        <div className="text-xl font-bold text-foreground sm:text-2xl">
          {formatCurrency(data.totalAmount)}
        </div>
        {data.fiscalYear && (
          <div className="text-xs text-muted-foreground">
            FY {data.fiscalYear}
          </div>
        )}
      </div>
    </div>
  );
}
