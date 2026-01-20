"use client";

import React from 'react';
import { TimelineItemData } from '@/data/workContent';
import { groupItemsByCompany } from '@/lib/utils/workExperience';
import { TimelineGroup } from './TimelineGroup';

interface DesktopTimelineProps {
    items: TimelineItemData[];
}

export const DesktopTimeline: React.FC<DesktopTimelineProps> = ({ items }) => {
    const groupedItems = groupItemsByCompany(items);

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
