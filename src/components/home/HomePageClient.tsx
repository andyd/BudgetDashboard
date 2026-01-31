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

      {/* Hero Section - Comparison Builder */}
      <section className="bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {/* Hero Headline */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              What Could Your Tax Dollars Buy?
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Turn billions into tangible comparisons. FY {currentFiscalYear}
            </p>
          </div>

          {/* Comparison Builder as Hero */}
          <div className="mx-auto max-w-2xl">
            <ComparisonBuilder
              budgetItems={budgetItems}
              onShare={handleBuilderShare}
            />
          </div>

          {/* Data Freshness - subtle placement */}
          <div className="mt-8 flex justify-center">
            <DataFreshnessIndicator
              lastUpdated={lastUpdated}
              source="USAspending.gov"
              sourceUrl="https://www.usaspending.gov"
            />
          </div>
        </div>
      </section>

      {/* Below Fold: Budget Overview Section */}
      <section className="border-t bg-muted/10">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
            Explore the Full Budget
          </h2>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Budget Pie Chart - Smaller */}
            <div>
              <div className="h-[400px]">
                <BudgetPieChart
                  data={budgetData}
                  onItemClick={handleItemClick}
                  onItemHover={handleItemHover}
                />
              </div>
              <div className="mt-4 text-center">
                <Link
                  href="/budget"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View detailed breakdown →
                </Link>
              </div>
            </div>

            {/* Featured Carousel */}
            <div className="flex flex-col">
              <h3 className="mb-4 text-lg font-semibold">
                Featured Comparisons
              </h3>
              <div className="flex-1">
                <FeaturedCarousel
                  comparisons={featuredComparisons}
                  autoRotateMs={8000}
                />
              </div>
            </div>
          </div>
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
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Build a Comparison
            </button>
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
