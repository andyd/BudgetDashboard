'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hierarchy, treemap as d3Treemap, type HierarchyRectangularNode } from 'd3-hierarchy';
import type { BudgetHierarchy } from '@/types/budget';

/**
 * Category color scheme for budget visualization
 * Maps department names to color codes
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

/**
 * Tree node structure for D3 hierarchy
 */
interface TreeNode {
  id: string;
  name: string;
  amount: number;
  parentId: string | null;
  children?: TreeNode[];
  percentOfParent?: number | null;
}

/**
 * Treemap cell data
 */
interface TreemapCell {
  id: string;
  name: string;
  amount: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  percentOfParent: number | null;
  percentOfTotal: number;
}

interface BudgetTreemapProps {
  data: BudgetHierarchy;
  onItemClick?: (itemId: string) => void;
  onItemHover?: (itemId: string | null) => void;
  selectedItemId?: string | null;
  className?: string;
}

export function BudgetTreemap({
  data,
  onItemClick,
  onItemHover,
  selectedItemId,
  className = '',
}: BudgetTreemapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredCell, setHoveredCell] = useState<TreemapCell | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const treeData = useMemo<TreeNode>(() => {
    const root: TreeNode = {
      id: data.root.id,
      name: data.root.name,
      amount: data.totalAmount,
      parentId: null,
      children: data.departments.map((dept) => ({
        id: dept.id,
        name: dept.name,
        amount: dept.amount,
        parentId: data.root.id,
        percentOfParent: dept.percentOfParent,
      })),
    };
    return root;
  }, [data]);

  const treemapCells = useMemo<TreemapCell[]>(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return [];

    const hierarchyData = hierarchy(treeData)
      .sum((d: TreeNode) => d.amount)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treemapLayout = d3Treemap<TreeNode>()
      .size([dimensions.width, dimensions.height])
      .paddingInner(2)
      .paddingOuter(4)
      .round(true);

    const root = treemapLayout(hierarchyData);

    const cells: TreemapCell[] = [];
    root.leaves().forEach((node: HierarchyRectangularNode<TreeNode>) => {
      const width = node.x1 - node.x0;
      const height = node.y1 - node.y0;
      const percentOfTotal = ((node.value || 0) / data.totalAmount) * 100;

      cells.push({
        id: node.data.id,
        name: node.data.name,
        amount: node.data.amount,
        x: node.x0,
        y: node.y0,
        width,
        height,
        color: getCategoryColor(node.data.name),
        percentOfParent: node.data.percentOfParent || null,
        percentOfTotal,
      });
    });

    return cells;
  }, [treeData, dimensions, data.totalAmount]);

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

  const handleCellHover = (cell: TreemapCell | null) => {
    setHoveredCell(cell);
    onItemHover?.(cell?.id || null);
  };

  const handleCellClick = (cellId: string) => {
    onItemClick?.(cellId);
  };

  const shouldShowLabel = (cell: TreemapCell): boolean => {
    return cell.percentOfTotal > 3 && cell.width > 80 && cell.height > 40;
  };

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div
        ref={containerRef}
        className="h-full w-full overflow-hidden rounded-lg bg-white dark:bg-gray-900"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => handleCellHover(null)}
      >
        <svg
          width={dimensions.width}
          height={dimensions.height}
          className="h-full w-full"
          role="img"
          aria-label="Budget treemap visualization"
        >
          <g>
            {treemapCells.map((cell) => {
              const isSelected = selectedItemId === cell.id;
              const isHovered = hoveredCell?.id === cell.id;
              const showLabel = shouldShowLabel(cell);

              return (
                <g key={cell.id}>
                  <motion.rect
                    x={cell.x}
                    y={cell.y}
                    width={cell.width}
                    height={cell.height}
                    fill={cell.color}
                    stroke={isSelected ? '#ffffff' : 'transparent'}
                    strokeWidth={isSelected ? 3 : 0}
                    opacity={isHovered ? 0.9 : 0.8}
                    className="cursor-pointer transition-opacity"
                    onMouseEnter={() => handleCellHover(cell)}
                    onClick={() => handleCellClick(cell.id)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: isHovered ? 0.9 : 0.8, scale: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${cell.name}: ${formatCurrency(cell.amount)}`}
                  />

                  {showLabel && (
                    <motion.text
                      x={cell.x + cell.width / 2}
                      y={cell.y + cell.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#ffffff"
                      className="pointer-events-none select-none text-sm font-semibold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <tspan
                        x={cell.x + cell.width / 2}
                        dy="-0.6em"
                        className="text-xs"
                      >
                        {cell.name.length > 20
                          ? `${cell.name.substring(0, 20)}...`
                          : cell.name}
                      </tspan>
                      <tspan
                        x={cell.x + cell.width / 2}
                        dy="1.2em"
                        className="font-bold"
                      >
                        {formatCurrency(cell.amount)}
                      </tspan>
                      <tspan
                        x={cell.x + cell.width / 2}
                        dy="1.2em"
                        className="text-xs opacity-90"
                      >
                        {cell.percentOfTotal.toFixed(1)}%
                      </tspan>
                    </motion.text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        <AnimatePresence>
          {hoveredCell && (
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
                {hoveredCell.name}
              </div>
              <div className="mb-1 text-lg font-bold">
                {formatCurrency(hoveredCell.amount)}
              </div>
              <div className="text-xs text-gray-300">
                {hoveredCell.percentOfTotal.toFixed(2)}% of total
              </div>
              {hoveredCell.percentOfParent !== null && (
                <div className="text-xs text-gray-400">
                  {hoveredCell.percentOfParent.toFixed(2)}% of parent
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
