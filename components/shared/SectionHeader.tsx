'use client';

import { cn } from '@/lib/utils';

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
    return (
        <div 
            className={cn(
                "w-full flex justify-between items-end border-b border-border pb-4",
                "animate-fade-in-up",
                className
            )}
        >
            <span className="font-playfair italic text-3xl md:text-4xl text-foreground">{number}</span>
            <span className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-50 text-muted-foreground">{title}</span>
        </div>
    );
};

// Alias for backward compatibility during migration
export const SectionHeaderAnimated = SectionHeader;
