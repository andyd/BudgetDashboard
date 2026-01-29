/**
 * Test page for SourceCitation component
 * Navigate to /test-citation to view
 */

import { SourceCitation } from '@/components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestCitationPage() {
  return (
    <div className="container mx-auto py-12 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">SourceCitation Component Test</h1>
        <p className="text-muted-foreground">
          Visual testing page for the SourceCitation component
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Citation (No Date)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This shows a basic source citation without a date.
            </p>
            <SourceCitation
              source="USAspending.gov"
              url="https://www.usaspending.gov/"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Citation with Date</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This citation includes a last updated date.
            </p>
            <SourceCitation
              source="Treasury Department"
              url="https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/"
              date="January 2025"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multiple Citations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Example showing multiple sources stacked vertically.
            </p>
            <div className="flex flex-col gap-2">
              <SourceCitation
                source="NASA FY2024 Budget"
                url="https://www.nasa.gov/budget"
                date="March 2024"
              />
              <SourceCitation
                source="Congressional Budget Office"
                url="https://www.cbo.gov/publication/59711"
                date="February 2024"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Right-Aligned Citation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Using custom className to align right.
            </p>
            <SourceCitation
              source="Example Source"
              url="https://example.com"
              date="Today"
              className="justify-end"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>With Border Accent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Citation with custom border styling.
            </p>
            <SourceCitation
              source="Federal Budget Data"
              url="https://www.whitehouse.gov/omb/budget/"
              date="December 2024"
              className="pl-4 border-l-2 border-primary"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-World Example: Defense Budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Department of Defense</h3>
              <p className="text-sm text-muted-foreground">
                The Department of Defense received $842 billion in appropriations for fiscal year 2024,
                representing approximately 13% of total federal spending.
              </p>
            </div>
            <SourceCitation
              source="USAspending.gov"
              url="https://www.usaspending.gov/agency/department-of-defense"
              date="December 2024"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
