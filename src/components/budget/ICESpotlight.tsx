"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "@/lib/framer-client";
import { ICE_SPENDING_DATA } from "@/lib/mock-data/ice-spending";

interface ICESpotlightProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

function formatCurrency(amount: number): string {
  if (amount >= 1e12) return `$${(amount / 1e12).toFixed(2)}T`;
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
  return `$${amount.toLocaleString()}`;
}

function formatChange(amount: number, percent: number): string {
  const sign = amount > 0 ? "+" : "";
  return `${sign}${formatCurrency(Math.abs(amount))} (${sign}${percent.toFixed(1)}%)`;
}

export function ICESpotlight({
  isOpen = true,
  onClose,
  className = "",
}: ICESpotlightProps) {
  const [expanded, setExpanded] = useState(false);

  const data = ICE_SPENDING_DATA;
  const currentYear = data.historicalData.find((d) => d.year === 2025);
  const prevYear = data.historicalData.find((d) => d.year === 2024);

  const yoyChange =
    currentYear && prevYear
      ? currentYear.totalBudget - prevYear.totalBudget
      : 780_000_000;
  const yoyPercent =
    currentYear && prevYear ? (yoyChange / prevYear.totalBudget) * 100 : 8.9;

  // Find facility construction category for the big increase
  const facilityConstruction = data.categories.find(
    (c) => c.id === "facility-construction",
  );
  const enforcement = data.categories.find(
    (c) => c.id === "enforcement-removal",
  );

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-950/90 to-red-950/90 p-4 shadow-xl backdrop-blur-sm ${className}`}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20">
            <span className="text-lg">🚨</span>
          </div>
          <div>
            <h3 className="font-bold text-orange-100">ICE Budget Spotlight</h3>
            <p className="text-xs text-orange-300/70">
              FY2025 Immigration Enforcement
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-full p-1 text-orange-300/50 transition-colors hover:bg-orange-500/20 hover:text-orange-100"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Main Stats */}
      <div className="mb-4 rounded-lg bg-black/30 p-3">
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-orange-300/70">
          Total ICE Budget
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-white">
            {formatCurrency(data.totalBudget)}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-sm font-semibold text-red-400">
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            {yoyPercent.toFixed(1)}%
          </span>
        </div>
        <div className="mt-1 text-xs text-orange-200/60">
          +{formatCurrency(yoyChange)} from FY2024
        </div>
      </div>

      {/* Cost Per American */}
      <div className="mb-4 rounded-lg bg-black/30 p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-orange-300/70">Your Share</div>
            <div className="text-2xl font-bold text-white">$28.42</div>
            <div className="text-xs text-orange-200/50">
              per American per year
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-orange-300/70">Family of 4</div>
            <div className="text-xl font-bold text-orange-300">$113.68</div>
            <div className="text-xs text-orange-200/50">annual cost</div>
          </div>
        </div>
      </div>

      {/* What Else Could It Fund */}
      <div className="rounded-xl border border-green-500/20 bg-gradient-to-br from-green-950/40 to-emerald-950/40 p-3">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-base">💡</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-green-300">
            What $9.52B Could Fund Instead
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-black/30 p-2 text-center">
            <div className="text-lg">🏥</div>
            <div className="text-lg font-bold text-green-400">1.12M</div>
            <div className="text-[10px] leading-tight text-green-200/70">
              people with
              <br />
              healthcare
            </div>
          </div>

          <div className="rounded-lg bg-black/30 p-2 text-center">
            <div className="text-lg">🎓</div>
            <div className="text-lg font-bold text-blue-400">1.36M</div>
            <div className="text-[10px] leading-tight text-blue-200/70">
              student
              <br />
              Pell Grants
            </div>
          </div>

          <div className="rounded-lg bg-black/30 p-2 text-center">
            <div className="text-lg">👩‍🏫</div>
            <div className="text-lg font-bold text-purple-400">140K</div>
            <div className="text-[10px] leading-tight text-purple-200/70">
              teacher
              <br />
              salaries
            </div>
          </div>

          <div className="rounded-lg bg-black/30 p-2 text-center">
            <div className="text-lg">🏠</div>
            <div className="text-lg font-bold text-cyan-400">47.6K</div>
            <div className="text-[10px] leading-tight text-cyan-200/70">
              affordable
              <br />
              housing units
            </div>
          </div>
        </div>
      </div>

      {/* Key Increases - Collapsed */}
      <div className="mt-3 space-y-2">
        <div className="text-xs font-medium uppercase tracking-wider text-orange-300/70">
          Biggest Budget Increases
        </div>

        {/* Facility Construction */}
        {facilityConstruction && (
          <div className="rounded-lg bg-red-500/10 p-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-orange-100">
                Detention Facility Construction
              </span>
              <span className="text-sm font-bold text-red-400">
                +{facilityConstruction.yoyChangePercent.toFixed(0)}%
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-orange-200/60">
                {formatCurrency(facilityConstruction.amount)}
              </span>
              <span className="text-red-300/70">
                +{formatCurrency(facilityConstruction.yoyChange)}
              </span>
            </div>
          </div>
        )}

        {/* Enforcement */}
        {enforcement && (
          <div className="rounded-lg bg-orange-500/10 p-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-orange-100">
                Enforcement &amp; Removal
              </span>
              <span className="text-sm font-bold text-orange-400">
                +{enforcement.yoyChangePercent.toFixed(0)}%
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-orange-200/60">
                {formatCurrency(enforcement.amount)}
              </span>
              <span className="text-orange-300/70">
                +{formatCurrency(enforcement.yoyChange)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-orange-500/10 py-2 text-xs font-medium text-orange-200 transition-colors hover:bg-orange-500/20"
      >
        {expanded ? "Show Less" : "Show More Details"}
        <svg
          className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3 border-t border-orange-500/20 pt-3">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-black/20 p-2">
                  <div className="text-xs text-orange-300/70">
                    Daily Detainees
                  </div>
                  <div className="text-lg font-bold text-white">41,500</div>
                  <div className="text-xs text-orange-200/50">
                    avg population
                  </div>
                </div>
                <div className="rounded-lg bg-black/20 p-2">
                  <div className="text-xs text-orange-300/70">
                    Cost Per Detainee
                  </div>
                  <div className="text-lg font-bold text-white">$150.75</div>
                  <div className="text-xs text-orange-200/50">per day</div>
                </div>
                <div className="rounded-lg bg-black/20 p-2">
                  <div className="text-xs text-orange-300/70">
                    Annual Per Person
                  </div>
                  <div className="text-lg font-bold text-white">$55,024</div>
                  <div className="text-xs text-orange-200/50">
                    detention cost
                  </div>
                </div>
                <div className="rounded-lg bg-black/20 p-2">
                  <div className="text-xs text-orange-300/70">
                    Alternative Cost
                  </div>
                  <div className="text-lg font-bold text-green-400">$4.12</div>
                  <div className="text-xs text-green-300/50">
                    per day (97% less)
                  </div>
                </div>
              </div>

              {/* Historical Trend */}
              <div>
                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-orange-300/70">
                  5-Year Budget Trend
                </div>
                <div className="flex items-end justify-between gap-1">
                  {data.historicalData.slice(-5).map((year) => {
                    const maxBudget = Math.max(
                      ...data.historicalData.map((d) => d.totalBudget),
                    );
                    const height = (year.totalBudget / maxBudget) * 100;
                    const isCurrentYear = year.year === 2025;

                    return (
                      <div
                        key={year.year}
                        className="flex flex-1 flex-col items-center gap-1"
                      >
                        <div
                          className={`w-full rounded-t ${isCurrentYear ? "bg-orange-500" : "bg-orange-500/40"}`}
                          style={{ height: `${height * 0.6}px` }}
                        />
                        <span
                          className={`text-[10px] ${isCurrentYear ? "font-bold text-orange-200" : "text-orange-300/50"}`}
                        >
                          {year.year.toString().slice(-2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Source */}
              <div className="text-[10px] text-orange-300/40">
                Source: DHS Budget FY2025, Congressional Appropriations
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ICESpotlight;
