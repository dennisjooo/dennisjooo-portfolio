"use client";

import React, { useState, memo } from 'react';
import { TimelineItemData } from '@/data/workContent';

interface MobileRoleProps {
    role: TimelineItemData;
    isLast: boolean;
}

export const MobileRole: React.FC<MobileRoleProps> = memo(({ role, isLast }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const INITIAL_COUNT = 2;
    const initialItems = role.responsibilities.slice(0, INITIAL_COUNT);
    const expandedItems = role.responsibilities.slice(INITIAL_COUNT);
    const hasMore = role.responsibilities.length > INITIAL_COUNT;

    return (
        <div className="space-y-4">
            {/* Role Header */}
            <div className="space-y-1">
                <h4 className="text-xl font-urbanist font-bold uppercase tracking-tight text-foreground">
                    {role.title}
                </h4>
                <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground/60 bg-foreground/5 px-2 py-1 rounded inline-block">
                    {role.date}
                </span>
            </div>

            {/* Responsibilities */}
            <ul className="space-y-2">
                {initialItems.map((resp, respIndex) => (
                    <li
                        key={respIndex}
                        className="flex items-start text-sm font-light text-muted-foreground leading-relaxed"
                    >
                        <span className="mr-3 mt-2 w-1 h-1 rounded-full bg-foreground/40 shrink-0" />
                        <span>{resp}</span>
                    </li>
                ))}
                
                {/* Expandable items using CSS grid for smooth height animation */}
                <div
                    className="grid transition-[grid-template-rows] duration-150 ease-out"
                    style={{
                        gridTemplateRows: isExpanded ? '1fr' : '0fr',
                    }}
                >
                    <div className="overflow-hidden">
                        <div className="space-y-2">
                            {expandedItems.map((resp, respIndex) => (
                                <li
                                    key={`expanded-${respIndex}`}
                                    className="flex items-start text-sm font-light text-muted-foreground leading-relaxed"
                                >
                                    <span className="mr-3 mt-2 w-1 h-1 rounded-full bg-foreground/40 shrink-0" />
                                    <span>{resp}</span>
                                </li>
                            ))}
                        </div>
                    </div>
                </div>
            </ul>

            {/* Read More Button */}
            {hasMore && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                    className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors pt-1"
                >
                    <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
                    <span className={`transition-transform duration-150 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                        ↓
                    </span>
                </button>
            )}

            {/* Role Divider (not for last role) */}
            {!isLast && (
                <div className="pt-4">
                    <div className="w-12 h-px bg-foreground/10" />
                </div>
            )}
        </div>
    );
});

MobileRole.displayName = 'MobileRole';
