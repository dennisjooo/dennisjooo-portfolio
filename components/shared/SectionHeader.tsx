'use client';

import { cn } from '@/lib/utils';
import { m, useReducedMotion, springConfigs, viewportSettings } from '@/components/motion';

interface SectionHeaderProps {
    number: string;
    title: string;
    className?: string;
}

const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: springConfigs.smooth
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
            initial={prefersReducedMotion ? undefined : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "visible"}
            viewport={viewportSettings.once}
            className={cn(
                "w-full flex justify-between items-end border-b border-border pb-4",
                className
            )}
        >
            <span className="font-playfair italic text-3xl md:text-4xl text-foreground">{number}</span>
            <span className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-50 text-muted-foreground">{title}</span>
        </m.div>
    );
};

// Alias for backward compatibility during migration
export const SectionHeaderAnimated = SectionHeader;
