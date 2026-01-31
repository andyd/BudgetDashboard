"use client";

import { useState } from "react";
import { ProgressIndicator } from "../ProgressIndicator";

/**
 * Demo page to visually test ProgressIndicator component
 * Access at: http://localhost:3000/wizard/progress-demo
 */
export default function ProgressIndicatorDemo() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [showLabel, setShowLabel] = useState(true);

  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">ProgressIndicator Demo</h1>
        <p className="text-muted-foreground mb-8">
          Visual testing for all states and responsive behavior
        </p>

        {/* Interactive Controls */}
        <div className="bg-card border rounded-lg p-6 mb-8 space-y-4">
          <h2 className="text-lg font-semibold mb-4">Controls</h2>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep(1)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? "bg-blue-600 text-white"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Step 1
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 2
                  ? "bg-blue-600 text-white"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Step 2
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 3
                  ? "bg-blue-600 text-white"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              Step 3
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showLabel}
                onChange={(e) => setShowLabel(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Show label</span>
            </label>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-card border rounded-lg p-8">
          <h2 className="text-lg font-semibold mb-6 text-center">
            Live Preview
          </h2>
          <ProgressIndicator currentStep={currentStep} showLabel={showLabel} />
        </div>

        {/* All States Preview */}
        <div className="space-y-6 mt-12">
          <h2 className="text-2xl font-bold">All States</h2>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Step 1 - First step (1 current, 2 incomplete)
            </h3>
            <ProgressIndicator currentStep={1} />
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Step 2 - Middle step (1 completed, 1 current, 1 incomplete)
            </h3>
            <ProgressIndicator currentStep={2} />
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Step 3 - Final step (2 completed, 1 current)
            </h3>
            <ProgressIndicator currentStep={3} />
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              With label hidden
            </h3>
            <ProgressIndicator currentStep={2} showLabel={false} />
          </div>
        </div>

        {/* Responsive Preview */}
        <div className="space-y-6 mt-12">
          <h2 className="text-2xl font-bold">Responsive Preview</h2>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Mobile viewport (resize browser to &lt;640px to see mobile styles)
            </h3>
            <div className="w-full sm:w-64">
              <ProgressIndicator currentStep={2} />
            </div>
          </div>
        </div>

        {/* Implementation Details */}
        <div className="bg-muted/50 border rounded-lg p-6 mt-12">
          <h2 className="text-xl font-bold mb-4">Implementation Details</h2>

          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-1">Dot States:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  <span className="font-mono">Current:</span> bg-emerald-500,
                  scale-125 (sm:scale-150)
                </li>
                <li>
                  <span className="font-mono">Completed:</span>{" "}
                  bg-emerald-500/60
                </li>
                <li>
                  <span className="font-mono">Incomplete:</span> bg-slate-600,
                  opacity-40
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Responsive Sizes:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  <span className="font-mono">Mobile:</span> h-2 w-2 (8px × 8px)
                </li>
                <li>
                  <span className="font-mono">Desktop:</span> sm:h-2.5 sm:w-2.5
                  (10px × 10px)
                </li>
                <li>
                  <span className="font-mono">Gap:</span> gap-1.5 sm:gap-2
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Accessibility:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  <span className="font-mono">
                    role=&quot;progressbar&quot;
                  </span>{" "}
                  on container
                </li>
                <li>
                  <span className="font-mono">aria-valuenow</span>,{" "}
                  <span className="font-mono">aria-valuemin</span>,{" "}
                  <span className="font-mono">aria-valuemax</span>
                </li>
                <li>
                  <span className="font-mono">aria-label</span> describes
                  progress
                </li>
                <li>
                  <span className="font-mono">
                    aria-live=&quot;polite&quot;
                  </span>{" "}
                  on step label
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
