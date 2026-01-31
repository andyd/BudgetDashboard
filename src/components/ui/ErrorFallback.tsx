"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ErrorFallbackProps {
  /** The error that was caught */
  error: Error;
  /** Callback to reset the error boundary and retry */
  resetErrorBoundary: () => void;
  /** Optional custom title */
  title?: string;
  /** Optional custom description */
  description?: string;
  /** Optional className for the container */
  className?: string;
}

/**
 * User-friendly error fallback component for react-error-boundary.
 * Displays a friendly message with retry option and collapsible error details in dev mode.
 */
export function ErrorFallback({
  error,
  resetErrorBoundary,
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  className,
}: ErrorFallbackProps) {
  const isDev = process.env.NODE_ENV === "development";

  // Log error to console
  useEffect(() => {
    console.error("[ErrorFallback] Error caught:", error);
    console.error("[ErrorFallback] Stack trace:", error.stack);
  }, [error]);

  return (
    <div
      className={cn(
        "flex items-center justify-center p-4 min-h-[300px]",
        className,
      )}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {/* Error Illustration/Icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* User-friendly description */}
          <p className="text-center text-sm text-muted-foreground">
            {description}
          </p>

          {/* Try Again Button */}
          <div className="flex justify-center">
            <Button onClick={resetErrorBoundary} className="min-w-[140px]">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>

          {/* Collapsible Error Details (dev mode only) */}
          {isDev && (
            <details className="group mt-4">
              <summary className="flex cursor-pointer items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <span>Show error details</span>
                <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-xs font-medium text-destructive mb-1">
                  {error.name}: {error.message}
                </p>
                {error.stack && (
                  <pre className="mt-2 max-h-[200px] overflow-auto text-xs text-muted-foreground font-mono whitespace-pre-wrap break-words">
                    {error.stack}
                  </pre>
                )}
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
