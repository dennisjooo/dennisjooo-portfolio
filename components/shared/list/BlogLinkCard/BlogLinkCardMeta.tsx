import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { getBlogTypeLabel } from "@/lib/utils/projectFormatting";

interface BlogLinkCardMetaProps {
  date: string;
  readTime?: string;
  type?: "project" | "blog";
  compact?: boolean;
  showArrow?: boolean;
}

export function BlogLinkCardMeta({
  date,
  readTime,
  type,
  compact = false,
  showArrow = true,
}: BlogLinkCardMetaProps) {
  return (
    <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
      <div
        className={cn(
          "flex items-center gap-2 font-mono uppercase tracking-widest text-muted-foreground",
          compact ? "text-[10px] md:text-xs" : "text-xs",
        )}
      >
        {type && (
          <>
            <span className="rounded border border-border bg-background/80 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur-sm md:hidden">
              {getBlogTypeLabel(type)}
            </span>
          </>
        )}
        <span>{date}</span>
        {readTime && (
          <>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            <span>{readTime}</span>
          </>
        )}
      </div>
      {showArrow && (
        <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
      )}
    </div>
  );
}

export function BlogLinkCardTypeBadge({
  type,
  className,
}: {
  type: "project" | "blog";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded border border-border bg-background/80 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur-sm",
        className,
      )}
    >
      {getBlogTypeLabel(type)}
    </span>
  );
}
