"use client";

import { useMemo } from "react";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { BudgetTable } from "@/components/budget/BudgetTable";
import {
  BudgetSummaryCards,
  BudgetSummaryData,
} from "@/components/budget/BudgetSummaryCards";
import { BudgetPieChart } from "@/components/budget/BudgetPieChart";
import { formatCurrency } from "@/lib/format";
import { ChevronRight } from "lucide-react";
import type { BudgetItem, BudgetHierarchy } from "@/types/budget";
import type { BudgetSpendingItem } from "@/lib/data";

interface BudgetOverviewClientProps {
  departmentItems: BudgetSpendingItem[];
}

// US population for per capita calculation (2025 estimate)
const US_POPULATION = 336_000_000;

export function BudgetOverviewClient({
  departmentItems,
}: BudgetOverviewClientProps) {
  // Calculate summary data
  const summaryData: BudgetSummaryData = useMemo(() => {
    const totalBudget = departmentItems.reduce(
      (sum, item) => sum + item.amount,
      0,
    );

    // Find largest department
    const sorted = [...departmentItems].sort((a, b) => b.amount - a.amount);
    const largest = sorted[0];

    return {
      totalBudget,
      largestDepartmentName: largest?.name || "N/A",
      largestDepartmentAmount: largest?.amount || 0,
      yearOverYearChange: 4.0, // FY2025 estimated 4% increase
      perCapita: Math.round(totalBudget / US_POPULATION),
      fiscalYear: 2025,
      previousFiscalYear: 2024,
    };
  }, [departmentItems]);

  // Convert BudgetSpendingItem to BudgetItem for table
  const tableItems: BudgetItem[] = useMemo(() => {
    const total = departmentItems.reduce((sum, item) => sum + item.amount, 0);

    return departmentItems.map((item) => ({
      id: item.id,
      name: item.name,
      amount: item.amount,
      parentId: null,
      fiscalYear: item.fiscalYear,
      percentOfParent: (item.amount / total) * 100,
      yearOverYearChange: null, // Could be calculated if we had prior year data
    }));
  }, [departmentItems]);

  // Convert to BudgetHierarchy for pie chart
  const budgetHierarchy: BudgetHierarchy = useMemo(() => {
    return {
      totalAmount: summaryData.totalBudget,
      fiscalYear: 2025,
      departments: departmentItems.map((item) => ({
        id: item.id,
        name: item.name,
        amount: item.amount,
        parentId: "federal-budget",
        fiscalYear: item.fiscalYear,
        percentOfParent: (item.amount / summaryData.totalBudget) * 100,
        yearOverYearChange: null,
        agencies: [],
      })),
    };
  }, [departmentItems, summaryData.totalBudget]);

  // Main content - Pie chart above table
  const mainContent = (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Federal Budget Overview
        </h1>
        <p className="mt-1 text-slate-400">
          FY2025 Federal Spending by Department
        </p>
      </div>

      {/* Pie Chart */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-6">
        <BudgetPieChart
          data={budgetHierarchy}
          height={400}
          onItemClick={() => {}}
          onItemHover={() => {}}
        />
      </div>

      {/* Budget Table */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/50">
        <BudgetTable
          budgetItems={tableItems}
          basePath="/budget"
          showPercentOfTotal={true}
          showYoYChange={false}
          className="border-0"
        />
      </div>
    </div>
  );

  // Side content - Summary cards and quick links
  const sideContent = (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-5">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
          Budget Summary
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-400">Total Budget</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(summaryData.totalBudget, { compact: true })}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Per Capita</p>
            <p className="text-xl font-semibold text-white">
              {formatCurrency(summaryData.perCapita)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Largest Department</p>
            <p className="font-medium text-white">
              {summaryData.largestDepartmentName}
            </p>
            <p className="text-sm text-slate-500">
              {formatCurrency(summaryData.largestDepartmentAmount, {
                compact: true,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-5">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
          Quick Links
        </h3>
        <div className="space-y-2">
          <Link
            href="/compare"
            className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            Compare Spending
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            Build a Comparison
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Data Source */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-5">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Data Source
        </h3>
        <p className="text-sm text-slate-400">
          Budget data from the Congressional Budget Office and USAspending.gov
          for Fiscal Year 2025.
        </p>
        <a
          href="https://www.usaspending.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm text-blue-400 hover:text-blue-300"
        >
          View source data
        </a>
      </div>
    </div>
  );

  // Secondary content - Summary cards (full width below on desktop)
  const secondaryContent = (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-6">
      <BudgetSummaryCards data={summaryData} />
    </div>
  );

  return (
    <PageLayout
      mainModule={mainContent}
      sideContent={sideContent}
      secondaryContent={secondaryContent}
    />
  );
}

export default BudgetOverviewClient;
