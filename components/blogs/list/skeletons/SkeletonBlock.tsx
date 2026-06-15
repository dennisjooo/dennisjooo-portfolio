import { cn } from "@/lib/utils";

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse bg-muted/20 rounded", className)}
      aria-hidden="true"
    />
  );
}
