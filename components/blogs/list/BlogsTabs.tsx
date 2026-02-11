"use client";

import CertificationsList from "./CertificationsList";
import ProjectsList from "./ProjectsList";
import TabSwitcher from "./TabSwitcher";
import { tabContentVariants } from "@/lib/animations/variants";
import { useTabState } from "@/lib/hooks/useTabState";
import { AnimatePresence, m } from "framer-motion";
import { BlogsHero } from "./BlogsHero";
import { TabType } from "./TabSwitcher";
import { useMemo, useEffect } from "react";
import type { Blog } from "@/lib/db";
import type { PaginationResult } from "@/lib/data/blogs";

interface BlogsTabsProps {
    initialProjects?: Blog[];
    initialPagination?: PaginationResult;
}

export function BlogsTabs({ initialProjects, initialPagination }: BlogsTabsProps) {
    const { activeTab, setActiveTab, mounted } = useTabState();

    // Always show certifications tab for now as it's database driven
    const availableTabs: TabType[] = useMemo(() => [
        'blog',
        'certifications'
    ], []);

    useEffect(() => {
        if (mounted && !availableTabs.includes(activeTab) && availableTabs.length > 0) {
            setActiveTab(availableTabs[0]);
        }
    }, [mounted, activeTab, availableTabs, setActiveTab]);

    return (
        <div
            className={`container max-w-7xl mx-auto px-6 pt-24 md:pt-20 transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"
                }`}
        >
            {/* Editorial Hero Section */}
            <BlogsHero activeTab={activeTab} />

            {/* Tab Navigation */}
            {availableTabs.length > 0 && (
                <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} tabs={availableTabs} />
            )}

            {/* Content Grid */}
            {availableTabs.length > 0 && (
                <div className="w-full min-h-[50vh] mt-12">
                    {mounted ? (
                        <AnimatePresence mode="wait">
                            {activeTab === "blog" ? (
                                <m.div key="blog" {...tabContentVariants}>
                                    <ProjectsList
                                        type="all"
                                        initialData={initialProjects}
                                        initialPagination={initialPagination}
                                    />
                                </m.div>
                            ) : (
                                <m.div key="certifications" {...tabContentVariants}>
                                    <CertificationsList />
                                </m.div>
                            )}
                        </AnimatePresence>
                    ) : (
                        <m.div key="blog" {...tabContentVariants}>
                            <ProjectsList
                                type="all"
                                initialData={initialProjects}
                                initialPagination={initialPagination}
                            />
                        </m.div>
                    )}
                </div>
            )}
        </div>
    );
}
