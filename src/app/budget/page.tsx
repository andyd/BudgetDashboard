import { Metadata } from "next";
import { BudgetOverviewClient } from "./BudgetOverviewClient";
import { DEPARTMENT_ITEMS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Federal Budget Overview - Explore All Departments & Programs",
  description:
    "Browse the complete FY2025 federal budget hierarchy. View spending by department, explore programs, and visualize data through interactive charts and tables.",
  openGraph: {
    title: "Federal Budget Overview - Explore All Departments & Programs",
    description:
      "Browse the complete FY2025 federal budget hierarchy. View spending by department, explore programs, and visualize data through interactive charts.",
    url: "https://budget-dashboard.vercel.app/budget",
    siteName: "Federal Budget Dashboard",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Federal Budget Overview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Federal Budget Overview",
    description:
      "Browse the complete FY2025 federal budget hierarchy with interactive visualizations.",
    images: ["/og-image.png"],
  },
  keywords: [
    "federal budget",
    "government spending",
    "department budget",
    "program funding",
    "budget breakdown",
    "fiscal year 2025",
    "budget visualization",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function BudgetOverviewPage() {
  return <BudgetOverviewClient departmentItems={DEPARTMENT_ITEMS} />;
}
