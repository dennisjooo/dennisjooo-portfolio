import { cn } from "@/lib/utils";

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded bg-muted/20", className)}
      aria-hidden="true"
    />
  );
}
