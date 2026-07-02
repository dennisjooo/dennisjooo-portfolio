"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { m } from "@/components/motion";
import { getBlogTypeLabel } from "@/lib/utils/projectFormatting";
import type { ProjectTileProps } from "./utils";
import { formatDisplayIndex } from "./utils";
import {
  ProjectTileFooter,
  ProjectTileGlow,
  ProjectTileImage,
  ProjectTileIndex,
  ProjectTileTitle,
  useProjectTileMotion,
} from "./ProjectTileParts";

export function ProjectFeaturedTile({
  title,
  description,
  slug,
  date,
  imageUrl,
  readTime,
  displayIndex,
  animationIndex,
  className,
}: ProjectTileProps) {
  const { motionProps } = useProjectTileMotion(animationIndex, -4);

  return (
    <Link
      href={`/blogs/${slug}`}
      className={cn("group block h-full w-full cursor-pointer", className)}
    >
      <m.div {...motionProps} className="relative h-full">
        <ProjectTileGlow large />

        <article className="relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-300 group-hover:border-foreground/30 md:rounded-2xl lg:min-h-[420px]">
          <m.div
            layoutId={`hero-image-${slug}`}
            className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-muted lg:aspect-auto lg:min-h-[240px] lg:flex-1"
          >
            <ProjectTileImage
              imageUrl={imageUrl}
              title={title}
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            <ProjectTileIndex label={formatDisplayIndex(displayIndex)} />
            <div className="absolute left-3 top-3 z-20 lg:left-4 lg:top-4">
              <span className="rounded border border-border bg-background/80 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
                {getBlogTypeLabel("project")}
              </span>
            </div>
          </m.div>

          <div className="flex flex-col gap-3 p-4 md:gap-4 md:p-5 lg:p-6">
            <ProjectTileTitle
              slug={slug}
              title={title}
              className="text-2xl leading-tight md:text-3xl lg:text-4xl lg:leading-[1.1]"
            />

            <p className="line-clamp-3 font-sans text-sm leading-relaxed text-muted-foreground md:text-base">
              {description}
            </p>

            <ProjectTileFooter date={date} readTime={readTime} />
          </div>
        </article>
      </m.div>
    </Link>
  );
}
