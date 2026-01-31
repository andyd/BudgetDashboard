/**
 * DepartmentComparison Component
 *
 * Side-by-side comparison of two federal departments showing budget amounts,
 * percentage differences, sub-programs, and year-over-year changes.
 * Uses Recharts for bar chart visualization.
 */

"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEPARTMENT_ITEMS, getItemsByParent } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import type { BudgetSpendingItem } from "@/lib/data";
import {
  ArrowUp,
  ArrowDown,
  Minus,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

// Color scheme for the two departments
const COLORS = {
  dept1: "hsl(221, 83%, 53%)", // Blue
  dept2: "hsl(262, 83%, 58%)", // Purple
  positive: "hsl(142, 76%, 36%)", // Green
  negative: "hsl(0, 84%, 60%)", // Red
  neutral: "hsl(220, 9%, 46%)", // Gray
};

interface DepartmentComparisonProps {
  /** Initial department 1 ID */
  initialDept1Id?: string;
  /** Initial department 2 ID */
  initialDept2Id?: string;
  /** Custom class name */
  className?: string;
}

interface ComparisonChartData {
  name: string;
  dept1Amount: number;
  dept2Amount: number;
  dept1Name: string;
  dept2Name: string;
}

/**
 * Calculate percentage difference between two values
 */
function calculatePercentDiff(value1: number, value2: number): number {
  if (value2 === 0) return value1 > 0 ? 100 : 0;
  return ((value1 - value2) / value2) * 100;
}

/**
 * Format YoY change with appropriate sign and styling info
 */
function formatYoYChange(change: number | null): {
  text: string;
  isPositive: boolean;
  isNeutral: boolean;
} {
  if (change === null || change === undefined) {
    return { text: "N/A", isPositive: false, isNeutral: true };
  }
  const isPositive = change > 0;
  const isNeutral = change === 0;
  const text = `${isPositive ? "+" : ""}${change.toFixed(1)}%`;
  return { text, isPositive, isNeutral };
}

/**
 * Custom tooltip for the comparison bar chart
 */
function ComparisonTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    payload: ComparisonChartData;
  }>;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div className="rounded-lg border bg-background p-3 shadow-lg">
      <p className="mb-2 font-semibold text-foreground">{data.name}</p>
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded"
            style={{ backgroundColor: COLORS.dept1 }}
          />
          <span className="text-muted-foreground">{data.dept1Name}:</span>
          <span className="font-medium">
            {formatCurrency(data.dept1Amount, { compact: true })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded"
            style={{ backgroundColor: COLORS.dept2 }}
          />
          <span className="text-muted-foreground">{data.dept2Name}:</span>
          <span className="font-medium">
            {formatCurrency(data.dept2Amount, { compact: true })}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Sub-program list component
 */
function SubProgramList({
  programs,
  departmentName,
  color,
}: {
  programs: BudgetSpendingItem[];
  departmentName: string;
  color: string;
}) {
  if (programs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No sub-programs available
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium" style={{ color }}>
        {departmentName} Programs
      </h4>
      <ul className="space-y-1.5">
        {programs.slice(0, 5).map((program) => (
          <li
            key={program.id}
            className="flex items-center justify-between text-sm"
          >
            <span className="truncate text-foreground">{program.name}</span>
            <span className="ml-2 shrink-0 text-muted-foreground">
              {formatCurrency(program.amount, { compact: true })}
            </span>
          </li>
        ))}
        {programs.length > 5 && (
          <li className="text-xs text-muted-foreground">
            +{programs.length - 5} more programs
          </li>
        )}
      </ul>
    </div>
  );
}

/**
 * YoY change comparison component
 */
function YoYComparison({
  dept1,
  dept2,
}: {
  dept1: BudgetSpendingItem | null;
  dept2: BudgetSpendingItem | null;
}) {
  // For demonstration, using mock YoY data since the data structure
  // doesn't include actual YoY changes for departments
  const mockYoY: Record<string, number> = {
    "dept-defense": 3.2,
    "dept-hhs": 5.1,
    "dept-ssa": 4.8,
    "dept-treasury": 8.5,
    "dept-va": 6.2,
    "dept-usda": -1.3,
    "dept-dhs": 7.4,
    "dept-dot": 2.1,
    "dept-hud": -0.5,
    "dept-state": 1.8,
    "dept-energy": 4.3,
    "dept-justice": 2.9,
    "dept-education": -2.1,
    "dept-nasa": 5.6,
    "dept-epa": -3.2,
  };

  const dept1YoY = dept1 ? (mockYoY[dept1.id] ?? null) : null;
  const dept2YoY = dept2 ? (mockYoY[dept2.id] ?? null) : null;

  const dept1Change = formatYoYChange(dept1YoY);
  const dept2Change = formatYoYChange(dept2YoY);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-lg border p-3">
        <div className="mb-1 text-xs text-muted-foreground">
          {dept1?.name ?? "Department 1"} YoY
        </div>
        <div className="flex items-center gap-1.5">
          {dept1Change.isNeutral ? (
            <Minus className="h-4 w-4 text-muted-foreground" />
          ) : dept1Change.isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span
            className={`text-lg font-semibold ${
              dept1Change.isNeutral
                ? "text-muted-foreground"
                : dept1Change.isPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
            }`}
          >
            {dept1Change.text}
          </span>
        </div>
      </div>
      <div className="rounded-lg border p-3">
        <div className="mb-1 text-xs text-muted-foreground">
          {dept2?.name ?? "Department 2"} YoY
        </div>
        <div className="flex items-center gap-1.5">
          {dept2Change.isNeutral ? (
            <Minus className="h-4 w-4 text-muted-foreground" />
          ) : dept2Change.isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          <span
            className={`text-lg font-semibold ${
              dept2Change.isNeutral
                ? "text-muted-foreground"
                : dept2Change.isPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
            }`}
          >
            {dept2Change.text}
          </span>
        </div>
      </div>
    </div>
  );
}

export function DepartmentComparison({
  initialDept1Id = "dept-defense",
  initialDept2Id = "dept-hhs",
  className = "",
}: DepartmentComparisonProps) {
  const [dept1Id, setDept1Id] = useState(initialDept1Id);
  const [dept2Id, setDept2Id] = useState(initialDept2Id);

  // Get selected departments
  const dept1 = useMemo(
    () => DEPARTMENT_ITEMS.find((d) => d.id === dept1Id) ?? null,
    [dept1Id],
  );
  const dept2 = useMemo(
    () => DEPARTMENT_ITEMS.find((d) => d.id === dept2Id) ?? null,
    [dept2Id],
  );

  // Get sub-programs for each department
  const dept1Programs = useMemo(
    () => (dept1Id ? getItemsByParent(dept1Id) : []),
    [dept1Id],
  );
  const dept2Programs = useMemo(
    () => (dept2Id ? getItemsByParent(dept2Id) : []),
    [dept2Id],
  );

  // Calculate percentage difference
  const percentDiff = useMemo(() => {
    if (!dept1 || !dept2) return null;
    return calculatePercentDiff(dept1.amount, dept2.amount);
  }, [dept1, dept2]);

  // Prepare chart data
  const chartData = useMemo<ComparisonChartData[]>(() => {
    if (!dept1 || !dept2) return [];
    return [
      {
        name: "Budget Comparison",
        dept1Amount: dept1.amount,
        dept2Amount: dept2.amount,
        dept1Name: dept1.name,
        dept2Name: dept2.name,
      },
    ];
  }, [dept1, dept2]);

  // Handle department selection
  const handleDept1Change = useCallback((value: string) => {
    setDept1Id(value);
  }, []);

  const handleDept2Change = useCallback((value: string) => {
    setDept2Id(value);
  }, []);

  // Format difference message
  const diffMessage = useMemo(() => {
    if (percentDiff === null || !dept1 || !dept2) return null;
    const absDiff = Math.abs(percentDiff);
    const isLarger = percentDiff > 0;
    const comparison = isLarger ? "larger" : "smaller";
    return {
      text: `${dept1.name} is ${absDiff.toFixed(1)}% ${comparison} than ${dept2.name}`,
      isLarger,
      dollarDiff: Math.abs(dept1.amount - dept2.amount),
    };
  }, [percentDiff, dept1, dept2]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Department Comparison</CardTitle>
        <CardDescription>
          Compare budgets, sub-programs, and year-over-year changes between two
          departments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Department Selectors */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Department 1
            </label>
            <Select value={dept1Id} onValueChange={handleDept1Change}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENT_ITEMS.map((dept) => (
                  <SelectItem
                    key={dept.id}
                    value={dept.id}
                    disabled={dept.id === dept2Id}
                  >
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Department 2
            </label>
            <Select value={dept2Id} onValueChange={handleDept2Change}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENT_ITEMS.map((dept) => (
                  <SelectItem
                    key={dept.id}
                    value={dept.id}
                    disabled={dept.id === dept1Id}
                  >
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Budget Amounts Display */}
        {dept1 && dept2 && (
          <div className="grid grid-cols-2 gap-4">
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: `${COLORS.dept1}15` }}
            >
              <div className="text-sm text-muted-foreground">{dept1.name}</div>
              <div
                className="text-2xl font-bold"
                style={{ color: COLORS.dept1 }}
              >
                {formatCurrency(dept1.amount, { compact: true })}
              </div>
            </div>
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: `${COLORS.dept2}15` }}
            >
              <div className="text-sm text-muted-foreground">{dept2.name}</div>
              <div
                className="text-2xl font-bold"
                style={{ color: COLORS.dept2 }}
              >
                {formatCurrency(dept2.amount, { compact: true })}
              </div>
            </div>
          </div>
        )}

        {/* Percentage Difference */}
        {diffMessage && (
          <div className="flex items-center justify-center gap-2 rounded-lg border bg-muted/30 p-4">
            {diffMessage.isLarger ? (
              <ArrowUp className="h-5 w-5 text-green-500" />
            ) : (
              <ArrowDown className="h-5 w-5 text-red-500" />
            )}
            <span className="text-center">
              <span className="font-medium">{diffMessage.text}</span>
              <span className="ml-2 text-muted-foreground">
                ({formatCurrency(diffMessage.dollarDiff, { compact: true })}{" "}
                difference)
              </span>
            </span>
          </div>
        )}

        {/* Bar Chart Comparison */}
        {chartData.length > 0 && (
          <div
            className="w-full"
            role="img"
            aria-label={`Bar chart comparing ${dept1?.name} and ${dept2?.name} budgets`}
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={chartData}
                layout="horizontal"
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <XAxis type="category" dataKey="name" hide />
                <YAxis
                  type="number"
                  tickFormatter={(value) =>
                    formatCurrency(value, { compact: true })
                  }
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <Tooltip content={<ComparisonTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 16 }}
                  formatter={(value) => (
                    <span className="text-sm text-foreground">{value}</span>
                  )}
                />
                <Bar
                  dataKey="dept1Amount"
                  name={dept1?.name ?? "Department 1"}
                  fill={COLORS.dept1}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={80}
                />
                <Bar
                  dataKey="dept2Amount"
                  name={dept2?.name ?? "Department 2"}
                  fill={COLORS.dept2}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={80}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* YoY Change Comparison */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">
            Year-over-Year Change (FY2024 to FY2025)
          </h3>
          <YoYComparison dept1={dept1} dept2={dept2} />
        </div>

        {/* Sub-Programs Lists */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <SubProgramList
            programs={dept1Programs}
            departmentName={dept1?.name ?? "Department 1"}
            color={COLORS.dept1}
          />
          <SubProgramList
            programs={dept2Programs}
            departmentName={dept2?.name ?? "Department 2"}
            color={COLORS.dept2}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default DepartmentComparison;
