"use client";

import * as React from "react";
import { SearchIcon, XIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface SpendingItem {
  id: string;
  name: string;
  amount: number;
  tier: "department" | "program" | "current-event";
  parentId?: string;
  fiscalYear: number;
  source: string;
  description: string;
}

interface BrowseSpendingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: SpendingItem) => void;
  items?: SpendingItem[];
}

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000_000) {
    return `$${(amount / 1_000_000_000_000).toFixed(2)}T`;
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
  return `$${amount.toLocaleString()}`;
}

function getTierLabel(tier: SpendingItem["tier"]): string {
  switch (tier) {
    case "department":
      return "Departments";
    case "program":
      return "Programs";
    case "current-event":
      return "Current Events";
    default:
      return tier;
  }
}

function getTierColor(tier: SpendingItem["tier"]): string {
  switch (tier) {
    case "department":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
    case "program":
      return "bg-green-500/10 text-green-700 dark:text-green-400";
    case "current-event":
      return "bg-orange-500/10 text-orange-700 dark:text-orange-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

// Default sample data - in production this would come from props
const DEFAULT_ITEMS: SpendingItem[] = [
  {
    id: "dept-defense",
    name: "Department of Defense",
    amount: 895_000_000_000,
    tier: "department",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Military personnel, operations, maintenance, procurement, research and development.",
  },
  {
    id: "dept-hhs",
    name: "Health & Human Services",
    amount: 1_802_000_000_000,
    tier: "department",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description:
      "Medicare, Medicaid, CHIP, NIH, CDC, FDA, and other health programs.",
  },
  {
    id: "dept-ssa",
    name: "Social Security Administration",
    amount: 1_500_000_000_000,
    tier: "department",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description: "Old-Age and Survivors Insurance, Disability Insurance, SSI.",
  },
  {
    id: "prog-medicare",
    name: "Medicare",
    amount: 850_000_000_000,
    tier: "program",
    parentId: "dept-hhs",
    fiscalYear: 2025,
    source: "Congressional Budget Office",
    description: "Federal health insurance for Americans aged 65 and older.",
  },
  {
    id: "prog-f35",
    name: "F-35 Fighter Program",
    amount: 13_200_000_000,
    tier: "program",
    parentId: "dept-defense",
    fiscalYear: 2025,
    source: "Department of Defense FY2025 Budget",
    description: "Procurement of the F-35 Lightning II Joint Strike Fighter.",
  },
  {
    id: "prog-ice-total",
    name: "ICE Total Budget",
    amount: 9_520_000_000,
    tier: "program",
    parentId: "dept-dhs",
    fiscalYear: 2025,
    source: "Department of Homeland Security Budget",
    description: "Immigration and Customs Enforcement operations.",
  },
  {
    id: "event-trump-inaugural-balls",
    name: "Trump Inaugural Balls",
    amount: 25_000_000,
    tier: "current-event",
    fiscalYear: 2025,
    source: "Presidential Inaugural Committee",
    description: "Official inaugural balls and celebration events.",
  },
  {
    id: "event-air-force-one",
    name: "Air Force One Operating Cost",
    amount: 200_000_000,
    tier: "current-event",
    fiscalYear: 2025,
    source: "U.S. Air Force",
    description: "Annual operating and maintenance costs for Air Force One.",
  },
];

export default function BrowseSpendingModal({
  isOpen,
  onClose,
  onSelect,
  items = DEFAULT_ITEMS,
}: BrowseSpendingModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<
    "all" | SpendingItem["tier"]
  >("all");

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setActiveTab("all");
    }
  }, [isOpen]);

  // Filter items based on search and tab
  const filteredItems = React.useMemo(() => {
    let filtered = items;

    // Filter by tier if not "all"
    if (activeTab !== "all") {
      filtered = filtered.filter((item) => item.tier === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );
    }

    // Sort by amount descending
    return filtered.sort((a, b) => b.amount - a.amount);
  }, [items, activeTab, searchQuery]);

  // Group items by tier for display
  const groupedItems = React.useMemo(() => {
    if (activeTab !== "all") {
      return { [activeTab]: filteredItems };
    }

    return filteredItems.reduce(
      (acc, item) => {
        if (!acc[item.tier]) {
          acc[item.tier] = [];
        }
        acc[item.tier].push(item);
        return acc;
      },
      {} as Record<SpendingItem["tier"], SpendingItem[]>,
    );
  }, [filteredItems, activeTab]);

  const handleSelect = (item: SpendingItem) => {
    onSelect(item);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent, item: SpendingItem) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(item);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Browse Spending Items</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search departments, programs, or events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Search spending items"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>

        {/* Tabs for filtering by tier */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as typeof activeTab)}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="department">Departments</TabsTrigger>
            <TabsTrigger value="program">Programs</TabsTrigger>
            <TabsTrigger value="current-event">Events</TabsTrigger>
          </TabsList>

          {/* Scrollable list of items */}
          <TabsContent value={activeTab} className="mt-4">
            <div
              className="overflow-y-auto max-h-[50vh] space-y-4 pr-2"
              role="listbox"
              aria-label="Spending items"
            >
              {filteredItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No items found matching your search.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveTab("all");
                    }}
                    className="mt-2 text-primary hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : activeTab === "all" ? (
                // Grouped display when showing all
                Object.entries(groupedItems).map(([tier, tierItems]) => (
                  <div key={tier} className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background py-1">
                      {getTierLabel(tier as SpendingItem["tier"])} (
                      {tierItems.length})
                    </h3>
                    <div className="space-y-1">
                      {tierItems.map((item) => (
                        <SpendingItemRow
                          key={item.id}
                          item={item}
                          onSelect={handleSelect}
                          onKeyDown={handleKeyDown}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Flat list when filtering by tier
                <div className="space-y-1">
                  {filteredItems.map((item) => (
                    <SpendingItemRow
                      key={item.id}
                      item={item}
                      onSelect={handleSelect}
                      onKeyDown={handleKeyDown}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer with count */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Showing {filteredItems.length} of {items.length} items
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Extracted row component for better organization
function SpendingItemRow({
  item,
  onSelect,
  onKeyDown,
}: {
  item: SpendingItem;
  onSelect: (item: SpendingItem) => void;
  onKeyDown: (e: React.KeyboardEvent, item: SpendingItem) => void;
}) {
  return (
    <div
      role="option"
      tabIndex={0}
      onClick={() => onSelect(item)}
      onKeyDown={(e) => onKeyDown(e, item)}
      className={cn(
        "flex items-center justify-between gap-4 p-3 rounded-lg border",
        "cursor-pointer transition-colors",
        "hover:bg-accent hover:border-accent-foreground/20",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
      aria-selected={false}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{item.name}</span>
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full shrink-0",
              getTierColor(item.tier),
            )}
          >
            {item.tier === "current-event"
              ? "Event"
              : item.tier.charAt(0).toUpperCase() + item.tier.slice(1)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate mt-0.5">
          {item.description}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-semibold tabular-nums">
          {formatCurrency(item.amount)}
        </p>
        <p className="text-xs text-muted-foreground">FY{item.fiscalYear}</p>
      </div>
    </div>
  );
}
