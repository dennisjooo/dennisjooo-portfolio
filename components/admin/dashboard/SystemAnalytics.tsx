import { CircleStackIcon } from '@heroicons/react/24/outline';
import { StatusIndicator } from './StatusIndicator';
import { StatusData } from './types';

interface SystemAnalyticsProps {
  statusData: StatusData | null;
  isLoading: boolean;
  error: string | null;
}

export function SystemAnalytics({ statusData, isLoading, error }: SystemAnalyticsProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/20 backdrop-blur-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <CircleStackIcon className="w-4 h-4" />
          System Status
        </h3>
        <div className="flex items-center gap-3">
          {statusData?.timestamp && (
            <span className="font-mono text-[11px] text-muted-foreground/60 tabular-nums">
              {new Date(statusData.timestamp).toLocaleTimeString()}
            </span>
          )}
          {statusData?.cached && (
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
              cached
            </span>
          )}
          {isLoading && (
            <span className="font-mono text-[11px] text-muted-foreground animate-pulse">
              polling...
            </span>
          )}
          {error && (
            <span className="font-mono text-[11px] text-destructive">{error}</span>
          )}
        </div>
      </div>

      <div className="px-6 py-2 divide-y divide-border/30">
        <StatusIndicator status={statusData?.database} label="Database" />
        <StatusIndicator status={statusData?.auth} label="Authentication" />
        <StatusIndicator status={statusData?.blobStorage} label="Blob Storage" />
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-foreground">Build Version</span>
          <span className="font-mono text-xs text-muted-foreground">
            {statusData?.version ? `v${statusData.version}` : '...'}
          </span>
        </div>
      </div>
    </div>
  );
}
