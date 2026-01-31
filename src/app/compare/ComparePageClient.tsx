"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpDown,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ALL_BUDGET_ITEMS, ALL_COMPARISON_UNITS } from "@/lib/data";
import { calculateComparison } from "@/lib/comparison-engine";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Budget tier display names
const BUDGET_TIER_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "department", label: "Departments" },
  { value: "program", label: "Programs" },
  { value: "current-event", label: "Current Events" },
] as const;

// Get unique unit categories from the data
const UNIT_CATEGORY_OPTIONS = [
  { value: "all", label: "All Unit Categories" },
  ...Array.from(new Set(ALL_COMPARISON_UNITS.map((u) => u.category)))
    .sort()
    .map((cat) => ({
      value: cat,
      label: cat
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    })),
];

// Sort options
const SORT_OPTIONS = [
  { value: "count-desc", label: "Count: High to Low" },
  { value: "count-asc", label: "Count: Low to High" },
  { value: "amount-desc", label: "Amount: High to Low" },
  { value: "amount-asc", label: "Amount: Low to High" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
] as const;

const ITEMS_PER_PAGE = 20;

interface ComparisonItem {
  budgetItem: (typeof ALL_BUDGET_ITEMS)[0];
  unit: (typeof ALL_COMPARISON_UNITS)[0];
  count: number;
  formatted: string;
}

/**
 * Format large currency values for display
 */
function formatCurrencyCompact(amount: number): string {
  if (amount >= 1_000_000_000_000) {
    return `$${(amount / 1_000_000_000_000).toFixed(2)}T`;
  } else if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  } else if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  } else if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
}

/**
 * Explore All Comparisons Client Component
 *
 * Displays all possible comparisons between budget items and comparison units
 * with filtering, search, sorting, and pagination.
 */
export function ComparePageClient() {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [budgetTierFilter, setBudgetTierFilter] = useState("all");
  const [unitCategoryFilter, setUnitCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<string>("count-desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Generate all comparisons
  const allComparisons = useMemo(() => {
    const comparisons: ComparisonItem[] = [];

    for (const budgetItem of ALL_BUDGET_ITEMS) {
      for (const unit of ALL_COMPARISON_UNITS) {
        const result = calculateComparison(budgetItem.amount, unit);
        comparisons.push({
          budgetItem,
          unit,
          count: result.count,
          formatted: result.formatted,
        });
      }
    }

    return comparisons;
  }, []);

  // Filter and sort comparisons
  const filteredComparisons = useMemo(() => {
    let filtered = allComparisons;

    // Filter by budget tier
    if (budgetTierFilter !== "all") {
      filtered = filtered.filter((c) => c.budgetItem.tier === budgetTierFilter);
    }

    // Filter by unit category
    if (unitCategoryFilter !== "all") {
      filtered = filtered.filter((c) => c.unit.category === unitCategoryFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.budgetItem.name.toLowerCase().includes(query) ||
          c.unit.name.toLowerCase().includes(query) ||
          (c.unit.description?.toLowerCase().includes(query) ?? false) ||
          (c.budgetItem.description?.toLowerCase().includes(query) ?? false),
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "count-desc":
          return b.count - a.count;
        case "count-asc":
          return a.count - b.count;
        case "amount-desc":
          return b.budgetItem.amount - a.budgetItem.amount;
        case "amount-asc":
          return a.budgetItem.amount - b.budgetItem.amount;
        case "name-asc":
          return a.budgetItem.name.localeCompare(b.budgetItem.name);
        case "name-desc":
          return b.budgetItem.name.localeCompare(a.budgetItem.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    allComparisons,
    budgetTierFilter,
    unitCategoryFilter,
    searchQuery,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredComparisons.length / ITEMS_PER_PAGE);
  const paginatedComparisons = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredComparisons.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredComparisons, currentPage]);

  // Reset to page 1 when filters change
  const handleFilterChange = <T extends string>(
    setter: React.Dispatch<React.SetStateAction<T>>,
    value: T,
  ) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Explore All Comparisons
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Browse and discover {allComparisons.length.toLocaleString()}{" "}
            possible comparisons between federal budget items and tangible
            units.
          </p>
        </div>

        {/* Filters Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="size-5" />
              Filters & Search
            </CardTitle>
            <CardDescription>
              Narrow down comparisons by category, search term, or sort order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Search */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search budget items or units..."
                  value={searchQuery}
                  onChange={(e) =>
                    handleFilterChange(setSearchQuery, e.target.value)
                  }
                  className="pl-10"
                />
              </div>

              {/* Budget Tier Filter */}
              <Select
                value={budgetTierFilter}
                onValueChange={(value) =>
                  handleFilterChange(setBudgetTierFilter, value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Budget Category" />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_TIER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Unit Category Filter */}
              <Select
                value={unitCategoryFilter}
                onValueChange={(value) =>
                  handleFilterChange(setUnitCategoryFilter, value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Unit Category" />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort and Results Info */}
            <div className="mt-4 flex flex-col items-start justify-between gap-4 border-t pt-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="size-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {paginatedComparisons.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {filteredComparisons.length.toLocaleString()}
                </span>{" "}
                comparisons
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Results Grid */}
        {paginatedComparisons.length === 0 ? (
          <div className="rounded-lg border bg-muted/50 p-12 text-center">
            <p className="text-lg text-muted-foreground">
              No comparisons found matching your criteria.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setBudgetTierFilter("all");
                setUnitCategoryFilter("all");
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedComparisons.map((comparison) => (
              <Link
                key={`${comparison.budgetItem.id}-${comparison.unit.id}`}
                href={`/compare/${comparison.budgetItem.id}/${comparison.unit.id}`}
                className="group block"
              >
                <Card className="h-full transition-all duration-200 hover:border-primary/50 hover:shadow-md group-hover:scale-[1.01]">
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2 text-base">
                      {comparison.budgetItem.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {formatCurrencyCompact(comparison.budgetItem.amount)} (FY
                      {comparison.budgetItem.fiscalYear})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {comparison.unit.icon && (
                          <span className="text-lg">
                            {comparison.unit.icon}
                          </span>
                        )}
                        <span className="text-sm text-muted-foreground">
                          equals
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-primary">
                        {comparison.formatted}
                      </p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {comparison.unit.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="mr-1 size-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {/* Show page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className="size-8 p-0"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-1 text-muted-foreground">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="size-8 p-0"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>
        )}

        {/* Data Source Attribution */}
        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>
            Budget data sourced from{" "}
            <a
              href="https://www.usaspending.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-foreground"
            >
              USAspending.gov
            </a>
            {". "}
            Comparison unit costs based on publicly available data.
          </p>
        </div>
      </div>
    </div>
  );
}
