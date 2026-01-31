"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

export interface CategoryCardProps {
  /** Unique identifier for the category */
  id: string;
  /** Display name of the category */
  name: string;
  /** Description text (shown on larger cards) */
  description: string;
  /** Lucide icon name (e.g., "DollarSign", "Building2") */
  icon: string;
  /** Whether this card is currently selected */
  selected: boolean;
  /** Callback when card is clicked */
  onClick: () => void;
  /** Card size variant */
  size?: "default" | "large";
  /** Whether the card is disabled (max selections reached) */
  disabled?: boolean;
}

/**
 * CategoryCard - Selectable card component for wizard category selection
 *
 * Features:
 * - Dark theme styling with slate-800/900 backgrounds
 * - Visual feedback on selection with border highlight and checkmark
 * - Hover states for interactivity
 * - Large tap targets (min 44px height)
 * - Smooth transition animations
 * - Mobile-friendly responsive design
 * - Two size variants: default (compact) and large (with description)
 */
export function CategoryCard({
  name,
  description,
  icon,
  selected,
  onClick,
  size = "default",
  disabled = false,
}: CategoryCardProps) {
  // Dynamically get the icon component from lucide-react
  type IconProps = { className?: string; strokeWidth?: number };
  const IconsRecord = Icons as unknown as Record<
    string,
    React.ComponentType<IconProps>
  >;
  const IconComponent = IconsRecord[icon] || Icons.HelpCircle;

  const isLarge = size === "large";

  // Keyboard handler for Enter and Space
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled) {
        onClick();
      }
    }
  };

  return (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      role="checkbox"
      aria-checked={selected}
      aria-label={`${name}. ${description}${selected ? ". Selected" : ""}${disabled ? ". Disabled" : ""}`}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={cn(
        // Base styles
        "relative flex flex-col items-center justify-center",
        "rounded-xl border-2 transition-all duration-200",
        "min-h-[44px] cursor-pointer group",

        // Size variants - more compact on mobile
        isLarge ? "p-4 sm:p-6 gap-2 sm:gap-3" : "p-3 sm:p-4 gap-1.5 sm:gap-2",
        isLarge
          ? "min-h-[160px] sm:min-h-[180px]"
          : "min-h-[100px] sm:min-h-[120px]",

        // Default state
        "bg-slate-900 border-slate-700",
        "hover:bg-slate-800 hover:border-slate-600",

        // Selected state
        selected && [
          "bg-slate-800 border-blue-500",
          "shadow-lg shadow-blue-500/20",
        ],

        // Focus visible for keyboard navigation
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "focus-visible:ring-offset-slate-950",

        // Disabled state
        disabled && [
          "opacity-50 cursor-not-allowed",
          "hover:bg-slate-900 hover:border-slate-700",
        ],

        // Active state (press feedback)
        !disabled && "active:scale-[0.98]",
      )}
    >
      {/* Checkmark indicator (top-right corner) */}
      {selected && (
        <div
          className={cn(
            "absolute top-2 right-2",
            "flex items-center justify-center",
            "w-6 h-6 rounded-full",
            "bg-blue-500 text-white",
            "animate-in zoom-in-50 duration-200",
          )}
        >
          <Check className="w-4 h-4" strokeWidth={3} />
        </div>
      )}

      {/* Icon */}
      <div
        className={cn(
          "flex items-center justify-center",
          "rounded-lg transition-transform duration-200",
          "group-hover:scale-110",
          selected ? "text-blue-400" : "text-slate-400",

          // Icon size based on card size - smaller on mobile
          isLarge ? "w-12 h-12 sm:w-16 sm:h-16" : "w-10 h-10 sm:w-12 sm:h-12",
        )}
      >
        <IconComponent
          className={cn(
            "transition-colors duration-200",
            isLarge ? "w-8 h-8 sm:w-10 sm:h-10" : "w-6 h-6 sm:w-8 sm:h-8",
          )}
          strokeWidth={1.5}
        />
      </div>

      {/* Name */}
      <div
        className={cn(
          "font-semibold text-center transition-colors duration-200 leading-tight px-1",
          selected ? "text-blue-100" : "text-slate-200",
          "group-hover:text-slate-100",
          isLarge ? "text-base sm:text-lg" : "text-xs sm:text-sm",
        )}
      >
        {name}
      </div>

      {/* Description (only shown on large cards) */}
      {isLarge && description && (
        <div
          className={cn(
            "text-[10px] sm:text-xs text-center leading-snug sm:leading-relaxed",
            "max-w-[180px] sm:max-w-[200px] line-clamp-2 px-1",
            "transition-colors duration-200",
            selected ? "text-slate-400" : "text-slate-500",
            "group-hover:text-slate-400",
          )}
        >
          {description}
        </div>
      )}
    </button>
  );
}
