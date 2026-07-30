"use client";

import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import {
  BlogLinkCardGlow,
  BlogLinkCardImage,
} from "@/components/shared/list/BlogLinkCard";
import { m, useFadeUpInView } from "@/components/motion";

export function useProjectTileMotion(animationIndex: number, hoverY: number) {
  return useFadeUpInView({ index: animationIndex, y: 30, hoverY });
}

export function ProjectTileGlow({ large = false }: { large?: boolean }) {
  return <BlogLinkCardGlow large={large} />;
}

export function ProjectTileImage({
  imageUrl,
  title,
  sizes,
}: {
  imageUrl?: string;
  title: string;
  sizes: string;
}) {
  return <BlogLinkCardImage imageUrl={imageUrl} title={title} sizes={sizes} />;
}

export function ProjectTileIndex({ label }: { label: string }) {
  return (
    <span className="absolute right-3 top-3 z-20 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/80 md:right-4 md:top-4 md:text-xs">
      {label}
    </span>
  );
}

export function ProjectTileFooter({
  date,
  readTime,
  compact = false,
}: {
  date: string;
  readTime?: string;
  compact?: boolean;
}) {
  return (
    <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
      <div
        className={cn(
          "flex items-center gap-2 font-mono uppercase tracking-widest text-muted-foreground",
          compact ? "text-[10px] md:text-xs" : "text-xs",
        )}
      >
        <span>{date}</span>
        {readTime && (
          <>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            <span>{readTime}</span>
          </>
        )}
      </div>
      <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
    </div>
  );
}

export function ProjectTileTitle({
  slug,
  title,
  className,
}: {
  slug: string;
  title: string;
  className?: string;
}) {
  return (
    <m.h3
      layoutId={`hero-title-${slug}`}
      className={cn(
        "font-caslon italic tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent",
        className,
      )}
    >
      {title}
    </m.h3>
  );
}
