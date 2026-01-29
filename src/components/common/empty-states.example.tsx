/**
 * Example usage of EmptyState components
 * This file demonstrates how to use the various empty state components in your application
 */

import {
  EmptyState,
  NoComparisonsEmpty,
  NoSearchResults,
  NoSpotlight,
} from './empty-states';
import { Inbox } from 'lucide-react';

// Example 1: Using NoComparisonsEmpty in a comparisons list
export function ComparisonsListExample() {
  const comparisons = []; // Empty array

  if (comparisons.length === 0) {
    return (
      <NoComparisonsEmpty
        onCreateComparison={() => console.log('Create comparison clicked')}
      />
    );
  }

  return <div>{/* Render comparisons */}</div>;
}

// Example 2: Using NoSearchResults in a search interface
export function SearchResultsExample() {
  const searchQuery = 'defense spending';
  const results = []; // Empty results

  if (results.length === 0 && searchQuery) {
    return (
      <NoSearchResults
        searchQuery={searchQuery}
        onClearSearch={() => console.log('Clear search clicked')}
      />
    );
  }

  return <div>{/* Render results */}</div>;
}

// Example 3: Using NoSpotlight in a spotlight panel
export function SpotlightPanelExample() {
  const spotlightData = null; // No data available
  const selectedItem = { name: 'Department of Defense' };

  if (!spotlightData) {
    return <NoSpotlight itemName={selectedItem.name} />;
  }

  return <div>{/* Render spotlight content */}</div>;
}

// Example 4: Using the base EmptyState component for custom cases
export function CustomEmptyStateExample() {
  const hasData = false;

  if (!hasData) {
    return (
      <EmptyState
        icon={Inbox}
        title="No data available"
        description="There is no budget data available for the selected time period. Try selecting a different date range."
        action={{
          label: 'Reset Filters',
          onClick: () => console.log('Reset clicked'),
          variant: 'outline',
        }}
        iconSize="lg"
      />
    );
  }

  return <div>{/* Render data */}</div>;
}

// Example 5: EmptyState without an action button
export function SimpleEmptyStateExample() {
  return (
    <EmptyState
      icon={Inbox}
      title="Coming soon"
      description="This feature is currently under development and will be available soon."
      iconSize="md"
    />
  );
}
