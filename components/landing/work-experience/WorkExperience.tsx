"use client";

import React from 'react';
import { workExperienceData } from '@/data/workContent';
import { DesktopTimeline, MobileTimeline } from './Timeline';
import { SectionHeader } from '@/components/shared/SectionHeader';

const WorkExperience: React.FC = () => {
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
                <DesktopTimeline items={workExperienceData} />
                <MobileTimeline items={workExperienceData} />
            </div>
        </section>
    );
};

export default WorkExperience;
