/**
 * Example usage of ComparisonPresets component
 *
 * This file demonstrates how to integrate ComparisonPresets
 * with a ComparisonBuilder component.
 */

'use client';

import { useState } from 'react';
import { ComparisonPresets, type PresetConfig } from './ComparisonPresets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ComparisonPresetsExample() {
  const [selectedConfig, setSelectedConfig] = useState<PresetConfig | null>(null);

  return (
    <div className="space-y-6">
      {/* Presets section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Comparisons</CardTitle>
        </CardHeader>
        <CardContent>
          <ComparisonPresets
            onSelect={(config) => {
              setSelectedConfig(config);
              // Here you would update your ComparisonBuilder state
              // Example:
              // setLeftItemId(config.leftItemId);
              // setRightItemId(config.rightItemId);
              // setSelectedUnitId(config.selectedUnitId);
            }}
          />
        </CardContent>
      </Card>

      {/* Display selected preset (for demo purposes) */}
      {selectedConfig && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Preset</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="rounded-lg bg-muted p-4 text-sm">
              {JSON.stringify(selectedConfig, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
