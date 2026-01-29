import Link from 'next/link';
import { AlertCircle, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Not Found Page for Comparison Routes
 *
 * Displayed when a comparison ID doesn&apos;t exist or can&apos;t be found.
 * Provides helpful navigation options to guide users back to useful content.
 */
export default function ComparisonNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <AlertCircle className="size-12 text-muted-foreground" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">
            Comparison Not Found
          </h1>
          <p className="text-muted-foreground text-lg">
            The budget comparison you&apos;re looking for doesn&apos;t exist or may have
            been removed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home />
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/budget#compare">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Search />
              Browse Comparisons
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <div className="pt-6 border-t">
          <p className="text-sm text-muted-foreground">
            Want to create your own comparison?{' '}
            <Link
              href="/budget#compare"
              className="text-primary hover:underline font-medium"
            >
              Try our comparison builder
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
