"use client";

import Link from "next/link";
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
      className="group flex w-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <m.div
        {...heroMotion}
        className={cn(
          "flex w-full flex-col gap-4",
          wide && "md:grid md:grid-cols-12 md:items-center md:gap-10",
        )}
      >
        <TileImage
          imageUrl={imageUrl}
          title={title}
          priority={priority}
          className={cn(
            "aspect-[16/10]",
            wide
              ? "md:col-span-7 md:aspect-[16/10]"
              : "lg:aspect-auto lg:min-h-[340px] lg:flex-1",
          )}
          sizes="(max-width: 768px) 100vw, 58vw"
        />

        <div
          className={cn(
            "flex flex-col gap-2 md:gap-3",
            wide && "md:col-span-5 md:gap-4",
          )}
        >
          <TileMeta
            parts={[
              displayIndex !== undefined
                ? String(displayIndex).padStart(2, "0")
                : undefined,
              type && getBlogTypeLabel(type),
              date,
              readTime,
            ]}
            className="tracking-wider"
          />
          <h3 className="font-serif text-2xl leading-tight tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent md:text-3xl md:leading-[1.1] xl:text-4xl">
            {title}
          </h3>
          <p className="line-clamp-2 font-sans text-sm leading-relaxed text-muted-foreground md:text-lg">
            {description}
          </p>
        </div>
      </m.div>
    </Link>
  );
};
