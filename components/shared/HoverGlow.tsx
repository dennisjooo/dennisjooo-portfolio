import { cn } from "@/lib/utils";

const roundedClasses = {
  lg: "rounded-sm",
  xl: "rounded-sm",
  "2xl": "rounded-sm",
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
        "pointer-events-none absolute inset-0",
        roundedClasses[rounded],
        className,
      )}
    />
  );
}
