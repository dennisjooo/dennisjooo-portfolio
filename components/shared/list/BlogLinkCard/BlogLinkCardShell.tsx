import { cn } from "@/lib/utils";

export function BlogLinkCardShell({
  children,
  className,
  variant = "grid",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "grid" | "featured" | "bento-compact" | "bento-featured";
}) {
  const variantClasses = {
    grid: "relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card",
    featured:
      "relative grid grid-cols-1 overflow-hidden rounded-xl border border-border bg-card md:grid-cols-5 md:gap-10 md:rounded-2xl md:p-6",
    "bento-compact":
      "relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-xl border border-border bg-card lg:flex-row",
    "bento-featured":
      "relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card",
  };

  return (
    <article className={cn(variantClasses[variant], className)}>
      {children}
    </article>
  );
}
