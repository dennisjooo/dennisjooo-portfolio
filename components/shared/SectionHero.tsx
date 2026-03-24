'use client';

import { type ReactNode } from 'react';
import { m, useReducedMotion, springConfigs, viewportSettings } from '@/components/motion';
import { SectionHeader } from './SectionHeader';
import { cn } from '@/lib/utils';

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

function slideVariants(direction: 'left' | 'right') {
    const x = direction === 'left' ? -50 : 50;
    return {
        hidden: { opacity: 0, x },
        visible: {
            opacity: 1,
            x: 0,
            transition: { ...springConfigs.smooth, delay: 0.2 },
        },
    };
}

interface SectionHeroProps {
    sectionNumber: string;
    sectionTitle: string;
    accentText: string;
    headlineText: string;
    caption?: ReactNode;
    alignment?: 'start' | 'end';
    trigger?: 'animate' | 'whileInView';
    accentClassName?: string;
    headlineClassName?: string;
    HeadlineTag?: 'h1' | 'h2';
    className?: string;
    innerClassName?: string;
    headerClassName?: string;
}

export const SectionHero = ({
    sectionNumber,
    sectionTitle,
    accentText,
    headlineText,
    caption,
    alignment = 'start',
    trigger = 'whileInView',
    accentClassName,
    headlineClassName,
    HeadlineTag = 'h2',
    className,
    innerClassName,
    headerClassName,
}: SectionHeroProps) => {
    const prefersReducedMotion = useReducedMotion();
    const isStart = alignment === 'start';
    const useVariants = trigger === 'whileInView';

    const motionContainerProps = prefersReducedMotion
        ? {}
        : useVariants
            ? {
                variants: containerVariants,
                initial: 'hidden' as const,
                whileInView: 'visible' as const,
                viewport: viewportSettings.once,
            }
            : {
                initial: { opacity: 0, y: 50 },
                animate: { opacity: 1, y: 0 },
                transition: springConfigs.smooth,
            };

    const accentMotionProps = prefersReducedMotion
        ? {}
        : useVariants
            ? { variants: slideVariants(isStart ? 'left' : 'right') }
            : {
                initial: { x: isStart ? -50 : 50, opacity: 0 },
                animate: { x: 0, opacity: 1 },
                transition: { ...springConfigs.smooth, delay: 0.2 },
            };

    const headlineMotionProps = prefersReducedMotion
        ? {}
        : useVariants
            ? { variants: fadeUpVariants }
            : {};

    return (
        <div className={cn('w-full', className)}>
            <SectionHeader
                number={sectionNumber}
                title={sectionTitle}
                className={headerClassName ?? "mb-12"}
            />

            <m.div
                {...motionContainerProps}
                className={cn(
                    'relative w-full select-none',
                    trigger === 'animate' && 'overflow-hidden',
                    innerClassName
                )}
            >
                <div className={cn('flex flex-col w-full', isStart ? 'items-start' : 'items-end')}>
                    <m.span
                        {...accentMotionProps}
                        className={cn(
                            'font-playfair italic relative z-20 text-foreground',
                            accentClassName
                        )}
                    >
                        {accentText}
                    </m.span>
                    <HeadlineTag>
                        <m.span
                            {...headlineMotionProps}
                            className={cn(
                                'font-urbanist font-black leading-[0.8] tracking-tighter text-background-layer z-10 select-none block',
                                headlineClassName
                            )}
                        >
                            {headlineText}
                        </m.span>
                    </HeadlineTag>
                </div>

                {caption && (
                    <m.div
                        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                        transition={{ ...springConfigs.smooth, delay: 0.4 }}
                        className="font-urbanist text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed max-w-xl mt-8 md:mt-12"
                    >
                        {caption}
                    </m.div>
                )}
            </m.div>
        </div>
    );
};
