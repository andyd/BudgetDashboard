import { MetadataRoute } from "next";
import { ALL_BUDGET_ITEMS, ALL_COMPARISON_UNITS } from "@/lib/data";

/**
 * Next.js 15 Sitemap Generator
 *
 * Generates a comprehensive sitemap including:
 * - Static pages (home, about, methodology, contact, units, budget, compare, wizard)
 * - Dynamic budget item pages
 * - Dynamic comparison unit pages
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://webapp-template.vercel.app";

  const currentDate = new Date();

  // ============================================================================
  // Static Pages
  // ============================================================================

  const staticRoutes: MetadataRoute.Sitemap = [
    // Homepage - highest priority, updates frequently with new budget data
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // About page - informational, updates occasionally
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Methodology page - detailed explanation, rarely changes
    {
      url: `${baseUrl}/methodology`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Contact page - rarely changes
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    // Budget landing page - main exploration entry point
    {
      url: `${baseUrl}/budget`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Units listing page - comparison unit catalog
    {
      url: `${baseUrl}/units`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Compare landing page - comparison builder
    {
      url: `${baseUrl}/compare`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Wizard page - interactive comparison builder
    {
      url: `${baseUrl}/wizard`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // ============================================================================
  // Budget Item Pages
  // ============================================================================

  const budgetItemRoutes: MetadataRoute.Sitemap = ALL_BUDGET_ITEMS.map(
    (item) => ({
      url: `${baseUrl}/budget/${item.id}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const, // Budget data updates regularly
      // Priority based on tier: departments highest, programs medium, line items lower
      priority:
        item.tier === "department" ? 0.8 : item.tier === "program" ? 0.7 : 0.6,
    }),
  );

  // ============================================================================
  // Comparison Unit Pages
  // ============================================================================

  const comparisonUnitRoutes: MetadataRoute.Sitemap = ALL_COMPARISON_UNITS.map(
    (unit) => ({
      url: `${baseUrl}/units/${unit.id}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const, // Unit data is relatively stable
      priority: 0.6,
    }),
  );

  // ============================================================================
  // Combine All Routes
  // ============================================================================

  return [...staticRoutes, ...budgetItemRoutes, ...comparisonUnitRoutes];
}
