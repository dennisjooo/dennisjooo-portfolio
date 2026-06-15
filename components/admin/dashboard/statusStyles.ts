import { ServiceStatus } from "./types";

export type StatusLevel = ServiceStatus["status"];

export const statusStyles: Record<
  StatusLevel,
  { dot: string; text: string; textColor: string; pill: string }
> = {
  operational: {
    dot: "bg-emerald-500",
    text: "Operational",
    textColor: "text-emerald-700 dark:text-emerald-400",
    pill: "bg-emerald-500/15 border-emerald-500/30",
  },
  degraded: {
    dot: "bg-amber-500",
    text: "Degraded",
    textColor: "text-amber-700 dark:text-amber-400",
    pill: "bg-amber-500/15 border-amber-500/30",
  },
  down: {
    dot: "bg-red-500",
    text: "Down",
    textColor: "text-red-700 dark:text-red-400",
    pill: "bg-red-500/15 border-red-500/30",
  },
};

export const overallStatusStyles = {
  checking: {
    textClass: "text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
  healthy: {
    textClass: "text-emerald-700 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
  },
  partial: {
    textClass: "text-amber-700 dark:text-amber-400",
    dotClass: "bg-amber-500",
  },
  unhealthy: {
    textClass: "text-red-700 dark:text-red-400",
    dotClass: "bg-red-500",
  },
} as const;
