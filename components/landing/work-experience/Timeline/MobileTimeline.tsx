"use client";

import React, { useState, useMemo, useCallback, useRef, useLayoutEffect, useEffect } from 'react';
import { TimelineItemData } from '@/lib/types/workExperience';
import { groupItemsByCompany } from '@/lib/utils/workExperience';
import { MobileWorkCard } from './MobileWorkCard';
import { m, useReducedMotion, springConfigs, viewportSettings } from '@/components/motion';

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: springConfigs.smooth,
    },
};

interface MobileTimelineProps {
    items: TimelineItemData[];
}

export const MobileTimeline: React.FC<MobileTimelineProps> = ({ items }) => {
    const prefersReducedMotion = useReducedMotion();
    const groupedItems = useMemo(() => groupItemsByCompany(items), [items]);

    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const pinnedCard = useRef<{ index: number; viewportTop: number } | null>(null);

    const isInitialMount = useRef(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            isInitialMount.current = false;
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    useLayoutEffect(() => {
        if (isInitialMount.current) return;

        const expandedElement = expandedIndex !== null ? cardRefs.current[expandedIndex] : null;

        if (pinnedCard.current) {
            const { index, viewportTop } = pinnedCard.current;
            const element = cardRefs.current[index];
            if (!element) return;

            const adjustScroll = () => {
                const currentTop = element.getBoundingClientRect().top;
                const drift = currentTop - viewportTop;
                if (Math.abs(drift) > 1) {
                    window.scrollBy(0, drift);
                }
            };

            adjustScroll();

            let running = true;
            const startTime = performance.now();

            const loop = () => {
                if (!running) return;
                if (performance.now() - startTime > 200) {
                    pinnedCard.current = null;
                    const rect = element.getBoundingClientRect();
                    if (rect.top < 100) {
                        element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest'
                        });
                    }
                    return;
                }
                adjustScroll();
                requestAnimationFrame(loop);
            };

            requestAnimationFrame(loop);

            return () => { running = false; };
        } else if (expandedElement) {
            setTimeout(() => {
                const rect = expandedElement.getBoundingClientRect();
                if (rect.top < 100) {
                    expandedElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            }, 200);
        }
    }, [expandedIndex]);

    const handleToggle = useCallback((index: number) => {
        const element = cardRefs.current[index];

        setExpandedIndex(prev => {
            if (prev === index) {
                pinnedCard.current = null;
                return null;
            }

            if (prev !== null && prev < index && element) {
                pinnedCard.current = {
                    index,
                    viewportTop: element.getBoundingClientRect().top
                };
            } else {
                pinnedCard.current = null;
            }

            return index;
        });
    }, []);

    return (
        <div className="md:hidden w-full px-5 py-12">
            <m.div
                variants={prefersReducedMotion ? undefined : containerVariants}
                initial={prefersReducedMotion ? undefined : 'hidden'}
                whileInView={prefersReducedMotion ? undefined : 'visible'}
                viewport={viewportSettings.once}
                className="relative space-y-6"
                style={{ overflowAnchor: 'none' }}
            >
                {groupedItems.map((group, index) => (
                    <m.div key={`${group.companyName}-${index}`} variants={prefersReducedMotion ? undefined : itemVariants}>
                        <MobileWorkCard
                            ref={el => { cardRefs.current[index] = el; }}
                            group={group}
                            index={index}
                            isExpanded={expandedIndex === index}
                            onToggle={() => handleToggle(index)}
                        />
                    </m.div>
                ))}
            </m.div>
        </div>
    );
};
