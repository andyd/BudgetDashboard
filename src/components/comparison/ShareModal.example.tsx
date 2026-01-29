/**
 * Example usage of ShareModal component
 *
 * This file demonstrates how to use the ShareModal component in your application.
 */

'use client';

import * as React from 'react';
import { ShareModal } from './ShareModal';
import { Button } from '@/components/ui/button';
import { Share2Icon } from 'lucide-react';

export function ShareModalExample() {
  const [isShareOpen, setIsShareOpen] = React.useState(false);

  return (
    <div>
      {/* Trigger button */}
      <Button onClick={() => setIsShareOpen(true)}>
        <Share2Icon className="size-4" />
        Share Comparison
      </Button>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        comparisonId="defense-vs-iphones"
        title="Pentagon Budget vs. iPhones for Everyone"
      />
    </div>
  );
}

/**
 * Usage in a comparison card or detail page:
 *
 * import { ShareModal } from '@/components/comparison/ShareModal';
 *
 * function ComparisonDetailPage() {
 *   const [isShareOpen, setIsShareOpen] = useState(false);
 *   const comparison = useComparison(); // Your data fetching hook
 *
 *   return (
 *     <div>
 *       <Button onClick={() => setIsShareOpen(true)}>
 *         Share
 *       </Button>
 *
 *       <ShareModal
 *         isOpen={isShareOpen}
 *         onClose={() => setIsShareOpen(false)}
 *         comparisonId={comparison.id}
 *         title={comparison.title}
 *       />
 *     </div>
 *   );
 * }
 */
