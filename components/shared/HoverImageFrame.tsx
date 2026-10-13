import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { HoverGlow } from "@/components/shared/HoverGlow";

export type HoverImageFrameProps = {
  children: React.ReactNode;
  className?: string;
  frameClassName?: string;
  rounded?: "lg" | "xl" | "2xl";
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "className">;

const roundedClasses = {
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
} as const;

/** Hover frame with the shared hairline-and-bloom glow. */
export const HoverImageFrame = forwardRef<HTMLDivElement, HoverImageFrameProps>(
  function HoverImageFrame(
    { children, className, frameClassName, rounded = "xl", ...frameProps },
    ref,
  ) {
    const roundedClass = roundedClasses[rounded];

    return (
      <div className={cn("group relative", className)}>
        <HoverGlow rounded={rounded} />
        <div
          ref={ref}
          {...frameProps}
          className={cn(
            "relative overflow-hidden border border-border bg-muted",
            roundedClass,
            frameClassName,
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);

HoverImageFrame.displayName = "HoverImageFrame";
