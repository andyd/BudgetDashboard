"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  /** Budget item ID for the comparison */
  budgetId: string;
  /** Comparison unit ID */
  unitId: string;
  /** Optional class name for styling */
  className?: string;
  /** Button size variant */
  size?: "default" | "sm" | "lg" | "icon";
  /** Show label text alongside icon */
  showLabel?: boolean;
  /** Callback when favorite state changes */
  onToggle?: (isFavorite: boolean) => void;
}

export function FavoriteButton({
  budgetId,
  unitId,
  className,
  size = "icon",
  showLabel = false,
  onToggle,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isAtLimit } = useFavorites();
  const [mounted, setMounted] = React.useState(false);

  const isFavorited = isFavorite(budgetId, unitId);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const newState = toggleFavorite(budgetId, unitId);
      onToggle?.(newState);
    },
    [budgetId, unitId, toggleFavorite, onToggle],
  );

  // Prevent hydration mismatch by showing unfavorited state until mounted
  const showFavorited = mounted && isFavorited;
  const showLimitWarning = mounted && isAtLimit && !isFavorited;

  const tooltipContent = showFavorited
    ? "Remove from favorites"
    : showLimitWarning
      ? "Favorites limit reached (oldest will be removed)"
      : "Add to favorites";

  const buttonContent = (
    <>
      <Heart
        className={cn(
          "transition-all duration-200",
          showFavorited && "fill-red-500 text-red-500",
          !showFavorited && "text-muted-foreground hover:text-red-500",
        )}
      />
      {showLabel && (
        <span className="sr-only sm:not-sr-only">
          {showFavorited ? "Favorited" : "Favorite"}
        </span>
      )}
    </>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={size}
            className={cn(
              "group",
              showFavorited && "hover:bg-red-50 dark:hover:bg-red-950/20",
              className,
            )}
            onClick={handleClick}
            aria-label={
              showFavorited ? "Remove from favorites" : "Add to favorites"
            }
            aria-pressed={showFavorited}
          >
            {buttonContent}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
