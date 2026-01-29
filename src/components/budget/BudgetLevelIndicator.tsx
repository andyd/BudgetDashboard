import { Badge } from '@/components/ui/badge';

interface BudgetLevelIndicatorProps {
  level: number; // 0-4
  labels?: string[];
}

const DEFAULT_LABELS = [
  'Total Budget',
  'Department',
  'Agency',
  'Program',
  'Line Item',
];

const LEVEL_COLORS = {
  0: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200',
  1: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
  2: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200',
  3: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200',
  4: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
} as const;

export function BudgetLevelIndicator({
  level,
  labels = DEFAULT_LABELS,
}: BudgetLevelIndicatorProps) {
  // Clamp level between 0 and 4
  const clampedLevel = Math.min(Math.max(level, 0), 4);
  const currentLabel = labels[clampedLevel] || DEFAULT_LABELS[clampedLevel];
  const colorClass = LEVEL_COLORS[clampedLevel as keyof typeof LEVEL_COLORS];

  return (
    <div className="flex items-center gap-2" role="status" aria-label={`Budget level: ${currentLabel}`}>
      {/* Level pills showing hierarchy path */}
      <div className="flex items-center gap-1">
        {Array.from({ length: clampedLevel + 1 }).map((_, index) => (
          <div key={index} className="flex items-center gap-1">
            {index > 0 && (
              <svg
                className="w-3 h-3 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
            <div
              className={`w-2 h-2 rounded-full ${
                index === clampedLevel
                  ? colorClass.split(' ')[0].replace('bg-', 'bg-') // Current level - full color
                  : 'bg-gray-300 dark:bg-gray-600' // Previous levels - muted
              }`}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>

      {/* Current level badge */}
      <Badge variant="secondary" className={colorClass}>
        <span className="text-xs font-medium">{currentLabel}</span>
      </Badge>

      {/* Level depth indicator */}
      <span className="text-xs text-gray-500 dark:text-gray-400" aria-hidden="true">
        L{clampedLevel}
      </span>
    </div>
  );
}
