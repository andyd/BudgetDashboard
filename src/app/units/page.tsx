import type { Metadata } from "next";
import { UnitsPageClient } from "./UnitsPageClient";

/**
 * Generate metadata for the Units browse page
 */
export function generateMetadata(): Metadata {
  return {
    title: "Browse Comparison Units | Federal Budget Dashboard",
    description:
      "Explore our library of comparison units to translate federal spending into real-world terms. Compare budget items to healthcare costs, education expenses, housing, and more.",
    keywords: [
      "federal budget",
      "comparison units",
      "government spending",
      "budget visualization",
      "healthcare costs",
      "education costs",
      "housing costs",
      "budget comparison",
    ],
    openGraph: {
      title: "Browse Comparison Units - Federal Budget Dashboard",
      description:
        "Explore our library of comparison units to translate federal spending into real-world terms you can understand.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Browse Comparison Units - Federal Budget Dashboard",
      description:
        "Explore our library of comparison units to translate federal spending into real-world terms.",
    },
  };
}

/**
 * Units Browse Page
 *
 * Server component that renders the client-side Units page.
 * Displays all comparison units grouped by category with search functionality.
 */
export default function UnitsPage() {
  return <UnitsPageClient />;
}
