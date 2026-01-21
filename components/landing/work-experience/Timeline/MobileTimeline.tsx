"use client";

import React, { useState, useMemo, useCallback, useRef, useLayoutEffect } from 'react';
import { TimelineItemData } from '../WorkExperience';
import { groupItemsByCompany } from '@/lib/utils/workExperience';
import { MobileWorkCard } from './MobileWorkCard';

interface MobileTimelineProps {
    items: TimelineItemData[];
}

export const MobileTimeline: React.FC<MobileTimelineProps> = ({ items }) => {
    // Memoize grouped items to avoid recalculation on every render
    const groupedItems = useMemo(() => groupItemsByCompany(items), [items]);

    // Track which company card is expanded (default: first one)
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Store the card we want to "pin" during layout shifts
    const pinnedCard = useRef<{ index: number; viewportTop: number } | null>(null);

    // Use layoutEffect to adjust scroll BEFORE browser paints, then continue during animation
    useLayoutEffect(() => {
        const expandedElement = expandedIndex !== null ? cardRefs.current[expandedIndex] : null;

        if (pinnedCard.current) {
            const { index, viewportTop } = pinnedCard.current;
            const element = cardRefs.current[index];
            if (!element) return;

            // Immediate adjustment before first paint
            const adjustScroll = () => {
                const currentTop = element.getBoundingClientRect().top;
                const drift = currentTop - viewportTop;
                if (Math.abs(drift) > 1) {
                    window.scrollBy(0, drift);
                }
            };

            adjustScroll();

            // Continue adjusting during the CSS animation (150ms)
            let running = true;
            const startTime = performance.now();

            const loop = () => {
                if (!running) return;
                if (performance.now() - startTime > 200) {
                    pinnedCard.current = null;
                    // After pinning animation, scroll into view if still obscured
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
            // No pinning needed - just scroll into view if the card header is obscured
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
            // If clicking the same card, just close it (no pinning needed)
            if (prev === index) {
                pinnedCard.current = null;
                return null;
            }

            // Pin the clicked card's position if a card above will collapse
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
            {/* Stacked Accordion Cards - overflow-anchor:none prevents browser scroll anchoring */}
            <div className="relative space-y-6" style={{ overflowAnchor: 'none' }}>
                {groupedItems.map((group, index) => (
                    <MobileWorkCard
                        key={`${group.companyName}-${index}`}
                        ref={el => { cardRefs.current[index] = el; }}
                        group={group}
                        index={index}
                        isExpanded={expandedIndex === index}
                        onToggle={() => handleToggle(index)}
                    />
                ))}
            </div>
        </div>
    );
};
