"use client";

import { memo } from "react";
import { formatCurrency } from "@/lib/format";
import {
  getCategoryName,
  getCategoryBudgetTotal,
  type PriorityCategory,
  type WastefulCategory,
} from "@/lib/wizard-categories";
import { Sparkles } from "lucide-react";

interface PrioritySummaryProps {
  /** Categories user wants more investment in */
  priorities: PriorityCategory[];
  /** Categories user thinks are wasteful */
  wasteful: WastefulCategory[];
  /** User's single top priority */
  topPriority: PriorityCategory;
}

/**
 * PrioritySummary
 *
 * Displays a two-column summary of the user's wizard answers at the top
 * of the results page. Shows which categories they selected with real
 * budget amounts, and highlights their top priority.
 */
export const PrioritySummary = memo<PrioritySummaryProps>(
  function PrioritySummary({ priorities, wasteful, topPriority }) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/50 via-slate-900/80 to-slate-950/50 p-4 sm:p-6 md:p-8">
        <h2 className="mb-6 text-xl font-bold text-white md:text-2xl">
          Your Budget Priorities
        </h2>

        {/* Two-column layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: Want More Investment */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              You want more in:
            </h3>
            <ul className="space-y-2">
              {priorities.map((category) => {
                const total = getCategoryBudgetTotal(category);
                const isTop = category === topPriority;

                return (
                  <li
                    key={category}
                    className="flex items-start justify-between gap-4 rounded-lg bg-slate-800/50 p-3"
                  >
                    <div className="flex items-start gap-2">
                      {isTop && (
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                      )}
                      <span
                        className={
                          isTop ? "font-semibold text-white" : "text-slate-300"
                        }
                      >
                        {getCategoryName(category)}
                      </span>
                    </div>
                    <span className="shrink-0 text-sm text-slate-500">
                      {formatCurrency(total, { compact: true })}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right: Think is Too Much */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              You think is too much:
            </h3>
            <ul className="space-y-2">
              {wasteful.map((category) => {
                const total = getCategoryBudgetTotal(category);

                return (
                  <li
                    key={category}
                    className="flex items-start justify-between gap-4 rounded-lg bg-slate-800/50 p-3"
                  >
                    <span className="text-slate-300">
                      {getCategoryName(category)}
                    </span>
                    <span className="shrink-0 text-sm text-slate-500">
                      {formatCurrency(total, { compact: true })}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Top Priority Callout */}
        <div className="mt-6 rounded-lg border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <p className="text-sm font-medium text-slate-300">
              Your #1 Priority:{" "}
              <span className="font-bold text-white">
                {getCategoryName(topPriority)}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  },
);
