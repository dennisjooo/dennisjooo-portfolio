import { ServiceStatus } from './types';

interface StatusIndicatorProps {
  status: ServiceStatus | undefined;
  label: string;
}

const statusConfig = {
  operational: {
    dot: 'bg-accent',
    text: 'Operational',
    textColor: 'text-foreground',
    pill: 'bg-accent/20 border-accent/30'
  },
  degraded: {
    dot: 'bg-foreground/40',
    text: 'Degraded',
    textColor: 'text-muted-foreground',
    pill: 'bg-muted/40 border-border/60'
  },
  down: {
    dot: 'bg-foreground',
    text: 'Down',
    textColor: 'text-foreground',
    pill: 'bg-foreground/10 border-border'
  },
};

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

  const config = statusConfig[status.status];

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
