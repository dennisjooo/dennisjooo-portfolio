import { forwardRef } from "react";
import { cn } from "@/lib/utils";

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

/** Solid border hover frame matching featured project cards. */
export const HoverImageFrame = forwardRef<HTMLDivElement, HoverImageFrameProps>(
  function HoverImageFrame(
    { children, className, frameClassName, rounded = "xl", ...frameProps },
    ref,
  ) {
    const roundedClass = roundedClasses[rounded];

    return (
      <div className={cn("group relative", className)}>
        <div
          className={cn(
            "absolute -inset-px bg-accent-border opacity-0 transition-opacity duration-500 group-hover:opacity-100",
            roundedClass,
          )}
        />
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
