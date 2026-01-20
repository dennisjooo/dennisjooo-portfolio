'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { PhotoView } from 'react-photo-view';
import { useEffect, useState } from 'react';

interface ArticleHeroProps {
    title: string;
    description: string;
    date: string;
    wordCount: number;
    readTime: number;
    imageUrl?: string;
    type: 'project' | 'blog';
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
    return (
        <header className="w-full mb-12 md:mb-16">
            {/* Back Navigation */}
            <motion.div
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
            </motion.div>

            {/* Meta Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-wrap items-center gap-3 md:gap-4 font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6"
            >
                <span className="px-2 py-1 rounded border border-border">
                    {type === 'project' ? 'Project' : 'Article'}
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <time dateTime={date}>{date}</time>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span>{wordCount.toLocaleString()} words</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span>{readTime} min read</span>
            </motion.div>

            {/* Title - Editorial Style */}
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-playfair italic text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-foreground mb-6"
            >
                {title}
            </motion.h1>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="font-urbanist text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mb-10"
            >
                {description}
            </motion.p>

            {/* Hero Image */}
            {imageUrl && <ArticleHeroImage src={imageUrl} alt={title} />}
        </header>
    );
};

function ArticleHeroImage({ src, alt }: { src: string; alt: string }) {
    const [aspectRatio, setAspectRatio] = useState<number | null>(null);

    useEffect(() => {
        const img = new window.Image();
        img.onload = () => {
            setAspectRatio(img.naturalWidth / img.naturalHeight);
        };
        img.src = src;
    }, [src]);

    return (
        <PhotoView src={src}>
            <motion.figure
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative w-full cursor-zoom-in group"
            >
                {/* Gradient Glow */}
                <div className="absolute -inset-2 bg-gradient-accent rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
                
                {/* Image Container */}
                <div 
                    className="relative w-full overflow-hidden rounded-xl border border-border bg-muted"
                    style={
                        aspectRatio
                            ? {
                                aspectRatio: `${aspectRatio}`,
                                maxHeight: '65vh',
                            }
                            : { minHeight: '300px', maxHeight: '65vh' }
                    }
                >
                    {/* Noise Overlay */}
                    <div 
                        className="absolute inset-0 z-10 pointer-events-none opacity-15 mix-blend-overlay"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                        }}
                    />
                    
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        style={{ objectFit: 'contain' }}
                        className="transition-transform duration-700 group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                        priority
                    />
                    
                    {/* Zoom Hint */}
                    <span className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border font-mono text-xs uppercase tracking-wider text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Click to zoom
                    </span>
                </div>
            </motion.figure>
        </PhotoView>
    );
}
