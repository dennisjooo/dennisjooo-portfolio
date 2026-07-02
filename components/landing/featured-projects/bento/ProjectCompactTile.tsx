"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { m } from "@/components/motion";
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

export function ProjectCompactTile({
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
  const { motionProps } = useProjectTileMotion(animationIndex, -3);

  return (
    <Link
      href={`/blogs/${slug}`}
      className={cn("group block h-full w-full cursor-pointer", className)}
    >
      <m.div {...motionProps} className="relative h-full">
        <ProjectTileGlow />

        <article className="relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-300 group-hover:border-foreground/30 lg:flex-row">
          <m.div
            layoutId={`hero-image-${slug}`}
            className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-muted lg:aspect-auto lg:min-h-[200px] lg:w-[40%]"
          >
            <ProjectTileImage
              imageUrl={imageUrl}
              title={title}
              sizes="(max-width: 1024px) 100vw, 20vw"
            />
            <ProjectTileIndex label={formatDisplayIndex(displayIndex)} />
          </m.div>

          <div className="flex flex-1 flex-col gap-2 p-4 md:gap-3 md:p-5">
            <ProjectTileTitle
              slug={slug}
              title={title}
              className="line-clamp-2 text-xl leading-tight md:text-2xl"
            />

            <p className="line-clamp-1 flex-1 font-sans text-sm leading-relaxed text-muted-foreground md:line-clamp-2">
              {description}
            </p>

            <ProjectTileFooter date={date} readTime={readTime} compact />
          </div>
        </article>
      </m.div>
    </Link>
  );
}
