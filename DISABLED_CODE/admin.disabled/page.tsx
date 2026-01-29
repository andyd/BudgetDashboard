import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, TrendingUp, Calendar, Star } from 'lucide-react';

// In production, these would fetch from the database
async function getDashboardStats() {
  // Mock data - replace with actual database queries
  return {
    totalBudgetItems: 1250,
    featuredComparisons: 12,
    lastDataUpdate: new Date('2025-01-15').toISOString(),
    totalUnits: 45,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const lastUpdate = new Date(stats.lastDataUpdate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Overview of budget data and editorial content
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Budget Items
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalBudgetItems.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all departments and programs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Featured Comparisons
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featuredComparisons}</div>
            <p className="text-xs text-muted-foreground">
              Active on homepage carousel
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Comparison Units
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUnits}</div>
            <p className="text-xs text-muted-foreground">
              Available for comparisons
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Data Update</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(stats.lastDataUpdate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </div>
            <p className="text-xs text-muted-foreground">{lastUpdate}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No recent activity to display. Start by managing featured
              comparisons or spotlight content.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Use the sidebar to navigate to:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>Featured Comparisons - Manage homepage carousel</li>
              <li>Units - Add or edit comparison units</li>
              <li>Spotlights - Create editorial spotlight cards</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
