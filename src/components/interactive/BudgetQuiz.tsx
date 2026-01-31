"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "@/lib/framer-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/format";
import {
  ALL_BUDGET_ITEMS,
  ALL_COMPARISON_UNITS,
  type ComparisonUnit,
} from "@/lib/data";
import { calculateComparison } from "@/lib/comparison-engine";
import type { BudgetSpendingItem } from "@/lib/data/budget-items/departments";

// =============================================================================
// Types
// =============================================================================

interface QuizQuestion {
  /** The budget item being asked about */
  budgetItem: BudgetSpendingItem;
  /** The comparison unit to guess */
  unit: ComparisonUnit;
  /** The correct answer (unit count) */
  correctAnswer: number;
  /** All answer options (one correct, three plausible wrong) */
  options: number[];
  /** Index of correct answer in options array */
  correctIndex: number;
  /** Explanation shown after answering */
  explanation: string;
}

interface QuizState {
  /** Current question index */
  currentQuestionIndex: number;
  /** All generated questions */
  questions: QuizQuestion[];
  /** User's answers (null = not answered yet) */
  answers: (number | null)[];
  /** Score (number of correct answers) */
  score: number;
  /** Whether quiz is complete */
  isComplete: boolean;
  /** Whether current question has been answered */
  hasAnswered: boolean;
  /** Selected answer for current question */
  selectedAnswer: number | null;
}

interface BudgetQuizProps {
  /** Number of questions in the quiz (default: 5) */
  questionCount?: number;
  /** Optional className for styling */
  className?: string;
  /** Callback when quiz completes */
  onComplete?: (score: number, total: number) => void;
}

// =============================================================================
// Constants
// =============================================================================

const QUIZ_MESSAGES = {
  perfect: [
    "Budget Guru!",
    "Fiscal Mastermind!",
    "You should run for Congress!",
  ],
  great: ["Impressive!", "Budget Whiz!", "You really know your numbers!"],
  good: ["Not bad!", "Getting there!", "Keep learning!"],
  okay: [
    "Room to grow!",
    "Every expert started somewhere!",
    "Try again to improve!",
  ],
} as const;

const FUN_FACTS = [
  "The federal budget is decided through a complex process involving the President and Congress.",
  "Mandatory spending (like Social Security and Medicare) makes up about 60% of the federal budget.",
  "The U.S. national debt is larger than the entire GDP of most countries combined.",
  "The Pentagon has never passed a comprehensive audit.",
  "Interest on the national debt is now one of the largest budget items.",
] as const;

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

/**
 * Generate plausible wrong answers based on the correct answer
 */
function generateWrongAnswers(correctAnswer: number): number[] {
  const wrongAnswers: number[] = [];
  const multipliers = [0.1, 0.25, 0.5, 2, 4, 10, 0.33, 3, 5, 0.2];

  // Shuffle multipliers to get variety
  const shuffledMultipliers = shuffleArray(multipliers);

  for (const multiplier of shuffledMultipliers) {
    if (wrongAnswers.length >= 3) break;

    const wrongAnswer = Math.round(correctAnswer * multiplier);

    // Ensure wrong answer is different from correct and other wrong answers
    if (
      wrongAnswer !== correctAnswer &&
      wrongAnswer > 0 &&
      !wrongAnswers.includes(wrongAnswer) &&
      Math.abs(wrongAnswer - correctAnswer) > correctAnswer * 0.1 // At least 10% different
    ) {
      wrongAnswers.push(wrongAnswer);
    }
  }

  // If we don't have enough wrong answers, generate some based on order of magnitude
  while (wrongAnswers.length < 3) {
    const magnitude = Math.pow(10, Math.floor(Math.log10(correctAnswer)));
    const randomWrong = Math.round((Math.random() * 9 + 1) * magnitude);

    if (
      randomWrong !== correctAnswer &&
      !wrongAnswers.includes(randomWrong) &&
      randomWrong > 0
    ) {
      wrongAnswers.push(randomWrong);
    }
  }

  return wrongAnswers.slice(0, 3);
}

/**
 * Generate a single quiz question
 */
function generateQuestion(
  budgetItem: BudgetSpendingItem,
  unit: ComparisonUnit,
): QuizQuestion {
  const { count, formatted } = calculateComparison(budgetItem.amount, unit);
  const roundedCount = Math.round(count);

  const wrongAnswers = generateWrongAnswers(roundedCount);
  const allOptions = shuffleArray([roundedCount, ...wrongAnswers]);
  const correctIndex = allOptions.indexOf(roundedCount);

  const unitCost = unit.costPerUnit ?? unit.cost ?? 0;
  const explanation = `${budgetItem.name} costs ${formatCurrency(budgetItem.amount, { compact: true })}, which equals ${formatted}. Each ${unit.nameSingular ?? unit.name.replace(/s$/, "")} costs ${formatCurrency(unitCost, { compact: true })}.`;

  return {
    budgetItem,
    unit,
    correctAnswer: roundedCount,
    options: allOptions,
    correctIndex,
    explanation,
  };
}

/**
 * Generate all quiz questions
 */
function generateQuestions(count: number): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const usedItems = new Set<string>();
  const usedUnits = new Set<string>();

  // Filter to items with reasonable amounts for interesting comparisons
  const eligibleItems = ALL_BUDGET_ITEMS.filter(
    (item) => item.amount >= 1_000_000_000 && item.amount <= 2_000_000_000_000,
  );

  // Shuffle for variety
  const shuffledItems = shuffleArray(eligibleItems);
  const shuffledUnits = shuffleArray([...ALL_COMPARISON_UNITS]);

  for (const item of shuffledItems) {
    if (questions.length >= count) break;
    if (usedItems.has(item.id)) continue;

    // Find a good unit for this item
    for (const unit of shuffledUnits) {
      if (usedUnits.has(unit.id)) continue;

      const unitCost = unit.costPerUnit ?? unit.cost ?? 0;
      if (unitCost <= 0) continue;

      const count = item.amount / unitCost;

      // Skip if the count is too small or too large to be interesting
      if (count < 10 || count > 1_000_000_000) continue;

      questions.push(generateQuestion(item, unit));
      usedItems.add(item.id);
      usedUnits.add(unit.id);
      break;
    }
  }

  return questions;
}

/**
 * Get a message based on the score
 */
function getScoreMessage(score: number, total: number): string {
  const percentage = (score / total) * 100;

  let messages: readonly string[];
  if (percentage === 100) {
    messages = QUIZ_MESSAGES.perfect;
  } else if (percentage >= 80) {
    messages = QUIZ_MESSAGES.great;
  } else if (percentage >= 60) {
    messages = QUIZ_MESSAGES.good;
  } else {
    messages = QUIZ_MESSAGES.okay;
  }

  return messages[Math.floor(Math.random() * messages.length)]!;
}

// =============================================================================
// Sub-components
// =============================================================================

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  hasAnswered: boolean;
  onSelectAnswer: (answerIndex: number) => void;
  onNext: () => void;
}

function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  hasAnswered,
  onSelectAnswer,
  onNext,
}: QuestionCardProps) {
  const { budgetItem, unit, options, correctIndex, explanation } = question;
  const unitName = unit.name;

  return (
    <motion.div
      key={questionNumber}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Question {questionNumber} of {totalQuestions}
            </span>
            {unit.icon && (
              <span className="text-2xl" role="img" aria-hidden="true">
                {unit.icon}
              </span>
            )}
          </div>
          <CardTitle className="text-xl md:text-2xl leading-tight mt-2">
            How many{" "}
            <span className="text-purple-600 dark:text-purple-400">
              {unitName}
            </span>{" "}
            could you buy with the{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {budgetItem.name}
            </span>{" "}
            budget?
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Budget: {formatCurrency(budgetItem.amount, { compact: true })}
          </p>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-3">
            {options.map((option, index) => {
              const isCorrect = index === correctIndex;
              const isSelected = selectedAnswer === index;
              const showResult = hasAnswered;

              let buttonClass =
                "h-auto py-4 text-lg font-semibold transition-all";

              if (showResult) {
                if (isCorrect) {
                  buttonClass +=
                    " bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300 hover:bg-green-100";
                } else if (isSelected && !isCorrect) {
                  buttonClass +=
                    " bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300 hover:bg-red-100";
                } else {
                  buttonClass += " opacity-50";
                }
              } else if (isSelected) {
                buttonClass += " ring-2 ring-purple-500 ring-offset-2";
              }

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={buttonClass}
                  onClick={() => !hasAnswered && onSelectAnswer(index)}
                  disabled={hasAnswered}
                >
                  {formatNumber(option)}
                  {showResult && isCorrect && (
                    <span className="ml-2" aria-label="Correct">
                      ✓
                    </span>
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <span className="ml-2" aria-label="Incorrect">
                      ✗
                    </span>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Explanation (shown after answering) */}
          <AnimatePresence>
            {hasAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div
                  className={cn(
                    "p-4 rounded-lg border-l-4",
                    selectedAnswer === correctIndex
                      ? "bg-green-50 dark:bg-green-950/30 border-green-500"
                      : "bg-amber-50 dark:bg-amber-950/30 border-amber-500",
                  )}
                >
                  <p className="font-medium mb-1">
                    {selectedAnswer === correctIndex
                      ? "Correct!"
                      : "Not quite!"}
                  </p>
                  <p className="text-sm text-muted-foreground">{explanation}</p>
                </div>

                <Button onClick={onNext} className="w-full" size="lg">
                  {questionNumber === totalQuestions
                    ? "See Results"
                    : "Next Question"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface ResultsCardProps {
  score: number;
  total: number;
  onPlayAgain: () => void;
}

function ResultsCard({ score, total, onPlayAgain }: ResultsCardProps) {
  const percentage = Math.round((score / total) * 100);
  const message = getScoreMessage(score, total);
  const funFact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];

  // Determine result color based on score
  let resultColor = "text-amber-600 dark:text-amber-400";
  let bgGradient =
    "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30";

  if (percentage >= 80) {
    resultColor = "text-green-600 dark:text-green-400";
    bgGradient =
      "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30";
  } else if (percentage >= 60) {
    resultColor = "text-blue-600 dark:text-blue-400";
    bgGradient =
      "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30";
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className={cn("overflow-hidden bg-gradient-to-br", bgGradient)}>
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          {/* Trophy/Star based on score */}
          <div className="text-6xl">
            {percentage === 100
              ? "🏆"
              : percentage >= 80
                ? "⭐"
                : percentage >= 60
                  ? "👍"
                  : "📚"}
          </div>

          {/* Message */}
          <div>
            <h2 className={cn("text-3xl font-bold", resultColor)}>{message}</h2>
            <p className="text-lg text-muted-foreground mt-2">
              You got {score} out of {total} correct ({percentage}%)
            </p>
          </div>

          {/* Score visualization */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: total }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "w-4 h-4 rounded-full",
                  i < score ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700",
                )}
              />
            ))}
          </div>

          {/* Fun fact */}
          <div className="p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground">
              Did you know?
            </p>
            <p className="text-sm mt-1">{funFact}</p>
          </div>

          {/* Play again button */}
          <Button onClick={onPlayAgain} size="lg" className="w-full max-w-xs">
            Play Again
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface ProgressBarProps {
  current: number;
  total: number;
  score: number;
}

function ProgressBar({ current, total, score }: ProgressBarProps) {
  const progress = ((current - 1) / total) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
        <span>Progress</span>
        <span>
          Score: {score}/{current - 1}
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function BudgetQuiz({
  questionCount = 5,
  className,
  onComplete,
}: BudgetQuizProps) {
  // Initialize quiz state
  const [quizState, setQuizState] = useState<QuizState>(() => ({
    currentQuestionIndex: 0,
    questions: generateQuestions(questionCount),
    answers: Array(questionCount).fill(null),
    score: 0,
    isComplete: false,
    hasAnswered: false,
    selectedAnswer: null,
  }));

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

  // Handle answer selection
  const handleSelectAnswer = useCallback(
    (answerIndex: number) => {
      if (quizState.hasAnswered) return;

      const isCorrect = answerIndex === currentQuestion?.correctIndex;

      setQuizState((prev) => ({
        ...prev,
        selectedAnswer: answerIndex,
        hasAnswered: true,
        score: isCorrect ? prev.score + 1 : prev.score,
        answers: prev.answers.map((a, i) =>
          i === prev.currentQuestionIndex ? answerIndex : a,
        ),
      }));
    },
    [quizState.hasAnswered, currentQuestion?.correctIndex],
  );

  // Handle next question
  const handleNext = useCallback(() => {
    setQuizState((prev) => {
      const nextIndex = prev.currentQuestionIndex + 1;
      const isComplete = nextIndex >= prev.questions.length;

      if (isComplete && onComplete) {
        onComplete(prev.score, prev.questions.length);
      }

      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        hasAnswered: false,
        selectedAnswer: null,
        isComplete,
      };
    });
  }, [onComplete]);

  // Handle play again
  const handlePlayAgain = useCallback(() => {
    setQuizState({
      currentQuestionIndex: 0,
      questions: generateQuestions(questionCount),
      answers: Array(questionCount).fill(null),
      score: 0,
      isComplete: false,
      hasAnswered: false,
      selectedAnswer: null,
    });
  }, [questionCount]);

  // If no questions could be generated, show error state
  if (quizState.questions.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            Unable to generate quiz questions. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      {!quizState.isComplete && (
        <ProgressBar
          current={quizState.currentQuestionIndex + 1}
          total={quizState.questions.length}
          score={quizState.score}
        />
      )}

      <AnimatePresence mode="wait">
        {quizState.isComplete ? (
          <ResultsCard
            key="results"
            score={quizState.score}
            total={quizState.questions.length}
            onPlayAgain={handlePlayAgain}
          />
        ) : currentQuestion ? (
          <QuestionCard
            key={quizState.currentQuestionIndex}
            question={currentQuestion}
            questionNumber={quizState.currentQuestionIndex + 1}
            totalQuestions={quizState.questions.length}
            selectedAnswer={quizState.selectedAnswer}
            hasAnswered={quizState.hasAnswered}
            onSelectAnswer={handleSelectAnswer}
            onNext={handleNext}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
