import { cn } from "@/lib/utils";

const roundedClasses = {
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
} as const;

export function HoverGlow({
  className,
  rounded = "xl",
}: {
  className?: string;
  rounded?: keyof typeof roundedClasses;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "glow-frame pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100",
        roundedClasses[rounded],
        className,
      )}
    />
  );
}
