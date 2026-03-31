"use client";

import React, { useMemo } from 'react';
import { TimelineItemData } from '@/lib/types/workExperience';
import { groupItemsByCompany } from '@/lib/utils/workExperience';
import { TimelineGroup } from './TimelineGroup';
import { m, useReducedMotion, springConfigs, viewportSettings } from '@/components/motion';

interface DesktopTimelineProps {
    items: TimelineItemData[];
}

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: springConfigs.smooth,
    },
};

export const DesktopTimeline: React.FC<DesktopTimelineProps> = ({ items }) => {
    const groupedItems = useMemo(() => groupItemsByCompany(items), [items]);
    const prefersReducedMotion = useReducedMotion();

    return (
        <m.div
            variants={prefersReducedMotion ? undefined : containerVariants}
            initial={prefersReducedMotion ? undefined : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={viewportSettings.once}
            className="hidden md:flex flex-col w-full relative"
        >
            {groupedItems.map((group, index) => (
                <m.div key={index} variants={prefersReducedMotion ? undefined : itemVariants}>
                    <TimelineGroup
                        group={group}
                        isLast={index === groupedItems.length - 1}
                    />
                </m.div>
            ))}
        </m.div>
    );
};
