"use client";

import { motion } from "@/lib/framer-client";
import { ICE_SPENDING_DATA } from "@/lib/mock-data/ice-spending";

interface ICESpotlightProps {
  className?: string;
}

function formatCurrency(amount: number): string {
  if (amount >= 1e12) return `$${(amount / 1e12).toFixed(2)}T`;
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
  return `$${amount.toLocaleString()}`;
}

export function ICESpotlight({ className = "" }: ICESpotlightProps) {
  const data = ICE_SPENDING_DATA;
  const currentYear = data.historicalData.find((d) => d.year === 2025);
  const prevYear = data.historicalData.find((d) => d.year === 2024);

  const yoyChange =
    currentYear && prevYear
      ? currentYear.totalBudget - prevYear.totalBudget
      : 780_000_000;
  const yoyPercent =
    currentYear && prevYear ? (yoyChange / prevYear.totalBudget) * 100 : 8.9;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border border-orange-500/30 bg-gradient-to-r from-orange-950/90 via-red-950/80 to-orange-950/90 p-4 ${className}`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Title + Total */}
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
            <span className="text-xl">🚨</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-orange-100">ICE Budget FY2025</h3>
              <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-semibold text-red-400">
                <svg
                  className="h-2.5 w-2.5"
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
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {formatCurrency(data.totalBudget)}
              </span>
              <span className="text-xs text-orange-200/60">
                +{formatCurrency(yoyChange)} from FY2024
              </span>
            </div>
          </div>
        </div>

        {/* Center: Your Share */}
        <div className="flex items-center gap-6 rounded-lg bg-black/30 px-4 py-2">
          <div className="text-center">
            <div className="text-xs text-orange-300/70">Your Share</div>
            <div className="text-xl font-bold text-white">$28.42</div>
            <div className="text-[10px] text-orange-200/50">per American</div>
          </div>
          <div className="h-8 w-px bg-orange-500/30" />
          <div className="text-center">
            <div className="text-xs text-orange-300/70">Family of 4</div>
            <div className="text-xl font-bold text-orange-300">$113.68</div>
            <div className="text-[10px] text-orange-200/50">annual cost</div>
          </div>
        </div>

        {/* Right: What It Could Fund */}
        <div className="rounded-lg border border-green-500/20 bg-green-950/40 px-3 py-2">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="text-sm">💡</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-green-300">
              Could Fund Instead
            </span>
          </div>
          <div className="flex gap-3">
            <div className="text-center">
              <div className="text-xs">🏥</div>
              <div className="text-sm font-bold text-green-400">1.12M</div>
              <div className="text-[8px] text-green-200/60">healthcare</div>
            </div>
            <div className="text-center">
              <div className="text-xs">🎓</div>
              <div className="text-sm font-bold text-blue-400">1.36M</div>
              <div className="text-[8px] text-blue-200/60">Pell Grants</div>
            </div>
            <div className="text-center">
              <div className="text-xs">👩‍🏫</div>
              <div className="text-sm font-bold text-purple-400">140K</div>
              <div className="text-[8px] text-purple-200/60">teachers</div>
            </div>
            <div className="text-center">
              <div className="text-xs">🏠</div>
              <div className="text-sm font-bold text-cyan-400">47.6K</div>
              <div className="text-[8px] text-cyan-200/60">housing</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ICESpotlight;
