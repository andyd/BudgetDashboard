interface ProgressIndicatorProps {
  currentStep: 1 | 2 | 3;
  totalSteps?: number;
  showLabel?: boolean;
}

export function ProgressIndicator({
  currentStep,
  totalSteps = 3,
  showLabel = true,
}: ProgressIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-2">
      {/* Dots with progressbar semantics */}
      <div
        className="flex items-center gap-1.5 sm:gap-2"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Wizard progress: Step ${currentStep} of ${totalSteps}`}
      >
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isComplete = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={stepNumber}
              className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full transition-all duration-300 ${
                isCurrent
                  ? "bg-emerald-500 scale-125 sm:scale-150"
                  : isComplete
                    ? "bg-emerald-500/60"
                    : "bg-slate-600 opacity-40"
              }`}
              aria-hidden="true"
            />
          );
        })}
      </div>

      {/* Label */}
      {showLabel && (
        <p
          className="text-[10px] sm:text-xs text-slate-400 font-medium"
          aria-live="polite"
        >
          Step {currentStep} of {totalSteps}
        </p>
      )}
    </div>
  );
}
