import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export const sectionInnerClasses = "container mx-auto px-6 max-w-7xl";

type SectionSpacing = "default" | "compact";

interface SectionShellProps {
  id: string;
  children: ReactNode;
  spacing?: SectionSpacing;
  fullBleed?: boolean;
  minHeight?: boolean;
  overflowHidden?: boolean;
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
  fullBleed = false,
  minHeight = false,
  overflowHidden = false,
  className,
  innerClassName,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        spacingClasses[spacing],
        "w-full bg-background text-foreground",
        minHeight && "relative min-h-[80vh] flex flex-col",
        overflowHidden && "overflow-hidden",
        className,
      )}
    >
      {fullBleed ? (
        children
      ) : (
        <div className={cn(sectionInnerClasses, innerClassName)}>
          {children}
        </div>
      )}
    </section>
  );
}

interface SectionShellHeaderProps {
  children: ReactNode;
  className?: string;
}

export function SectionShellHeader({
  children,
  className,
}: SectionShellHeaderProps) {
  return (
    <div className={cn(sectionInnerClasses, "mb-10", className)}>
      {children}
    </div>
  );
}
