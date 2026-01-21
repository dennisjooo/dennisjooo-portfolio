import { StatusIndicator } from './StatusIndicator';
import { StatusData } from './types';

interface SystemAnalyticsProps {
  statusData: StatusData | null;
  isLoading: boolean;
  error: string | null;
}

export function SystemAnalytics({ statusData, isLoading, error }: SystemAnalyticsProps) {
  return (
    <div className="p-8 rounded-2xl border border-border bg-card/20 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          System Analytics
        </h3>
        <div className="flex items-center gap-3">
          {statusData?.timestamp && (
            <span className="font-mono text-xs text-muted-foreground">
              Updated: {new Date(statusData.timestamp).toLocaleTimeString()}
            </span>
          )}
          {statusData?.cached && (
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
              Cached
            </span>
          )}
          {isLoading && (
            <span className="font-mono text-xs text-muted-foreground animate-pulse">
              Checking...
            </span>
          )}
          {error && (
            <span className="font-mono text-xs text-red-500">Error: {error}</span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-1">
          <StatusIndicator status={statusData?.database} />
          <div className="text-sm text-muted-foreground">Database Status</div>
          {statusData?.database?.latency != null && (
            <div className="text-xs text-muted-foreground/60">
              {statusData.database.latency}ms
            </div>
          )}
        </div>
        <div className="space-y-1">
          <StatusIndicator status={statusData?.auth} />
          <div className="text-sm text-muted-foreground">Auth System</div>
          {statusData?.auth?.latency != null && (
            <div className="text-xs text-muted-foreground/60">
              {statusData.auth.latency}ms
            </div>
          )}
        </div>
        <div className="space-y-1">
          <StatusIndicator status={statusData?.blobStorage} />
          <div className="text-sm text-muted-foreground">Blob Storage</div>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-bold font-urbanist">
            {statusData?.version ? `v${statusData.version}` : '...'}
          </div>
          <div className="text-sm text-muted-foreground">Current Build</div>
        </div>
      </div>
    </div>
  );
}
