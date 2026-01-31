import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, DollarSign, Tag, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getUnitById,
  ALL_COMPARISON_UNITS,
  ALL_BUDGET_ITEMS,
} from "@/lib/data";
import { calculateComparison } from "@/lib/comparison-engine";
import { formatCurrency } from "@/lib/format";

interface UnitDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Get related units in the same category
 */
function getRelatedUnits(unitId: string, category: string, limit: number = 4) {
  return ALL_COMPARISON_UNITS.filter(
    (u) => u.id !== unitId && u.category === category,
  ).slice(0, limit);
}

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({
  params,
}: UnitDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const unit = getUnitById(id);

  if (!unit) {
    return {
      title: "Unit Not Found | Federal Budget Dashboard",
      description: "The requested comparison unit could not be found.",
    };
  }

  const cost = unit.costPerUnit ?? unit.cost ?? 0;
  const formattedCost = formatCurrency(cost);
  const title = `${unit.nameSingular || unit.name} - ${formattedCost}`;
  const description =
    unit.description ||
    `Compare federal spending using ${unit.name} at ${formattedCost} each.`;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const canonicalUrl = `${baseUrl}/units/${id}`;

  return {
    title: `${title} | Federal Budget Dashboard`,
    description,
    keywords: [
      "federal budget",
      "government spending",
      unit.name,
      unit.category,
      "budget comparison",
      "fiscal policy",
    ],
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Federal Budget Dashboard",
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

/**
 * Unit Detail Page
 *
 * Displays detailed information about a comparison unit including:
 * - Name, cost, description, and category
 * - Source citations with links
 * - Grid of budget items showing "how many of this unit" each could buy
 * - Related units in the same category
 */
export default async function UnitDetailPage({ params }: UnitDetailPageProps) {
  const { id } = await params;
  const unit = getUnitById(id);

  if (!unit) {
    notFound();
  }

  const cost = unit.costPerUnit ?? unit.cost ?? 0;
  const relatedUnits = getRelatedUnits(id, unit.category);

  // Calculate comparisons for each budget item
  const budgetComparisons = ALL_BUDGET_ITEMS.map((item) => {
    const result = calculateComparison(item.amount, unit);
    return {
      item,
      result,
    };
  })
    .filter((comparison) => comparison.result.count >= 1)
    .sort((a, b) => b.result.count - a.result.count);

  // Format the category for display
  const categoryDisplay = unit.category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

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

        <div className="mx-auto max-w-6xl space-y-8">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {unit.icon && (
                <span className="text-4xl" role="img" aria-label={unit.name}>
                  {unit.icon}
                </span>
              )}
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {unit.nameSingular || unit.name}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                <Tag className="mr-1 size-3" />
                {categoryDisplay}
              </Badge>
              {unit.period && (
                <Badge variant="outline" className="text-sm">
                  Per {unit.period}
                </Badge>
              )}
            </div>
          </div>

          {/* Main Details Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="size-5 text-primary" />
                Unit Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cost */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Cost per Unit
                </span>
                <span className="text-3xl font-bold text-primary">
                  {formatCurrency(cost)}
                </span>
              </div>

              {/* Description */}
              {unit.description && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    Description
                  </span>
                  <p className="text-base leading-relaxed text-foreground">
                    {unit.description}
                  </p>
                </div>
              )}

              {/* Source Citation */}
              {(unit.source || unit.sourceUrl) && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    Source
                  </span>
                  <div className="flex items-center gap-2">
                    {unit.sourceUrl ? (
                      <a
                        href={unit.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                      >
                        {unit.source || unit.sourceUrl}
                        <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      <span className="text-foreground">{unit.source}</span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Budget Comparisons Grid */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">
                What Could Buy {unit.name}?
              </h2>
              <Info className="size-4 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              See how many {unit.name.toLowerCase()} different federal budget
              items could fund.
            </p>

            {budgetComparisons.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No budget items produce at least 1 unit at this price point.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {budgetComparisons.slice(0, 12).map(({ item, result }) => (
                  <Link
                    key={item.id}
                    href={`/compare/${item.id}/${unit.id}`}
                    className="group"
                  >
                    <Card className="h-full transition-all duration-200 hover:shadow-md hover:ring-1 hover:ring-primary/20">
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-start justify-between">
                          <h3 className="font-semibold text-foreground group-hover:text-primary">
                            {item.name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {item.tier}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Budget:{" "}
                            {formatCurrency(item.amount, { compact: true })}
                          </p>
                          <p className="text-lg font-bold text-primary">
                            = {result.formatted}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {budgetComparisons.length > 12 && (
              <p className="text-center text-sm text-muted-foreground">
                Showing 12 of {budgetComparisons.length} budget items
              </p>
            )}
          </section>

          {/* Related Units */}
          {relatedUnits.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">
                More {categoryDisplay} Units
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedUnits.map((relatedUnit) => {
                  const relatedCost =
                    relatedUnit.costPerUnit ?? relatedUnit.cost ?? 0;
                  return (
                    <Link
                      key={relatedUnit.id}
                      href={`/units/${relatedUnit.id}`}
                      className="group"
                    >
                      <Card className="h-full transition-all duration-200 hover:shadow-md hover:ring-1 hover:ring-primary/20">
                        <CardContent className="p-4">
                          <div className="mb-2 flex items-center gap-2">
                            {relatedUnit.icon && (
                              <span className="text-xl">
                                {relatedUnit.icon}
                              </span>
                            )}
                            <h3 className="font-semibold text-foreground group-hover:text-primary">
                              {relatedUnit.nameSingular || relatedUnit.name}
                            </h3>
                          </div>
                          <p className="text-lg font-bold text-primary">
                            {formatCurrency(relatedCost)}
                          </p>
                          {relatedUnit.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {relatedUnit.description}
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
              Unit cost based on{" "}
              {unit.source ? (
                unit.sourceUrl ? (
                  <a
                    href={unit.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline transition-colors hover:text-foreground"
                  >
                    {unit.source}
                  </a>
                ) : (
                  <span>{unit.source}</span>
                )
              ) : (
                "publicly available data"
              )}
              .
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
