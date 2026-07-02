"use client";

import Image from "next/image";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import {
  m,
  useReducedMotion,
  springConfigs,
  viewportSettings,
} from "@/components/motion";
import { NOISE_OVERLAY_LIGHT } from "@/lib/constants/noiseOverlay";

export function useProjectTileMotion(animationIndex: number, hoverY: number) {
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ...springConfigs.smooth,
        delay: Math.min(animationIndex * 0.08, 0.24),
      },
    },
  };

  return {
    motionProps: {
      variants: prefersReducedMotion ? undefined : variants,
      initial: prefersReducedMotion ? undefined : ("hidden" as const),
      whileInView: prefersReducedMotion ? undefined : ("visible" as const),
      viewport: viewportSettings.once,
      whileHover: prefersReducedMotion
        ? undefined
        : { y: hoverY, transition: springConfigs.snappy },
    },
  };
}

export function ProjectTileGlow({ large = false }: { large?: boolean }) {
  return (
    <div
      className={cn(
        "bg-gradient-accent absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100",
        large && "md:rounded-2xl",
      )}
    />
  );
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
  return (
    <>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes={sizes}
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-secondary to-muted" />
      )}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: NOISE_OVERLAY_LIGHT }}
      />
      <div className="absolute inset-0 z-10 bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/5" />
    </>
  );
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
