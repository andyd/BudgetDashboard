import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, TrendingUp, Calculator } from "lucide-react";
import { ComparisonResult } from "@/components/comparison/ComparisonResult";
import { ShareButton } from "@/components/comparison/ShareButton";
import { Button } from "@/components/ui/button";
import { MOCK_BUDGET_DATA } from "@/lib/mock-data/budget";
import {
  mockUnits,
  getUnitById as getUnitByIdFromMock,
} from "@/lib/mock-data/units";
import {
  ALL_COMPARISON_UNITS,
  getUnitById as getUnitByIdFromData,
} from "@/lib/data/comparison-units";
import type { BudgetCategory } from "@/types/budget";
import type {
  ComparisonUnit,
  ComparisonResult as ComparisonResultType,
} from "@/types/comparison";

interface ComparisonPageProps {
  params: Promise<{
    spendingId: string;
    unitId: string;
  }>;
}

/**
 * Find a budget item by ID recursively through the budget hierarchy
 */
function findBudgetItemById(
  items: BudgetCategory[],
  id: string,
): BudgetCategory | null {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }
    if (item.subcategories) {
      const found = findBudgetItemById(item.subcategories, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Get a comparison unit by ID from all available sources
 */
function getComparisonUnit(unitId: string): ComparisonUnit | undefined {
  // Try mock units first
  const mockUnit = getUnitByIdFromMock(unitId);
  if (mockUnit) return mockUnit;

  // Try data comparison units
  const dataUnit = getUnitByIdFromData(unitId);
  if (dataUnit) return dataUnit;

  // Search in ALL_COMPARISON_UNITS directly as fallback
  return (
    ALL_COMPARISON_UNITS.find((unit) => unit.id === unitId) ||
    mockUnits.find((unit) => unit.id === unitId)
  );
}

/**
 * Calculate comparison result
 */
function calculateComparison(
  budgetAmount: number,
  unit: ComparisonUnit,
): ComparisonResultType {
  const costPerUnit = unit.costPerUnit ?? unit.cost ?? 0;
  const unitCount = costPerUnit > 0 ? budgetAmount / costPerUnit : 0;

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(budgetAmount);

  const formattedCount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(unitCount);

  const unitName =
    unitCount !== 1
      ? unit.name || unit.pluralName || "units"
      : unit.nameSingular || unit.name || "unit";

  return {
    unitCount,
    formatted: `${formattedAmount} = ${formattedCount} ${unitName}`,
    unit,
    dollarAmount: budgetAmount,
  };
}

/**
 * Format large currency values for display
 */
function formatCurrencyCompact(amount: number): string {
  if (amount >= 1_000_000_000_000) {
    return `$${(amount / 1_000_000_000_000).toFixed(2)}T`;
  } else if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  } else if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  } else if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
}

/**
 * Generate dynamic metadata for SEO and social sharing
 */
export async function generateMetadata({
  params,
}: ComparisonPageProps): Promise<Metadata> {
  const { spendingId, unitId } = await params;

  const budgetItem = findBudgetItemById(MOCK_BUDGET_DATA, spendingId);
  const unit = getComparisonUnit(unitId);

  if (!budgetItem || !unit) {
    return {
      title: "Comparison Not Found | Federal Budget Dashboard",
      description: "The requested budget comparison could not be found.",
    };
  }

  const result = calculateComparison(budgetItem.allocated, unit);
  const formattedAmount = formatCurrencyCompact(budgetItem.allocated);
  const formattedCount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(result.unitCount);

  const unitName =
    result.unitCount !== 1
      ? unit.name || unit.pluralName || "units"
      : unit.nameSingular || unit.name || "unit";

  const title = `${budgetItem.name}: ${formattedAmount} = ${formattedCount} ${unitName}`;
  const description = `Visualize federal spending: ${budgetItem.name} (${formattedAmount}) could fund ${formattedCount} ${unitName}. Explore and share budget comparisons.`;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const shareUrl = `${baseUrl}/compare/${spendingId}/${unitId}`;

  return {
    title: `${title} | Federal Budget Dashboard`,
    description,
    keywords: [
      "federal budget",
      "government spending",
      budgetItem.name,
      unit.name,
      "budget comparison",
      "fiscal policy",
    ],
    openGraph: {
      title,
      description,
      url: shareUrl,
      siteName: "Federal Budget Dashboard",
      images: [
        {
          url: `/api/og/comparison/${spendingId}/${unitId}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og/comparison/${spendingId}/${unitId}`],
    },
    alternates: {
      canonical: shareUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Shareable Comparison Page
 *
 * Displays a specific budget item compared to a specific unit.
 * URL format: /compare/[spendingId]/[unitId]
 *
 * Features:
 * - Dynamic comparison calculation
 * - Full context display with ComparisonResult component
 * - Social sharing buttons
 * - SEO-optimized metadata for rich previews
 * - CTAs to explore more or build custom comparisons
 */
export default async function ShareableComparisonPage({
  params,
}: ComparisonPageProps) {
  const { spendingId, unitId } = await params;

  // Look up budget item and unit from data
  const budgetItem = findBudgetItemById(MOCK_BUDGET_DATA, spendingId);
  const unit = getComparisonUnit(unitId);

  // Show 404 if either not found
  if (!budgetItem || !unit) {
    notFound();
  }

  // Calculate comparison result
  const result = calculateComparison(budgetItem.allocated, unit);

  // Generate headline
  const formattedAmount = formatCurrencyCompact(budgetItem.allocated);
  const formattedCount = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(result.unitCount);
  const unitName =
    result.unitCount !== 1
      ? unit.name || unit.pluralName || "units"
      : unit.nameSingular || unit.name || "unit";
  const headline = `${budgetItem.name} = ${formattedCount} ${unitName}`;

  // Comparison ID for sharing (combines both IDs)
  const comparisonId = `${spendingId}/${unitId}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Hero Headline */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Federal Budget Comparison
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Putting government spending in perspective
            </p>
          </div>

          {/* Main Comparison Display */}
          <div className="transform transition-all duration-300 hover:scale-[1.01]">
            <ComparisonResult
              result={result}
              budgetItemName={budgetItem.name}
            />
          </div>

          {/* Context Section */}
          {budgetItem.description && (
            <div className="rounded-lg border bg-muted/50 p-6">
              <h2 className="mb-3 text-lg font-semibold">
                About {budgetItem.name}
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                {budgetItem.description}
              </p>
              {budgetItem.changeFromPriorYear !== undefined && (
                <p className="mt-3 text-sm text-muted-foreground">
                  <span className="font-medium">Year-over-year change:</span>{" "}
                  <span
                    className={
                      budgetItem.changeFromPriorYear >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {budgetItem.changeFromPriorYear >= 0 ? "+" : ""}
                    {(budgetItem.changeFromPriorYear * 100).toFixed(1)}%
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Unit Context */}
          {unit.description && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-3 text-lg font-semibold">
                About {unit.nameSingular || unit.name}
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                {unit.description}
              </p>
              {unit.source && (
                <p className="mt-3 text-sm text-muted-foreground">
                  <span className="font-medium">Source:</span> {unit.source}
                </p>
              )}
            </div>
          )}

          {/* Share Section */}
          <div className="rounded-lg border bg-card p-6 shadow-md">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="mb-1 text-lg font-semibold">
                  Share This Comparison
                </h3>
                <p className="text-sm text-muted-foreground">
                  Help others understand federal spending
                </p>
              </div>
              <ShareButton
                comparisonId={comparisonId}
                title={headline}
                className="w-full sm:w-auto"
              />
            </div>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="grid gap-4 pt-4 sm:grid-cols-2">
            {/* Explore Budget CTA */}
            <Link href="/budget" className="block">
              <div className="group relative h-full overflow-hidden rounded-lg bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="relative z-10">
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp className="size-5" />
                    <h3 className="text-lg font-bold">
                      Explore the Full Budget
                    </h3>
                  </div>
                  <p className="mb-4 text-sm text-primary-foreground/90">
                    Dive deep into federal spending with interactive
                    visualizations and drill-down views
                  </p>
                  <div className="inline-flex items-center text-sm font-medium transition-all group-hover:gap-2">
                    View Budget Dashboard
                    <span className="ml-1 inline-block transform transition-transform group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>

            {/* Build Your Own CTA */}
            <Link href="/#compare" className="block">
              <div className="group relative h-full overflow-hidden rounded-lg border-2 border-primary/20 bg-card p-6 shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 hover:shadow-lg">
                <div className="relative z-10">
                  <div className="mb-2 flex items-center gap-2">
                    <Calculator className="size-5 text-primary" />
                    <h3 className="text-lg font-bold text-foreground">
                      Build Your Own Comparison
                    </h3>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Compare any budget item with custom units to create your own
                    shareable insights
                  </p>
                  <div className="inline-flex items-center text-sm font-medium text-primary transition-all group-hover:gap-2">
                    Start Building
                    <span className="ml-1 inline-block transform transition-transform group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Data Source Attribution */}
          <div className="border-t pt-6 text-center text-sm text-muted-foreground">
            <p>
              Budget data sourced from{" "}
              <a
                href="https://www.usaspending.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors hover:text-foreground"
              >
                USAspending.gov
              </a>
              {". "}
              Comparison unit costs based on publicly available data.
            </p>
            <p className="mt-2">
              Fiscal Year 2025 | Last updated: January 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
