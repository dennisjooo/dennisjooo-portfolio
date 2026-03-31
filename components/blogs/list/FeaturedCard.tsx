'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';
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
            <m.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 40 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={springConfigs.smooth}
                className="relative"
            >
                {/* Gradient border glow */}
                <div className="absolute -inset-px bg-gradient-accent rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <article className="relative grid grid-cols-1 md:grid-cols-5 md:gap-10 rounded-xl md:rounded-2xl border border-border bg-card md:p-6 overflow-hidden">

                {/* Image */}
                <div className="relative md:col-span-3 w-full aspect-[16/9] md:aspect-auto md:min-h-[320px] md:rounded-xl overflow-hidden bg-muted">
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

                    {/* Type badge overlaid on image (mobile only) */}
                    {type && (
                        <div className="absolute top-3 left-3 z-20 md:hidden">
                            <span className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest bg-background/80 backdrop-blur-sm rounded border border-border text-muted-foreground">
                                {getBlogTypeLabel(type)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="md:col-span-2 flex flex-col justify-center gap-3 md:gap-4 p-4 md:p-0 md:py-4">
                    {/* Meta (desktop only) */}
                    <div className="hidden md:flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
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
                    <h3 className="font-playfair italic text-xl md:text-4xl tracking-tight leading-tight md:leading-[1.1] text-foreground group-hover:text-accent transition-colors duration-300">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="font-sans text-muted-foreground text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-4">
                        {description}
                    </p>

                    {/* Mobile footer - matches ContentCard */}
                    <div className="flex items-center justify-between pt-3 border-t border-border mt-auto md:hidden">
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

                    {/* Desktop footer - read article link */}
                    <div className="hidden md:flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-muted-foreground group-hover:text-accent transition-colors duration-300 mt-2">
                        <span>Read article</span>
                        <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                </div>
                </article>
            </m.div>
        </Link>
    );
};
