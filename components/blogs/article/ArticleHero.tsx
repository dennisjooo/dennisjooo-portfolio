"use client";

import {
  m,
  articleHeroBackVariants,
  articleHeroMetaVariants,
  articleHeroTitleVariants,
  articleHeroDescriptionVariants,
  articleHeroImageVariants,
  useMotionSafeProps,
} from "@/components/motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PhotoView } from "react-photo-view";
import { useState } from "react";
import { HoverImageFrame } from "@/components/shared/HoverImageFrame";
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
        <Link
          href="/blogs"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Blogs
        </Link>
      </m.div>

      <m.div
        {...metaMotion}
        className="mb-6 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted-foreground md:gap-4"
      >
        <span className="rounded border border-border px-2 py-1">
          {getBlogTypeLabel(type)}
        </span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
        <time dateTime={date}>{date}</time>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
        <span>{wordCount.toLocaleString()} words</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
        <span>{readTime} min read</span>
      </m.div>

      <m.h1
        {...titleMotion}
        className="mb-6 font-caslon text-4xl italic leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl"
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
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const imageMotion = useMotionSafeProps(articleHeroImageVariants);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    }
  };

  return (
    <PhotoView src={src}>
      <m.figure {...imageMotion} className="cursor-zoom-in">
        <HoverImageFrame frameClassName="shadow-lg">
          <div
            className="relative w-full"
            style={
              aspectRatio
                ? {
                    aspectRatio: `${aspectRatio}`,
                    maxHeight: "70vh",
                  }
                : { minHeight: "300px", maxHeight: "70vh" }
            }
          >
            <Image
              src={src}
              alt={alt}
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              priority
              onLoad={handleImageLoad}
            />
          </div>
        </HoverImageFrame>
      </m.figure>
    </PhotoView>
  );
}
