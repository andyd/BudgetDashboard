"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/format";

interface ComparisonCardMiniProps {
  budgetItemId: string;
  budgetItemName: string;
  budgetAmount: number;
  unitId: string;
  unitName: string;
  unitCount: number;
  unitIcon?: string;
  className?: string;
}

export function ComparisonCardMini({
  budgetItemId,
  budgetItemName,
  budgetAmount,
  unitId,
  unitName,
  unitCount,
  unitIcon,
  className,
}: ComparisonCardMiniProps) {
  const formattedBudget = formatCurrency(budgetAmount, { compact: true });
  const formattedCount = formatNumber(Math.floor(unitCount));

  return (
    <Link
      href={`/compare/${budgetItemId}/${unitId}`}
      className={cn(
        "block rounded-lg border bg-card p-4 transition-all hover:shadow-md hover:border-primary/30",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {unitIcon && <span className="text-2xl">{unitIcon}</span>}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground truncate">
            {budgetItemName}
          </p>
          <p className="mt-1 text-lg font-bold leading-tight">
            <span className="text-primary">{formattedCount}</span>{" "}
            <span className="text-foreground">{unitName}</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formattedBudget}
          </p>
        </div>
      </div>
    </Link>
  );
}
