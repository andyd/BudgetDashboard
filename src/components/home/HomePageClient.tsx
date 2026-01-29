"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { BudgetPieChart } from "@/components/budget/BudgetPieChart";
import { DataFreshnessIndicator } from "@/components/budget/DataFreshnessIndicator";
import { ICESpotlight } from "@/components/budget/ICESpotlight";
import { FeaturedCarousel } from "@/components/comparison/FeaturedCarousel";
import { ComparisonBuilder } from "@/components/comparison/ComparisonBuilder";
import type { BudgetHierarchy, BudgetItem } from "@/types/budget";
import type { FeaturedComparison } from "@/types/comparison";

interface HomePageClientProps {
  budgetData: BudgetHierarchy;
  budgetItems: BudgetItem[];
  featuredComparisons: FeaturedComparison[];
  currentFiscalYear: number;
  lastUpdated: Date;
}

export function HomePageClient({
  budgetData,
  budgetItems,
  featuredComparisons,
  currentFiscalYear,
  lastUpdated,
}: HomePageClientProps) {
  const router = useRouter();

  const handleItemClick = (itemId: string) => {
    router.push(`/budget/${itemId}`);
  };

  const handleItemHover = (itemId: string | null) => {
    // Could update a store to show contextual comparisons
    console.log("Hovering budget item:", itemId);
  };

  const handleBuilderShare = (budgetItemId: string, unitId: string) => {
    const shareUrl = `${window.location.origin}/compare/custom?budget=${budgetItemId}&unit=${unitId}`;
    navigator.clipboard.writeText(shareUrl);
    console.log("Share comparison:", { budgetItemId, unitId });
  };

  return (
    <>
      {/* ICE Budget Spotlight Bar */}
      <section className="border-b border-orange-500/20">
        <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <ICESpotlight />
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-muted/10">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Where Your Tax Dollars Go
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                Fiscal Year {currentFiscalYear}
              </p>
            </div>
            <div className="flex items-center">
              <DataFreshnessIndicator
                lastUpdated={lastUpdated}
                source="USAspending.gov"
                sourceUrl="https://www.usaspending.gov"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Visualization Section - Side by Side Layout */}
      <section className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
          {/* Left: Budget Pie Chart (60% - 3 columns) */}
          <div className="lg:col-span-3">
            <div className="sticky top-4 h-[600px]">
              <BudgetPieChart
                data={budgetData}
                onItemClick={handleItemClick}
                onItemHover={handleItemHover}
              />
            </div>
          </div>

          {/* Right: Featured Comparisons + Comparison Builder (40% - 2 columns) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Featured Carousel */}
            <div>
              <FeaturedCarousel
                comparisons={featuredComparisons}
                autoRotateMs={8000}
              />
            </div>

            {/* Quick Compare Widget */}
            <div>
              <div className="rounded-lg border bg-muted/30 p-6">
                <h3 className="mb-2 text-lg font-semibold">Quick Compare</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Build your own comparison
                </p>
                <div className="space-y-3">
                  <div className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
                    Select budget item...
                  </div>
                  <div className="text-center text-muted-foreground">→</div>
                  <div className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
                    Select comparison unit...
                  </div>
                  <Link
                    href="#comparison-builder"
                    className="block w-full rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Build Full Comparison
                  </Link>
                </div>
              </div>
            </div>

            {/* Contextual Info */}
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
              <h4 className="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                How to use this dashboard
              </h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Click any segment to drill down into details</li>
                <li>• Hover to see contextual comparisons</li>
                <li>• Build custom comparisons below</li>
                <li>• Share comparisons via unique URLs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Below Fold: Full Comparison Builder Section */}
      <section id="comparison-builder" className="border-y bg-muted/20">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <ComparisonBuilder
            budgetItems={budgetItems}
            onShare={handleBuilderShare}
          />
        </div>
      </section>

      {/* Key Insights Section */}
      <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
          Understanding the Numbers
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 text-4xl">💰</div>
            <h3 className="mb-2 text-lg font-semibold">Total Federal Budget</h3>
            <p className="mb-2 text-3xl font-bold text-primary">$7.0T</p>
            <p className="text-sm text-muted-foreground">
              The complete federal budget for FY 2025, including mandatory and
              discretionary spending
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 text-4xl">📊</div>
            <h3 className="mb-2 text-lg font-semibold">Transparent Data</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              All data sourced from official government databases including
              USAspending.gov, CBO, and OMB
            </p>
            <Link
              href="/methodology"
              className="text-sm font-medium text-primary hover:underline"
            >
              Read our methodology →
            </Link>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 text-4xl">🔍</div>
            <h3 className="mb-2 text-lg font-semibold">Drill Down Deeper</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Explore spending by department, agency, program, and individual
              line items
            </p>
            <Link
              href="/budget"
              className="text-sm font-medium text-primary hover:underline"
            >
              Explore full budget →
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="border-y bg-primary/5">
        <div className="container mx-auto px-4 py-12 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
            Make the Numbers Meaningful
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Turn billions into tangible comparisons. Share your findings with
            others. Help make federal spending understandable for everyone.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="#comparison-builder"
              className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Build a Comparison
            </Link>
            <Link
              href="/about"
              className="rounded-lg border bg-background px-6 py-3 font-medium transition-colors hover:bg-muted/50"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
