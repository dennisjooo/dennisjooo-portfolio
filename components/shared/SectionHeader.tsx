'use client';

import { cn } from '@/lib/utils';
import { m, useReducedMotion, springConfigs, viewportSettings } from '@/components/motion';

interface SectionHeaderProps {
    number: string;
    title: string;
    className?: string;
}

const headerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: springConfigs.smooth,
    },
};

const underlineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
        scaleX: 1,
        opacity: 1,
        transition: { ...springConfigs.smooth, delay: 0.3 },
    },
};

export const SectionHeader = ({
    number,
    title,
    className,
}: SectionHeaderProps) => {
    const prefersReducedMotion = useReducedMotion();

    return (
        <m.div
            variants={prefersReducedMotion ? undefined : headerVariants}
            initial={prefersReducedMotion ? undefined : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={viewportSettings.once}
            className={cn(
                'relative w-full flex justify-between items-end border-b border-border pb-4',
                className
            )}
        >
            <m.span
                variants={prefersReducedMotion ? undefined : itemVariants}
                className="font-playfair italic text-3xl md:text-4xl text-foreground"
            >
                {number}
            </m.span>
            <m.span
                variants={prefersReducedMotion ? undefined : itemVariants}
                className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-70 text-muted-foreground"
            >
                {title}
            </m.span>
            <m.div
                variants={prefersReducedMotion ? undefined : underlineVariants}
                className="absolute bottom-0 left-0 right-0 h-px bg-gradient-accent origin-left"
                style={{ boxShadow: '0 0 8px var(--accent-shadow)' }}
            />
        </m.div>
    );
};
