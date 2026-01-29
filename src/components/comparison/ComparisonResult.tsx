"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { ComparisonResult as ComparisonResultType } from "@/types/comparison";

interface ComparisonResultProps {
  result: ComparisonResultType;
  budgetItemName?: string; // Optional budget item name for display
}

/**
 * ComparisonResult
 *
 * Large display of a comparison result with animated number counting.
 * Shows budget item compared to real-world unit with detailed calculation
 * and source information.
 *
 * Format: "[Budget Item] ($X) = [Y] [Unit Name]"
 * Math: "$X ÷ $Z/unit = Y units"
 */
export function ComparisonResult({
  result,
  budgetItemName,
}: ComparisonResultProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Format currency
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(result.dollarAmount);

  // Get cost per unit from the comparison unit
  const costPerUnit = result.unit.costPerUnit;
  const formattedCostPerUnit = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(costPerUnit);

  // Animated number counter
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const displayValue = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isInView) {
      motionValue.set(result.unitCount);
    }
  }, [isInView, motionValue, result.unitCount]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (displayValue.current) {
        const formatted = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1,
        }).format(latest);
        displayValue.current.textContent = formatted;
      }
    });

    return () => unsubscribe();
  }, [springValue]);

  return (
    <Card className="p-8 md:p-12" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-8"
      >
        {/* Main comparison display */}
        <div className="space-y-4 text-center">
          {/* Budget item name */}
          {budgetItemName && (
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl font-bold text-foreground md:text-3xl"
            >
              {budgetItemName}
            </motion.h2>
          )}

          {/* Budget amount */}
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-extrabold text-primary md:text-5xl lg:text-6xl"
          >
            {formattedAmount}
          </motion.p>

          {/* Equals sign */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-2xl text-muted-foreground md:text-3xl"
          >
            =
          </motion.p>

          {/* Animated unit count */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-2"
          >
            <p className="text-5xl font-extrabold text-primary md:text-6xl lg:text-7xl">
              <span ref={displayValue}>0</span>
            </p>
            <p className="text-xl font-semibold text-foreground md:text-2xl">
              {result.unitCount !== 1
                ? result.unit.name
                : result.unit.nameSingular}
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto h-px w-24 bg-border"
        />

        {/* Math explanation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-2 text-center"
        >
          <p className="text-sm font-medium text-muted-foreground">
            Calculation:
          </p>
          <p className="font-mono text-base text-foreground md:text-lg">
            {formattedAmount} ÷ {formattedCostPerUnit}/unit ={" "}
            {new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            }).format(result.unitCount)}{" "}
            units
          </p>
        </motion.div>

        {/* Unit description and category */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="space-y-3 text-center"
        >
          {result.unit.description && (
            <p className="text-sm text-muted-foreground">
              {result.unit.description}
            </p>
          )}

          {/* Category badge */}
          <div className="flex justify-center">
            <span className="rounded-full bg-secondary px-4 py-1 text-sm font-medium text-secondary-foreground">
              {result.unit.category.charAt(0).toUpperCase() +
                result.unit.category.slice(1)}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </Card>
  );
}
