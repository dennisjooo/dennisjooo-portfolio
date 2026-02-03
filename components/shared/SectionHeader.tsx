'use client';

import { cn } from '@/lib/utils';
import { m, useReducedMotion, springConfigs, viewportSettings } from '@/components/motion';

interface SectionHeaderProps {
    number: string;
    title: string;
    className?: string;
}

export const SectionHeader = ({ 
    number, 
    title, 
    className,
}: SectionHeaderProps) => {
    const prefersReducedMotion = useReducedMotion();

    // If reduced motion is enabled, skip animations entirely
    if (prefersReducedMotion) {
        return (
            <div 
                className={cn(
                    "w-full flex justify-between items-end border-b border-border pb-4",
                    className
                )}
            >
                <span className="font-playfair italic text-3xl md:text-4xl text-foreground">{number}</span>
                <span className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-50 text-muted-foreground">{title}</span>
            </div>
        );
    }

    return (
        <m.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportSettings.once}
            transition={springConfigs.smooth}
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
