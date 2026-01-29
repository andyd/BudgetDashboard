'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from '@/lib/framer-client';
import { pie, arc, type PieArcDatum } from 'd3-shape';
import type { BudgetHierarchy } from '@/types/budget';

/**
 * Category color scheme for budget visualization
 */
const CATEGORY_COLORS: Record<string, string> = {
  defense: '#ef4444',
  military: '#ef4444',
  'health and human services': '#3b82f6',
  healthcare: '#3b82f6',
  'social security': '#8b5cf6',
  'social security administration': '#8b5cf6',
  treasury: '#10b981',
  'department of the treasury': '#10b981',
  agriculture: '#84cc16',
  education: '#f59e0b',
  'veterans affairs': '#ec4899',
  transportation: '#06b6d4',
  'homeland security': '#f97316',
  energy: '#eab308',
  'housing and urban development': '#6366f1',
  justice: '#78716c',
  'department of justice': '#78716c',
  state: '#14b8a6',
  'department of state': '#14b8a6',
  interior: '#22c55e',
  commerce: '#a855f7',
  labor: '#0ea5e9',
  other: '#64748b',
  default: '#94a3b8',
};

/**
 * Get color for a category with fallback
 */
function getCategoryColor(name: string): string {
  const normalizedName = name.toLowerCase();

  if (CATEGORY_COLORS[normalizedName]) {
    return CATEGORY_COLORS[normalizedName];
  }

  for (const [key, color] of Object.entries(CATEGORY_COLORS)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return color;
    }
  }

  return CATEGORY_COLORS.default || '#94a3b8';
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

interface PieSlice {
  id: string;
  name: string;
  amount: number;
  percentOfParent: number | null;
  percentOfTotal: number;
  color: string;
}

interface BudgetPieChartProps {
  data: BudgetHierarchy;
  onItemClick?: (itemId: string) => void;
  onItemHover?: (itemId: string | null) => void;
  selectedItemId?: string | null;
  className?: string;
}

export function BudgetPieChart({
  data,
  onItemClick,
  onItemHover,
  selectedItemId,
  className = '',
}: BudgetPieChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredSlice, setHoveredSlice] = useState<PieSlice | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Prepare slice data
  const sliceData = useMemo<PieSlice[]>(() => {
    return data.departments.map((dept) => ({
      id: dept.id,
      name: dept.name,
      amount: dept.amount,
      percentOfParent: dept.percentOfParent,
      percentOfTotal: (dept.amount / data.totalAmount) * 100,
      color: getCategoryColor(dept.name),
    }));
  }, [data]);

  // Calculate pie layout
  const pieData = useMemo(() => {
    const pieGenerator = pie<PieSlice>()
      .value((d) => d.amount)
      .sort((a, b) => b.amount - a.amount)
      .padAngle(0.02);

    return pieGenerator(sliceData);
  }, [sliceData]);

  // Calculate arc generator
  const { arcGenerator, labelArcGenerator } = useMemo(() => {
    const size = Math.min(dimensions.width, dimensions.height);
    const outerRadius = size / 2 - 20;
    const innerRadius = outerRadius * 0.4; // Donut style

    const arcGen = arc<PieArcDatum<PieSlice>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(4);

    const labelArcGen = arc<PieArcDatum<PieSlice>>()
      .innerRadius(outerRadius * 0.7)
      .outerRadius(outerRadius * 0.7);

    return { arcGenerator: arcGen, labelArcGenerator: labelArcGen };
  }, [dimensions]);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleSliceHover = (slice: PieSlice | null) => {
    setHoveredSlice(slice);
    onItemHover?.(slice?.id || null);
  };

  const handleSliceClick = (sliceId: string) => {
    onItemClick?.(sliceId);
  };

  const shouldShowLabel = (d: PieArcDatum<PieSlice>): boolean => {
    return d.data.percentOfTotal > 5;
  };

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div
        ref={containerRef}
        className="h-full w-full overflow-hidden rounded-lg bg-white dark:bg-gray-900"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => handleSliceHover(null)}
      >
        <svg
          width={dimensions.width}
          height={dimensions.height}
          className="h-full w-full"
          role="img"
          aria-label="Budget pie chart visualization"
        >
          <g transform={`translate(${centerX}, ${centerY})`}>
            {pieData.map((d) => {
              const isSelected = selectedItemId === d.data.id;
              const isHovered = hoveredSlice?.id === d.data.id;
              const showLabel = shouldShowLabel(d);
              const pathD = arcGenerator(d) || '';
              const labelPosition = labelArcGenerator.centroid(d);

              return (
                <g key={d.data.id}>
                  <motion.path
                    d={pathD}
                    fill={d.data.color}
                    stroke={isSelected ? '#ffffff' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={isSelected ? 3 : 1}
                    className="cursor-pointer"
                    onMouseEnter={() => handleSliceHover(d.data)}
                    onClick={() => handleSliceClick(d.data.id)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isHovered ? 1 : 0.85,
                      scale: isHovered ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${d.data.name}: ${formatCurrency(d.data.amount)}`}
                  />

                  {showLabel && (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="pointer-events-none"
                    >
                      <text
                        x={labelPosition[0]}
                        y={labelPosition[1]}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#ffffff"
                        className="select-none text-xs font-semibold"
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                      >
                        <tspan x={labelPosition[0]} dy="-0.5em">
                          {d.data.name.length > 15
                            ? `${d.data.name.substring(0, 15)}...`
                            : d.data.name}
                        </tspan>
                        <tspan x={labelPosition[0]} dy="1.2em" className="font-bold">
                          {d.data.percentOfTotal.toFixed(1)}%
                        </tspan>
                      </text>
                    </motion.g>
                  )}
                </g>
              );
            })}

            {/* Center label showing total */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <text
                x={0}
                y={-10}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-lg font-bold"
              >
                {formatCurrency(data.totalAmount)}
              </text>
              <text
                x={0}
                y={15}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-xs"
              >
                FY {data.fiscalYear}
              </text>
            </motion.g>
          </g>
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredSlice && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute z-50 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white shadow-lg dark:bg-gray-800"
              style={{
                left: mousePosition.x + 16,
                top: mousePosition.y + 16,
                transform:
                  mousePosition.x > dimensions.width - 200
                    ? 'translateX(-100%)'
                    : 'none',
              }}
            >
              <div className="mb-1 text-sm font-semibold">
                {hoveredSlice.name}
              </div>
              <div className="mb-1 text-lg font-bold">
                {formatCurrency(hoveredSlice.amount)}
              </div>
              <div className="text-xs text-gray-300">
                {hoveredSlice.percentOfTotal.toFixed(2)}% of total
              </div>
              {hoveredSlice.percentOfParent !== null && (
                <div className="text-xs text-gray-400">
                  {hoveredSlice.percentOfParent.toFixed(2)}% of parent
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {sliceData.slice(0, 8).map((slice) => (
          <button
            key={slice.id}
            className="flex items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors hover:bg-muted/50"
            onClick={() => handleSliceClick(slice.id)}
            onMouseEnter={() => handleSliceHover(slice)}
            onMouseLeave={() => handleSliceHover(null)}
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-muted-foreground">
              {slice.name.length > 20
                ? `${slice.name.substring(0, 20)}...`
                : slice.name}
            </span>
          </button>
        ))}
        {sliceData.length > 8 && (
          <span className="px-2 py-1 text-xs text-muted-foreground">
            +{sliceData.length - 8} more
          </span>
        )}
      </div>
    </div>
  );
}
