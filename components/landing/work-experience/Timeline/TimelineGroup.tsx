"use client";

import React from 'react';
import { CompanyGroup } from '@/lib/utils/workExperience';
import { CompanyHeader } from './CompanyHeader';
import { TimelineRole } from './TimelineRole';

interface TimelineGroupProps {
    group: CompanyGroup;
    isLast: boolean;
}

export const TimelineGroup: React.FC<TimelineGroupProps> = ({ group, isLast }) => {
    return (
        <div className={`group relative w-full ${!isLast ? 'mb-0' : ''}`}>
            {/* Desktop Layout: Grid */}
            <div className="hidden md:grid md:grid-cols-12 md:gap-16 min-h-[50vh]">
                {/* Left Column: Sticky Header */}
                <div className="col-span-5 relative">
                    <div className="sticky will-change-transform top-32 flex flex-col items-end pb-20">
                        <CompanyHeader companyName={group.companyName} logo={group.logo} />

                        {/* Decorative Dot */}
                        <div className="absolute right-[-4.5rem] top-6 w-4 h-4 rounded-full bg-background border-2 border-foreground group-hover:bg-foreground transition-colors duration-500 z-10 hidden lg:block" />
                    </div>
                </div>

                {/* Right Column: Content */}
                <div className="col-span-7 pt-8 pb-32 border-l border-foreground/10 pl-16">
                    <div className="flex flex-col space-y-20">
                        {group.roles.map((role, i) => (
                            <TimelineRole key={role.id} role={role} index={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
