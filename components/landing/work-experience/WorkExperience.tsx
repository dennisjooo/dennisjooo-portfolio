"use client";

import React from 'react';
import { DesktopTimeline, MobileTimeline } from './Timeline';
import { SectionHeader } from '@/components/shared/SectionHeader';

export interface TimelineItemData {
    id?: string;
    _id?: string;
    date: string;
    title: string;
    company: string;
    imageSrc: string;
    responsibilities: string[];
    order?: number;
}

// Default data for fallback
const defaultWorkExperienceData: TimelineItemData[] = [];

interface WorkExperienceProps {
    workExperience?: TimelineItemData[];
}

const WorkExperience: React.FC<WorkExperienceProps> = ({ workExperience }) => {
    const items = workExperience || defaultWorkExperienceData;

    return (
        <section
            id="work"
            className="py-24 md:py-32 w-full bg-background text-foreground"
        >
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header - Matching About Section Style */}
                <SectionHeader
                    number="03."
                    title="Work Experience"
                    className="mb-16"
                />

                {/* Content */}
                <DesktopTimeline items={items} />
                <MobileTimeline items={items} />
            </div>
        </section>
    );
};

export default WorkExperience;
