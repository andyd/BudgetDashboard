/**
 * Example usage of DataFreshnessIndicator component
 *
 * This file demonstrates how to use the DataFreshnessIndicator component
 * in your application.
 */

import { DataFreshnessIndicator } from './DataFreshnessIndicator'

export function DataFreshnessIndicatorExamples() {
  // Example 1: Fresh data (within 7 days)
  const freshDate = new Date()
  freshDate.setDate(freshDate.getDate() - 3) // 3 days ago

  // Example 2: Older data (more than 7 days)
  const olderDate = new Date()
  olderDate.setDate(olderDate.getDate() - 15) // 15 days ago

  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Fresh Data Example</h3>
        <DataFreshnessIndicator
          lastUpdated={freshDate}
          source="USAspending.gov"
          sourceUrl="https://www.usaspending.gov/"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Older Data Example</h3>
        <DataFreshnessIndicator
          lastUpdated={olderDate}
          source="USAspending.gov"
          sourceUrl="https://www.usaspending.gov/"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Real-World Usage</h3>
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Federal Budget Dashboard</h2>
            <DataFreshnessIndicator
              lastUpdated={new Date('2026-01-15')}
              source="USAspending.gov"
              sourceUrl="https://www.usaspending.gov/"
            />
          </div>
          <p className="text-muted-foreground">
            Budget data and visualizations would appear here...
          </p>
        </div>
      </div>
    </div>
  )
}
