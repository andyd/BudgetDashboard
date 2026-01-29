import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { ComparisonCard } from '@/components/comparison/ComparisonCard';
import { ShareButton } from '@/components/comparison/ShareButton';
import { Button } from '@/components/ui/button';
import type { FeaturedComparison, ComparisonUnit } from '@/types/comparison';
import type { BudgetItem } from '@/types/budget';

interface ComparisonPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Fetch comparison data by ID
 * In production, this would call your API endpoint
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getComparison(id: string): Promise<{
  comparison: FeaturedComparison;
  budgetItem: BudgetItem;
  unit: ComparisonUnit;
} | null> {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comparisons/${id}`);
    // if (!response.ok) return null;
    // return await response.json();

    // Mock data for development
    // Return null to trigger 404 for now
    return null;
  } catch (error) {
    console.error('Error fetching comparison:', error);
    return null;
  }
}

/**
 * Generate dynamic metadata for social sharing
 * Creates Open Graph and Twitter Card tags for rich social previews
 */
export async function generateMetadata({
  params,
}: ComparisonPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getComparison(id);

  if (!data) {
    return {
      title: 'Comparison Not Found',
      description: 'The requested budget comparison could not be found.',
    };
  }

  const { comparison, budgetItem, unit } = data;

  // Format the comparison for social sharing
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(comparison.budgetAmount);

  const formattedUnitCount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(comparison.result.unitCount);

  const title = comparison.headline;
  const description = `${budgetItem.name}: ${formattedAmount} equals ${formattedUnitCount} ${unit.name}. Explore the full federal budget and build your own comparisons.`;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/compare/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: shareUrl,
      siteName: 'Federal Budget Dashboard',
      images: [
        {
          url: `/api/og/comparison/${id}`, // Dynamic OG image generation endpoint
          width: 1200,
          height: 630,
          alt: comparison.headline,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og/comparison/${id}`],
    },
    alternates: {
      canonical: shareUrl,
    },
  };
}

/**
 * Comparison Detail Page
 *
 * Displays a single budget comparison in a full-page format with:
 * - Large, prominent comparison card
 * - Call-to-action to explore the full budget
 * - Link to build custom comparisons
 * - Social sharing buttons
 * - SEO-optimized metadata for rich social previews
 */
export default async function ComparisonPage({ params }: ComparisonPageProps) {
  const { id } = await params;
  const data = await getComparison(id);

  // Show 404 if comparison not found
  if (!data) {
    notFound();
  }

  const { comparison, budgetItem, unit } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Large Comparison Card - Hero Element */}
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <ComparisonCard
                budgetAmount={comparison.budgetAmount}
                unitCount={comparison.result.unitCount}
                unit={unit}
                headline={comparison.headline}
                {...(comparison.context && { context: comparison.context })}
                className="shadow-2xl border-2"
              />
            </div>

            {/* Context Section */}
            {comparison.context && (
              <div className="bg-muted/50 rounded-lg p-6 border">
                <h2 className="text-lg font-semibold mb-3">Context</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {comparison.context}
                </p>
              </div>
            )}

            {/* Share Section - Prominent */}
            <div className="bg-card border rounded-lg p-6 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Share This Comparison
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Help others understand federal spending
                  </p>
                </div>
                <ShareButton
                  comparisonId={id}
                  title={comparison.headline}
                  className="w-full sm:w-auto"
                />
              </div>
            </div>

            {/* Call-to-Action Buttons */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {/* Explore Budget CTA */}
              <Link href="/budget" className="block">
                <div className="group relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="size-5" />
                      <h3 className="text-lg font-bold">
                        Explore the Full Budget
                      </h3>
                    </div>
                    <p className="text-sm text-primary-foreground/90 mb-4">
                      Dive deep into federal spending with interactive
                      visualizations and drill-down views
                    </p>
                    <div className="inline-flex items-center text-sm font-medium group-hover:gap-2 transition-all">
                      View Budget Dashboard
                      <span className="inline-block transform group-hover:translate-x-1 transition-transform ml-1">
                        →
                      </span>
                    </div>
                  </div>
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>

              {/* Build Your Own CTA */}
              <Link href="/budget#compare" className="block">
                <div className="group relative overflow-hidden bg-card border-2 border-primary/20 hover:border-primary/40 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full">
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold mb-2 text-foreground">
                      Build Your Own Comparison
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Compare any budget item with custom units to create your
                      own shareable insights
                    </p>
                    <div className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                      Start Building
                      <span className="inline-block transform group-hover:translate-x-1 transition-transform ml-1">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Additional Information */}
            <div className="border-t pt-6 text-center text-sm text-muted-foreground">
              <p>
                Data sourced from{' '}
                <a
                  href="https://www.usaspending.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  USAspending.gov
                </a>
                {'. '}Fiscal Year: {budgetItem.fiscalYear}
              </p>
            </div>
        </div>
      </div>
    </div>
  );
}
