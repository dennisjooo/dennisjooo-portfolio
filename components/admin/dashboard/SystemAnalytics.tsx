import { CircleStackIcon } from "@heroicons/react/24/outline";
import { StatusIndicator } from "./StatusIndicator";
import { StatusData } from "./types";

interface SystemAnalyticsProps {
  statusData: StatusData | null;
  isLoading: boolean;
  error: string | null;
}

export function SystemAnalytics({
  statusData,
  isLoading,
  error,
}: SystemAnalyticsProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/20 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <CircleStackIcon className="h-4 w-4" />
          System Status
        </h3>
        <div className="flex items-center gap-3">
          {statusData?.timestamp && (
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground/60">
              {new Date(statusData.timestamp).toLocaleTimeString()}
            </span>
          )}
          {statusData?.cached && (
            <span className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              cached
            </span>
          )}
          {isLoading && (
            <span className="animate-pulse font-mono text-[11px] text-muted-foreground">
              polling...
            </span>
          )}
          {error && (
            <span className="font-mono text-[11px] text-destructive">
              {error}
            </span>
          )}
        </div>
      </div>

      <div className="divide-y divide-border/30 px-6 py-2">
        <StatusIndicator status={statusData?.database} label="Database" />
        <StatusIndicator status={statusData?.auth} label="Authentication" />
        <StatusIndicator
          status={statusData?.blobStorage}
          label="Blob Storage"
        />
        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-foreground">Build Version</span>
          <span className="font-mono text-xs text-muted-foreground">
            {statusData?.version ? `v${statusData.version}` : "..."}
          </span>
        </div>
      </div>
    </div>
  );
}
