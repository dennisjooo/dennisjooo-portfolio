import { ServiceStatus } from './types';

interface StatusIndicatorProps {
  status: ServiceStatus | undefined;
  label: string;
}

const statusConfig = {
  operational: { dot: 'bg-emerald-500', text: 'Operational', textColor: 'text-emerald-600 dark:text-emerald-400' },
  degraded: { dot: 'bg-yellow-500', text: 'Degraded', textColor: 'text-yellow-600 dark:text-yellow-400' },
  down: { dot: 'bg-red-500', text: 'Down', textColor: 'text-red-600 dark:text-red-400' },
};

export function StatusIndicator({ status, label }: StatusIndicatorProps) {
  if (!status) {
    return (
      <div className="flex items-center justify-between py-2">
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
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex items-center gap-2">
        {status.latency != null && (
          <span className="font-mono text-[11px] text-muted-foreground/60">
            {status.latency}ms
          </span>
        )}
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span className={`text-xs font-medium ${config.textColor}`}>
          {config.text}
        </span>
      </div>
    </div>
  );
}
