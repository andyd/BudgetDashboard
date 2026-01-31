"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ComparisonUnit } from "@/types/comparison";

interface BrowseUnitsModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when the modal should close */
  onClose: () => void;
  /** Callback when a unit is selected */
  onSelect: (unit: ComparisonUnit) => void;
  /** Available comparison units */
  units: ComparisonUnit[];
}

/** Category configuration for display */
const CATEGORY_CONFIG: Record<
  string,
  { displayName: string; icon: string; order: number }
> = {
  healthcare: { displayName: "Healthcare", icon: "🏥", order: 1 },
  education: { displayName: "Education", icon: "🎓", order: 2 },
  housing: { displayName: "Housing", icon: "🏠", order: 3 },
  infrastructure: { displayName: "Infrastructure", icon: "🏗️", order: 4 },
  transportation: { displayName: "Transportation", icon: "🚗", order: 5 },
  environment: { displayName: "Environment", icon: "🌳", order: 6 },
  "public-services": { displayName: "Public Services", icon: "🏛️", order: 7 },
  salary: { displayName: "Salaries", icon: "💰", order: 8 },
  income: { displayName: "Income", icon: "💵", order: 9 },
  everyday: { displayName: "Everyday Items", icon: "🛒", order: 10 },
  food: { displayName: "Food", icon: "🍔", order: 11 },
  entertainment: { displayName: "Entertainment", icon: "🎬", order: 12 },
  products: { displayName: "Products", icon: "📦", order: 13 },
  vehicles: { displayName: "Vehicles", icon: "🚙", order: 14 },
  buildings: { displayName: "Buildings", icon: "🏢", order: 15 },
  misc: { displayName: "Miscellaneous", icon: "📊", order: 16 },
  general: { displayName: "General", icon: "📋", order: 17 },
};

/** Format cost for display */
function formatCost(cost: number): string {
  if (cost < 1) {
    return `$${cost.toFixed(2)}`;
  }
  if (cost >= 1_000_000_000) {
    return `$${(cost / 1_000_000_000).toFixed(1)}B`;
  }
  if (cost >= 1_000_000) {
    return `$${(cost / 1_000_000).toFixed(1)}M`;
  }
  if (cost >= 1_000) {
    return `$${(cost / 1_000).toFixed(1)}K`;
  }
  return `$${cost.toLocaleString()}`;
}

/**
 * Full browsing modal for all comparison units
 * Features search, category tabs, and a scrollable list
 */
export function BrowseUnitsModal({
  isOpen,
  onClose,
  onSelect,
  units,
}: BrowseUnitsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Get unique categories from units
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(units.map((unit) => unit.category))];
    return uniqueCategories.sort(
      (a, b) =>
        (CATEGORY_CONFIG[a]?.order ?? 99) - (CATEGORY_CONFIG[b]?.order ?? 99),
    );
  }, [units]);

  // Filter units based on search and category
  const filteredUnits = useMemo(() => {
    let result = units;

    // Filter by category if not "all"
    if (activeCategory !== "all") {
      result = result.filter((unit) => unit.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (unit) =>
          unit.name.toLowerCase().includes(query) ||
          unit.nameSingular?.toLowerCase().includes(query) ||
          unit.description?.toLowerCase().includes(query),
      );
    }

    return result;
  }, [units, activeCategory, searchQuery]);

  // Group filtered units by category
  const groupedUnits = useMemo(() => {
    if (activeCategory !== "all") {
      return { [activeCategory]: filteredUnits };
    }

    return filteredUnits.reduce(
      (acc, unit) => {
        const category = unit.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(unit);
        return acc;
      },
      {} as Record<string, ComparisonUnit[]>,
    );
  }, [filteredUnits, activeCategory]);

  // Handle unit selection
  const handleSelect = (unit: ComparisonUnit) => {
    onSelect(unit);
    onClose();
    setSearchQuery("");
    setActiveCategory("all");
  };

  // Handle modal close
  const handleClose = () => {
    onClose();
    setSearchQuery("");
    setActiveCategory("all");
  };

  // Get cost from unit (handling both costPerUnit and cost properties)
  const getUnitCost = (unit: ComparisonUnit): number => {
    return unit.costPerUnit ?? unit.cost ?? 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Browse Comparison Units</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col overflow-hidden">
          {/* Search input */}
          <div className="border-b px-6 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search units..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category tabs */}
          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="flex-1 overflow-hidden"
          >
            <div className="overflow-x-auto border-b px-6 py-2">
              <TabsList className="h-auto w-auto flex-wrap gap-1">
                <TabsTrigger value="all" className="text-xs px-3 py-1.5">
                  All
                </TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="text-xs px-3 py-1.5"
                  >
                    <span className="mr-1">
                      {CATEGORY_CONFIG[category]?.icon ?? "📋"}
                    </span>
                    {CATEGORY_CONFIG[category]?.displayName ?? category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Scrollable units list */}
            <TabsContent value={activeCategory} className="m-0 overflow-hidden">
              <div className="max-h-[50vh] overflow-y-auto px-6 py-4">
                {filteredUnits.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <p>No units found</p>
                    {searchQuery && (
                      <p className="mt-1 text-sm">
                        Try a different search term
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedUnits)
                      .sort(
                        ([a], [b]) =>
                          (CATEGORY_CONFIG[a]?.order ?? 99) -
                          (CATEGORY_CONFIG[b]?.order ?? 99),
                      )
                      .map(([category, categoryUnits]) => (
                        <div key={category}>
                          {activeCategory === "all" && (
                            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                              <span>
                                {CATEGORY_CONFIG[category]?.icon ?? "📋"}
                              </span>
                              {CATEGORY_CONFIG[category]?.displayName ??
                                category}
                            </h3>
                          )}
                          <div className="grid gap-2">
                            {categoryUnits.map((unit) => (
                              <button
                                key={unit.id}
                                type="button"
                                onClick={() => handleSelect(unit)}
                                className="flex w-full items-center gap-3 rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              >
                                {/* Icon */}
                                <span
                                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xl"
                                  aria-hidden="true"
                                >
                                  {unit.icon ?? "📊"}
                                </span>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-medium truncate">
                                      {unit.name}
                                    </span>
                                    <span className="text-sm font-semibold text-primary whitespace-nowrap">
                                      {formatCost(getUnitCost(unit))}
                                      {unit.period &&
                                        unit.period !== "unit" && (
                                          <span className="text-muted-foreground font-normal">
                                            /{unit.period}
                                          </span>
                                        )}
                                    </span>
                                  </div>
                                  {unit.description && (
                                    <p className="mt-0.5 text-sm text-muted-foreground truncate">
                                      {unit.description}
                                    </p>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer with count */}
          <div className="border-t px-6 py-3 text-center text-sm text-muted-foreground">
            {filteredUnits.length} unit{filteredUnits.length !== 1 ? "s" : ""}{" "}
            available
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BrowseUnitsModal;
