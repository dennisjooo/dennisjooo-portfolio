import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DockIcon({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex size-10 items-center justify-center rounded-full",
        className,
      )}
    >
      {children}
    </div>
  );
}
