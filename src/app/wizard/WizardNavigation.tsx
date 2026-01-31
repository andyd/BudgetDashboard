"use client";

import { Button } from "@/components/ui/button";

interface WizardNavigationProps {
  step: 1 | 2 | 3;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function WizardNavigation({
  step,
  canProceed,
  onNext,
  onBack,
}: WizardNavigationProps) {
  const nextButtonText = step === 3 ? "See My Results" : "Next";
  const showBackButton = step > 1;

  return (
    <nav
      className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4"
      role="navigation"
      aria-label="Wizard navigation"
    >
      {/* Back button - hidden on step 1 */}
      <div className="flex-shrink-0 w-full sm:w-auto order-2 sm:order-1">
        {showBackButton && (
          <Button
            variant="outline"
            onClick={onBack}
            type="button"
            className="w-full sm:w-auto min-h-[44px]"
            aria-label={`Go back to step ${step - 1}`}
          >
            Back
          </Button>
        )}
      </div>

      {/* Next button - always visible, disabled until canProceed */}
      <div className="flex-shrink-0 w-full sm:w-auto sm:ml-auto order-1 sm:order-2">
        <Button
          variant="default"
          onClick={onNext}
          disabled={!canProceed}
          aria-disabled={!canProceed}
          type="button"
          className="w-full sm:w-auto min-h-[44px]"
          aria-label={
            canProceed
              ? step === 3
                ? "Continue to see your personalized results"
                : `Continue to step ${step + 1}`
              : "Complete selections to continue"
          }
        >
          {nextButtonText}
        </Button>
      </div>
    </nav>
  );
}
