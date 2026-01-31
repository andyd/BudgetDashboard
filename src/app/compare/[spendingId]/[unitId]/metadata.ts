import type { Metadata } from "next";
import { getItemById } from "@/lib/data/budget-items";
import { getUnitById } from "@/lib/data/comparison-units";
import { formatCurrency, formatNumber } from "@/lib/format";

interface ComparisonPageParams {
  params: Promise<{
    spendingId: string;
    unitId: string;
  }>;
}

/**
 * Generate dynamic metadata for comparison pages
 *
 * Creates SEO-optimized metadata including:
 * - Dynamic title based on spending item and unit comparison
 * - Descriptive content for search engines
 * - Open Graph tags for social sharing
 * - Twitter Card metadata for rich previews
 */
export async function generateMetadata({
  params,
}: ComparisonPageParams): Promise<Metadata> {
  const { spendingId, unitId } = await params;

  // Fetch spending item and comparison unit data
  const spendingItem = getItemById(spendingId);
  const unit = getUnitById(unitId);

  // Return fallback metadata if data not found
  if (!spendingItem || !unit) {
    return {
      title: "Comparison Not Found | Budget Dashboard",
      description:
        "The requested budget comparison could not be found. Explore federal spending with tangible comparisons.",
    };
  }

  // Calculate comparison result
  const unitCost = unit.costPerUnit ?? unit.cost ?? 0;
  const unitCount =
    unitCost > 0 ? Math.floor(spendingItem.amount / unitCost) : 0;

  // Format values for display
  const formattedUnitCount = formatNumber(unitCount);
  const formattedAmount = formatCurrency(spendingItem.amount, {
    compact: true,
  });

  // Get appropriate unit name (singular or plural)
  const unitName =
    unitCount === 1
      ? (unit.nameSingular ?? unit.name)
      : (unit.pluralName ?? unit.name);

  // Build dynamic title and description
  const title = `${spendingItem.name} = ${formattedUnitCount} ${unitName} | Budget Dashboard`;
  const description = `${spendingItem.name} (${formattedAmount}) is equivalent to ${formattedUnitCount} ${unitName}. Explore how federal spending translates into tangible comparisons.`;

  // Base URL for canonical and OG URLs
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const shareUrl = `${baseUrl}/compare/${spendingId}/${unitId}`;
  const ogImageUrl = `${baseUrl}/api/og/comparison?spendingId=${encodeURIComponent(spendingId)}&unitId=${encodeURIComponent(unitId)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: shareUrl,
      siteName: "Federal Budget Dashboard",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${spendingItem.name} equals ${formattedUnitCount} ${unitName}`,
        },
      ],
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: shareUrl,
    },
  };
}
