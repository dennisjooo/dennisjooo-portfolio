"use client";

import React, { memo } from 'react';
import Image from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { CompanyGroup } from '@/lib/utils/workExperience';
import { MobileRole } from './MobileRole';

interface MobileWorkCardProps {
    group: CompanyGroup;
    index: number;
    isExpanded: boolean;
    onToggle: () => void;
}

export const MobileWorkCard: React.FC<MobileWorkCardProps> = memo(({
    group,
    index,
    isExpanded,
    onToggle,
}) => {
    // Get the date range for the company (first role start to last role end)
    const dateRange = group.roles.length > 1
        ? `${group.roles[group.roles.length - 1].date.split(' - ')[0]} - ${group.roles[0].date.split(' - ')[1] || 'Now'}`
        : group.roles[0].date;

    return (
        <div
            className="relative p-px"
            style={{ zIndex: isExpanded ? 10 : 1 }}
        >
            {/* Gradient Border - Only visible when expanded */}
            <div
                className={`absolute inset-0 bg-gradient-accent rounded-2xl ${isExpanded ? 'opacity-100' : 'opacity-0'
                    }`}
            />

            {/* Card Container */}
            <div
                className={`relative bg-background rounded-[15px] overflow-hidden ${isExpanded
                    ? 'shadow-xl'
                    : 'border border-foreground/5 shadow-lg'
                    }`}
            >

                {/* Card Header - Clickable */}
                <button
                    onClick={onToggle}
                    className="relative z-10 w-full p-6 flex flex-col gap-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                    {/* Top Row: Index Number and Chevron */}
                    <div className="flex items-center justify-between">
                        {/* Index Number - Editorial Style */}
                        <span className="font-mono text-xs text-muted-foreground/50 uppercase tracking-widest">
                            0{index + 1}.
                        </span>

                        {/* Expand Indicator */}
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-150 ${isExpanded ? 'bg-foreground/10 rotate-180' : 'bg-foreground/5 rotate-0'
                                }`}
                        >
                            <ChevronDownIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </div>

                    {/* Logo - Featured Large */}
                    <div className="relative w-16 h-16 overflow-hidden shrink-0">
                        <Image
                            src={group.logo}
                            alt={group.companyName}
                            fill
                            className={`object-contain object-left ${isExpanded ? 'opacity-100' : 'opacity-60 grayscale'
                                }`}
                        />
                    </div>

                    {/* Company Info */}
                    <div className="space-y-2">
                        <h3 className="text-3xl font-playfair italic font-bold text-gradient-primary leading-tight pb-1">
                            {group.companyName}
                        </h3>
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground/60">
                                {dateRange}
                            </span>
                            {!isExpanded && (
                                <>
                                    <span className="text-muted-foreground/30">|</span>
                                    <span className="font-mono text-xs text-muted-foreground/40">
                                        {group.roles.length} {group.roles.length === 1 ? 'role' : 'roles'}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Tap Hint - Only when collapsed */}
                    {!isExpanded && (
                        <div className="flex items-center gap-2 pt-1">
                            <div className="h-px flex-1 bg-gradient-to-r from-foreground/10 to-transparent" />
                            <span className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-widest">
                                Tap to explore
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-l from-foreground/10 to-transparent" />
                        </div>
                    )}
                </button>

                {/* Expandable Content - Using CSS grid for smooth height animation */}
                <div
                    className="grid transition-[grid-template-rows] duration-150 ease-out"
                    style={{
                        gridTemplateRows: isExpanded ? '1fr' : '0fr',
                    }}
                >
                    <div className="overflow-hidden">
                        <div className="relative z-10 px-6 pb-6 space-y-4">
                            {/* Divider */}
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

                            {/* Roles - No staggered animations for better performance */}
                            {group.roles.map((role, roleIndex) => (
                                <MobileRole
                                    key={role.id}
                                    role={role}
                                    isLast={roleIndex === group.roles.length - 1}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

MobileWorkCard.displayName = 'MobileWorkCard';
