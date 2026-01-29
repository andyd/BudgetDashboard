'use client';

import { useEffect, useState } from 'react';

interface PercentageBarProps {
  value: number; // 0-100
  color?: string;
  showLabel?: boolean;
}

export function PercentageBar({
  value,
  color = 'bg-blue-500',
  showLabel = true,
}: PercentageBarProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  // Clamp value between 0 and 100
  const clampedValue = Math.min(Math.max(value, 0), 100);

  useEffect(() => {
    // Animate fill on mount
    const timer = setTimeout(() => {
      setAnimatedValue(clampedValue);
    }, 50);

    return () => clearTimeout(timer);
  }, [clampedValue]);

  return (
    <div className="relative w-full">
      <div
        className="h-2 bg-gray-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${clampedValue}% complete`}
      >
        <div
          className={`h-full ${color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${animatedValue}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-right text-sm text-gray-600">
          {clampedValue}%
        </div>
      )}
    </div>
  );
}
