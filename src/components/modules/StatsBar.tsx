interface StatsBarProps {
  totalBudget?: string;
  budgetItemsCount?: string;
  comparisonUnitsCount?: string;
  fiscalYear?: number;
}

export function StatsBar({
  totalBudget = "$7.0T",
  budgetItemsCount = "100+",
  comparisonUnitsCount = "75+",
  fiscalYear = 2025,
}: StatsBarProps) {
  return (
    <section className="border-t border-slate-800 bg-slate-950">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
          <div>
            <p className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-4xl font-bold text-transparent">
              {totalBudget}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Total FY{fiscalYear} Budget
            </p>
          </div>
          <div>
            <p className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-4xl font-bold text-transparent">
              {budgetItemsCount}
            </p>
            <p className="mt-1 text-sm text-slate-500">Budget Items</p>
          </div>
          <div>
            <p className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-4xl font-bold text-transparent">
              {comparisonUnitsCount}
            </p>
            <p className="mt-1 text-sm text-slate-500">Comparison Units</p>
          </div>
        </div>
      </div>
    </section>
  );
}
