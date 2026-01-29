/**
 * Visual test component to showcase all empty state variants
 * This can be rendered in Storybook or a test page to verify styling
 */

import {
  EmptyState,
  NoComparisonsEmpty,
  NoSearchResults,
  NoSpotlight,
} from '../empty-states';
import { Inbox, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EmptyStateShowcase() {
  return (
    <div className="space-y-8 p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Empty State Components</h1>

      {/* Base EmptyState Component */}
      <Card>
        <CardHeader>
          <CardTitle>Base EmptyState</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Inbox}
            title="Custom Empty State"
            description="This is a custom empty state using the base EmptyState component with all features."
            action={{
              label: 'Take Action',
              onClick: () => console.log('Action clicked'),
              variant: 'default',
            }}
            iconSize="md"
          />
        </CardContent>
      </Card>

      {/* NoComparisonsEmpty */}
      <Card>
        <CardHeader>
          <CardTitle>NoComparisonsEmpty</CardTitle>
        </CardHeader>
        <CardContent>
          <NoComparisonsEmpty
            onCreateComparison={() => console.log('Create comparison')}
          />
        </CardContent>
      </Card>

      {/* NoComparisonsEmpty without action */}
      <Card>
        <CardHeader>
          <CardTitle>NoComparisonsEmpty (No Action)</CardTitle>
        </CardHeader>
        <CardContent>
          <NoComparisonsEmpty />
        </CardContent>
      </Card>

      {/* NoSearchResults with query */}
      <Card>
        <CardHeader>
          <CardTitle>NoSearchResults (With Query)</CardTitle>
        </CardHeader>
        <CardContent>
          <NoSearchResults
            searchQuery="defense spending 2024"
            onClearSearch={() => console.log('Clear search')}
          />
        </CardContent>
      </Card>

      {/* NoSearchResults without query */}
      <Card>
        <CardHeader>
          <CardTitle>NoSearchResults (No Query)</CardTitle>
        </CardHeader>
        <CardContent>
          <NoSearchResults onClearSearch={() => console.log('Clear search')} />
        </CardContent>
      </Card>

      {/* NoSpotlight with item name */}
      <Card>
        <CardHeader>
          <CardTitle>NoSpotlight (With Item Name)</CardTitle>
        </CardHeader>
        <CardContent>
          <NoSpotlight itemName="Department of Defense" />
        </CardContent>
      </Card>

      {/* NoSpotlight without item name */}
      <Card>
        <CardHeader>
          <CardTitle>NoSpotlight (No Item Name)</CardTitle>
        </CardHeader>
        <CardContent>
          <NoSpotlight />
        </CardContent>
      </Card>

      {/* Small icon size */}
      <Card>
        <CardHeader>
          <CardTitle>Small Icon Size</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={AlertCircle}
            title="Small Icon"
            description="This uses the small icon size variant."
            iconSize="sm"
          />
        </CardContent>
      </Card>

      {/* Large icon size */}
      <Card>
        <CardHeader>
          <CardTitle>Large Icon Size</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Inbox}
            title="Large Icon"
            description="This uses the large icon size variant."
            iconSize="lg"
          />
        </CardContent>
      </Card>

      {/* Without description */}
      <Card>
        <CardHeader>
          <CardTitle>Without Description</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState icon={Inbox} title="No Description" iconSize="md" />
        </CardContent>
      </Card>

      {/* Dark mode preview note */}
      <Card>
        <CardHeader>
          <CardTitle>Design Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Colors:</strong> All empty states use muted colors
            (text-muted-foreground) for non-critical information
          </p>
          <p>
            <strong>Icon Background:</strong> Icons sit in semi-transparent
            muted backgrounds (bg-muted/50)
          </p>
          <p>
            <strong>Spacing:</strong> Consistent padding (py-12 px-4) with
            centered layout
          </p>
          <p>
            <strong>Typography:</strong> Title is text-lg font-semibold,
            description is text-sm
          </p>
          <p>
            <strong>Actions:</strong> Optional action buttons use small size for
            proportional scaling
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
