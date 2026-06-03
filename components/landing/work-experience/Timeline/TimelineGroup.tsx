"use client";

import React, { useRef } from 'react';
import { CompanyGroup } from '@/lib/utils/workExperience';
import { useScrollActiveZone } from '@/lib/hooks/useScrollActiveZone';
import { cn } from '@/lib/utils';
import { CompanyHeader } from './CompanyHeader';
import { TimelineRole } from './TimelineRole';

interface TimelineGroupProps {
    group: CompanyGroup;
    isLast: boolean;
}

export const TimelineGroup: React.FC<TimelineGroupProps> = ({ group, isLast }) => {
    const groupRef = useRef<HTMLDivElement>(null);
    const isActive = useScrollActiveZone(groupRef);

    return (
        <div ref={groupRef} className={`relative w-full ${!isLast ? 'mb-0' : ''}`}>
            {/* Desktop Layout: Grid */}
            <div className="hidden md:grid md:grid-cols-12 md:gap-16 min-h-[50vh]">
                {/* Left Column: Sticky Header */}
                <div className="col-span-5 relative">
                    <div className="sticky will-change-transform top-32 flex flex-col items-end pb-20">
                        <CompanyHeader
                            companyName={group.companyName}
                            logo={group.logo}
                            isActive={isActive}
                        />

                        {/* Decorative Dot */}
                        <div
                            className={cn(
                                'absolute right-[-4.5rem] top-6 w-4 h-4 rounded-full border-2 z-10 hidden lg:block transition-all duration-500',
                                isActive
                                    ? 'bg-foreground border-foreground shadow-[0_0_0_4px_hsl(var(--foreground)/0.15),0_0_16px_hsl(var(--foreground)/0.25)] scale-110'
                                    : 'bg-background border-foreground/25 scale-100'
                            )}
                        />
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
