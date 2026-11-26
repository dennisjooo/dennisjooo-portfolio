"use client";

import {
  m,
  articleHeroBackVariants,
  articleHeroMetaVariants,
  articleHeroTitleVariants,
  articleHeroDescriptionVariants,
  useMotionSafeProps,
} from "@/components/motion";
import Image from "next/image";
import { PhotoView } from "react-photo-view";
import { BackToBlogsLink } from "@/components/blogs/article/BackToBlogsLink";
import { useLayoutEffect, useRef, useState } from "react";
import { HoverImageFrame } from "@/components/shared/HoverImageFrame";
import { cn } from "@/lib/utils";
import { getBlogTypeLabel } from "@/lib/utils/projectFormatting";

interface ArticleHeroProps {
  title: string;
  description: string;
  date: string;
  wordCount: number;
  readTime: number;
  imageUrl?: string;
  type: "project" | "blog";
}

export const ArticleHero = ({
  title,
  description,
  date,
  wordCount,
  readTime,
  imageUrl,
  type,
}: ArticleHeroProps) => {
  const backMotion = useMotionSafeProps(articleHeroBackVariants);
  const metaMotion = useMotionSafeProps(articleHeroMetaVariants);
  const titleMotion = useMotionSafeProps(articleHeroTitleVariants);
  const descriptionMotion = useMotionSafeProps(articleHeroDescriptionVariants);

  return (
    <header className="mb-12 w-full md:mb-16">
      <m.div {...backMotion} className="mb-8">
        <BackToBlogsLink>Back to Blogs</BackToBlogsLink>
      </m.div>

      <m.div
        {...metaMotion}
        className="mb-6 flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground md:gap-4"
      >
        <span>{getBlogTypeLabel(type)}</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
        <time dateTime={date}>{date}</time>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
        <span>{wordCount.toLocaleString()} words</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
        <span>{readTime} min read</span>
      </m.div>

      <m.h1
        {...titleMotion}
        className="mb-6 font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl"
      >
        {title}
      </m.h1>

      <m.p
        {...descriptionMotion}
        className="mb-10 max-w-3xl font-sans text-lg leading-relaxed text-muted-foreground md:text-xl"
      >
        {description}
      </m.p>

      {imageUrl && <ArticleHeroImage src={imageUrl} alt={title} />}
    </header>
  );
};

function ArticleHeroImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [src]);

  return (
    <PhotoView src={src}>
      <figure
        className={cn(
          "cursor-zoom-in transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
          loaded ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        )}
      >
        <HoverImageFrame frameClassName="bg-transparent">
          <div className="w-full">
            <Image
              ref={imgRef}
              src={src}
              alt={alt}
              width={0}
              height={0}
              className="h-auto max-h-[70vh] w-full object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              priority
              onLoad={() => setLoaded(true)}
            />
          </div>
        </HoverImageFrame>
      </figure>
    </PhotoView>
  );
}
