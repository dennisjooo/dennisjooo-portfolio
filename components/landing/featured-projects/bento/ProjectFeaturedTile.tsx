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
import {
  BlogLinkCardShell,
  BlogLinkCardTypeBadge,
} from "@/components/shared/list/BlogLinkCard";

export function ProjectFeaturedTile({
  title,
  description,
  slug,
  type,
  date,
  imageUrl,
  readTime,
  displayIndex,
  animationIndex,
  className,
}: ProjectTileProps) {
  const { motionProps } = useProjectTileMotion(animationIndex);

  return (
    <Link
      href={`/blogs/${slug}`}
      className={cn("group block h-full w-full cursor-pointer", className)}
    >
      <m.div {...motionProps} className="relative h-full">
        <ProjectTileGlow large />

        <BlogLinkCardShell
          variant="bento-featured"
          className="min-h-[320px] md:rounded-2xl lg:min-h-[420px]"
        >
          <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-muted lg:aspect-auto lg:min-h-[240px] lg:flex-1">
            <ProjectTileImage
              imageUrl={imageUrl}
              title={title}
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
            <ProjectTileIndex label={formatDisplayIndex(displayIndex)} />
            <div className="absolute left-3 top-3 z-20 lg:left-4 lg:top-4">
              <BlogLinkCardTypeBadge type={type} />
            </div>
          </div>

          <div className="flex flex-col gap-3 p-4 md:gap-4 md:p-5 lg:p-6">
            <ProjectTileTitle
              title={title}
              className="text-2xl leading-tight md:text-3xl lg:text-4xl lg:leading-[1.1]"
            />

            <p className="line-clamp-3 font-sans text-sm leading-relaxed text-muted-foreground md:text-base">
              {description}
            </p>

            <ProjectTileFooter date={date} readTime={readTime} />
          </div>
        </BlogLinkCardShell>
      </m.div>
    </Link>
  );
}
