"use client";

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { TimelineItemData } from '@/data/workContent';
import { groupItemsByCompany } from '@/lib/utils/workExperience';
import { MobileWorkCard } from './MobileWorkCard';

interface MobileTimelineProps {
    items: TimelineItemData[];
}

export const MobileTimeline: React.FC<MobileTimelineProps> = ({ items }) => {
    // Memoize grouped items to avoid recalculation on every render
    const groupedItems = useMemo(() => groupItemsByCompany(items), [items]);

    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    
    // Track which company card is expanded (default: first one)
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

    const handleToggle = useCallback((index: number) => {
        setExpandedIndex(prev => {
            const newIndex = prev === index ? null : index;
            if (newIndex !== null) {
                setTimeout(() => {
                    cardRefs.current[index]?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
            return newIndex;
        });
    }, []);

    return (
        <div className="md:hidden w-full px-5 py-12">
            {/* Stacked Accordion Cards */}
            <div className="relative space-y-6">
                {groupedItems.map((group, index) => (
                    <MobileWorkCard
                        ref={el => { cardRefs.current[index] = el; }}
                        key={`${group.companyName}-${index}`}
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
