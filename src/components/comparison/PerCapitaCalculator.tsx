"use client";

import * as React from "react";
import { motion } from "@/lib/framer-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import { US_POPULATION } from "@/constants";

// State population data (2023 estimates, US Census Bureau)
const STATE_POPULATIONS: Record<string, { name: string; population: number }> =
  {
    US: { name: "United States (Total)", population: US_POPULATION },
    CA: { name: "California", population: 39_029_342 },
    TX: { name: "Texas", population: 30_029_572 },
    FL: { name: "Florida", population: 22_244_823 },
    NY: { name: "New York", population: 19_677_151 },
    PA: { name: "Pennsylvania", population: 12_972_008 },
    IL: { name: "Illinois", population: 12_582_032 },
    OH: { name: "Ohio", population: 11_756_058 },
    GA: { name: "Georgia", population: 10_912_876 },
    NC: { name: "North Carolina", population: 10_698_973 },
    MI: { name: "Michigan", population: 10_037_261 },
    NJ: { name: "New Jersey", population: 9_290_841 },
    VA: { name: "Virginia", population: 8_642_274 },
    WA: { name: "Washington", population: 7_785_786 },
    AZ: { name: "Arizona", population: 7_359_197 },
    MA: { name: "Massachusetts", population: 7_001_399 },
    TN: { name: "Tennessee", population: 7_051_339 },
    IN: { name: "Indiana", population: 6_833_037 },
    MO: { name: "Missouri", population: 6_177_957 },
    MD: { name: "Maryland", population: 6_164_660 },
    WI: { name: "Wisconsin", population: 5_892_539 },
    CO: { name: "Colorado", population: 5_839_926 },
    MN: { name: "Minnesota", population: 5_717_184 },
    SC: { name: "South Carolina", population: 5_282_634 },
    AL: { name: "Alabama", population: 5_074_296 },
    LA: { name: "Louisiana", population: 4_590_241 },
    KY: { name: "Kentucky", population: 4_512_310 },
    OR: { name: "Oregon", population: 4_240_137 },
    OK: { name: "Oklahoma", population: 4_019_800 },
    CT: { name: "Connecticut", population: 3_626_205 },
    UT: { name: "Utah", population: 3_380_800 },
    IA: { name: "Iowa", population: 3_200_517 },
    NV: { name: "Nevada", population: 3_177_772 },
    AR: { name: "Arkansas", population: 3_045_637 },
    MS: { name: "Mississippi", population: 2_940_057 },
    KS: { name: "Kansas", population: 2_937_150 },
    NM: { name: "New Mexico", population: 2_113_344 },
    NE: { name: "Nebraska", population: 1_967_923 },
    ID: { name: "Idaho", population: 1_939_033 },
    WV: { name: "West Virginia", population: 1_770_071 },
    HI: { name: "Hawaii", population: 1_440_196 },
    NH: { name: "New Hampshire", population: 1_395_231 },
    ME: { name: "Maine", population: 1_385_340 },
    RI: { name: "Rhode Island", population: 1_095_962 },
    MT: { name: "Montana", population: 1_122_867 },
    DE: { name: "Delaware", population: 1_018_396 },
    SD: { name: "South Dakota", population: 909_824 },
    ND: { name: "North Dakota", population: 779_261 },
    AK: { name: "Alaska", population: 733_583 },
    DC: { name: "District of Columbia", population: 671_803 },
    VT: { name: "Vermont", population: 647_064 },
    WY: { name: "Wyoming", population: 576_851 },
  };

// Median household income (2023, US Census Bureau)
const MEDIAN_HOUSEHOLD_INCOME = 74_580;

// Average hourly wage calculation (assuming 2,080 work hours per year)
const HOURS_PER_YEAR = 2_080;
const MEDIAN_HOURLY_WAGE = MEDIAN_HOUSEHOLD_INCOME / HOURS_PER_YEAR;

type TimeFrame = "daily" | "weekly" | "monthly" | "yearly";

interface TimeBreakdown {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

interface PerCapitaCalculatorProps {
  /** Initial budget amount in dollars */
  initialAmount?: number;
  /** Additional CSS classes */
  className?: string;
}

export function PerCapitaCalculator({
  initialAmount = 0,
  className,
}: PerCapitaCalculatorProps) {
  const [budgetAmount, setBudgetAmount] = React.useState<number>(initialAmount);
  const [selectedState, setSelectedState] = React.useState<string>("US");
  const [inputValue, setInputValue] = React.useState<string>(
    initialAmount > 0 ? initialAmount.toString() : "",
  );

  // Get population for selected state
  const population =
    STATE_POPULATIONS[selectedState]?.population ?? US_POPULATION;
  const stateName = STATE_POPULATIONS[selectedState]?.name ?? "United States";

  // Calculate per-person share
  const perPersonShare = budgetAmount / population;

  // Calculate time breakdown
  const timeBreakdown: TimeBreakdown = {
    yearly: perPersonShare,
    monthly: perPersonShare / 12,
    weekly: perPersonShare / 52,
    daily: perPersonShare / 365,
  };

  // Calculate comparison to median income
  const percentOfMedianIncome =
    (perPersonShare / MEDIAN_HOUSEHOLD_INCOME) * 100;
  const monthsOfIncome = perPersonShare / (MEDIAN_HOUSEHOLD_INCOME / 12);

  // Calculate "time to earn" (how long it takes median worker to earn this amount)
  const hoursToEarn = perPersonShare / MEDIAN_HOURLY_WAGE;
  const daysToEarn = hoursToEarn / 8; // 8-hour workday
  const weeksToEarn = daysToEarn / 5; // 5-day workweek

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setInputValue(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setBudgetAmount(numValue);
    } else if (value === "") {
      setBudgetAmount(0);
    }
  };

  // Format time to earn display
  const formatTimeToEarn = (): string => {
    if (hoursToEarn < 1) {
      const minutes = Math.round(hoursToEarn * 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } else if (hoursToEarn < 8) {
      const hours = Math.round(hoursToEarn * 10) / 10;
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    } else if (daysToEarn < 5) {
      const days = Math.round(daysToEarn * 10) / 10;
      return `${days} work day${days !== 1 ? "s" : ""}`;
    } else if (weeksToEarn < 52) {
      const weeks = Math.round(weeksToEarn * 10) / 10;
      return `${weeks} work week${weeks !== 1 ? "s" : ""}`;
    } else {
      const years = Math.round((weeksToEarn / 52) * 10) / 10;
      return `${years} year${years !== 1 ? "s" : ""}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "relative overflow-hidden",
          "bg-gradient-to-br from-emerald-50 via-white to-teal-50",
          "dark:from-emerald-950/20 dark:via-gray-950 dark:to-teal-950/20",
          "border-emerald-200/60 dark:border-emerald-800/40",
          "shadow-lg",
          className,
        )}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />

        <CardHeader className="relative border-b border-emerald-200/40 dark:border-emerald-800/40">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="text-2xl" role="img" aria-label="Calculator">
              🧮
            </span>
            Per Capita Calculator
          </CardTitle>
        </CardHeader>

        <CardContent className="relative space-y-6 pt-6">
          {/* Input Section */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="budget-amount">Budget Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="budget-amount"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter amount..."
                  value={inputValue}
                  onChange={handleInputChange}
                  className="pl-7"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state-select">Population Scope</Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger id="state-select" className="w-full">
                  <SelectValue placeholder="Select scope..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States (Total)</SelectItem>
                  {Object.entries(STATE_POPULATIONS)
                    .filter(([code]) => code !== "US")
                    .sort((a, b) => a[1].name.localeCompare(b[1].name))
                    .map(([code, { name }]) => (
                      <SelectItem key={code} value={code}>
                        {name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Per-Person Share Display */}
          {budgetAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="space-y-4"
            >
              {/* Main Result */}
              <div className="text-center py-6 px-4 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-emerald-200/40 dark:border-emerald-800/40">
                <div className="text-sm text-muted-foreground mb-1">
                  Per-person share in {stateName}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(perPersonShare, {
                    showCents: perPersonShare < 1000,
                  })}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Population: {population.toLocaleString()}
                </div>
              </div>

              {/* Time Breakdown */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Time Breakdown
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(Object.entries(timeBreakdown) as [TimeFrame, number][]).map(
                    ([period, amount]) => (
                      <div
                        key={period}
                        className="text-center p-3 rounded-lg bg-white/30 dark:bg-gray-900/30 border border-emerald-200/30 dark:border-emerald-800/30"
                      >
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(amount, { showCents: amount < 100 })}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {period}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Median Income Comparison */}
              <div className="space-y-3 pt-4 border-t border-emerald-200/40 dark:border-emerald-800/40">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Compared to Median Income
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="p-4 rounded-lg bg-white/30 dark:bg-gray-900/30 border border-emerald-200/30 dark:border-emerald-800/30">
                    <div className="text-2xl font-bold text-teal-700 dark:text-teal-400">
                      {percentOfMedianIncome.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      of median household income
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      ({formatCurrency(MEDIAN_HOUSEHOLD_INCOME)}/year)
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white/30 dark:bg-gray-900/30 border border-emerald-200/30 dark:border-emerald-800/30">
                    <div className="text-2xl font-bold text-teal-700 dark:text-teal-400">
                      {monthsOfIncome >= 1
                        ? `${monthsOfIncome.toFixed(1)} mo`
                        : `${(monthsOfIncome * 30).toFixed(0)} days`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      of income equivalent
                    </div>
                  </div>
                </div>
              </div>

              {/* Time to Earn */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/40 dark:border-amber-800/40">
                <div className="flex items-center gap-3">
                  <span className="text-3xl" role="img" aria-label="Clock">
                    ⏱️
                  </span>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Time for median worker to earn this
                    </div>
                    <div className="text-xl font-bold text-amber-700 dark:text-amber-400">
                      {formatTimeToEarn()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      at{" "}
                      {formatCurrency(MEDIAN_HOURLY_WAGE, { showCents: true })}
                      /hour
                    </div>
                  </div>
                </div>
              </div>

              {/* Source Attribution */}
              <div className="text-xs text-muted-foreground text-center pt-2">
                Population data: US Census Bureau (2023 estimates) | Median
                income: $74,580 (2023)
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {budgetAmount === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <span
                className="text-4xl mb-2 block"
                role="img"
                aria-label="Arrow up"
              >
                👆
              </span>
              <p>Enter a budget amount to see per-person calculations</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
