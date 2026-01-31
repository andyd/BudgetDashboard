import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { BudgetBreadcrumb } from "@/components/budget/BudgetBreadcrumb";
import { ComparisonBuilder } from "@/components/comparison-builder";
import { ComparisonGrid } from "@/components/comparison/ComparisonGrid";
import type { ComparisonGridItem } from "@/components/comparison/ComparisonGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getItemById,
  getItemsByParent,
  ALL_COMPARISON_UNITS,
} from "@/lib/data";
import type { BudgetSpendingItem } from "@/lib/data";
import { formatCurrency, formatPercent, formatCompact } from "@/lib/format";

interface BudgetDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Calculate the total budget for percentage calculations
 */
function calculateTotalBudget(items: BudgetSpendingItem[]): number {
  return items
    .filter((item) => item.tier === "department")
    .reduce((sum, item) => sum + item.amount, 0);
}

/**
 * Get the parent item for an item if it has one
 */
function getParentItem(
  item: BudgetSpendingItem,
): BudgetSpendingItem | undefined {
  if (!item.parentId) return undefined;
  return getItemById(item.parentId);
}

/**
 * Build breadcrumb path for an item
 */
function buildBreadcrumbPath(
  item: BudgetSpendingItem,
): Array<{ id: string; name: string; slug: string }> {
  const path: Array<{ id: string; name: string; slug: string }> = [];

  // Add root
  path.push({
    id: "root",
    name: "Federal Budget",
    slug: "",
  });

  // Build path from parent chain
  const parentChain: BudgetSpendingItem[] = [];
  let current: BudgetSpendingItem | undefined = item;

  while (current) {
    parentChain.unshift(current);
    current = current.parentId ? getItemById(current.parentId) : undefined;
  }

  // Add each item in the chain (excluding current item which will be added as current page)
  for (const chainItem of parentChain) {
    path.push({
      id: chainItem.id,
      name: chainItem.name,
      slug: chainItem.id,
    });
  }

  return path;
}

/**
 * Generate related comparisons for a budget item
 */
function generateRelatedComparisons(
  item: BudgetSpendingItem,
  limit: number = 6,
): ComparisonGridItem[] {
  const comparisons: ComparisonGridItem[] = [];

  // Find units that produce readable comparisons (between 1 and 1,000,000)
  for (const unit of ALL_COMPARISON_UNITS) {
    const cost = unit.costPerUnit ?? unit.cost ?? 0;
    if (cost <= 0) continue;

    const count = item.amount / cost;

    // Filter for comprehensible numbers
    if (count >= 1 && count <= 10_000_000) {
      comparisons.push({
        budgetItem: {
          id: item.id,
          name: item.name,
          amount: item.amount,
        },
        unit: {
          id: unit.id,
          name: unit.name,
          ...(unit.icon && { icon: unit.icon }),
        },
        count: Math.floor(count),
      });
    }

    if (comparisons.length >= limit) break;
  }

  return comparisons;
}

/**
 * Format year-over-year change display
 */
function formatYoYChange(change: number | undefined): {
  text: string;
  color: string;
  icon: typeof TrendingUp | typeof TrendingDown | typeof Minus;
} {
  if (change === undefined || change === null) {
    return {
      text: "No prior data",
      color: "text-muted-foreground",
      icon: Minus,
    };
  }

  if (change > 0) {
    return {
      text: `+${change.toFixed(1)}% from prior year`,
      color: "text-green-600 dark:text-green-400",
      icon: TrendingUp,
    };
  }

  if (change < 0) {
    return {
      text: `${change.toFixed(1)}% from prior year`,
      color: "text-red-600 dark:text-red-400",
      icon: TrendingDown,
    };
  }

  return {
    text: "No change from prior year",
    color: "text-muted-foreground",
    icon: Minus,
  };
}

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({
  params,
}: BudgetDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = getItemById(id);

  if (!item) {
    return {
      title: "Budget Item Not Found | Federal Budget Dashboard",
      description: "The requested budget item could not be found.",
    };
  }

  const formattedAmount = formatCurrency(item.amount, { compact: true });
  const title = `${item.name} - ${formattedAmount} | Federal Budget Dashboard`;
  const description =
    item.description ||
    `Explore ${item.name} federal budget allocation of ${formattedAmount} for FY${item.fiscalYear}. See breakdowns, comparisons, and year-over-year changes.`;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const pageUrl = `${baseUrl}/budget/${id}`;

  return {
    title,
    description,
    keywords: [
      "federal budget",
      "government spending",
      item.name,
      `FY${item.fiscalYear}`,
      item.tier,
      "budget breakdown",
    ],
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Federal Budget Dashboard",
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Budget Detail Page
 *
 * Shows detailed view of a single budget item (department or program).
 * Displays:
 * - Name, amount, % of total, YoY change
 * - Child items (programs under department)
 * - Comparison builder for this specific item
 * - Related comparisons grid
 */
export default async function BudgetDetailPage({
  params,
}: BudgetDetailPageProps) {
  const { id } = await params;
  const item = getItemById(id);

  if (!item) {
    notFound();
  }

  // Get child items
  const childItems = getItemsByParent(id);

  // Get parent item
  const parentItem = getParentItem(item);

  // Build breadcrumb path
  const breadcrumbPath = buildBreadcrumbPath(item);

  // Calculate percentage of total/parent
  const totalBudget = calculateTotalBudget(
    // Import ALL_BUDGET_ITEMS would create circular dependency risk,
    // so we estimate from departments
    childItems.length > 0 ? [item, ...childItems] : [item],
  );

  // Calculate percentage relative to parent or total
  let percentageBase: number;
  let percentageLabel: string;

  if (parentItem) {
    percentageBase = parentItem.amount;
    percentageLabel = `of ${parentItem.name}`;
  } else {
    // For top-level items, show percentage of total federal budget
    // Using estimated total of ~7 trillion
    percentageBase = 7_000_000_000_000;
    percentageLabel = "of federal budget";
  }

  const percentOfTotal = (item.amount / percentageBase) * 100;

  // Generate related comparisons
  const relatedComparisons = generateRelatedComparisons(item, 6);

  // Format YoY change - using a mock value for now
  // In production, this would come from the data
  const mockYoYChange = undefined; // Replace with actual data when available
  const yoyDisplay = formatYoYChange(mockYoYChange);
  const YoYIcon = yoyDisplay.icon;

  // Determine parent path for back navigation
  const parentPath = parentItem ? `/budget/${parentItem.id}` : "/";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href={parentPath} className="gap-2">
              <ArrowLeft className="size-4" />
              {parentItem ? `Back to ${parentItem.name}` : "Back to Dashboard"}
            </Link>
          </Button>
        </div>

        {/* Breadcrumb Navigation */}
        <BudgetBreadcrumb path={breadcrumbPath} className="mb-8" />

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-baseline gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {item.name}
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
              {item.tier}
            </span>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Fiscal Year {item.fiscalYear}
          </p>

          {item.description && (
            <p className="text-muted-foreground max-w-3xl leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Key Metrics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Amount Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-primary">
                {formatCurrency(item.amount, { compact: true })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(item.amount)}
              </p>
            </CardContent>
          </Card>

          {/* Percentage Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Percentage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">
                {formatPercent(percentOfTotal / 100, 1)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {percentageLabel}
              </p>
            </CardContent>
          </Card>

          {/* YoY Change Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Year-over-Year
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`flex items-center gap-2 ${yoyDisplay.color}`}>
                <YoYIcon className="size-5" />
                <span className="text-lg font-semibold">{yoyDisplay.text}</span>
              </div>
            </CardContent>
          </Card>

          {/* Source Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Data Source
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">{item.source}</p>
              <p className="text-xs text-muted-foreground mt-1">
                FY{item.fiscalYear} Budget Data
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Child Items Section */}
        {childItems.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              Programs & Allocations
            </h2>
            <p className="text-muted-foreground mb-6">
              {childItems.length} program{childItems.length !== 1 ? "s" : ""}{" "}
              under {item.name}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {childItems.map((child) => {
                const childPercentOfParent = (child.amount / item.amount) * 100;

                return (
                  <Link
                    key={child.id}
                    href={`/budget/${child.id}`}
                    className="block"
                  >
                    <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold line-clamp-2">
                          {child.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xl font-bold text-primary">
                            {formatCurrency(child.amount, { compact: true })}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {childPercentOfParent.toFixed(1)}%
                          </span>
                        </div>
                        {child.description && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {child.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* No Children State */}
        {childItems.length === 0 && item.tier !== "department" && (
          <div className="bg-muted/50 rounded-lg p-8 text-center mb-12">
            <p className="text-muted-foreground">
              This is the most detailed level available for this budget item.
            </p>
          </div>
        )}

        {/* Comparison Builder Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Build a Comparison</h2>
          <p className="text-muted-foreground mb-6">
            See what {formatCurrency(item.amount, { compact: true })} could fund
            in tangible terms.
          </p>
          <ComparisonBuilder />
        </section>

        {/* Related Comparisons Section */}
        {relatedComparisons.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Related Comparisons</h2>
            <p className="text-muted-foreground mb-6">
              Putting {item.name} spending in perspective
            </p>
            <ComparisonGrid
              items={relatedComparisons}
              initialCount={6}
              emptyMessage="No comparisons available"
              emptyDescription="Unable to generate comparisons for this budget item."
            />
          </section>
        )}

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
            {" and "}
            <span className="font-medium">{item.source}</span>.
          </p>
          <p className="mt-2">
            Fiscal Year {item.fiscalYear} | Last updated: January 2026
          </p>
        </div>
      </div>
    </div>
  );
}
