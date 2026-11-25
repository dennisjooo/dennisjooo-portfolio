import { cn } from "@/lib/utils";

interface CommandItemLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function CommandItemLabel({
  children,
  className,
}: CommandItemLabelProps) {
  return (
    <span className={cn("text-xs font-normal", className)}>{children}</span>
  );
}
