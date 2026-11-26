import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AccordionPanelProps {
  open: boolean;
  children: ReactNode;
  id?: string;
  className?: string;
  innerClassName?: string;
}

export function AccordionPanel({
  open,
  children,
  id,
  className,
  innerClassName,
}: AccordionPanelProps) {
  return (
    <div
      id={id}
      data-state={open ? "open" : "closed"}
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        className,
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div className={innerClassName}>{children}</div>
      </div>
    </div>
  );
}
