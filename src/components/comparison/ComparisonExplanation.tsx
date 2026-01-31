"use client";

import { useMemo } from "react";
import { formatCurrency, formatCount, pluralize } from "@/lib/format-utils";
import { US_POPULATION } from "@/constants";
import type { BudgetItem } from "@/types/budget";
import type { ComparisonUnit } from "@/types/comparison";

interface ComparisonExplanationProps {
  /** The budget item being compared */
  budgetItem: BudgetItem;
  /** The comparison unit (e.g., teachers, F-35s) */
  unit: ComparisonUnit;
  /** The calculated count of units */
  count: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ComparisonExplanation
 *
 * Generates human-readable, engaging text explaining a budget comparison.
 * Varies phrasing based on magnitude and includes per-capita breakdown.
 */
export default function ComparisonExplanation({
  budgetItem,
  unit,
  count,
  className,
}: ComparisonExplanationProps) {
  // Get cost per unit (handle both property names)
  const costPerUnit = unit.costPerUnit ?? unit.cost ?? 0;

  // Calculate per-capita amount
  const perCapita = budgetItem.amount / US_POPULATION;

  // Determine the unit name based on count
  const unitName = count === 1 ? (unit.nameSingular ?? unit.name) : unit.name;

  // Generate contextual framing based on magnitude
  const contextualFrame = useMemo(() => {
    const roundedCount = Math.floor(count);

    // Very small amounts (less than 1)
    if (count < 1) {
      const percentage = (count * 100).toFixed(1);
      return `That's about ${percentage}% of the cost of a single ${unit.nameSingular ?? unit.name}.`;
    }

    // Just one unit
    if (roundedCount === 1) {
      return `That's enough to fund exactly one ${unit.nameSingular ?? unit.name}.`;
    }

    // Small counts (2-10)
    if (roundedCount <= 10) {
      return `That's enough to fund ${formatCount(roundedCount)} ${unitName}.`;
    }

    // Medium counts (11-100)
    if (roundedCount <= 100) {
      return `That's enough to cover ${formatCount(roundedCount)} ${unitName}.`;
    }

    // Large counts (101-1000)
    if (roundedCount <= 1000) {
      return `That's enough for ${formatCount(roundedCount)} ${unitName} - imagine filling a small stadium!`;
    }

    // Very large counts (1001-10000)
    if (roundedCount <= 10000) {
      return `That's ${formatCount(roundedCount)} ${unitName} - enough to supply a small city.`;
    }

    // Huge counts (10001-100000)
    if (roundedCount <= 100000) {
      return `At ${formatCount(roundedCount)} ${unitName}, this could transform entire communities.`;
    }

    // Massive counts (100001-1000000)
    if (roundedCount <= 1000000) {
      return `With ${formatCount(roundedCount)} ${unitName}, this represents a nationwide impact.`;
    }

    // Astronomical counts (1000001+)
    return `An staggering ${formatCount(roundedCount)} ${unitName} - a number almost too large to comprehend.`;
  }, [count, unitName, unit.nameSingular, unit.name]);

  // Generate engaging opening based on amount size
  const engagingOpening = useMemo(() => {
    const amount = budgetItem.amount;

    if (amount >= 1_000_000_000_000) {
      return "This trillion-dollar investment";
    }
    if (amount >= 100_000_000_000) {
      return "This major allocation";
    }
    if (amount >= 1_000_000_000) {
      return "This billion-dollar commitment";
    }
    if (amount >= 100_000_000) {
      return "This significant investment";
    }
    if (amount >= 1_000_000) {
      return "This allocation";
    }
    return "This budget item";
  }, [budgetItem.amount]);

  // Generate per-capita explanation
  const perCapitaExplanation = useMemo(() => {
    if (perCapita >= 1000) {
      return `every American effectively contributes ${formatCurrency(perCapita)} toward this`;
    }
    if (perCapita >= 100) {
      return `each person's share comes to about ${formatCurrency(perCapita)}`;
    }
    if (perCapita >= 10) {
      return `that works out to roughly ${formatCurrency(perCapita)} per person`;
    }
    if (perCapita >= 1) {
      return `breaking it down, it's about ${formatCurrency(perCapita)} per American`;
    }
    // Less than $1 per person
    const cents = Math.round(perCapita * 100);
    if (cents >= 1) {
      return `that's just ${cents} ${pluralize(cents, "cent")} per person`;
    }
    // Less than 1 cent
    return "the per-person cost is less than a penny";
  }, [perCapita]);

  return (
    <div className={className}>
      <p className="text-base leading-relaxed text-foreground">
        {engagingOpening} of{" "}
        <span className="font-semibold text-primary">
          {formatCurrency(budgetItem.amount)}
        </span>{" "}
        for <span className="font-medium">{budgetItem.name}</span> translates to
        real-world impact. {contextualFrame}
      </p>

      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        With each {unit.nameSingular ?? unit.name} costing approximately{" "}
        <span className="font-medium">{formatCurrency(costPerUnit)}</span>,{" "}
        {perCapitaExplanation}.
      </p>

      {unit.description && (
        <p className="mt-2 text-sm italic text-muted-foreground">
          {unit.description}
        </p>
      )}
    </div>
  );
}
