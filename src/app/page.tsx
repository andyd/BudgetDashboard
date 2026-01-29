import { Metadata } from "next";
import { HomePageClient } from "@/components/home/HomePageClient";
import type { BudgetHierarchy, BudgetItem } from "@/types/budget";
import type { FeaturedComparison } from "@/types/comparison";

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

const sampleBudgetItems: BudgetItem[] = [
  {
    id: "defense",
    name: "Defense Department",
    amount: 895000000000,
    parentId: null,
    fiscalYear: 2025,
    percentOfParent: null,
    yearOverYearChange: 7.0,
  },
  {
    id: "ice-detention",
    name: "ICE Detention Operations",
    amount: 3500000000,
    parentId: "homeland-security",
    fiscalYear: 2025,
    percentOfParent: 3.0,
    yearOverYearChange: 9.4,
  },
  {
    id: "f35-program",
    name: "F-35 Fighter Program",
    amount: 13200000000,
    parentId: "defense",
    fiscalYear: 2025,
    percentOfParent: 1.5,
    yearOverYearChange: 6.5,
  },
];

const sampleFeaturedComparisons: FeaturedComparison[] = [
  {
    id: "1",
    budgetItemId: "ice-detention",
    budgetItemName: "ICE Detention Operations",
    budgetAmount: 3500000000,
    unit: {
      id: "teacher-salary",
      name: "Teacher Salaries",
      nameSingular: "Teacher Salary",
      costPerUnit: 68000,
      category: "everyday" as const,
      description: "Average annual teacher salary",
      icon: "👩‍🏫",
    },
    result: {
      unitCount: 51470,
      formatted: "51,470 Teacher Salaries",
      unit: {
        id: "teacher-salary",
        name: "Teacher Salaries",
        nameSingular: "Teacher Salary",
        costPerUnit: 68000,
        category: "everyday" as const,
      },
      dollarAmount: 3500000000,
    },
    headline: "ICE Detention = 51,470 Teacher Salaries",
    context:
      "Annual ICE detention operations cost as much as 51,470 teacher salaries for a year",
    source: "DHS Budget FY2025, BLS Average Salary Data",
    priority: 100,
    isFeatured: true,
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
  },
  {
    id: "2",
    budgetItemId: "f35-program",
    budgetItemName: "F-35 Fighter Program",
    budgetAmount: 13200000000,
    unit: {
      id: "school-construction",
      name: "New Schools",
      nameSingular: "New School",
      costPerUnit: 38000000,
      category: "buildings" as const,
      description: "Cost to build a new public school",
      icon: "🏫",
    },
    result: {
      unitCount: 347,
      formatted: "347 New Schools",
      unit: {
        id: "school-construction",
        name: "New Schools",
        nameSingular: "New School",
        costPerUnit: 38000000,
        category: "buildings" as const,
      },
      dollarAmount: 13200000000,
    },
    headline: "F-35 Program = 347 New Schools",
    context:
      "The annual F-35 program budget could build 347 new public schools",
    source: "DoD Budget FY2025, School Construction Cost Index",
    priority: 90,
    isFeatured: true,
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
  },
  {
    id: "3",
    budgetItemId: "inaugural-balls",
    budgetItemName: "Trump Inaugural Balls",
    budgetAmount: 25000000,
    unit: {
      id: "healthcare-coverage",
      name: "People with Healthcare",
      nameSingular: "Person with Healthcare",
      costPerUnit: 8500,
      category: "everyday" as const,
      description: "Average annual ACA marketplace premium",
      icon: "🏥",
    },
    result: {
      unitCount: 2941,
      formatted: "2,941 People with Healthcare",
      unit: {
        id: "healthcare-coverage",
        name: "People with Healthcare",
        nameSingular: "Person with Healthcare",
        costPerUnit: 8500,
        category: "everyday" as const,
      },
      dollarAmount: 25000000,
    },
    headline: "Inaugural Balls = 2,941 with Healthcare",
    context:
      "The cost of Trump inaugural ballroom events could provide a year of healthcare for 2,941 people",
    source: "FEC Inaugural Committee Filings, Healthcare.gov Premium Data",
    priority: 95,
    isFeatured: true,
    createdAt: new Date("2025-01-29"),
    updatedAt: new Date("2025-01-29"),
  },
];

export default function HomePage() {
  const currentFiscalYear = 2025;
  const lastUpdated = new Date("2025-10-01"); // FY2025 ended Sept 30, 2025

  return (
    <HomePageClient
      budgetData={sampleBudgetData}
      budgetItems={sampleBudgetItems}
      featuredComparisons={sampleFeaturedComparisons}
      currentFiscalYear={currentFiscalYear}
      lastUpdated={lastUpdated}
    />
  );
}
