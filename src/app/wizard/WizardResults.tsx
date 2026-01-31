"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "@/lib/framer-client";
import { ResultCard } from "./ResultCard";
import { PrioritySummary } from "./PrioritySummary";
import { ShareButton } from "./ShareButton";
import { generateWizardComparisons } from "@/lib/wizard-comparisons";
import {
  PRIORITY_CATEGORIES,
  WASTEFUL_CATEGORIES,
} from "@/lib/wizard-categories";
import type {
  PriorityCategory,
  WastefulCategory,
} from "@/lib/wizard-categories";
import { AlertCircle, RefreshCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface WizardResultsProps {
  /** User's priority categories from Step 1 */
  priorities: PriorityCategory[];

  /** User's wasteful categories from Step 2 */
  wasteful: WastefulCategory[];

  /** User's single top priority from Step 3 */
  topPriority: PriorityCategory;

  /** Restart wizard callback */
  onRestart: () => void;
}

/**
 * WizardResults
 *
 * Displays personalized comparison results based on wizard answers.
 * Handles edge cases:
 * - Empty comparison results
 * - Invalid/missing URL parameters
 * - Category data loading failures
 */
export function WizardResults({
  priorities,
  wasteful,
  topPriority,
  onRestart,
}: WizardResultsProps) {
  const router = useRouter();

  // Validate that we have all required data
  const validationError = useMemo(() => {
    if (!priorities || priorities.length === 0) {
      return "No priorities selected. Please restart the wizard.";
    }
    if (!wasteful || wasteful.length === 0) {
      return "No wasteful categories selected. Please restart the wizard.";
    }
    if (!topPriority) {
      return "No top priority selected. Please restart the wizard.";
    }

    // Validate that categories exist in our definitions
    // Using hasOwnProperty for safer object property checking (avoids prototype chain issues)
    const invalidPriorities = priorities.filter(
      (p) => !Object.prototype.hasOwnProperty.call(PRIORITY_CATEGORIES, p),
    );
    const invalidWasteful = wasteful.filter(
      (w) => !Object.prototype.hasOwnProperty.call(WASTEFUL_CATEGORIES, w),
    );

    if (invalidPriorities.length > 0) {
      return `Invalid priority categories: ${invalidPriorities.join(", ")}`;
    }
    if (invalidWasteful.length > 0) {
      return `Invalid wasteful categories: ${invalidWasteful.join(", ")}`;
    }
    if (
      !Object.prototype.hasOwnProperty.call(PRIORITY_CATEGORIES, topPriority)
    ) {
      return `Invalid top priority: ${topPriority}`;
    }

    return null;
  }, [priorities, wasteful, topPriority]);

  // Generate comparisons
  const comparisons = useMemo(() => {
    if (validationError) return [];

    try {
      return generateWizardComparisons(priorities, wasteful, topPriority);
    } catch (error) {
      console.error("Error generating wizard comparisons:", error);
      return [];
    }
  }, [priorities, wasteful, topPriority, validationError]);

  // Handle validation errors
  if (validationError) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-8 text-center"
          >
            <AlertCircle className="mx-auto h-12 w-12 text-red-600 dark:text-red-400 mb-4" />
            <h2 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">
              Invalid Wizard Data
            </h2>
            <p className="text-red-700 dark:text-red-300 mb-6">
              {validationError}
            </p>
            <Button
              onClick={onRestart}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Handle empty comparison results
  if (comparisons.length === 0) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-8 text-center"
          >
            <AlertCircle className="mx-auto h-12 w-12 text-amber-600 dark:text-amber-400 mb-4" />
            <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">
              No Comparisons Available
            </h2>
            <p className="text-amber-700 dark:text-amber-300 mb-6">
              We couldn&apos;t generate comparisons for your selections. This
              might happen if the budget items or comparison units are missing
              data.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={onRestart}
                variant="outline"
                className="border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-900/30"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try Different Priorities
              </Button>
              <Button
                onClick={() => router.push("/")}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Back to Home
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Success state - show results
  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Your Personalized Budget Comparisons
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">
            Based on your priorities, here&apos;s how wasteful spending could
            fund what matters to you
          </p>
        </motion.div>

        {/* Priority Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <PrioritySummary
            priorities={priorities}
            wasteful={wasteful}
            topPriority={topPriority}
          />
        </motion.div>

        {/* Results Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 sm:space-y-4 mb-6 sm:mb-8"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 px-1">
            Your Comparisons ({comparisons.length})
          </h2>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            {comparisons.map((comparison, index) => (
              <motion.div
                key={`${comparison.budgetItem.id}-${comparison.unit.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <ResultCard
                  budgetItemName={comparison.budgetItem.name}
                  budgetItemAmount={comparison.budgetItem.amount}
                  unitCount={comparison.unitCount}
                  unitName={comparison.unit.name}
                  unitCost={
                    comparison.unit.costPerUnit || comparison.unit.cost || 0
                  }
                  isTopPriority={comparison.isTopPriority}
                  budgetItemId={comparison.budgetItem.id}
                  unitId={comparison.unit.id}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center"
        >
          <Button
            onClick={onRestart}
            variant="outline"
            className="w-full sm:w-auto min-h-[44px]"
          >
            <RefreshCcw className="mr-2 h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Try Different Priorities</span>
            <span className="inline sm:hidden">Try Again</span>
          </Button>
          <ShareButton />
          <Button
            onClick={() => router.push("/")}
            className="w-full sm:w-auto min-h-[44px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <span className="hidden sm:inline">Explore Full Budget</span>
            <span className="inline sm:hidden">Explore Budget</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
