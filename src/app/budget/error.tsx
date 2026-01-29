'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BarChart3, Home, RefreshCw, TrendingUp } from 'lucide-react';

export default function BudgetError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Budget page error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-24">
      <div className="container mx-auto max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950">
              <BarChart3 className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-2xl">
              Unable to Load Budget Data
            </CardTitle>
            <CardDescription className="text-base">
              We&apos;re having trouble loading the federal budget information right
              now.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error.message && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                  Technical Details
                </p>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-500 font-mono">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="mt-2 text-xs text-amber-600 dark:text-amber-600">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium">This might be because:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>The budget data service is temporarily unavailable</li>
                <li>Your internet connection was interrupted</li>
                <li>The requested budget category doesn&apos;t exist</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm font-medium">What you can do:</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• Try refreshing the page</li>
                <li>• Return to the budget explorer home</li>
                <li>• Check your internet connection</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={reset} className="w-full sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/budget">
                <TrendingUp className="mr-2 h-4 w-4" />
                Budget Explorer
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
