import { cn } from "@/lib/utils";

export function Dock({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto flex w-max items-center gap-5", className)}>
      {children}
    </div>
  );
}
