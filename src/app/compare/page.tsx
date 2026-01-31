import type { Metadata } from "next";
import { ComparePageClient } from "./ComparePageClient";

/**
 * Static metadata for the Explore All Comparisons page
 */
export const metadata: Metadata = {
  title: "Explore All Comparisons | Federal Budget Dashboard",
  description:
    "Browse and discover thousands of comparisons between federal budget items and tangible units. Filter by category, search, and find meaningful perspectives on government spending.",
  openGraph: {
    title: "Explore All Comparisons | Federal Budget Dashboard",
    description:
      "Browse and discover thousands of comparisons between federal budget items and tangible units. Filter by category, search, and find meaningful perspectives on government spending.",
    type: "website",
    siteName: "Federal Budget Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore All Comparisons | Federal Budget Dashboard",
    description:
      "Browse and discover thousands of comparisons between federal budget items and tangible units.",
  },
};

/**
 * Explore All Comparisons Page
 *
 * Server component wrapper that exports metadata and renders the client component.
 */
export default function ComparePage() {
  return <ComparePageClient />;
}
