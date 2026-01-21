import { ServiceStatus } from './types';

interface StatusIndicatorProps {
  status: ServiceStatus | undefined;
}

const statusConfig = {
  operational: { color: 'bg-emerald-500', text: 'Active', textColor: 'text-emerald-500' },
  degraded: { color: 'bg-yellow-500', text: 'Degraded', textColor: 'text-yellow-500' },
  down: { color: 'bg-red-500', text: 'Down', textColor: 'text-red-500' },
};

export function StatusIndicator({ status }: StatusIndicatorProps) {
  if (!status) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
        <span className="text-3xl font-bold font-urbanist text-muted-foreground">...</span>
      </div>
    );
  }

  const config = statusConfig[status.status];

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      <span className={`text-3xl font-bold font-urbanist ${config.textColor}`}>
        {config.text}
      </span>
    </div>
  );
}
