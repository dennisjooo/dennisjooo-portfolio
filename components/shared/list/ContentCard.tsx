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
      className="block group w-full cursor-pointer h-full"
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
        <article className="relative flex flex-col h-full rounded-xl border border-border bg-card overflow-hidden transition-colors duration-300 group-hover:border-foreground/30">
          <m.div
            layoutId={`hero-image-${slug}`}
            className="relative w-full aspect-[16/9] bg-muted overflow-hidden"
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
              <div className="w-full h-full bg-gradient-to-br from-secondary to-muted" />
            )}

            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500 z-10" />

            {type && (
              <div className="absolute top-3 left-3 z-20">
                <span className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest bg-background/80 backdrop-blur-sm rounded border border-border text-muted-foreground">
                  {getBlogTypeLabel(type)}
                </span>
              </div>
            )}
          </m.div>

          <div className="flex flex-col gap-3 p-4 md:p-5 flex-1">
            <m.h3
              layoutId={`hero-title-${slug}`}
              className={cn(
                "font-caslon italic tracking-tight text-foreground group-hover:text-accent transition-colors duration-300",
                isFeatured
                  ? "text-2xl md:text-3xl leading-[0.9]"
                  : "text-xl md:text-2xl leading-tight",
              )}
            >
              {title}
            </m.h3>

            <p className="font-sans text-muted-foreground text-sm leading-relaxed line-clamp-2 flex-1">
              {description}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-widest">
                <span>{date}</span>
                {readTime && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                    <span>{readTime}</span>
                  </>
                )}
              </div>

              <ArrowUpRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
            </div>
          </div>
        </article>
      </m.div>
    </Link>
  );
};
