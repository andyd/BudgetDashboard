'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import {
  RefreshCw,
  Database,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Activity,
  ExternalLink
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Mock data types
interface SyncLog {
  id: string;
  timestamp: Date;
  status: 'success' | 'error' | 'warning';
  recordsProcessed: number;
  duration: number;
  message?: string;
}

interface SyncStatus {
  lastSync: Date | null;
  nextScheduledSync: Date | null;
  isRunning: boolean;
  progress: number;
  sourceHealth: 'healthy' | 'degraded' | 'down';
  totalRecords: number;
}

// Mock sync status
const mockSyncStatus: SyncStatus = {
  lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  nextScheduledSync: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
  isRunning: false,
  progress: 0,
  sourceHealth: 'healthy',
  totalRecords: 234567,
};

// Mock sync logs
const mockSyncLogs: SyncLog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'success',
    recordsProcessed: 1247,
    duration: 45.3,
    message: 'Successfully synced budget data for Q1 2024',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    status: 'success',
    recordsProcessed: 892,
    duration: 38.7,
    message: 'Successfully synced budget data',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000),
    status: 'warning',
    recordsProcessed: 1105,
    duration: 67.2,
    message: 'Sync completed with warnings: 3 records skipped due to validation errors',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
    status: 'success',
    recordsProcessed: 1023,
    duration: 41.5,
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
    status: 'error',
    recordsProcessed: 0,
    duration: 12.1,
    message: 'Failed to connect to USAspending API: Network timeout',
  },
];

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}

export default function AdminSyncPage() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(mockSyncStatus);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(mockSyncLogs);
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    setSyncStatus(prev => ({ ...prev, isRunning: true, progress: 0 }));

    // Simulate sync progress
    const interval = setInterval(() => {
      setSyncStatus(prev => {
        const newProgress = Math.min(prev.progress + 10, 100);
        if (newProgress === 100) {
          clearInterval(interval);
        }
        return { ...prev, progress: newProgress };
      });
    }, 300);

    // Simulate sync completion after 3 seconds
    setTimeout(() => {
      clearInterval(interval);
      const newLog: SyncLog = {
        id: String(syncLogs.length + 1),
        timestamp: new Date(),
        status: 'success',
        recordsProcessed: Math.floor(Math.random() * 500) + 800,
        duration: Math.random() * 30 + 20,
        message: 'Manual sync completed successfully',
      };

      setSyncLogs(prev => [newLog, ...prev]);
      setSyncStatus(prev => ({
        ...prev,
        isRunning: false,
        progress: 0,
        lastSync: new Date(),
      }));
      setIsManualSyncing(false);
    }, 3000);
  };

  const getStatusIcon = (status: SyncLog['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: SyncLog['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Warning</Badge>;
    }
  };

  const getHealthBadge = (health: SyncStatus['sourceHealth']) => {
    switch (health) {
      case 'healthy':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Healthy</Badge>;
      case 'degraded':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Degraded</Badge>;
      case 'down':
        return <Badge variant="destructive">Down</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Data Synchronization</h1>
        <p className="text-muted-foreground">
          Manage and monitor data sync from USAspending.gov API
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {/* Current Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Sync Status
            </CardTitle>
            <CardDescription>
              {syncStatus.isRunning ? 'Sync in progress...' : 'Last sync status'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {syncStatus.isRunning ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{syncStatus.progress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300 ease-out"
                    style={{ width: `${syncStatus.progress}%` }}
                  />
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Running
                </Badge>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Sync</span>
                  <span className="text-sm font-medium">
                    {syncStatus.lastSync ? formatRelativeTime(syncStatus.lastSync) : 'Never'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Next Scheduled</span>
                  <span className="text-sm font-medium">
                    {syncStatus.nextScheduledSync ? formatRelativeTime(syncStatus.nextScheduledSync) : 'Not scheduled'}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Records</span>
                  <span className="text-sm font-medium">
                    {syncStatus.totalRecords.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Source Health Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Source Status
            </CardTitle>
            <CardDescription>USAspending.gov API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">API Health</span>
                {getHealthBadge(syncStatus.sourceHealth)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Response Time</span>
                <span className="text-sm font-medium">124ms</span>
              </div>
              <Separator />
              <a
                href="https://api.usaspending.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                View API Status
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Manual Sync Card */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Manual Sync
            </CardTitle>
            <CardDescription>Trigger immediate data sync</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Start a manual synchronization to fetch the latest budget data from USAspending.gov.
              </p>
              <Button
                onClick={handleManualSync}
                disabled={syncStatus.isRunning || isManualSyncing}
                className="w-full"
              >
                {isManualSyncing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Start Sync
                  </>
                )}
              </Button>
              {syncStatus.lastSync && (
                <p className="text-xs text-muted-foreground text-center">
                  Last synced {formatRelativeTime(syncStatus.lastSync)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Sync History
          </CardTitle>
          <CardDescription>Recent synchronization logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {syncLogs.map((log, index) => (
              <div key={log.id}>
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">{getStatusIcon(log.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(log.status)}
                        <span className="text-sm text-muted-foreground">
                          {formatRelativeTime(log.timestamp)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDuration(log.duration)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {log.recordsProcessed.toLocaleString()} records processed
                      </span>
                    </div>
                    {log.message && (
                      <p className={cn(
                        "text-sm mt-1",
                        log.status === 'error' && "text-red-600",
                        log.status === 'warning' && "text-yellow-600",
                        log.status === 'success' && "text-muted-foreground"
                      )}>
                        {log.message}
                      </p>
                    )}
                  </div>
                </div>
                {index < syncLogs.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
