'use client';

import { HERO_CONTENT } from '@/data/heroContent';
import { useTypingEffect } from '@/lib/hooks/useTypingEffect';
import { BlinkingCursor } from '@/components/shared/BlinkingCursor';

/**
 * Typing effect for hero role description
 * Client component - loads after LCP completes
 * Uses min-height to prevent CLS when text changes
 */
export function HeroTypingRole() {
    // Delay typing start by 800ms to ensure LCP completes first
    const description = useTypingEffect(HERO_CONTENT.descriptions, 800);

    return (
        <div
            className="max-w-md text-sm md:text-xl lg:text-2xl font-light leading-relaxed text-foreground/90 text-left animate-fade-in-up min-h-[4rem] md:min-h-[5rem]"
            style={{ animationDelay: '1000ms' }}
        >
            <span className="font-mono text-[10px] md:text-xs lg:text-sm opacity-50 block mb-2 uppercase tracking-wider">
                Role
            </span>
            {description}<BlinkingCursor cursor="|" />
        </div>
    );
}
