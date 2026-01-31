import { Metadata } from "next";
import { Suspense } from "react";
import { WizardClient } from "./WizardClient";

export const metadata: Metadata = {
  title:
    "Budget Priority Wizard - Discover What Matters To You | Federal Budget Dashboard",
  description:
    "Answer 3 quick questions to discover personalized federal budget comparisons based on your priorities. Find spending areas that matter most to you and explore government spending through your values.",
  openGraph: {
    title: "Budget Priority Wizard - Discover What Matters To You",
    description:
      "Answer 3 quick questions to discover personalized federal budget comparisons based on your priorities. Find spending areas that matter most to you.",
    url: "https://budget-dashboard.vercel.app/wizard",
    siteName: "Federal Budget Dashboard",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Budget Priority Wizard - Personalized Federal Budget Exploration",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Budget Priority Wizard - Discover What Matters To You",
    description:
      "Answer 3 quick questions to discover personalized federal budget comparisons based on your priorities.",
    images: ["/og-image.png"],
  },
  keywords: [
    "budget priorities",
    "federal spending quiz",
    "personalized budget",
    "government spending priorities",
    "budget comparisons",
    "what matters to you",
    "budget explorer",
    "interactive budget tool",
    "budget values",
    "spending priorities quiz",
  ],
  authors: [{ name: "Federal Budget Dashboard Team" }],
  creator: "Federal Budget Dashboard",
  publisher: "Federal Budget Dashboard",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function WizardPage() {
  return (
    <Suspense fallback={<WizardLoading />}>
      <WizardClient />
    </Suspense>
  );
}

function WizardLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        {/* Header skeleton */}
        <div className="text-center mb-12 space-y-4">
          <div className="h-10 bg-muted/50 rounded-lg w-3/4 mx-auto animate-pulse" />
          <div className="h-6 bg-muted/30 rounded-lg w-2/3 mx-auto animate-pulse" />
        </div>

        {/* Card skeleton */}
        <div className="bg-card border rounded-xl p-8 space-y-6">
          <div className="h-8 bg-muted/50 rounded-lg w-1/2 animate-pulse" />
          <div className="space-y-3">
            <div className="h-12 bg-muted/30 rounded-lg animate-pulse" />
            <div className="h-12 bg-muted/30 rounded-lg animate-pulse" />
            <div className="h-12 bg-muted/30 rounded-lg animate-pulse" />
          </div>
          <div className="flex justify-between pt-4">
            <div className="h-10 bg-muted/30 rounded-lg w-24 animate-pulse" />
            <div className="h-10 bg-muted/50 rounded-lg w-32 animate-pulse" />
          </div>
        </div>

        {/* Progress indicator skeleton */}
        <div className="flex justify-center gap-2 mt-8">
          <div className="h-2 w-16 bg-muted/50 rounded-full animate-pulse" />
          <div className="h-2 w-16 bg-muted/30 rounded-full animate-pulse" />
          <div className="h-2 w-16 bg-muted/30 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
