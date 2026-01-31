"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "@/lib/framer-client";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import {
  Car,
  Home,
  Building2,
  Plane,
  Train,
  Ambulance,
  GraduationCap,
  Heart,
  TreePine,
  Utensils,
  Film,
  Package,
  DollarSign,
  Briefcase,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import type { ComparisonUnit } from "@/types/comparison";

// Category to icon mapping
const CATEGORY_ICONS: Record<ComparisonUnit["category"], LucideIcon> = {
  infrastructure: Building2,
  everyday: Package,
  vehicles: Car,
  buildings: Home,
  misc: Package,
  food: Utensils,
  entertainment: Film,
  products: Package,
  transportation: Train,
  salary: Briefcase,
  healthcare: Heart,
  education: GraduationCap,
  general: DollarSign,
  housing: Home,
  environment: TreePine,
  "public-services": Landmark,
  income: DollarSign,
  veterans: Ambulance,
};

// Category to color mapping for visual distinction
const CATEGORY_COLORS: Record<ComparisonUnit["category"], string> = {
  infrastructure: "text-amber-500",
  everyday: "text-slate-500",
  vehicles: "text-blue-500",
  buildings: "text-orange-500",
  misc: "text-gray-500",
  food: "text-green-500",
  entertainment: "text-pink-500",
  products: "text-indigo-500",
  transportation: "text-cyan-500",
  salary: "text-emerald-500",
  healthcare: "text-red-500",
  education: "text-purple-500",
  general: "text-yellow-500",
  housing: "text-teal-500",
  environment: "text-lime-500",
  "public-services": "text-sky-500",
  income: "text-green-600",
  veterans: "text-rose-500",
};

// Maximum icons to display before scaling
const MAX_ICONS = 100;

// Target icon size in pixels
const ICON_SIZE = 24;

interface ImpactVisualizationProps {
  /** Number of comparison units to visualize */
  count: number;

  /** The comparison unit for icon selection */
  unit: ComparisonUnit;

  /** Optional custom icon to override category default */
  customIcon?: LucideIcon;

  /** Additional CSS classes */
  className?: string;

  /** Whether to animate icons appearing */
  animate?: boolean;

  /** Layout direction */
  layout?: "grid" | "flow";

  /** Maximum columns for grid layout */
  maxColumns?: number;
}

/**
 * ImpactVisualization
 *
 * Visualizes comparison counts as a grid of icons. Scales automatically
 * for large numbers, showing a representative subset with a "1 icon = X units" legend.
 */
export function ImpactVisualization({
  count,
  unit,
  customIcon,
  className,
  animate = true,
  layout = "grid",
  maxColumns = 10,
}: ImpactVisualizationProps) {
  // Calculate how many icons to show and the scale factor
  const { displayCount, scaleFactor, iconColor, IconComponent } =
    useMemo(() => {
      const Icon = customIcon || CATEGORY_ICONS[unit.category] || Package;
      const color = CATEGORY_COLORS[unit.category] || "text-gray-500";

      // Scale down for large numbers
      let display = Math.floor(count);
      let scale = 1;

      if (display > MAX_ICONS) {
        // Find a nice scale factor (powers of 10, 5, or 2)
        const rawScale = display / MAX_ICONS;

        if (rawScale >= 1000000) {
          scale = Math.ceil(rawScale / 1000000) * 1000000;
        } else if (rawScale >= 100000) {
          scale = Math.ceil(rawScale / 100000) * 100000;
        } else if (rawScale >= 10000) {
          scale = Math.ceil(rawScale / 10000) * 10000;
        } else if (rawScale >= 1000) {
          scale = Math.ceil(rawScale / 1000) * 1000;
        } else if (rawScale >= 100) {
          scale = Math.ceil(rawScale / 100) * 100;
        } else if (rawScale >= 10) {
          scale = Math.ceil(rawScale / 10) * 10;
        } else {
          scale = Math.ceil(rawScale);
        }

        display = Math.min(Math.ceil(count / scale), MAX_ICONS);
      }

      return {
        displayCount: display,
        scaleFactor: scale,
        iconColor: color,
        IconComponent: Icon,
      };
    }, [count, unit.category, customIcon]);

  // Generate icon array with staggered animation delays
  const icons = useMemo(() => {
    return Array.from({ length: displayCount }, (_, i) => ({
      id: i,
      delay: animate ? Math.min(i * 0.02, 2) : 0, // Cap at 2 seconds
    }));
  }, [displayCount, animate]);

  // Don't render if count is 0 or negative
  if (count <= 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Icon Grid */}
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4",
          "border border-gray-200 dark:border-gray-700",
        )}
      >
        <div
          className={cn(
            layout === "grid"
              ? "grid gap-2"
              : "flex flex-wrap gap-2 justify-center",
          )}
          style={
            layout === "grid"
              ? {
                  gridTemplateColumns: `repeat(${Math.min(displayCount, maxColumns)}, ${ICON_SIZE}px)`,
                }
              : undefined
          }
        >
          <AnimatePresence mode="popLayout">
            {icons.map(({ id, delay }) => (
              <motion.div
                key={id}
                initial={animate ? { opacity: 0, scale: 0 } : false}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  delay,
                }}
                className={cn(
                  "flex items-center justify-center",
                  "w-6 h-6 rounded-md",
                  "bg-white/50 dark:bg-gray-800/50",
                  "shadow-sm",
                )}
              >
                <IconComponent
                  className={cn("w-4 h-4", iconColor)}
                  strokeWidth={2}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Gradient fade for large grids */}
        {displayCount > 50 && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-100 dark:from-gray-800 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div
            className={cn(
              "flex items-center justify-center w-5 h-5 rounded",
              "bg-gray-100 dark:bg-gray-800",
            )}
          >
            <IconComponent
              className={cn("w-3 h-3", iconColor)}
              strokeWidth={2}
            />
          </div>
          <span>
            1 icon = {scaleFactor > 1 ? formatNumber(scaleFactor) : "1"}{" "}
            {scaleFactor === 1
              ? unit.nameSingular || unit.name.replace(/s$/, "")
              : unit.name}
          </span>
        </div>

        <div className="font-medium text-foreground">
          Total: {formatNumber(count)}{" "}
          {count === 1 ? unit.nameSingular : unit.name}
        </div>
      </div>

      {/* Visual scale indicator for large numbers */}
      {scaleFactor > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="text-xs text-center text-muted-foreground italic"
        >
          Showing {formatNumber(displayCount)} icons representing{" "}
          {formatNumber(count)} total
        </motion.div>
      )}
    </div>
  );
}

/**
 * Compact version of ImpactVisualization for inline use
 */
interface ImpactVisualizationCompactProps {
  count: number;
  unit: ComparisonUnit;
  maxIcons?: number;
  className?: string;
}

export function ImpactVisualizationCompact({
  count,
  unit,
  maxIcons = 5,
  className,
}: ImpactVisualizationCompactProps) {
  const IconComponent = CATEGORY_ICONS[unit.category] || Package;
  const iconColor = CATEGORY_COLORS[unit.category] || "text-gray-500";

  const displayCount = Math.min(Math.floor(count), maxIcons);
  const hasMore = count > maxIcons;

  if (count <= 0) return null;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: displayCount }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            delay: i * 0.05,
          }}
        >
          <IconComponent className={cn("w-4 h-4", iconColor)} strokeWidth={2} />
        </motion.div>
      ))}
      {hasMore && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: displayCount * 0.05 + 0.1 }}
          className="text-xs text-muted-foreground font-medium ml-1"
        >
          +{formatNumber(Math.floor(count) - displayCount)}
        </motion.span>
      )}
    </div>
  );
}
