'use client';

import { AnimatePresence, m, springConfigs, useReducedMotion } from '@/components/motion';

interface BlogsHeroProps {
    activeTab: 'blog' | 'certifications';
}

const tabTitles: Record<'blog' | 'certifications', string> = {
    blog: 'Blogs',
    certifications: 'Certifications',
};

const tabCaptions: Record<'blog' | 'certifications', string> = {
    blog: "Things I've built and written about (mostly coherent).",
    certifications: "Stuff that (supposedly) validates my expertise."
};

export const BlogsHero = ({ activeTab }: BlogsHeroProps) => {
    const prefersReducedMotion = useReducedMotion();

    return (
        <header className="w-full mb-8 md:mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Blog & Certifications
            </p>

            <AnimatePresence mode="wait">
                <m.h1
                    key={activeTab}
                    initial={prefersReducedMotion ? false : { opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, x: 24 }}
                    transition={prefersReducedMotion ? { duration: 0 } : springConfigs.snappy}
                    className="font-playfair italic text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-foreground mb-4"
                >
                    {tabTitles[activeTab]}
                </m.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
                <m.p
                    key={activeTab}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
                    transition={
                        prefersReducedMotion
                            ? { duration: 0 }
                            : { ...springConfigs.smooth, delay: 0.1 }
                    }
                    className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl"
                >
                    {tabCaptions[activeTab]}
                </m.p>
            </AnimatePresence>
        </header>
    );
};
