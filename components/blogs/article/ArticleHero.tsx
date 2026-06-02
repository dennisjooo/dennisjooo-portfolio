'use client';

import { m } from '@/components/motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { PhotoView } from 'react-photo-view';
import { useState } from 'react';
import { HoverImageFrame } from '@/components/shared/HoverImageFrame';
import { NOISE_OVERLAY_HEAVY } from '@/lib/constants/noiseOverlay';
import { getBlogTypeLabel } from '@/lib/utils/projectFormatting';

interface ArticleHeroProps {
    title: string;
    description: string;
    date: string;
    wordCount: number;
    readTime: number;
    imageUrl?: string;
    type: 'project' | 'blog';
    slug: string;
}

export const ArticleHero = ({
    title,
    description,
    date,
    wordCount,
    readTime,
    imageUrl,
    type,
    slug,
}: ArticleHeroProps) => {
    return (
        <header className="w-full mb-12 md:mb-16">
            {/* Back Navigation */}
            <m.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <Link
                    href="/blogs"
                    className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Blogs
                </Link>
            </m.div>

            {/* Meta Bar */}
            <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-wrap items-center gap-3 md:gap-4 font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6"
            >
                <span className="px-2 py-1 rounded border border-border">
                    {getBlogTypeLabel(type)}
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <time dateTime={date}>{date}</time>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span>{wordCount.toLocaleString()} words</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span>{readTime} min read</span>
            </m.div>

            {/* Title - Editorial Style */}
            <m.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-playfair italic text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-foreground mb-6"
            >
                {title}
            </m.h1>

            {/* Description */}
            <m.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="font-sans text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mb-10"
            >
                {description}
            </m.p>

            {/* Hero Image - Full Bleed */}
            {imageUrl && <ArticleHeroImage src={imageUrl} alt={title} slug={slug} />}
        </header>
    );
};

function ArticleHeroImage({ src, alt, slug }: { src: string; alt: string; slug: string }) {
    const [aspectRatio, setAspectRatio] = useState<number | null>(null);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        if (img.naturalWidth && img.naturalHeight) {
            setAspectRatio(img.naturalWidth / img.naturalHeight);
        }
    };

    return (
        <PhotoView src={src}>
            <m.figure
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="cursor-zoom-in"
            >
                <HoverImageFrame frameClassName="shadow-lg">
                    <m.div
                        layoutId={`hero-image-${slug}`}
                        className="relative w-full"
                        style={
                            aspectRatio
                                ? {
                                      aspectRatio: `${aspectRatio}`,
                                      maxHeight: '70vh',
                                  }
                                : { minHeight: '300px', maxHeight: '70vh' }
                        }
                    >
                        <div
                            className="absolute inset-0 z-10 pointer-events-none opacity-15 mix-blend-overlay"
                            style={{ backgroundImage: NOISE_OVERLAY_HEAVY }}
                        />

                        <Image
                            src={src}
                            alt={alt}
                            fill
                            style={{ objectFit: 'contain' }}
                            className="transition-transform duration-700 ease-out group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                            priority
                            onLoad={handleImageLoad}
                        />

                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500 z-10 pointer-events-none" />

                        <span className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border font-mono text-xs uppercase tracking-wider text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Click to zoom
                        </span>
                    </m.div>
                </HoverImageFrame>
            </m.figure>
        </PhotoView>
    );
}
