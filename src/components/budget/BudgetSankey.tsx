"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "@/lib/framer-client";
import {
  sankey,
  sankeyLinkHorizontal,
  SankeyNode,
  SankeyLink,
} from "d3-sankey";
import { formatCurrency } from "@/lib/format";
import type { BudgetHierarchy, BudgetItem } from "@/types/budget";

/**
 * Department color scheme for Sankey visualization
 */
const DEPARTMENT_COLORS: Record<string, string> = {
  defense: "#ef4444",
  military: "#ef4444",
  "health and human services": "#3b82f6",
  healthcare: "#3b82f6",
  hhs: "#3b82f6",
  "social security": "#8b5cf6",
  "social security administration": "#8b5cf6",
  treasury: "#10b981",
  "department of the treasury": "#10b981",
  agriculture: "#84cc16",
  education: "#f59e0b",
  "veterans affairs": "#ec4899",
  veterans: "#ec4899",
  transportation: "#06b6d4",
  "homeland security": "#f97316",
  dhs: "#f97316",
  energy: "#eab308",
  "housing and urban development": "#6366f1",
  housing: "#6366f1",
  justice: "#78716c",
  "department of justice": "#78716c",
  state: "#14b8a6",
  "department of state": "#14b8a6",
  interior: "#22c55e",
  commerce: "#a855f7",
  labor: "#0ea5e9",
  nasa: "#1e40af",
  epa: "#16a34a",
  other: "#64748b",
  default: "#94a3b8",
};

/**
 * Get color for a department with fallback
 */
function getDepartmentColor(name: string): string {
  const normalizedName = name.toLowerCase();

  if (DEPARTMENT_COLORS[normalizedName]) {
    return DEPARTMENT_COLORS[normalizedName];
  }

  for (const [key, color] of Object.entries(DEPARTMENT_COLORS)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return color;
    }
  }

  return DEPARTMENT_COLORS.default || "#94a3b8";
}

/**
 * Node data for the Sankey diagram
 */
interface SankeyNodeData {
  id: string;
  name: string;
  amount: number;
  level: "budget" | "department" | "program";
  color: string;
  parentId?: string;
}

/**
 * Link data for the Sankey diagram
 */
interface SankeyLinkData {
  source: string;
  target: string;
  value: number;
}

/**
 * Extended Sankey node with computed layout
 */
type ComputedSankeyNode = SankeyNode<SankeyNodeData, SankeyLinkData> &
  SankeyNodeData;

/**
 * Extended Sankey link with computed layout
 */
type ComputedSankeyLink = SankeyLink<SankeyNodeData, SankeyLinkData> & {
  source: ComputedSankeyNode;
  target: ComputedSankeyNode;
};

interface BudgetSankeyProps {
  /**
   * Hierarchical budget data with departments and programs
   */
  data: BudgetHierarchy;
  /**
   * Callback when a node is clicked
   */
  onNodeClick?: (
    nodeId: string,
    level: "budget" | "department" | "program",
  ) => void;
  /**
   * Callback when a node is hovered
   */
  onNodeHover?: (nodeId: string | null) => void;
  /**
   * Currently selected node ID
   */
  selectedNodeId?: string | null;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Minimum height for the component
   */
  minHeight?: number;
}

/**
 * BudgetSankey - Interactive Sankey diagram showing budget flow
 *
 * Displays the flow of budget allocation from the total budget
 * to departments and then to individual programs. Features
 * interactive hover highlighting and formatted tooltips.
 *
 * @example
 * ```tsx
 * <BudgetSankey
 *   data={budgetHierarchy}
 *   onNodeClick={(id, level) => console.log('Clicked:', id, level)}
 * />
 * ```
 */
export function BudgetSankey({
  data,
  onNodeClick,
  onNodeHover,
  selectedNodeId,
  className = "",
  minHeight = 500,
}: BudgetSankeyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNode, setHoveredNode] = useState<ComputedSankeyNode | null>(
    null,
  );
  const [hoveredLink, setHoveredLink] = useState<ComputedSankeyLink | null>(
    null,
  );
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Build nodes and links from hierarchy data
  const { nodes, links } = useMemo(() => {
    const nodeList: SankeyNodeData[] = [];
    const linkList: SankeyLinkData[] = [];
    const nodeIdSet = new Set<string>();

    // Root budget node
    const rootId = data.root?.id || "total-budget";
    const rootName = data.root?.name || "Federal Budget";
    nodeList.push({
      id: rootId,
      name: rootName,
      amount: data.totalAmount,
      level: "budget",
      color: "#1e293b",
    });
    nodeIdSet.add(rootId);

    // Process departments
    const departments = data.departments || data.items || [];
    departments.forEach((dept) => {
      if (!nodeIdSet.has(dept.id)) {
        nodeList.push({
          id: dept.id,
          name: dept.name,
          amount: dept.amount,
          level: "department",
          color: getDepartmentColor(dept.name),
          parentId: rootId,
        });
        nodeIdSet.add(dept.id);

        // Link from root to department
        linkList.push({
          source: rootId,
          target: dept.id,
          value: dept.amount,
        });

        // Process programs within department
        const programs =
          dept.children ||
          (dept as unknown as { programs?: BudgetItem[] }).programs ||
          [];
        programs.forEach((program) => {
          if (!nodeIdSet.has(program.id)) {
            nodeList.push({
              id: program.id,
              name: program.name,
              amount: program.amount,
              level: "program",
              color: getDepartmentColor(dept.name),
              parentId: dept.id,
            });
            nodeIdSet.add(program.id);

            // Link from department to program
            linkList.push({
              source: dept.id,
              target: program.id,
              value: program.amount,
            });
          }
        });
      }
    });

    return { nodes: nodeList, links: linkList };
  }, [data]);

  // Calculate Sankey layout
  const sankeyLayout = useMemo(() => {
    if (
      dimensions.width === 0 ||
      dimensions.height === 0 ||
      nodes.length === 0
    ) {
      return null;
    }

    const nodeWidth = 20;
    const nodePadding = 12;
    const margin = { top: 20, right: 120, bottom: 20, left: 120 };

    const sankeyGenerator = sankey<SankeyNodeData, SankeyLinkData>()
      .nodeId((d) => d.id)
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .extent([
        [margin.left, margin.top],
        [dimensions.width - margin.right, dimensions.height - margin.bottom],
      ]);

    // Create a copy of nodes and links for the sankey generator
    const nodesCopy = nodes.map((n) => ({ ...n }));
    const linksCopy = links.map((l) => ({ ...l }));

    try {
      const layout = sankeyGenerator({
        nodes: nodesCopy,
        links: linksCopy,
      });
      return layout;
    } catch {
      console.warn("Sankey layout failed - check for circular references");
      return null;
    }
  }, [nodes, links, dimensions]);

  // Resize observer
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const { width } = containerRef.current.getBoundingClientRect();
      // Calculate height based on number of nodes, with minimum
      const calculatedHeight = Math.max(minHeight, nodes.length * 25);
      setDimensions({ width, height: calculatedHeight });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [minHeight, nodes.length]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleNodeHover = useCallback(
    (node: ComputedSankeyNode | null) => {
      setHoveredNode(node);
      setHoveredLink(null);
      onNodeHover?.(node?.id || null);
    },
    [onNodeHover],
  );

  const handleLinkHover = useCallback((link: ComputedSankeyLink | null) => {
    setHoveredLink(link);
    setHoveredNode(null);
  }, []);

  const handleNodeClick = useCallback(
    (node: ComputedSankeyNode) => {
      onNodeClick?.(node.id, node.level);
    },
    [onNodeClick],
  );

  // Check if a node or its links are highlighted
  const isNodeHighlighted = useCallback(
    (node: ComputedSankeyNode): boolean => {
      if (!hoveredNode && !hoveredLink) return true;
      if (hoveredNode?.id === node.id) return true;
      if (hoveredLink) {
        return (
          hoveredLink.source.id === node.id || hoveredLink.target.id === node.id
        );
      }
      // Check if connected to hovered node
      if (hoveredNode && sankeyLayout) {
        const isConnected = sankeyLayout.links.some(
          (link) =>
            ((link.source as ComputedSankeyNode).id === hoveredNode.id &&
              (link.target as ComputedSankeyNode).id === node.id) ||
            ((link.target as ComputedSankeyNode).id === hoveredNode.id &&
              (link.source as ComputedSankeyNode).id === node.id),
        );
        return isConnected;
      }
      return false;
    },
    [hoveredNode, hoveredLink, sankeyLayout],
  );

  const isLinkHighlighted = useCallback(
    (link: ComputedSankeyLink): boolean => {
      if (!hoveredNode && !hoveredLink) return true;
      if (hoveredLink === link) return true;
      if (hoveredNode) {
        return (
          link.source.id === hoveredNode.id || link.target.id === hoveredNode.id
        );
      }
      return false;
    },
    [hoveredNode, hoveredLink],
  );

  // Generate link path
  const linkPath = useMemo(() => sankeyLinkHorizontal(), []);

  if (!sankeyLayout) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ minHeight }}
      >
        <p className="text-muted-foreground">Loading Sankey diagram...</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-lg bg-white dark:bg-gray-900"
        style={{ height: dimensions.height }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          handleNodeHover(null);
          handleLinkHover(null);
        }}
      >
        <svg
          width={dimensions.width}
          height={dimensions.height}
          className="w-full"
          role="img"
          aria-label="Budget Sankey diagram showing flow from total budget to departments to programs"
        >
          {/* Links */}
          <g className="links">
            {(sankeyLayout.links as ComputedSankeyLink[]).map((link, index) => {
              const highlighted = isLinkHighlighted(link);
              const path = linkPath(
                link as SankeyLink<SankeyNodeData, SankeyLinkData>,
              );
              if (!path) return null;

              return (
                <motion.path
                  key={`link-${index}`}
                  d={path}
                  fill="none"
                  stroke={link.source.color}
                  strokeWidth={Math.max(1, link.width || 1)}
                  strokeOpacity={highlighted ? 0.5 : 0.15}
                  className="cursor-pointer transition-opacity duration-200"
                  onMouseEnter={() => handleLinkHover(link)}
                  onMouseLeave={() => handleLinkHover(null)}
                  initial={{ strokeOpacity: 0 }}
                  animate={{ strokeOpacity: highlighted ? 0.5 : 0.15 }}
                  transition={{ duration: 0.2 }}
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {(sankeyLayout.nodes as ComputedSankeyNode[]).map((node) => {
              const highlighted = isNodeHighlighted(node);
              const isSelected = selectedNodeId === node.id;
              const nodeHeight = (node.y1 || 0) - (node.y0 || 0);
              const nodeWidth = (node.x1 || 0) - (node.x0 || 0);

              return (
                <g key={node.id}>
                  <motion.rect
                    x={node.x0}
                    y={node.y0}
                    width={nodeWidth}
                    height={nodeHeight}
                    fill={node.color}
                    stroke={isSelected ? "#ffffff" : "transparent"}
                    strokeWidth={isSelected ? 2 : 0}
                    opacity={highlighted ? 1 : 0.4}
                    className="cursor-pointer transition-opacity duration-200"
                    onMouseEnter={() => handleNodeHover(node)}
                    onMouseLeave={() => handleNodeHover(null)}
                    onClick={() => handleNodeClick(node)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${node.name}: ${formatCurrency(node.amount, { compact: true })}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: highlighted ? 1 : 0.4 }}
                    transition={{ duration: 0.2 }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleNodeClick(node);
                      }
                    }}
                  />

                  {/* Node labels */}
                  {nodeHeight > 20 && (
                    <text
                      x={
                        node.level === "program"
                          ? (node.x1 || 0) + 6
                          : (node.x0 || 0) - 6
                      }
                      y={((node.y0 || 0) + (node.y1 || 0)) / 2}
                      dy="0.35em"
                      textAnchor={node.level === "program" ? "start" : "end"}
                      className={`pointer-events-none select-none text-xs font-medium transition-opacity duration-200 ${
                        highlighted ? "opacity-100" : "opacity-40"
                      }`}
                      fill="currentColor"
                    >
                      {node.name.length > 25
                        ? `${node.name.substring(0, 25)}...`
                        : node.name}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {(hoveredNode || hoveredLink) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute z-50 max-w-xs rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800"
              style={{
                left: Math.min(mousePosition.x + 16, dimensions.width - 200),
                top: mousePosition.y + 16,
              }}
            >
              {hoveredNode && (
                <>
                  <div className="mb-1 flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: hoveredNode.color }}
                    />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {hoveredNode.name}
                    </span>
                  </div>
                  <div className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(hoveredNode.amount, { compact: true })}
                  </div>
                  <div className="text-xs capitalize text-gray-500 dark:text-gray-400">
                    {hoveredNode.level}
                  </div>
                  {hoveredNode.level !== "budget" && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {((hoveredNode.amount / data.totalAmount) * 100).toFixed(
                        2,
                      )}
                      % of total budget
                    </div>
                  )}
                </>
              )}
              {hoveredLink && (
                <>
                  <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {hoveredLink.source.name} → {hoveredLink.target.name}
                  </div>
                  <div className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(hoveredLink.value, { compact: true })}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {((hoveredLink.value / data.totalAmount) * 100).toFixed(2)}%
                    of total budget
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default BudgetSankey;
