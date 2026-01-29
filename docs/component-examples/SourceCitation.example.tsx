/**
 * Example usage of SourceCitation component
 *
 * This file demonstrates different ways to use the SourceCitation component
 * throughout the Budget Dashboard application.
 */

import { SourceCitation } from './SourceCitation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SourceCitationExamples() {
  return (
    <div className="space-y-6 p-8">
      <h2 className="text-2xl font-bold">SourceCitation Component Examples</h2>

      {/* Example 1: Basic usage with source and URL */}
      <Card>
        <CardHeader>
          <CardTitle>Defense Budget FY 2024</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The Department of Defense received $842 billion in appropriations for fiscal year 2024.
          </p>
          <SourceCitation
            source="USAspending.gov"
            url="https://www.usaspending.gov/agency/department-of-defense"
          />
        </CardContent>
      </Card>

      {/* Example 2: With date included */}
      <Card>
        <CardHeader>
          <CardTitle>Social Security Spending</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Social Security outlays totaled $1.35 trillion in 2024.
          </p>
          <SourceCitation
            source="Treasury Department"
            url="https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/"
            date="January 2025"
          />
        </CardContent>
      </Card>

      {/* Example 3: Multiple sources in a card */}
      <Card>
        <CardHeader>
          <CardTitle>Medicare & Medicaid Combined</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Medicare spending: $874 billion
            </p>
            <SourceCitation
              source="CMS.gov"
              url="https://www.cms.gov/data-research/statistics-trends-and-reports"
              date="December 2024"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Medicaid spending: $616 billion
            </p>
            <SourceCitation
              source="Medicaid.gov"
              url="https://www.medicaid.gov/medicaid/financial-management/"
              date="November 2024"
            />
          </div>
        </CardContent>
      </Card>

      {/* Example 4: In a comparison card */}
      <Card>
        <CardHeader>
          <CardTitle>NASA Budget Comparison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            NASA&apos;s $25.4 billion budget equals approximately 12,700 Lamborghini Aventadors.
          </p>
          <div className="flex flex-col gap-2">
            <SourceCitation
              source="NASA FY2024 Budget"
              url="https://www.nasa.gov/budget"
              date="March 2024"
            />
            <SourceCitation
              source="Lamborghini Pricing"
              url="https://www.lamborghini.com/en-en/models/aventador"
              date="January 2025"
            />
          </div>
        </CardContent>
      </Card>

      {/* Example 5: Custom styling */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Styled Citation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Example with custom className for different positioning.
          </p>
          <SourceCitation
            source="Example Source"
            url="https://example.com"
            date="Today"
            className="justify-end" // Right-aligned
          />
        </CardContent>
      </Card>

      {/* Example 6: Inline in paragraph */}
      <Card>
        <CardHeader>
          <CardTitle>Inline Citation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              The federal government spent $6.1 trillion in fiscal year 2024.
            </p>
            <SourceCitation
              source="Congressional Budget Office"
              url="https://www.cbo.gov/publication/59711"
              date="February 2024"
              className="pl-4 border-l-2 border-muted"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
