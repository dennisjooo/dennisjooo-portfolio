import { ServiceStatus } from './types';
import { statusStyles } from './statusStyles';

interface StatusIndicatorProps {
  status: ServiceStatus | undefined;
  label: string;
}

export function StatusIndicator({ status, label }: StatusIndicatorProps) {
  if (!status) {
    return (
      <div className="flex items-center justify-between py-3">
        <span className="text-sm text-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" />
          <span className="text-xs text-muted-foreground">Checking</span>
        </div>
      </div>
    );
  }

  const config = statusStyles[status.status];

  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex items-center gap-2">
        {status.latency != null && (
          <span className="font-mono text-[11px] text-muted-foreground/60 tabular-nums">
            {status.latency}ms
          </span>
        )}
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-widest ${config.pill} ${config.textColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          {config.text}
        </span>
      </div>
    </div>
  );
}
