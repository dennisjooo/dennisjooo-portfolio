import { StatusData } from './types';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getOverallStatus(statusData: StatusData | null, isLoading: boolean): { label: string; color: string } {
  if (isLoading || !statusData) return { label: 'Checking...', color: 'text-muted-foreground' };
  const statuses = [statusData.database, statusData.auth, statusData.blobStorage];
  if (statuses.some(s => s?.status === 'down')) return { label: 'Degraded', color: 'text-foreground' };
  if (statuses.some(s => s?.status === 'degraded')) return { label: 'Partial', color: 'text-muted-foreground' };
  if (statuses.every(s => s?.status === 'operational')) return { label: 'All Systems Go', color: 'text-accent' };
  return { label: 'Checking...', color: 'text-muted-foreground' };
}

interface DashboardHeaderProps {
  userName?: string | null;
  statusData?: StatusData | null;
  statusLoading?: boolean;
}

export function DashboardHeader({ userName, statusData = null, statusLoading = true }: DashboardHeaderProps) {
  const greeting = getGreeting();
  const status = getOverallStatus(statusData, statusLoading);
  const isPending = statusLoading || !statusData;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2 pb-2">
        <h1 className="font-playfair italic text-4xl md:text-5xl lg:text-6xl text-foreground">
          {greeting},{' '}
          <span className="font-playfair font-bold text-gradient-primary">
            {userName || 'Admin'}.
          </span>
        </h1>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest ${status.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.color.replace('text-', 'bg-')} ${isPending ? 'animate-pulse' : ''}`} />
            {status.label}
          </span>
          <span className="text-border">|</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-muted/50 font-mono text-[10px] text-muted-foreground">
            Ctrl K
          </kbd>
          <span className="hidden sm:inline font-mono text-xs text-muted-foreground">
            to jump anywhere
          </span>
        </div>
      </div>
    </div>
  );
}
