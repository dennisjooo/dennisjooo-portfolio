'use client';

import { m } from 'framer-motion';
import React from 'react';

export type TabType = 'blog' | 'certifications';

interface TabSwitcherProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    tabs: TabType[];
}

const tabLabels: Record<TabType, string> = {
    blog: 'Projects',
    certifications: 'Certifications'
};

export default function TabSwitcher({ activeTab, onTabChange, tabs }: TabSwitcherProps) {
    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-6 md:gap-10 mb-8 border-b border-border pb-4"
        >
            {tabs.map((tab, index) => (
                <m.button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="relative group"
                >
                    {/* Index Number */}
                    <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider block mb-1">
                        0{index + 1}.
                    </span>

                    {/* Tab Label */}
                    <span className={`
                        font-urbanist font-bold text-lg md:text-xl uppercase tracking-wide
                        transition-colors duration-300
                        ${activeTab === tab
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }
                    `}>
                        {tabLabels[tab]}
                    </span>

                    {/* Active Indicator */}
                    {activeTab === tab && (
                        <m.div
                            layoutId="tab-indicator"
                            className="absolute -bottom-4 left-0 right-0 h-[2px] bg-gradient-accent"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                </m.button>
            ))}

            {/* Decorative Line */}
            <div className="flex-1" />
            <span className="hidden md:block font-mono text-xs text-muted-foreground uppercase tracking-widest">
                {tabs.length} Categories
            </span>
        </m.div>
    );
} 