"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  m,
  featuredCardVariants,
  useMotionSafeProps,
} from "@/components/motion";
import { cn } from "@/lib/utils";
import { TileImage, TileMeta } from "@/components/shared/list/ContentCard";
import { getBlogTypeLabel } from "@/lib/utils/projectFormatting";

interface FeaturedCardProps {
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  slug: string;
  type?: "project" | "blog";
  readTime?: string;
  displayIndex?: number;
  priority?: boolean;
  wide?: boolean;
}

export const FeaturedCard = ({
  title,
  description,
  date,
  imageUrl,
  slug,
  type,
  readTime,
  displayIndex,
  priority = true,
  wide = false,
}: FeaturedCardProps) => {
  const heroMotion = useMotionSafeProps({
    initial: featuredCardVariants.initial,
    whileInView: featuredCardVariants.whileInView,
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  });

  return (
    <Link
      href={`/blogs/${slug}`}
      className="group flex w-full cursor-pointer rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <m.div
        {...heroMotion}
        className={cn(
          "flex w-full flex-col gap-5",
          wide && "md:grid md:grid-cols-12 md:items-center md:gap-10",
        )}
      >
        <TileImage
          imageUrl={imageUrl}
          title={title}
          displayIndex={displayIndex}
          priority={priority}
          className={cn(
            "aspect-[16/9]",
            wide
              ? "md:col-span-7 md:aspect-[16/10]"
              : "lg:aspect-auto lg:min-h-[340px] lg:flex-1",
          )}
          sizes="(max-width: 768px) 100vw, 58vw"
        />

        <div
          className={cn(
            "flex flex-col gap-3",
            wide && "md:col-span-5 md:gap-4",
          )}
        >
          <TileMeta parts={[type && getBlogTypeLabel(type), date, readTime]} />
          <h3 className="font-caslon text-2xl italic leading-[1.1] tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent md:text-3xl xl:text-4xl">
            {title}
          </h3>
          <p className="line-clamp-2 font-sans text-sm leading-relaxed text-muted-foreground md:text-lg">
            {description}
          </p>
          <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-muted-foreground transition-colors duration-300 group-hover:text-accent">
            <span>Read article</span>
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </m.div>
    </Link>
  );
};
