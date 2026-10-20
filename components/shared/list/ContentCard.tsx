"use client";

import Image from "next/image";
import Link from "next/link";
import { m, useFadeUpInView } from "@/components/motion";
import { cn } from "@/lib/utils";
import { getBlogTypeLabel } from "@/lib/utils/projectFormatting";

interface ContentCardProps {
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  slug: string;
  index: number;
  displayIndex?: number;
  type?: "project" | "blog";
  readTime?: string;
}

interface TileImageProps {
  imageUrl?: string;
  title: string;
  sizes: string;
  displayIndex?: number;
  priority?: boolean;
  className?: string;
}

export function TileImage({
  imageUrl,
  title,
  sizes,
  displayIndex,
  priority,
  className,
}: TileImageProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl bg-muted",
        className,
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]"
          sizes={sizes}
        />
      ) : (
        <div className="bg-noise relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-secondary to-muted">
          <span
            aria-hidden
            className="select-none font-caslon text-[10rem] italic leading-none text-foreground/10 transition-transform duration-500 group-hover:scale-110"
          >
            {title.charAt(0)}
          </span>
        </div>
      )}

      {displayIndex !== undefined && (
        <span className="absolute right-4 top-4 z-20 font-mono text-xs uppercase tracking-[0.25em] text-white/80 drop-shadow">
          {String(displayIndex).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}

export function TileMeta({
  parts,
  className,
}: {
  parts: (string | undefined)[];
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-xs uppercase tracking-widest text-muted-foreground",
        className,
      )}
    >
      {parts.filter(Boolean).join(" · ")}
    </p>
  );
}

export const ContentCard = ({
  title,
  description,
  date,
  imageUrl,
  slug,
  index,
  displayIndex,
  type,
  readTime,
}: ContentCardProps) => {
  const { motionProps } = useFadeUpInView({ index, y: 30 });

  return (
    <Link
      href={`/blogs/${slug}`}
      className="group block h-full w-full cursor-pointer rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <m.div {...motionProps}>
        <TileImage
          imageUrl={imageUrl}
          title={title}
          displayIndex={displayIndex}
          className="aspect-[16/10]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        <div className="mt-4 flex flex-col gap-2">
          <TileMeta parts={[type && getBlogTypeLabel(type), date, readTime]} />
          <h3 className="font-caslon text-2xl italic leading-tight tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent md:text-3xl lg:text-2xl">
            {title}
          </h3>
          <p className="line-clamp-2 font-sans text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
        </div>
      </m.div>
    </Link>
  );
};

export const CompactCard = ({
  title,
  description,
  date,
  imageUrl,
  slug,
  index,
  displayIndex,
  type,
}: ContentCardProps) => {
  const { motionProps } = useFadeUpInView({ index, y: 20 });

  return (
    <Link
      href={`/blogs/${slug}`}
      className="group block w-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent lg:flex"
    >
      <m.div {...motionProps} className="flex w-full gap-4 md:gap-5">
        <TileImage
          imageUrl={imageUrl}
          title={title}
          className="aspect-[16/10] w-32 shrink-0 self-start rounded-xl md:w-40 lg:w-[46%]"
          sizes="176px"
        />

        <div className="flex min-w-0 flex-col justify-center gap-2">
          <TileMeta
            parts={[
              displayIndex !== undefined
                ? String(displayIndex).padStart(2, "0")
                : undefined,
              type && getBlogTypeLabel(type),
              date,
            ]}
            className="tracking-wider"
          />
          <h3 className="line-clamp-3 font-caslon text-xl italic leading-tight tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent md:text-2xl lg:text-3xl">
            {title}
          </h3>
          <p className="line-clamp-2 font-sans text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </m.div>
    </Link>
  );
};
