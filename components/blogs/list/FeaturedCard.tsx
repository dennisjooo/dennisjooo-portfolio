'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { m, useReducedMotion, springConfigs } from '@/components/motion';
import { NOISE_OVERLAY_LIGHT } from '@/lib/constants/noiseOverlay';
import { getBlogTypeLabel } from '@/lib/utils/projectFormatting';

interface FeaturedCardProps {
    title: string;
    description: string;
    date: string;
    imageUrl?: string;
    slug: string;
    type?: 'project' | 'blog';
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
    const prefersReducedMotion = useReducedMotion();

    return (
        <Link href={`/blogs/${slug}`} className="block group w-full cursor-pointer mb-12 md:mb-16">
            <m.article
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 40 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={springConfigs.smooth}
                className="relative grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-10 rounded-2xl border border-border bg-card p-4 md:p-6 overflow-hidden"
            >
                {/* Gradient glow on hover */}
                <div className="absolute -inset-1 bg-gradient-accent rounded-2xl opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-700 -z-10" />

                {/* Image - 3 columns on desktop */}
                <div className="relative md:col-span-3 w-full aspect-[16/9] md:aspect-auto md:min-h-[320px] rounded-xl overflow-hidden bg-muted">
                    <div
                        className="absolute inset-0 z-10 pointer-events-none opacity-20 mix-blend-overlay hidden md:block"
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
                        <div className="w-full h-full bg-gradient-to-br from-secondary to-muted" />
                    )}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500 z-10" />
                </div>

                {/* Content - 2 columns on desktop */}
                <div className="md:col-span-2 flex flex-col justify-center gap-4 py-2 md:py-4">
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        {type && (
                            <span className="px-2 py-1 rounded border border-border bg-muted/50">
                                {getBlogTypeLabel(type)}
                            </span>
                        )}
                        <span>{date}</span>
                        {readTime && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                                <span>{readTime}</span>
                            </>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="font-playfair italic text-3xl md:text-4xl tracking-tight leading-[1.1] text-foreground group-hover:text-accent transition-colors duration-300">
                        {title}
                    </h3>

                    {/* Description - not truncated */}
                    <p className="font-urbanist text-muted-foreground text-base leading-relaxed line-clamp-4">
                        {description}
                    </p>

                    {/* Read article link */}
                    <div className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-muted-foreground group-hover:text-accent transition-colors duration-300 mt-2">
                        <span>Read article</span>
                        <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                </div>
            </m.article>
        </Link>
    );
};
