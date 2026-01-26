'use client';

import { m, useReducedMotion, springConfigs } from '@/components/motion';
import { SectionHeader } from '@/components/shared/SectionHeader';

interface BlogsHeroProps {
    activeTab: 'blog' | 'certifications';
}

const tabCaptions: Record<'blog' | 'certifications', string> = {
    blog: "Projects, tutorials, and experiments I've been building and writing about.",
    certifications: "Professional certifications and credentials that validate my expertise."
};

export const BlogsHero = ({ activeTab }: BlogsHeroProps) => {
    const prefersReducedMotion = useReducedMotion();

    return (
        <div className="w-full mb-10">
            {/* Standard Section Header */}
            <SectionHeader 
                number="" 
                title="Blog & Certifications" 
                className="mb-12"
            />

            {/* Artistic/Editorial Headline */}
            <m.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 50 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={springConfigs.smooth}
                className="relative w-full pt-8 md:pt-12 select-none overflow-hidden"
            >
                <div className="flex flex-col items-end w-full">
                    <m.span 
                        initial={prefersReducedMotion ? undefined : { x: 50, opacity: 0 }}
                        animate={prefersReducedMotion ? undefined : { x: 0, opacity: 1 }}
                        transition={{ ...springConfigs.smooth, delay: 0.2 }}
                        className="font-playfair italic text-3xl md:text-5xl lg:text-6xl mr-2 md:mr-12 mb-[-2vw] md:mb-[-2.5vw] relative z-20 text-foreground"
                    >
                        Explore
                    </m.span>
                    <h1 className="font-urbanist font-black text-[14vw] md:text-[11vw] leading-[0.8] tracking-tighter text-background-layer z-10 select-none">
                        WRITINGS
                    </h1>
                </div>

                {/* Caption */}
                <m.p
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                    animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ ...springConfigs.smooth, delay: 0.4 }}
                    className="font-urbanist text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed max-w-xl mt-8 md:mt-12"
                >
                    {tabCaptions[activeTab]}
                </m.p>
            </m.div>
        </div>
    );
};
