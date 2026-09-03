import { cn } from "@/lib/utils";

export function BlogLinkCardGlow({ large = false }: { large?: boolean }) {
  return (
    <div
      className={cn(
        "absolute -inset-px rounded-xl bg-accent-border opacity-0 transition-opacity duration-500 group-hover:opacity-100",
        large && "md:rounded-2xl",
      )}
    />
  );
}
