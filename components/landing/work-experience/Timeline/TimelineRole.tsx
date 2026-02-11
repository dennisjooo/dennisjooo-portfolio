"use client";

import React, { useState } from 'react';
import { TimelineItemData } from '../WorkExperience';
import { m, AnimatePresence } from 'framer-motion';

interface TimelineRoleProps {
    role: TimelineItemData;
    index: number;
}

export const TimelineRole: React.FC<TimelineRoleProps> = ({ role, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const INITIAL_COUNT = 3;
    const initialItems = role.responsibilities.slice(0, INITIAL_COUNT);
    const expandedItems = role.responsibilities.slice(INITIAL_COUNT);
    const hasMore = role.responsibilities.length > INITIAL_COUNT;

    return (
        <m.div
            className="relative pl-8 md:pl-0 border-l border-foreground/10 md:border-none ml-4 md:ml-0 py-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            {/* Dot for mobile timeline */}
            <div className="absolute -left-[5px] top-6 w-2.5 h-2.5 rounded-full bg-background border border-foreground/30 md:hidden" />

            {/* Role Header */}
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-6 gap-3">
                <h4 className="text-3xl md:text-4xl font-sans font-bold leading-none text-gradient-primary tracking-tight pb-1">
                    {role.title}
                </h4>
                <span className="font-mono text-xs md:text-sm tracking-widest uppercase text-muted-foreground bg-foreground/5 px-3 py-1 rounded w-fit">
                    {role.date}
                </span>
            </div>

            {/* Responsibilities */}
            <ul className="space-y-4 mb-4">
                {/* Initial Items - Static */}
                {initialItems.map((resp, idx) => (
                    <li
                        key={idx}
                        className="flex items-start text-lg md:text-xl font-light text-muted-foreground leading-relaxed group/item"
                    >
                        <span className="mr-4 mt-[0.7em] w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0 group-hover/item:bg-foreground transition-colors" />
                        <span>{resp}</span>
                    </li>
                ))}

                {/* Expanded Items - Animate Entry/Exit */}
                <AnimatePresence>
                    {isExpanded && expandedItems.map((resp, idx) => (
                        <m.li
                            key={`expanded-${idx}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start text-lg md:text-xl font-light text-muted-foreground leading-relaxed group/item overflow-hidden"
                        >
                            <span className="mr-4 mt-[0.7em] w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0 group-hover/item:bg-foreground transition-colors" />
                            <span>{resp}</span>
                        </m.li>
                    ))}
                </AnimatePresence>
            </ul>

            {/* Read More Button */}
            {hasMore && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="group flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                    <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
                    <span className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                        ↓
                    </span>
                </button>
            )}
        </m.div>
    );
};

