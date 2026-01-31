"use client";

interface SpendingAlternative {
  id: string;
  name: string;
  resultCount: number;
}

interface UnitAlternative {
  id: string;
  name: string;
  resultCount: number;
}

interface AlternativesPanelProps {
  spendingAlternatives: SpendingAlternative[];
  unitAlternatives: UnitAlternative[];
  onSelectSpending: (id: string) => void;
  onSelectUnit: (id: string) => void;
  onBrowseAllSpending?: () => void;
  onBrowseAllUnits?: () => void;
}

function formatNumber(num: number): string {
  return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function AlternativesPanel({
  spendingAlternatives,
  unitAlternatives,
  onSelectSpending,
  onSelectUnit,
  onBrowseAllSpending,
  onBrowseAllUnits,
}: AlternativesPanelProps) {
  const displayedSpending = spendingAlternatives.slice(0, 3);
  const displayedUnits = unitAlternatives.slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Left Column: Try Other Spending */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Try Other Spending
        </h3>
        <ul className="space-y-2">
          {displayedSpending.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSelectSpending(item.id)}
                className="group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <span className="font-medium text-slate-800 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                  {item.name}
                </span>
                <span className="ml-2 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:bg-slate-700 dark:text-slate-300 dark:group-hover:bg-indigo-900 dark:group-hover:text-indigo-300">
                  {formatNumber(item.resultCount)}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {onBrowseAllSpending && (
          <button
            onClick={onBrowseAllSpending}
            className="mt-4 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Browse all...
          </button>
        )}
      </div>

      {/* Right Column: Try Other Comparisons */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Try Other Comparisons
        </h3>
        <ul className="space-y-2">
          {displayedUnits.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSelectUnit(item.id)}
                className="group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <span className="font-medium text-slate-800 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                  {item.name}
                </span>
                <span className="ml-2 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700 dark:bg-slate-700 dark:text-slate-300 dark:group-hover:bg-indigo-900 dark:group-hover:text-indigo-300">
                  {formatNumber(item.resultCount)}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {onBrowseAllUnits && (
          <button
            onClick={onBrowseAllUnits}
            className="mt-4 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Browse all...
          </button>
        )}
      </div>
    </div>
  );
}
