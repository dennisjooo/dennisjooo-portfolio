"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import {
  m,
  springConfigs,
  featuredCardVariants,
  useMotionSafeProps,
} from "@/components/motion";
import {
  BlogLinkCardGlow,
  BlogLinkCardShell,
  BlogLinkCardTypeBadge,
} from "@/components/shared/list/BlogLinkCard";
import { NOISE_OVERLAY_LIGHT } from "@/lib/constants/noiseOverlay";
import { getBlogTypeLabel } from "@/lib/utils/projectFormatting";

interface FeaturedCardProps {
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  slug: string;
  type?: "project" | "blog";
  readTime?: string;
}

export const FeaturedCard = ({
  title,
  description,
  date,
  imageUrl,
  slug,
  type,
  readTime,
}: FeaturedCardProps) => {
  const heroMotion = useMotionSafeProps({
    initial: featuredCardVariants.initial,
    whileInView: featuredCardVariants.whileInView,
    viewport: { once: true, margin: "-50px" },
    transition: springConfigs.smooth,
  });

  return (
    <Link
      href={`/blogs/${slug}`}
      className="group mb-12 block w-full cursor-pointer md:mb-16"
    >
      <m.div {...heroMotion} className="relative">
        <BlogLinkCardGlow large />

        <BlogLinkCardShell variant="featured">
          {/* Image */}
          <m.div
            layoutId={`hero-image-${slug}`}
            className="relative aspect-[16/9] w-full overflow-hidden bg-muted md:col-span-3 md:aspect-auto md:min-h-[320px] md:rounded-xl"
          >
            <div
              className="pointer-events-none absolute inset-0 z-10 hidden opacity-20 mix-blend-overlay md:block"
              style={{ backgroundImage: NOISE_OVERLAY_LIGHT }}
            />
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-secondary to-muted" />
            )}
            <div className="absolute inset-0 z-10 bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/5" />

            {/* Type badge overlaid on image (mobile only) */}
            {type && (
              <div className="absolute left-3 top-3 z-20 md:hidden">
                <BlogLinkCardTypeBadge type={type} />
              </div>
            )}
          </m.div>

          {/* Content */}
          <div className="flex flex-col justify-center gap-3 p-4 md:col-span-2 md:gap-4 md:p-0 md:py-4">
            {/* Meta (desktop only) */}
            <div className="hidden flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground md:flex">
              {type && (
                <span className="rounded border border-border bg-muted/50 px-2 py-1">
                  {getBlogTypeLabel(type)}
                </span>
              )}
              <span>{date}</span>
              {readTime && (
                <>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                  <span>{readTime}</span>
                </>
              )}
            </div>

            {/* Title */}
            <m.h3
              layoutId={`hero-title-${slug}`}
              className="font-caslon text-xl italic leading-tight tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent md:text-4xl md:leading-[1.1]"
            >
              {title}
            </m.h3>

            {/* Description */}
            <p className="line-clamp-2 font-sans text-sm leading-relaxed text-muted-foreground md:line-clamp-4 md:text-base">
              {description}
            </p>

            {/* Mobile footer - matches ContentCard */}
            <div className="mt-auto flex items-center justify-between border-t border-border pt-3 md:hidden">
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

            {/* Desktop footer - read article link */}
            <div className="mt-2 hidden items-center gap-2 font-mono text-sm uppercase tracking-wider text-muted-foreground transition-colors duration-300 group-hover:text-accent md:flex">
              <span>Read article</span>
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </BlogLinkCardShell>
      </m.div>
    </Link>
  );
};
