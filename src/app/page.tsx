import { Metadata } from "next";
import { HomePageClient } from "@/components/home/HomePageClient";
import { ALL_BUDGET_ITEMS } from "@/lib/data";
import type { BudgetHierarchy } from "@/types/budget";

export const metadata: Metadata = {
  title: "Federal Budget Dashboard - Where Your Tax Dollars Go",
  description:
    "Explore US federal spending with interactive visualizations and side-by-side comparisons that translate billions into tangible terms.",
  openGraph: {
    title: "Federal Budget Dashboard - Where Your Tax Dollars Go",
    description:
      "Explore US federal spending with interactive visualizations and side-by-side comparisons that translate billions into tangible terms.",
    url: "https://budget-dashboard.vercel.app",
    siteName: "Federal Budget Dashboard",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Federal Budget Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Federal Budget Dashboard - Where Your Tax Dollars Go",
    description:
      "Explore US federal spending with interactive visualizations and side-by-side comparisons.",
    images: ["/og-image.png"],
  },
  keywords: [
    "federal budget",
    "government spending",
    "tax dollars",
    "budget visualization",
    "federal spending",
    "budget comparison",
    "USAspending",
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

// FY2025 Federal Budget Data
// Sources: CBO Monthly Budget Review, Treasury Fiscal Data, OMB Budget FY2025
// Total outlays: $7.0 trillion (4% increase from FY2025)
const sampleBudgetData: BudgetHierarchy = {
  root: {
    id: "federal-budget",
    name: "Federal Budget",
    amount: 7000000000000,
    parentId: null,
    fiscalYear: 2025,
    percentOfParent: null,
    yearOverYearChange: 4.0,
  },
  departments: [
    {
      id: "health-human-services",
      name: "Health and Human Services",
      amount: 1802000000000,
      parentId: "federal-budget",
      fiscalYear: 2025,
      percentOfParent: 25.7,
      yearOverYearChange: 8.0,
      agencies: [],
    },
    {
      id: "social-security",
      name: "Social Security Administration",
      amount: 1500000000000,
      parentId: "federal-budget",
      fiscalYear: 2025,
      percentOfParent: 21.4,
      yearOverYearChange: 8.0,
      agencies: [],
    },
    {
      id: "treasury",
      name: "Treasury (Net Interest)",
      amount: 1050000000000,
      parentId: "federal-budget",
      fiscalYear: 2025,
      percentOfParent: 15.0,
      yearOverYearChange: 16.7,
      agencies: [],
    },
    {
      id: "defense",
      name: "Defense",
      amount: 895000000000,
      parentId: "federal-budget",
      fiscalYear: 2025,
      percentOfParent: 12.8,
      yearOverYearChange: 7.0,
      agencies: [],
    },
    {
      id: "veterans-affairs",
      name: "Veterans Affairs",
      amount: 323000000000,
      parentId: "federal-budget",
      fiscalYear: 2025,
      percentOfParent: 4.6,
      yearOverYearChange: 14.0,
      agencies: [],
    },
    {
      id: "agriculture",
      name: "Agriculture",
      amount: 224000000000,
      parentId: "federal-budget",
      fiscalYear: 2025,
      percentOfParent: 3.2,
      yearOverYearChange: 12.0,
      agencies: [],
    },
    {
      id: "homeland-security",
      name: "Homeland Security",
      amount: 116000000000,
      parentId: "federal-budget",
      fiscalYear: 2025,
      percentOfParent: 1.7,
      yearOverYearChange: 29.0,
      agencies: [],
    },
    {
      id: "education",
      name: "Education",
      amount: 35000000000,
      parentId: "federal-budget",
      fiscalYear: 2025,
      percentOfParent: 0.5,
      yearOverYearChange: -87.0,
      agencies: [],
    },
    {
      id: "other",
      name: "Other Departments",
      amount: 1055000000000,
      parentId: "federal-budget",
      fiscalYear: 2025,
      percentOfParent: 15.1,
      yearOverYearChange: 3.5,
      agencies: [],
    },
  ],
  totalAmount: 7000000000000,
  fiscalYear: 2025,
};

export default function HomePage() {
  const currentFiscalYear = 2025;
  const lastUpdated = new Date("2025-10-01"); // FY2025 ended Sept 30, 2025

  return (
    <HomePageClient
      budgetData={sampleBudgetData}
      budgetItems={ALL_BUDGET_ITEMS}
      currentFiscalYear={currentFiscalYear}
      lastUpdated={lastUpdated}
    />
  );
}
