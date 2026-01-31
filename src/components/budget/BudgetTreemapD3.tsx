"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import * as d3 from "d3";
import type { HierarchyRectangularNode } from "d3-hierarchy";
import { formatCurrency } from "@/lib/format";
import type { BudgetHierarchy, BudgetItem } from "@/types/budget";
import { getCategoryColor, getCategoryHoverColor } from "@/lib/treemap-colors";

/**
 * Internal tree node structure for D3 hierarchy
 */
interface TreeNode {
  id: string;
  name: string;
  amount: number;
  parentId: string | null;
  children?: TreeNode[];
  percentOfParent?: number | null;
  categoryId?: string;
}

interface BudgetTreemapD3Props {
  data: BudgetHierarchy;
  onItemClick?: (itemId: string, item: BudgetItem) => void;
  onItemHover?: (itemId: string | null) => void;
  className?: string;
}

/**
 * D3-based interactive treemap with zoom/drill-down functionality
 *
 * Features:
 * - Hierarchical visualization with nested rectangles
 * - Click to zoom/drill-down into categories
 * - Animated transitions between views
 * - Responsive sizing with ResizeObserver
 * - Tooltips with formatted amounts
 * - Color-coded categories
 */
export function BudgetTreemapD3({
  data,
  onItemClick,
  onItemHover,
  className = "",
}: BudgetTreemapD3Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const currentViewRef = useRef<HierarchyRectangularNode<TreeNode> | null>(
    null,
  );

  /**
   * Convert BudgetHierarchy to D3-compatible tree structure
   */
  const buildTreeData = useCallback((hierarchy: BudgetHierarchy): TreeNode => {
    const convertItem = (
      item: BudgetItem,
      parentId: string | null,
    ): TreeNode => {
      const node: TreeNode = {
        id: item.id,
        name: item.name,
        amount: item.amount,
        parentId,
        percentOfParent: item.percentOfParent,
        categoryId: item.id,
      };
      if (item.children && item.children.length > 0) {
        node.children = item.children.map((child) =>
          convertItem(child, item.id),
        );
      }
      return node;
    };

    // Build from departments if available
    if (hierarchy.departments && hierarchy.departments.length > 0) {
      const rootNode: TreeNode = {
        id: hierarchy.root?.id || "root",
        name: hierarchy.root?.name || "Federal Budget",
        amount: hierarchy.totalAmount,
        parentId: null,
        categoryId: "root",
        children: hierarchy.departments.map((dept) => {
          const deptNode: TreeNode = {
            id: dept.id,
            name: dept.name,
            amount: dept.amount,
            parentId: hierarchy.root?.id || "root",
            percentOfParent: dept.percentOfParent,
            categoryId: dept.id,
          };
          if (dept.agencies && dept.agencies.length > 0) {
            deptNode.children = dept.agencies.map((agency) => {
              const agencyNode: TreeNode = {
                id: agency.id,
                name: agency.name,
                amount: agency.amount,
                parentId: dept.id,
                percentOfParent: agency.percentOfParent,
                categoryId: dept.id,
              };
              if (agency.programs && agency.programs.length > 0) {
                agencyNode.children = agency.programs.map((prog) => ({
                  id: prog.id,
                  name: prog.name,
                  amount: prog.amount,
                  parentId: agency.id,
                  percentOfParent: prog.percentOfParent,
                  categoryId: dept.id,
                }));
              }
              return agencyNode;
            });
          }
          return deptNode;
        }),
      };
      return rootNode;
    }

    // Build from items if available
    if (hierarchy.items && hierarchy.items.length > 0) {
      return {
        id: hierarchy.root?.id || "root",
        name: hierarchy.root?.name || "Federal Budget",
        amount: hierarchy.totalAmount,
        parentId: null,
        categoryId: "root",
        children: hierarchy.items.map((item) =>
          convertItem(item, hierarchy.root?.id || "root"),
        ),
      };
    }

    // Fallback to root only
    return {
      id: hierarchy.root?.id || "root",
      name: hierarchy.root?.name || "Federal Budget",
      amount: hierarchy.totalAmount,
      parentId: null,
      categoryId: "root",
    };
  }, []);

  /**
   * Get color for a node based on its root category
   */
  const getNodeColor = useCallback(
    (node: HierarchyRectangularNode<TreeNode>): string => {
      // Find the top-level category (first child of root)
      let current: HierarchyRectangularNode<TreeNode> | null = node;
      while (current?.parent?.parent) {
        current = current.parent;
      }
      const categoryName = current?.data.name || node.data.name;
      return getCategoryColor(categoryName);
    },
    [],
  );

  /**
   * Get hover color for a node
   */
  const getNodeHoverColor = useCallback(
    (node: HierarchyRectangularNode<TreeNode>): string => {
      let current: HierarchyRectangularNode<TreeNode> | null = node;
      while (current?.parent?.parent) {
        current = current.parent;
      }
      const categoryName = current?.data.name || node.data.name;
      return getCategoryHoverColor(categoryName);
    },
    [],
  );

  /**
   * Show tooltip at mouse position
   */
  const showTooltip = useCallback(
    (event: MouseEvent, node: HierarchyRectangularNode<TreeNode>) => {
      if (!tooltipRef.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const tooltip = tooltipRef.current;
      const percentOfTotal = ((node.value || 0) / data.totalAmount) * 100;

      tooltip.innerHTML = `
      <div class="font-semibold text-sm mb-1">${node.data.name}</div>
      <div class="text-lg font-bold mb-1">${formatCurrency(node.data.amount, { compact: true })}</div>
      <div class="text-xs text-gray-300">${percentOfTotal.toFixed(2)}% of total</div>
      ${
        node.data.percentOfParent !== null &&
        node.data.percentOfParent !== undefined
          ? `<div class="text-xs text-gray-400">${node.data.percentOfParent.toFixed(2)}% of parent</div>`
          : ""
      }
      ${node.children ? `<div class="text-xs text-blue-300 mt-1">Click to zoom in</div>` : ""}
    `;

      tooltip.style.opacity = "1";
      tooltip.style.visibility = "visible";

      // Position tooltip
      let left = event.clientX - containerRect.left + 16;
      let top = event.clientY - containerRect.top + 16;

      // Adjust if tooltip would overflow right edge
      if (left + tooltip.offsetWidth > containerRect.width - 10) {
        left = event.clientX - containerRect.left - tooltip.offsetWidth - 16;
      }

      // Adjust if tooltip would overflow bottom edge
      if (top + tooltip.offsetHeight > containerRect.height - 10) {
        top = event.clientY - containerRect.top - tooltip.offsetHeight - 16;
      }

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    },
    [data.totalAmount],
  );

  /**
   * Hide tooltip
   */
  const hideTooltip = useCallback(() => {
    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = "0";
      tooltipRef.current.style.visibility = "hidden";
    }
  }, []);

  /**
   * Render the treemap
   */
  const renderTreemap = useCallback(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0)
      return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

    // Clear previous content
    svg.selectAll("*").remove();

    // Build hierarchy
    const treeData = buildTreeData(data);
    const root = d3
      .hierarchy(treeData)
      .sum((d) => (d.children ? 0 : d.amount))
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Create treemap layout
    const treemapLayout = d3
      .treemap<TreeNode>()
      .size([width, height])
      .paddingOuter(4)
      .paddingTop(28)
      .paddingInner(2)
      .round(true);

    treemapLayout(root);

    // Store current view
    currentViewRef.current = root as HierarchyRectangularNode<TreeNode>;

    // Create main group
    const g = svg.append("g");

    /**
     * Render a view of the treemap (for zoom transitions)
     */
    const render = (currentRoot: HierarchyRectangularNode<TreeNode>) => {
      // Calculate scale and translation for zoom
      const x = d3
        .scaleLinear()
        .domain([currentRoot.x0, currentRoot.x1])
        .range([0, width]);
      const y = d3
        .scaleLinear()
        .domain([currentRoot.y0, currentRoot.y1])
        .range([0, height]);

      g.selectAll("*").remove();

      // Get nodes to display (children of current root, or leaves if no children)
      const nodesToRender = currentRoot.children || [currentRoot];

      // Create groups for each cell
      const cell = g
        .selectAll<SVGGElement, HierarchyRectangularNode<TreeNode>>("g")
        .data(nodesToRender)
        .join("g")
        .attr("transform", (d) => `translate(${x(d.x0)},${y(d.y0)})`);

      // Add rectangles
      cell
        .append("rect")
        .attr("width", (d) => Math.max(0, x(d.x1) - x(d.x0)))
        .attr("height", (d) => Math.max(0, y(d.y1) - y(d.y0)))
        .attr("fill", (d) => getNodeColor(d))
        .attr("fill-opacity", 0.85)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .attr("rx", 4)
        .attr("cursor", (d) => (d.children ? "pointer" : "default"))
        .style("transition", "fill-opacity 0.2s ease")
        .on("mouseover", function (event, d) {
          d3.select(this)
            .attr("fill", getNodeHoverColor(d))
            .attr("fill-opacity", 1);
          showTooltip(event, d);
          onItemHover?.(d.data.id);
        })
        .on("mousemove", function (event, d) {
          showTooltip(event, d);
        })
        .on("mouseout", function (event, d) {
          d3.select(this)
            .attr("fill", getNodeColor(d))
            .attr("fill-opacity", 0.85);
          hideTooltip();
          onItemHover?.(null);
        })
        .on("click", function (event, d) {
          event.stopPropagation();

          // Find the original item for callback
          const originalItem: BudgetItem = {
            id: d.data.id,
            name: d.data.name,
            amount: d.data.amount,
            parentId: d.data.parentId,
            fiscalYear: data.fiscalYear || new Date().getFullYear(),
            percentOfParent: d.data.percentOfParent || null,
            yearOverYearChange: null,
          };

          onItemClick?.(d.data.id, originalItem);

          // Zoom into node if it has children
          if (d.children) {
            currentViewRef.current = d;
            zoomTo(d);
          }
        });

      // Add header bar for nodes with children
      cell
        .filter((d) => !!d.children)
        .append("rect")
        .attr("y", 0)
        .attr("width", (d) => Math.max(0, x(d.x1) - x(d.x0)))
        .attr("height", 24)
        .attr(
          "fill",
          (d) =>
            d3.color(getNodeColor(d))?.darker(0.3)?.toString() ||
            getNodeColor(d),
        )
        .attr("rx", 4);

      // Add labels
      const minWidthForLabel = 60;
      const minHeightForLabel = 40;

      cell
        .filter((d) => {
          const cellWidth = x(d.x1) - x(d.x0);
          const cellHeight = y(d.y1) - y(d.y0);
          return cellWidth > minWidthForLabel && cellHeight > minHeightForLabel;
        })
        .append("text")
        .attr("x", 6)
        .attr("y", 16)
        .attr("fill", "#fff")
        .attr("font-size", "12px")
        .attr("font-weight", "600")
        .text((d) => {
          const cellWidth = x(d.x1) - x(d.x0);
          const maxChars = Math.floor((cellWidth - 12) / 7);
          const name = d.data.name;
          return name.length > maxChars
            ? `${name.slice(0, maxChars - 2)}...`
            : name;
        });

      // Add amount labels for larger cells
      cell
        .filter((d) => {
          const cellWidth = x(d.x1) - x(d.x0);
          const cellHeight = y(d.y1) - y(d.y0);
          return cellWidth > 80 && cellHeight > 60;
        })
        .append("text")
        .attr("x", (d) => (x(d.x1) - x(d.x0)) / 2)
        .attr("y", (d) => (y(d.y1) - y(d.y0)) / 2 + 8)
        .attr("fill", "#fff")
        .attr("font-size", "14px")
        .attr("font-weight", "700")
        .attr("text-anchor", "middle")
        .attr("opacity", 0.95)
        .text((d) => formatCurrency(d.data.amount, { compact: true }));

      // Add percentage labels for larger cells
      cell
        .filter((d) => {
          const cellWidth = x(d.x1) - x(d.x0);
          const cellHeight = y(d.y1) - y(d.y0);
          return cellWidth > 80 && cellHeight > 80;
        })
        .append("text")
        .attr("x", (d) => (x(d.x1) - x(d.x0)) / 2)
        .attr("y", (d) => (y(d.y1) - y(d.y0)) / 2 + 26)
        .attr("fill", "#fff")
        .attr("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("opacity", 0.8)
        .text((d) => {
          const percentOfTotal = ((d.value || 0) / data.totalAmount) * 100;
          return `${percentOfTotal.toFixed(1)}%`;
        });
    };

    /**
     * Animate zoom transition to a new node
     */
    const zoomTo = (target: HierarchyRectangularNode<TreeNode>) => {
      const x = d3
        .scaleLinear()
        .domain([target.x0, target.x1])
        .range([0, width]);
      const y = d3
        .scaleLinear()
        .domain([target.y0, target.y1])
        .range([0, height]);

      // Animate existing elements
      g.selectAll("g")
        .transition()
        .duration(750)
        .ease(d3.easeCubicInOut)
        .attr("transform", (d: unknown) => {
          const node = d as HierarchyRectangularNode<TreeNode>;
          return `translate(${x(node.x0)},${y(node.y0)})`;
        })
        .selectAll("rect")
        .attr("width", (d: unknown) => {
          const node = d as HierarchyRectangularNode<TreeNode>;
          return Math.max(0, x(node.x1) - x(node.x0));
        })
        .attr("height", (d: unknown) => {
          const node = d as HierarchyRectangularNode<TreeNode>;
          return Math.max(0, y(node.y1) - y(node.y0));
        });

      // After transition, re-render with new root
      setTimeout(() => {
        render(target);
      }, 800);
    };

    // Add breadcrumb/back button when zoomed in
    const addBreadcrumb = () => {
      const breadcrumb = svg
        .append("g")
        .attr("class", "breadcrumb")
        .attr("cursor", "pointer")
        .on("click", () => {
          if (currentViewRef.current?.parent) {
            currentViewRef.current = currentViewRef.current.parent;
            render(currentViewRef.current);
            updateBreadcrumb();
          }
        });

      const updateBreadcrumb = () => {
        breadcrumb.selectAll("*").remove();

        if (currentViewRef.current && currentViewRef.current.parent) {
          breadcrumb
            .append("rect")
            .attr("x", 8)
            .attr("y", 8)
            .attr("width", 100)
            .attr("height", 28)
            .attr("fill", "rgba(0,0,0,0.6)")
            .attr("rx", 4);

          breadcrumb
            .append("text")
            .attr("x", 20)
            .attr("y", 26)
            .attr("fill", "#fff")
            .attr("font-size", "12px")
            .attr("font-weight", "500")
            .text("< Back");
        }
      };

      return updateBreadcrumb;
    };

    const updateBreadcrumb = addBreadcrumb();

    // Initial render
    render(root as HierarchyRectangularNode<TreeNode>);

    // Handle clicks on background to zoom out
    svg.on("click", () => {
      if (currentViewRef.current?.parent) {
        currentViewRef.current = currentViewRef.current.parent;
        render(currentViewRef.current);
        updateBreadcrumb();
      }
    });
  }, [
    data,
    dimensions,
    buildTreeData,
    getNodeColor,
    getNodeHoverColor,
    showTooltip,
    hideTooltip,
    onItemClick,
    onItemHover,
  ]);

  /**
   * Set up ResizeObserver for responsive sizing
   */
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  /**
   * Re-render treemap when data or dimensions change
   */
  useEffect(() => {
    renderTreemap();
  }, [renderTreemap]);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden rounded-lg bg-white dark:bg-gray-900 ${className}`}
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="h-full w-full"
        role="img"
        aria-label="Interactive budget treemap visualization"
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-50 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white shadow-lg transition-opacity duration-150 dark:bg-gray-800"
        style={{
          opacity: 0,
          visibility: "hidden",
          maxWidth: "280px",
        }}
      />
    </div>
  );
}
