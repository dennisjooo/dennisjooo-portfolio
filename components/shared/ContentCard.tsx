'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { m, useReducedMotion, springConfigs, viewportSettings } from '@/components/motion';

interface ContentCardProps {
    title: string;
    description: string;
    date: string;
    imageUrl?: string;
    slug: string;
    index: number;
    type?: 'project' | 'blog';
    readTime?: string;
    variant?: 'featured' | 'standard';
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
    variant = 'standard',
}: ContentCardProps) => {
    const isFeatured = variant === 'featured';
    const prefersReducedMotion = useReducedMotion();
    
    // Stagger delay: featured cards get more time between reveals
    const animationDelay = isFeatured ? index * 0.15 : Math.min(index * 0.08, 0.24);

    // Animation variants
    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: isFeatured ? 50 : 30, 
            scale: isFeatured ? 0.95 : 1 
        },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
                ...springConfigs.smooth,
                delay: animationDelay,
            }
        },
    };

    // Hover lift amounts
    const hoverY = isFeatured ? -12 : -6;

    return (
        <Link href={`/blogs/${slug}`} className="block group w-full cursor-pointer h-full">
            <m.article
                variants={prefersReducedMotion ? undefined : cardVariants}
                initial={prefersReducedMotion ? undefined : "hidden"}
                whileInView={prefersReducedMotion ? undefined : "visible"}
                viewport={isFeatured ? viewportSettings.onceDeep : viewportSettings.once}
                whileHover={prefersReducedMotion ? undefined : { y: hoverY, transition: springConfigs.snappy }}
                className="flex flex-col gap-4 h-full"
            >
                {/* Card Wrapper for Glow */}
                <div className="relative w-full aspect-[4/3]">
                    {/* Gradient Glow */}
                    <div className={cn(
                        "absolute -inset-1 bg-gradient-accent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                        isFeatured ? "blur-lg" : "blur-md"
                    )} />
                    
                    {/* Image Container - Poster Style */}
                    <div className="relative w-full h-full bg-muted overflow-hidden rounded-md border border-border">
                        {/* Noise Overlay */}
                        <div 
                            className="absolute inset-0 z-10 pointer-events-none opacity-20 mix-blend-overlay hidden md:block"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                            }}
                        />
                        
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={title}
                                fill
                                loading="lazy"
                                className={cn(
                                    "object-cover transition-transform duration-700 ease-out",
                                    isFeatured ? "group-hover:scale-110" : "group-hover:scale-105"
                                )}
                                sizes={isFeatured 
                                    ? "(max-width: 768px) 100vw, 33vw"
                                    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                }
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-secondary to-muted" />
                        )}
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500 z-10" />
                        
                        {/* Type Badge - Only if type is provided */}
                        {type && (
                            <div className="absolute top-3 left-3 z-20">
                                <span className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest bg-background/80 backdrop-blur-sm rounded border border-border text-muted-foreground">
                                    {type === 'project' ? 'Project' : 'Article'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content - Editorial Layout */}
                <div className="flex flex-col gap-2 relative flex-1">
                    {/* Header Line */}
                    <div className="flex items-baseline justify-between border-b border-border pb-2 mb-2">
                        {isFeatured ? (
                             <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                                0{index + 1} — {date}
                            </span>
                        ) : (
                            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-widest">
                                <span>0{(index % 9) + 1}</span>
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                                <span>{date}</span>
                                {readTime && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                                        <span>{readTime}</span>
                                    </>
                                )}
                            </div>
                        )}
                        
                        <ArrowUpRightIcon className={cn(
                            "w-4 h-4 text-muted-foreground group-hover:text-foreground transition-all duration-300",
                            !isFeatured && "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        )} />
                    </div>

                    <h3 className={cn(
                        "font-playfair italic tracking-tight text-foreground group-hover:text-accent transition-colors duration-300",
                        isFeatured 
                            ? "text-2xl md:text-3xl leading-[0.9]" 
                            : "text-xl md:text-2xl leading-tight"
                    )}>
                        {title}
                    </h3>

                    <p className="font-urbanist text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {description}
                    </p>
                </div>
            </m.article>
        </Link>
    );
};
