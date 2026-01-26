'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { GradientUnderline } from '@/components/shared';
import { m, useReducedMotion, springConfigs, viewportSettings } from '@/components/motion';

const buttonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            ...springConfigs.smooth,
            delay: 0.3,
        },
    },
};

export const ViewAllButton = () => {
    const prefersReducedMotion = useReducedMotion();

    return (
        <m.div
            variants={prefersReducedMotion ? undefined : buttonVariants}
            initial={prefersReducedMotion ? undefined : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "visible"}
            viewport={viewportSettings.once}
            className="w-full flex justify-center mt-20 md:mt-32"
        >
            <Link
                href="/blogs"
                prefetch
                className="group relative inline-flex items-center gap-3 py-2"
            >
                <GradientUnderline trigger="hover" className="font-urbanist font-bold text-lg md:text-xl uppercase tracking-widest text-foreground transition-colors duration-300 group-hover:text-accent">
                    All Projects
                </GradientUnderline>
                
                <ArrowRightIcon className="w-5 h-5 text-foreground transform transition-all duration-300 group-hover:translate-x-2 group-hover:text-accent" />
            </Link>
        </m.div>
    );
};
