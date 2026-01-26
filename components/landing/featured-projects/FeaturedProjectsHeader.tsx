'use client';

import { SectionHeader } from '@/components/shared/SectionHeader';
import { m, useReducedMotion, springConfigs, viewportSettings } from '@/components/motion';

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: springConfigs.smooth,
    },
};

const slideInVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
        opacity: 1, 
        x: 0,
        transition: {
            ...springConfigs.smooth,
            delay: 0.2,
        },
    },
};

export const FeaturedProjectsHeader = () => {
    const prefersReducedMotion = useReducedMotion();

    return (
        <div className="w-full mb-16 md:mb-24">
            <SectionHeader 
                number="04." 
                title="Featured Projects" 
                className="mb-12"
            />

            <m.div
                variants={prefersReducedMotion ? undefined : containerVariants}
                initial={prefersReducedMotion ? undefined : "hidden"}
                whileInView={prefersReducedMotion ? undefined : "visible"}
                viewport={viewportSettings.once}
                className="relative w-full pt-12 select-none"
            >
                <div className="flex flex-col items-start w-full">
                    <m.span 
                        variants={prefersReducedMotion ? undefined : slideInVariants}
                        className="font-playfair italic text-7xl md:text-9xl ml-2 md:ml-12 mb-[-3vw] md:mb-[-4vw] relative z-20 text-foreground"
                    >
                        Selected
                    </m.span>
                    <m.h2 
                        variants={prefersReducedMotion ? undefined : fadeUpVariants}
                        className="font-urbanist font-black text-[15vw] md:text-[12vw] leading-[0.8] tracking-tighter text-background-layer z-10 select-none"
                    >
                        WORK
                    </m.h2>
                </div>
            </m.div>
        </div>
    );
};
