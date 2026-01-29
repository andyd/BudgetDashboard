import { Search, TrendingUp, Info } from 'lucide-react';
import { EmptyState, EmptyStateProps } from './EmptyState';

/**
 * Empty state for when no featured comparisons are available
 */
export function NoComparisonsEmpty({
  onCreateComparison,
}: {
  onCreateComparison?: () => void;
}) {
  const props: EmptyStateProps = {
    icon: TrendingUp,
    title: 'No featured comparisons yet',
    description:
      'Featured comparisons help put federal spending into perspective. Check back soon or create your own.',
    iconSize: 'md',
  };

  if (onCreateComparison) {
    props.action = {
      label: 'Create Comparison',
      onClick: onCreateComparison,
      variant: 'outline',
    };
  }

  return <EmptyState {...props} />;
}

/**
 * Empty state for when search returns no results
 */
export function NoSearchResults({
  searchQuery,
  onClearSearch,
}: {
  searchQuery?: string;
  onClearSearch?: () => void;
}) {
  const props: EmptyStateProps = {
    icon: Search,
    title: 'No budget items match your search',
    description: searchQuery
      ? `No results found for "${searchQuery}". Try adjusting your search terms or filters.`
      : "Try adjusting your search terms or filters to find what you're looking for.",
    iconSize: 'md',
  };

  if (onClearSearch) {
    props.action = {
      label: 'Clear Search',
      onClick: onClearSearch,
      variant: 'outline',
    };
  }

  return <EmptyState {...props} />;
}

/**
 * Empty state for when spotlight panel has no additional information
 */
export function NoSpotlight({ itemName }: { itemName?: string }) {
  return (
    <EmptyState
      icon={Info}
      title="No additional information available"
      description={
        itemName
          ? `There is currently no additional context or explanation available for "${itemName}".`
          : 'There is currently no additional context or explanation available for this item.'
      }
      iconSize="sm"
      className="py-8"
    />
  );
}

/**
 * Re-export base component for custom use cases
 */
export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';
