"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import {
  m,
  useReducedMotion,
  springConfigs,
  viewportSettings,
} from "@/components/motion";
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
  variant?: "featured" | "standard";
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
  variant = "standard",
}: ContentCardProps) => {
  const isFeatured = variant === "featured";
  const prefersReducedMotion = useReducedMotion();

  const animationDelay = isFeatured
    ? index * 0.15
    : Math.min(index * 0.08, 0.24);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: isFeatured ? 50 : 30,
      scale: isFeatured ? 0.95 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        ...springConfigs.smooth,
        delay: animationDelay,
      },
    },
  };

  const hoverY = -6;

  return (
    <Link
      href={`/blogs/${slug}`}
      className="group block h-full w-full cursor-pointer"
    >
      <m.div
        variants={
          prefersReducedMotion
            ? undefined
            : isFeatured
              ? undefined
              : cardVariants
        }
        initial={
          prefersReducedMotion ? undefined : isFeatured ? undefined : "hidden"
        }
        whileInView={
          prefersReducedMotion ? undefined : isFeatured ? undefined : "visible"
        }
        viewport={isFeatured ? undefined : viewportSettings.once}
        whileHover={
          prefersReducedMotion
            ? undefined
            : { y: hoverY, transition: springConfigs.snappy }
        }
        className="relative h-full"
      >
        <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-300 group-hover:border-foreground/30">
          <m.div
            layoutId={`hero-image-${slug}`}
            className="relative aspect-[16/9] w-full overflow-hidden bg-muted"
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                loading="lazy"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-secondary to-muted" />
            )}

            <div className="absolute inset-0 z-10 bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/5" />

            {type && (
              <div className="absolute left-3 top-3 z-20">
                <span className="rounded border border-border bg-background/80 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
                  {getBlogTypeLabel(type)}
                </span>
              </div>
            )}
          </m.div>

          <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
            <m.h3
              layoutId={`hero-title-${slug}`}
              className={cn(
                "font-caslon italic tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent",
                isFeatured
                  ? "text-2xl leading-[0.9] md:text-3xl"
                  : "text-xl leading-tight md:text-2xl",
              )}
            >
              {title}
            </m.h3>

            <p className="line-clamp-2 flex-1 font-sans text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>

            <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
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
          </div>
        </article>
      </m.div>
    </Link>
  );
};
