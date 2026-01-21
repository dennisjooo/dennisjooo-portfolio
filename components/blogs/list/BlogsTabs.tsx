"use client";

import CertificationsList from "./CertificationsList";
import ProjectsList from "./ProjectsList";
import TabSwitcher from "./TabSwitcher";
import { tabContentVariants } from "@/lib/animations/variants";
import { useTabState } from "@/lib/hooks/useTabState";
import { AnimatePresence, motion } from "framer-motion";
import { BlogsHero } from "./BlogsHero";
import { certifications } from "@/data/certificationContent";
import { TabType } from "./TabSwitcher";
import { useMemo, useEffect, useState } from "react";

export function BlogsTabs() {
    const { activeTab, setActiveTab, mounted } = useTabState();
    const hasCerts = certifications.length > 0;

    // We need to know if there are blogs to show the tab. 
    // Ideally ProjectsList would tell us, or we fetch count separately.
    // For now, let's assume true or fetch briefly. 
    // Actually, ProjectsList handles the fetching. 
    // To avoid complex state lift, let's just default 'hasBlog' to true for now, 
    // or fetch a count if critical. 
    // Since we are moving to CMS, we can assume there might be blogs.
    
    // Let's rely on ProjectsList to render empty state if needed, 
    // but for the TAB itself, we probably want to show it.
    
    const availableTabs: TabType[] = useMemo(() => [
        'blog', // Always show blog tab for now
        hasCerts ? 'certifications' : null,
    ].filter((t): t is TabType => t !== null), [hasCerts]);

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
                                <motion.div key="blog" {...tabContentVariants}>
                                    <ProjectsList type="all" />
                                </motion.div>
                            ) : (
                                <motion.div key="certifications" {...tabContentVariants}>
                                    <CertificationsList />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    ) : (
                        <motion.div key="blog" {...tabContentVariants}>
                            <ProjectsList type="all" />
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}
