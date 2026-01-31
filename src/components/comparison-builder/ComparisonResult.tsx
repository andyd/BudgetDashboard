"use client";

interface SpendingItem {
  name: string;
  amount: number;
  source?: string;
  year?: string;
}

interface ComparisonUnit {
  name: string;
  namePlural: string;
  cost: number;
  icon?: string;
}

interface ComparisonResultProps {
  spendingItem: SpendingItem;
  unit: ComparisonUnit;
  result: number;
}

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

export default function ComparisonResult({
  spendingItem,
  unit,
  result,
}: ComparisonResultProps) {
  const unitName = result === 1 ? unit.name : unit.namePlural;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 shadow-2xl">
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 text-center">
        {/* Icon */}
        {unit.icon && (
          <div className="mb-4 text-5xl" aria-hidden="true">
            {unit.icon}
          </div>
        )}

        {/* Main headline */}
        <h2 className="mb-4 text-3xl font-extrabold leading-tight text-white drop-shadow-lg sm:text-4xl md:text-5xl">
          <span className="block text-yellow-300">{spendingItem.name}</span>
          <span className="block text-2xl font-medium text-white/90 sm:text-3xl">
            =
          </span>
          <span className="block">
            <span className="text-4xl sm:text-5xl md:text-6xl">
              {formatNumber(result)}
            </span>{" "}
            <span className="text-2xl font-semibold text-white/95 sm:text-3xl">
              {unitName}
            </span>
          </span>
        </h2>

        {/* Subline with amounts */}
        <p className="mb-6 text-lg font-medium text-white/80 sm:text-xl">
          {formatCurrency(spendingItem.amount)} @ {formatCurrency(unit.cost)}
          /year
        </p>

        {/* Divider */}
        <div className="mx-auto mb-4 h-px w-24 bg-white/30" />

        {/* Source citation */}
        {spendingItem.source && (
          <p className="text-xs text-white/60 sm:text-sm">
            Source: {spendingItem.source}
            {spendingItem.year && ` (${spendingItem.year})`}
          </p>
        )}
      </div>
    </div>
  );
}
