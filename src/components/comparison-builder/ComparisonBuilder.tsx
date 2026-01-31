"use client";

import { useState, useMemo, useCallback } from "react";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockUnits } from "@/lib/mock-data/units";
import ComparisonResult from "./ComparisonResult";
import ShareButtons from "./ShareButtons";

// ============================================================================
// Types
// ============================================================================

interface SpendingItem {
  id: string;
  name: string;
  amount: number;
  source?: string;
  year?: string;
  category?: string;
}

interface ComparisonUnit {
  id: string;
  name: string;
  namePlural: string;
  cost: number;
  icon?: string;
  category?: string;
  description?: string;
}

interface Alternative {
  unit: ComparisonUnit;
  result: number;
  label: string;
}

// ============================================================================
// Mock Data - Spending Items
// ============================================================================

const SPENDING_ITEMS: SpendingItem[] = [
  {
    id: "defense",
    name: "Defense Department",
    amount: 886_000_000_000,
    source: "USAspending.gov",
    year: "FY2024",
    category: "department",
  },
  {
    id: "hhs",
    name: "Health & Human Services",
    amount: 1_700_000_000_000,
    source: "USAspending.gov",
    year: "FY2024",
    category: "department",
  },
  {
    id: "education",
    name: "Department of Education",
    amount: 79_000_000_000,
    source: "USAspending.gov",
    year: "FY2024",
    category: "department",
  },
  {
    id: "nasa",
    name: "NASA",
    amount: 25_000_000_000,
    source: "USAspending.gov",
    year: "FY2024",
    category: "agency",
  },
  {
    id: "va",
    name: "Veterans Affairs",
    amount: 301_000_000_000,
    source: "USAspending.gov",
    year: "FY2024",
    category: "department",
  },
  {
    id: "transportation",
    name: "Transportation",
    amount: 104_000_000_000,
    source: "USAspending.gov",
    year: "FY2024",
    category: "department",
  },
  {
    id: "f35-program",
    name: "F-35 Program (annual)",
    amount: 12_000_000_000,
    source: "DoD Budget",
    year: "FY2024",
    category: "program",
  },
  {
    id: "social-security",
    name: "Social Security",
    amount: 1_400_000_000_000,
    source: "SSA",
    year: "FY2024",
    category: "program",
  },
];

// ============================================================================
// Comparison Engine - Smart Matching
// ============================================================================

/**
 * Convert mockUnits to the local ComparisonUnit format
 */
function convertMockUnits(): ComparisonUnit[] {
  return mockUnits.map((unit) => ({
    id: unit.id,
    name: unit.nameSingular || unit.name,
    namePlural: unit.name,
    cost: unit.costPerUnit || 0,
    icon: unit.icon,
    category: unit.category,
    description: unit.description,
  }));
}

/**
 * Find the best matching unit for a given spending amount
 * Aims for a result between 10 and 10,000 for human comprehension
 */
function findBestMatch(
  amount: number,
  units: ComparisonUnit[],
  excludeIds: string[] = [],
): ComparisonUnit | null {
  const availableUnits = units.filter(
    (u) => !excludeIds.includes(u.id) && u.cost > 0,
  );

  if (availableUnits.length === 0) return null;

  // Score each unit based on how "readable" the result would be
  const scored = availableUnits.map((unit) => {
    const result = amount / unit.cost;

    // Ideal range: 10 to 10,000 (easy to grasp)
    let score = 0;

    if (result >= 10 && result <= 10000) {
      // Perfect range - highest score
      score = 100;
      // Prefer results closer to 100-1000
      if (result >= 100 && result <= 1000) {
        score = 150;
      }
    } else if (result >= 1 && result < 10) {
      // Small but acceptable
      score = 50;
    } else if (result > 10000 && result <= 1000000) {
      // Large but still comprehensible
      score = 40;
    } else if (result > 1000000) {
      // Very large - less ideal
      score = 10;
    } else {
      // Less than 1 - not great
      score = 5;
    }

    return { unit, result, score };
  });

  // Sort by score descending, then by result being closer to 100
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // Prefer results closer to 100
    const aDistance = Math.abs(Math.log10(a.result) - 2);
    const bDistance = Math.abs(Math.log10(b.result) - 2);
    return aDistance - bDistance;
  });

  return scored[0]?.unit || null;
}

/**
 * Find the best spending item for a given unit
 */
function findBestSpending(
  unit: ComparisonUnit,
  spendingItems: SpendingItem[],
): SpendingItem | null {
  if (unit.cost === 0) return null;

  const scored = spendingItems.map((item) => {
    const result = item.amount / unit.cost;

    let score = 0;
    if (result >= 10 && result <= 10000) {
      score = 100;
      if (result >= 100 && result <= 1000) {
        score = 150;
      }
    } else if (result >= 1 && result < 10) {
      score = 50;
    } else if (result > 10000 && result <= 1000000) {
      score = 40;
    } else {
      score = 10;
    }

    return { item, result, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aDistance = Math.abs(Math.log10(a.result) - 2);
    const bDistance = Math.abs(Math.log10(b.result) - 2);
    return aDistance - bDistance;
  });

  return scored[0]?.item || null;
}

/**
 * Get alternative comparisons for the current spending amount
 */
function getAlternatives(
  amount: number,
  units: ComparisonUnit[],
  currentUnitId: string,
  limit: number = 3,
): Alternative[] {
  const alternatives: Alternative[] = [];
  const excludeIds = [currentUnitId];

  for (let i = 0; i < limit; i++) {
    const unit = findBestMatch(amount, units, excludeIds);
    if (!unit) break;

    const result = Math.floor(amount / unit.cost);
    alternatives.push({
      unit,
      result,
      label: `${formatNumber(result)} ${result === 1 ? unit.name : unit.namePlural}`,
    });
    excludeIds.push(unit.id);
  }

  return alternatives;
}

// ============================================================================
// Formatting Utilities
// ============================================================================

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000_000) {
    return `$${(amount / 1_000_000_000_000).toFixed(1)}T`;
  }
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
}

function formatNumber(num: number): string {
  return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

// ============================================================================
// Sub-Components
// ============================================================================

interface SelectorInputProps {
  type: "spending" | "unit";
  value: string | null;
  onChange: (value: string) => void;
  spendingItems: SpendingItem[];
  units: ComparisonUnit[];
  placeholder?: string;
  disabled?: boolean;
}

function SelectorInput({
  type,
  value,
  onChange,
  spendingItems,
  units,
  placeholder,
  disabled = false,
}: SelectorInputProps) {
  if (type === "spending") {
    const groupedItems = spendingItems.reduce(
      (acc, item) => {
        const category = item.category || "other";
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
      },
      {} as Record<string, SpendingItem[]>,
    );

    const categoryLabels: Record<string, string> = {
      department: "Departments",
      agency: "Agencies",
      program: "Programs",
      other: "Other",
    };

    return (
      <Select value={value || ""} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full h-12 text-base">
          <SelectValue placeholder={placeholder || "Select spending item..."} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(groupedItems).map(([category, items]) => (
            <SelectGroup key={category}>
              <SelectLabel>{categoryLabels[category] || category}</SelectLabel>
              {items.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  <span className="flex items-center justify-between gap-4 w-full">
                    <span className="truncate">{item.name}</span>
                    <span className="text-muted-foreground text-sm whitespace-nowrap">
                      {formatCurrency(item.amount)}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Unit selector
  const categoryLabels: Record<string, string> = {
    infrastructure: "Infrastructure",
    everyday: "Everyday Items",
    vehicles: "Vehicles",
    buildings: "Buildings",
    misc: "Salaries & Income",
  };

  const groupedUnits = units.reduce(
    (acc, unit) => {
      const category = unit.category || "misc";
      if (!acc[category]) acc[category] = [];
      acc[category].push(unit);
      return acc;
    },
    {} as Record<string, ComparisonUnit[]>,
  );

  return (
    <Select value={value || ""} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full h-12 text-base">
        <SelectValue placeholder={placeholder || "Select comparison unit..."} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(groupedUnits).map(([category, categoryUnits]) => (
          <SelectGroup key={category}>
            <SelectLabel>{categoryLabels[category] || category}</SelectLabel>
            {categoryUnits.map((unit) => (
              <SelectItem key={unit.id} value={unit.id}>
                <span className="flex items-center gap-2">
                  {unit.icon && <span>{unit.icon}</span>}
                  <span className="truncate">{unit.namePlural}</span>
                  <span className="text-muted-foreground text-xs ml-auto">
                    {formatCurrency(unit.cost)}/ea
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}

interface AlternativesPanelProps {
  alternatives: Alternative[];
  onSelect: (unitId: string) => void;
}

function AlternativesPanel({ alternatives, onSelect }: AlternativesPanelProps) {
  if (alternatives.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">
        Or compare to...
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {alternatives.map((alt) => (
          <button
            key={alt.unit.id}
            onClick={() => onSelect(alt.unit.id)}
            className={cn(
              "group relative p-4 rounded-lg border bg-card text-left",
              "hover:border-primary/50 hover:bg-accent/50 transition-all",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            )}
          >
            <div className="flex items-start gap-3">
              {alt.unit.icon && (
                <span className="text-2xl">{alt.unit.icon}</span>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-lg truncate">
                  {formatNumber(alt.result)}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {alt.result === 1 ? alt.unit.name : alt.unit.namePlural}
                </p>
              </div>
            </div>
            <ArrowRight
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 size-4",
                "text-muted-foreground/50 group-hover:text-primary transition-colors",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function ComparisonBuilder() {
  // State
  const [selectedSpendingId, setSelectedSpendingId] = useState<string | null>(
    null,
  );
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  // Convert mock units to local format
  const units = useMemo(() => convertMockUnits(), []);

  // Get selected items
  const selectedSpending = useMemo(
    () => SPENDING_ITEMS.find((s) => s.id === selectedSpendingId) || null,
    [selectedSpendingId],
  );

  const selectedUnit = useMemo(
    () => units.find((u) => u.id === selectedUnitId) || null,
    [units, selectedUnitId],
  );

  // Calculate result
  const result = useMemo(() => {
    if (!selectedSpending || !selectedUnit || selectedUnit.cost === 0) {
      return null;
    }
    return Math.floor(selectedSpending.amount / selectedUnit.cost);
  }, [selectedSpending, selectedUnit]);

  // Get alternatives
  const alternatives = useMemo(() => {
    if (!selectedSpending || !selectedUnitId) return [];
    return getAlternatives(selectedSpending.amount, units, selectedUnitId, 3);
  }, [selectedSpending, selectedUnitId, units]);

  // Auto-fill logic
  const handleSpendingChange = useCallback(
    (id: string) => {
      setSelectedSpendingId(id);
      setIsAutoFilled(false);

      const spending = SPENDING_ITEMS.find((s) => s.id === id);
      if (spending && !selectedUnitId) {
        const bestUnit = findBestMatch(spending.amount, units);
        if (bestUnit) {
          setSelectedUnitId(bestUnit.id);
          setIsAutoFilled(true);
        }
      }
    },
    [selectedUnitId, units],
  );

  const handleUnitChange = useCallback(
    (id: string) => {
      setSelectedUnitId(id);
      setIsAutoFilled(false);

      const unit = units.find((u) => u.id === id);
      if (unit && !selectedSpendingId) {
        const bestSpending = findBestSpending(unit, SPENDING_ITEMS);
        if (bestSpending) {
          setSelectedSpendingId(bestSpending.id);
          setIsAutoFilled(true);
        }
      }
    },
    [selectedSpendingId, units],
  );

  const handleAlternativeSelect = useCallback((unitId: string) => {
    setSelectedUnitId(unitId);
    setIsAutoFilled(false);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedSpendingId(null);
    setSelectedUnitId(null);
    setIsAutoFilled(false);
  }, []);

  const handleSurpriseMe = useCallback(() => {
    // Pick a random spending item
    const randomSpending =
      SPENDING_ITEMS[Math.floor(Math.random() * SPENDING_ITEMS.length)];
    setSelectedSpendingId(randomSpending.id);

    // Find best matching unit
    const bestUnit = findBestMatch(randomSpending.amount, units);
    if (bestUnit) {
      setSelectedUnitId(bestUnit.id);
    }
    setIsAutoFilled(true);
  }, [units]);

  // Show result if we have both selections
  const showResult = selectedSpending && selectedUnit && result !== null;

  return (
    <Card className="w-full overflow-hidden">
      {/* Hero Header */}
      <CardHeader className="bg-gradient-to-br from-primary/5 via-primary/10 to-transparent pb-8">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
              Budget Reality Check
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Translate federal spending into terms you can understand
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSurpriseMe}
            className="hidden sm:flex gap-2"
          >
            <Sparkles className="size-4" />
            Surprise Me
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Selector Interface */}
        <div className="space-y-6">
          {/* Two-column selector grid */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
            {/* Spending Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Federal Spending
              </label>
              <SelectorInput
                type="spending"
                value={selectedSpendingId}
                onChange={handleSpendingChange}
                spendingItems={SPENDING_ITEMS}
                units={units}
                placeholder="Choose a budget item..."
              />
            </div>

            {/* Equals Arrow */}
            <div className="hidden md:flex items-center justify-center px-4">
              <div className="flex flex-col items-center gap-1">
                <ArrowRight className="size-6 text-primary" />
                <span className="text-xs text-muted-foreground font-medium">
                  equals
                </span>
              </div>
            </div>

            {/* Unit Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Compare To
              </label>
              <SelectorInput
                type="unit"
                value={selectedUnitId}
                onChange={handleUnitChange}
                spendingItems={SPENDING_ITEMS}
                units={units}
                placeholder="Choose a comparison..."
              />
            </div>
          </div>

          {/* Auto-fill indicator */}
          {isAutoFilled && (
            <p className="text-sm text-muted-foreground text-center">
              <Sparkles className="inline size-3 mr-1" />
              We picked a great comparison for you. Change it anytime!
            </p>
          )}

          {/* Mobile Surprise Me button */}
          <div className="flex sm:hidden justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSurpriseMe}
              className="gap-2"
            >
              <Sparkles className="size-4" />
              Surprise Me
            </Button>
          </div>
        </div>

        {/* Result Display */}
        {showResult && (
          <div className="space-y-6">
            <ComparisonResult
              spendingItem={{
                name: selectedSpending.name,
                amount: selectedSpending.amount,
                source: selectedSpending.source,
                year: selectedSpending.year,
              }}
              unit={{
                name: selectedUnit.name,
                namePlural: selectedUnit.namePlural,
                cost: selectedUnit.cost,
                icon: selectedUnit.icon,
              }}
              result={result}
            />

            {/* Alternatives Panel */}
            <AlternativesPanel
              alternatives={alternatives}
              onSelect={handleAlternativeSelect}
            />

            {/* Share Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Share this comparison
              </p>
              <ShareButtons
                spendingId={selectedSpendingId || ""}
                unitId={selectedUnitId || ""}
              />
            </div>

            {/* Reset Button */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="size-4" />
                Start Over
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!showResult && (
          <div className="text-center py-12">
            <div className="mx-auto mb-4 size-16 rounded-full bg-muted/50 flex items-center justify-center">
              <ArrowRight className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Pick something to compare
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Select a federal spending item or a comparison unit to get
              started. We&apos;ll automatically suggest a great match for the
              other side.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
