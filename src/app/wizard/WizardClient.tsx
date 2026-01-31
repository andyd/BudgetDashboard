"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "@/lib/framer-client";
import { WizardStep } from "./WizardStep";
import { WizardResults } from "./WizardResults";
import { WizardNavigation } from "./WizardNavigation";
import { ProgressIndicator } from "./ProgressIndicator";
import {
  NEEDS_MORE_CATEGORIES,
  WASTEFUL_CATEGORIES,
} from "./wizard-categories";
import type {
  PriorityCategory,
  WastefulCategory,
} from "@/lib/wizard-categories";

type WizardStepNumber = 1 | 2 | 3 | "results";

/**
 * WizardClient
 *
 * Main wizard orchestration component. Manages:
 * - Step navigation (1, 2, 3, results) with smooth transitions
 * - URL state sync (?step=2&priorities=education,healthcare)
 * - Selection validation
 * - Edge case handling (missing params, invalid data)
 * - Direction-based slide animations
 */
export function WizardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse URL params on mount
  const [currentStep, setCurrentStep] = useState<WizardStepNumber>(1);
  const [priorities, setPriorities] = useState<PriorityCategory[]>([]);
  const [wasteful, setWasteful] = useState<WastefulCategory[]>([]);
  const [topPriority, setTopPriority] = useState<PriorityCategory | null>(null);
  const [direction, setDirection] = useState(1); // Track navigation direction for animations (default 1 for initial forward)
  const [isInitialized, setIsInitialized] = useState(false); // Track if initial URL parsing is complete

  // Initialize from URL params
  useEffect(() => {
    const step = searchParams.get("step");
    const prioritiesParam = searchParams.get("priorities");
    const wastefulParam = searchParams.get("wasteful");
    const topPriorityParam = searchParams.get("topPriority");

    // Parse priorities
    if (prioritiesParam) {
      const parsedPriorities = prioritiesParam
        .split(",")
        .filter((p) =>
          NEEDS_MORE_CATEGORIES.some((cat) => cat.id === p),
        ) as PriorityCategory[];
      setPriorities(parsedPriorities);
    }

    // Parse wasteful
    if (wastefulParam) {
      const parsedWasteful = wastefulParam
        .split(",")
        .filter((w) =>
          WASTEFUL_CATEGORIES.some((cat) => cat.id === w),
        ) as WastefulCategory[];
      setWasteful(parsedWasteful);
    }

    // Parse top priority
    if (topPriorityParam) {
      if (NEEDS_MORE_CATEGORIES.some((cat) => cat.id === topPriorityParam)) {
        setTopPriority(topPriorityParam as PriorityCategory);
      }
    }

    // Set step
    if (
      step === "results" &&
      prioritiesParam &&
      wastefulParam &&
      topPriorityParam
    ) {
      setCurrentStep("results");
    } else if (step === "2" || step === "3") {
      setCurrentStep(parseInt(step) as 1 | 2 | 3);
    } else {
      // Default to step 1
      setCurrentStep(1);
    }

    // Mark as initialized after first URL parse to prevent hydration issues
    setIsInitialized(true);
  }, [searchParams]);

  // Update URL when state changes
  const updateURL = useCallback(
    (
      step: WizardStepNumber,
      newPriorities?: PriorityCategory[],
      newWasteful?: WastefulCategory[],
      newTopPriority?: PriorityCategory | null,
    ) => {
      const params = new URLSearchParams();
      params.set("step", step.toString());

      const p = newPriorities ?? priorities;
      const w = newWasteful ?? wasteful;
      const t = newTopPriority !== undefined ? newTopPriority : topPriority;

      if (p.length > 0) {
        params.set("priorities", p.join(","));
      }
      if (w.length > 0) {
        params.set("wasteful", w.join(","));
      }
      if (t) {
        params.set("topPriority", t);
      }

      router.push(`/wizard?${params.toString()}`, { scroll: false });
    },
    [router, priorities, wasteful, topPriority],
  );

  // Step 1: Select priorities (what needs more investment)
  const handlePrioritySelect = useCallback(
    (id: string) => {
      const newPriorities = priorities.includes(id as PriorityCategory)
        ? priorities.filter((p) => p !== id)
        : [...priorities, id as PriorityCategory];

      setPriorities(newPriorities);
      updateURL(1, newPriorities);
    },
    [priorities, updateURL],
  );

  // Step 2: Select wasteful categories
  const handleWastefulSelect = useCallback(
    (id: string) => {
      const newWasteful = wasteful.includes(id as WastefulCategory)
        ? wasteful.filter((w) => w !== id)
        : [...wasteful, id as WastefulCategory];

      setWasteful(newWasteful);
      updateURL(2, undefined, newWasteful);
    },
    [wasteful, updateURL],
  );

  // Step 3: Select top priority (single select)
  const handleTopPrioritySelect = useCallback(
    (id: string) => {
      const newTopPriority = id as PriorityCategory;
      setTopPriority(newTopPriority);
      updateURL(3, undefined, undefined, newTopPriority);
    },
    [updateURL],
  );

  // Navigation handlers with direction tracking
  const handleNext = useCallback(() => {
    setDirection(1); // Moving forward
    if (currentStep === 1 && priorities.length >= 1) {
      setCurrentStep(2);
      updateURL(2);
    } else if (currentStep === 2 && wasteful.length >= 1) {
      setCurrentStep(3);
      updateURL(3);
    } else if (currentStep === 3 && topPriority) {
      setCurrentStep("results");
      updateURL("results");
    }
  }, [currentStep, priorities, wasteful, topPriority, updateURL]);

  const handleBack = useCallback(() => {
    setDirection(-1); // Moving backward
    if (currentStep === 2) {
      setCurrentStep(1);
      updateURL(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
      updateURL(2);
    } else if (currentStep === "results") {
      setCurrentStep(3);
      updateURL(3);
    }
  }, [currentStep, updateURL]);

  const handleRestart = useCallback(() => {
    setPriorities([]);
    setWasteful([]);
    setTopPriority(null);
    setCurrentStep(1);
    setDirection(1); // Reset to forward direction
    router.push("/wizard");
  }, [router]);

  // Validation
  const canProceed =
    (currentStep === 1 && priorities.length >= 1) ||
    (currentStep === 2 && wasteful.length >= 1) ||
    (currentStep === 3 && topPriority !== null);

  // Animation variants for smooth step transitions
  // Enter from right when moving forward (direction > 0), from left when moving backward
  // Exit to left when moving forward, to right when moving backward
  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  // Render results page
  if (currentStep === "results") {
    // Edge case: Missing required data for results
    if (priorities.length === 0 || wasteful.length === 0 || !topPriority) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-3 sm:px-4 py-12 sm:py-16 text-center"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            Incomplete Wizard Data
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 px-2">
            It looks like you navigated to the results page without completing
            all the steps.
          </p>
          <button
            onClick={handleRestart}
            className="px-6 py-3 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Start the Wizard
          </button>
        </motion.div>
      );
    }

    return (
      <WizardResults
        priorities={priorities}
        wasteful={wasteful}
        topPriority={topPriority}
        onRestart={handleRestart}
      />
    );
  }

  // Render wizard steps
  const shouldAnimate = true;

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header with fade-in animation */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: -20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Budget Priority Wizard
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">
            Answer 3 quick questions to discover personalized budget comparisons
          </p>
        </motion.div>

        {/* Progress Indicator with fade-in */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <ProgressIndicator
            currentStep={currentStep as 1 | 2 | 3}
            totalSteps={3}
          />
        </motion.div>

        {/* Step Content with AnimatePresence for smooth transitions */}
        <div className="bg-card border rounded-xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 min-h-[400px] sm:min-h-[500px] relative overflow-hidden">
          <AnimatePresence
            mode="wait"
            custom={direction}
            initial={shouldAnimate}
          >
            {currentStep === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                <WizardStep
                  step={1}
                  title="What needs more investment?"
                  subtitle="Select 1-3 areas you think deserve more federal funding"
                  categories={NEEDS_MORE_CATEGORIES}
                  selectedIds={priorities}
                  onSelect={handlePrioritySelect}
                  minSelections={1}
                  maxSelections={3}
                  cardSize="default"
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                <WizardStep
                  step={2}
                  title="What's overfunded or wasteful?"
                  subtitle="Select 1-3 areas you think spend too much"
                  categories={WASTEFUL_CATEGORIES}
                  selectedIds={wasteful}
                  onSelect={handleWastefulSelect}
                  minSelections={1}
                  maxSelections={3}
                  cardSize="default"
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                <WizardStep
                  step={3}
                  title="What's your top priority?"
                  subtitle="Of the areas you selected, which matters most?"
                  categories={NEEDS_MORE_CATEGORIES.filter((cat) =>
                    priorities.includes(cat.id as PriorityCategory),
                  )}
                  selectedIds={topPriority ? [topPriority] : []}
                  onSelect={handleTopPrioritySelect}
                  minSelections={1}
                  maxSelections={1}
                  singleSelect={true}
                  cardSize="large"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation with fade-in */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <WizardNavigation
            step={currentStep as 1 | 2 | 3}
            canProceed={canProceed}
            onBack={handleBack}
            onNext={handleNext}
          />
        </motion.div>
      </div>
    </div>
  );
}
