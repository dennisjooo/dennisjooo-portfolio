"use client";

import Image from "next/image";
import Link from "next/link";
import { m, useFadeUpInView } from "@/components/motion";
import {
  BlogLinkCardGlow,
  BlogLinkCardMeta,
  BlogLinkCardShell,
} from "@/components/shared/list/BlogLinkCard";
import { getBlogTypeLabel } from "@/lib/utils/projectFormatting";

interface ContentCardProps {
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  slug: string;
  index: number;
  type?: "project" | "blog";
  readTime?: string;
}

export const ContentCard = ({
  title,
  description,
  date,
  imageUrl,
  slug,
  index,
  type,
  readTime,
}: ContentCardProps) => {
  const { motionProps } = useFadeUpInView({ index, y: 30 });

  return (
    <Link
      href={`/blogs/${slug}`}
      className="group block h-full w-full cursor-pointer"
    >
      <m.div {...motionProps} className="relative h-full">
        <BlogLinkCardGlow />
        <BlogLinkCardShell variant="grid">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-secondary to-muted" />
            )}

            {type && (
              <div className="absolute left-3 top-3 z-20">
                <span className="rounded border border-border bg-background/80 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
                  {getBlogTypeLabel(type)}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
            <h3 className="font-caslon text-xl italic leading-tight tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent md:text-2xl">
              {title}
            </h3>

            <p className="line-clamp-2 flex-1 font-sans text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>

            <BlogLinkCardMeta date={date} readTime={readTime} />
          </div>
        </BlogLinkCardShell>
      </m.div>
    </Link>
  );
};
