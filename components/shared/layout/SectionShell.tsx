import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export const sectionInnerClasses = "container mx-auto px-6 max-w-7xl";

type SectionSpacing = "default" | "compact";

interface SectionShellProps {
  id: string;
  children: ReactNode;
  spacing?: SectionSpacing;
  className?: string;
  innerClassName?: string;
}

const spacingClasses: Record<SectionSpacing, string> = {
  default: "py-24 md:py-32",
  compact: "py-24",
};

export function SectionShell({
  id,
  children,
  spacing = "default",
  className,
  innerClassName,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        spacingClasses[spacing],
        "w-full bg-background text-foreground",
        className,
      )}
    >
      <div className={cn(sectionInnerClasses, innerClassName)}>{children}</div>
    </section>
  );
}
