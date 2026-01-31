"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ExternalLink, DollarSign } from "lucide-react";
import { ALL_COMPARISON_UNITS } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ComparisonUnit } from "@/types/comparison";

/**
 * Category display configuration
 */
const CATEGORY_CONFIG: Record<string, { label: string; description: string }> =
  {
    healthcare: {
      label: "Healthcare",
      description: "Medical costs, insurance, and health services",
    },
    housing: {
      label: "Housing",
      description: "Rent, mortgages, and housing expenses",
    },
    education: {
      label: "Education",
      description: "Tuition, student loans, and educational costs",
    },
    food: {
      label: "Food",
      description: "Meals, groceries, and food assistance",
    },
    transportation: {
      label: "Transportation",
      description: "Vehicles, public transit, and travel costs",
    },
    income: {
      label: "Income",
      description: "Salaries, wages, and household income",
    },
    "public-services": {
      label: "Public Services",
      description: "Government services and infrastructure",
    },
    veterans: {
      label: "Veterans",
      description: "Veterans benefits and services",
    },
    environment: {
      label: "Environment",
      description: "Environmental programs and conservation",
    },
    infrastructure: {
      label: "Infrastructure",
      description: "Roads, bridges, and public works",
    },
    everyday: {
      label: "Everyday",
      description: "Common household items and expenses",
    },
    vehicles: {
      label: "Vehicles",
      description: "Cars, trucks, and transportation equipment",
    },
    buildings: {
      label: "Buildings",
      description: "Construction and real estate",
    },
    entertainment: {
      label: "Entertainment",
      description: "Recreation and leisure activities",
    },
    products: {
      label: "Products",
      description: "Consumer goods and merchandise",
    },
    salary: {
      label: "Salary",
      description: "Employment and compensation",
    },
    general: {
      label: "General",
      description: "Miscellaneous comparison units",
    },
    misc: {
      label: "Miscellaneous",
      description: "Other comparison units",
    },
  };

/**
 * Get category display info with fallback
 */
function getCategoryInfo(category: string): {
  label: string;
  description: string;
} {
  return (
    CATEGORY_CONFIG[category] || {
      label:
        category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " "),
      description: `${category} related comparison units`,
    }
  );
}

/**
 * Group units by category
 */
function groupUnitsByCategory(
  units: ComparisonUnit[],
): Record<string, ComparisonUnit[]> {
  return units.reduce(
    (acc, unit) => {
      const category = unit.category || "misc";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(unit);
      return acc;
    },
    {} as Record<string, ComparisonUnit[]>,
  );
}

/**
 * Get the cost value from a unit (handles both cost and costPerUnit)
 */
function getUnitCost(unit: ComparisonUnit): number {
  return unit.costPerUnit ?? unit.cost ?? 0;
}

/**
 * UnitCard component for displaying a single comparison unit
 */
function UnitCard({ unit }: { unit: ComparisonUnit }) {
  const cost = getUnitCost(unit);
  const displayName = unit.nameSingular || unit.name;

  return (
    <Link href={`/units/${unit.id}`} className="block">
      <Card className="h-full transition-all duration-200 hover:border-primary/50 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-tight">
              {displayName}
            </CardTitle>
            {unit.icon && (
              <span className="text-lg" role="img" aria-hidden="true">
                {unit.icon}
              </span>
            )}
          </div>
          <CardDescription className="line-clamp-2 text-sm">
            {unit.description || `Cost comparison unit for ${unit.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-lg font-semibold text-primary">
              <DollarSign className="size-4" />
              {formatCurrency(cost)}
            </div>
            {unit.period && unit.period !== "unit" && (
              <Badge variant="secondary" className="text-xs">
                per {unit.period}
              </Badge>
            )}
          </div>
          {unit.source && (
            <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
              Source: {unit.source}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * Units Browse Page Client Component
 *
 * Displays all comparison units grouped by category with search functionality.
 * Each unit links to its detail page for building comparisons.
 */
export function UnitsPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Group units by category
  const unitsByCategory = useMemo(
    () => groupUnitsByCategory(ALL_COMPARISON_UNITS),
    [],
  );

  // Get sorted category keys
  const categories = useMemo(
    () => Object.keys(unitsByCategory).sort(),
    [unitsByCategory],
  );

  // Filter units based on search query
  const filteredUnits = useMemo(() => {
    if (!searchQuery.trim()) {
      return activeTab === "all"
        ? ALL_COMPARISON_UNITS
        : unitsByCategory[activeTab] || [];
    }

    const query = searchQuery.toLowerCase();
    const unitsToFilter =
      activeTab === "all"
        ? ALL_COMPARISON_UNITS
        : unitsByCategory[activeTab] || [];

    return unitsToFilter.filter(
      (unit) =>
        unit.name.toLowerCase().includes(query) ||
        unit.nameSingular?.toLowerCase().includes(query) ||
        unit.description?.toLowerCase().includes(query) ||
        unit.source?.toLowerCase().includes(query),
    );
  }, [searchQuery, activeTab, unitsByCategory]);

  // Group filtered units by category for display
  const filteredByCategory = useMemo(
    () => groupUnitsByCategory(filteredUnits),
    [filteredUnits],
  );

  return (
    <>
      {/* Hero Section */}
      <section className="from-background via-background to-muted/20 relative overflow-hidden bg-gradient-to-br py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-center">
            <Badge variant="secondary" className="mb-4">
              Comparison Units
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Browse Comparison Units
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Explore our library of comparison units to translate federal
              spending into real-world terms you can understand.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="border-b bg-background py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search units by name, description, or source..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Results count */}
            <p className="text-sm text-muted-foreground">
              {filteredUnits.length} unit{filteredUnits.length !== 1 ? "s" : ""}{" "}
              {searchQuery && "found"}
            </p>
          </div>
        </div>
      </section>

      {/* Category Tabs and Units Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-8 flex h-auto flex-wrap gap-2">
              <TabsTrigger value="all" className="px-4">
                All ({ALL_COMPARISON_UNITS.length})
              </TabsTrigger>
              {categories.map((category) => {
                const info = getCategoryInfo(category);
                const count = unitsByCategory[category]?.length || 0;
                return (
                  <TabsTrigger key={category} value={category} className="px-4">
                    {info.label} ({count})
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* All Units Tab */}
            <TabsContent value="all" className="mt-0">
              {searchQuery ? (
                // Show flat grid when searching
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredUnits.map((unit) => (
                    <UnitCard key={unit.id} unit={unit} />
                  ))}
                </div>
              ) : (
                // Show grouped by category when not searching
                <div className="space-y-12">
                  {categories.map((category) => {
                    const units = unitsByCategory[category] || [];
                    const info = getCategoryInfo(category);
                    return (
                      <div key={category}>
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold">{info.label}</h2>
                          <p className="text-muted-foreground">
                            {info.description}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {units.map((unit) => (
                            <UnitCard key={unit.id} unit={unit} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Individual Category Tabs */}
            {categories.map((category) => {
              const info = getCategoryInfo(category);
              const units = filteredByCategory[category] || [];
              return (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold">{info.label}</h2>
                    <p className="text-muted-foreground">{info.description}</p>
                  </div>
                  {units.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {units.map((unit) => (
                        <UnitCard key={unit.id} unit={unit} />
                      ))}
                    </div>
                  ) : (
                    <Card className="py-12 text-center">
                      <CardContent>
                        <p className="text-muted-foreground">
                          No units found matching your search in this category.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>

          {/* Empty State */}
          {filteredUnits.length === 0 && (
            <Card className="py-12 text-center">
              <CardContent>
                <Search className="mx-auto mb-4 size-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No units found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search query or browse a different
                  category.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-xl">
                Ready to Build a Comparison?
              </CardTitle>
              <CardDescription>
                Select any unit above to start comparing federal spending to
                real-world costs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/#compare"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Go to Comparison Builder
                <ExternalLink className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
