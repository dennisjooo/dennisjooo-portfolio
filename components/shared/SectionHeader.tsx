import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
    number: string;
    title: string;
    className?: string;
    isVisible?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
    number, 
    title, 
    className,
    isVisible = false 
}) => {
    return (
        <div 
            className={cn(
                "w-full flex justify-between items-end border-b border-border pb-4",
                "translate-y-5 opacity-0 transition-all duration-[600ms] ease-out",
                isVisible && "translate-y-0 opacity-100",
                className
            )}
        >
            <span className="font-playfair italic text-3xl md:text-4xl text-foreground">{number}</span>
            <span className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-50 text-muted-foreground">{title}</span>
        </div>
    );
};
