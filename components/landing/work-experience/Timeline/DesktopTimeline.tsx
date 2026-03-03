"use client";

import React, { useMemo } from 'react';
import { TimelineItemData } from '../WorkExperience';
import { groupItemsByCompany } from '@/lib/utils/workExperience';
import { TimelineGroup } from './TimelineGroup';

interface DesktopTimelineProps {
    items: TimelineItemData[];
}

export const DesktopTimeline: React.FC<DesktopTimelineProps> = ({ items }) => {
    const groupedItems = useMemo(() => groupItemsByCompany(items), [items]);

    return (
        <div className="hidden md:flex flex-col w-full relative">
            {groupedItems.map((group, index) => (
                <TimelineGroup
                    key={index}
                    group={group}
                    isLast={index === groupedItems.length - 1}
                />
            ))}
        </div>
    );
};
