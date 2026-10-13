"use client";

import { m } from "@/components/motion";
import React from "react";

export type TabType = "blog" | "certifications";

interface TabSwitcherProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  tabs: TabType[];
}

const tabLabels: Record<TabType, string> = {
  blog: "Blogs",
  certifications: "Certifications",
};

export default function TabSwitcher({
  activeTab,
  onTabChange,
  tabs,
}: TabSwitcherProps) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mb-8 flex items-center gap-6 border-b border-border pb-4 md:gap-10"
    >
      {tabs.map((tab, index) => (
        <m.button
          key={tab}
          onClick={() => onTabChange(tab)}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="group relative"
        >
          {/* Index Number */}
          <span className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
            0{index + 1}.
          </span>

          {/* Tab Label */}
          <span
            className={`font-sans text-lg font-bold uppercase tracking-wide transition-colors duration-300 md:text-xl ${
              activeTab === tab
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            } `}
          >
            {tabLabels[tab]}
          </span>

          {/* Active Indicator */}
          {activeTab === tab && (
            <m.div
              layoutId="tab-indicator"
              className="absolute -bottom-4 left-0 right-0 h-[2px] bg-foreground"
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
            />
          )}
        </m.button>
      ))}

      {/* Decorative Line */}
      <div className="flex-1" />
      <span className="hidden font-mono text-xs uppercase tracking-widest text-muted-foreground md:block">
        {tabs.length} Categories
      </span>
    </m.div>
  );
}
