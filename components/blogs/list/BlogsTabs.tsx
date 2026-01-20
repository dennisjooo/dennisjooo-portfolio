"use client";

import CertificationsList from "./CertificationsList";
import ProjectsList from "./ProjectsList";
import TabSwitcher from "./TabSwitcher";
import { tabContentVariants } from "@/lib/animations/variants";
import { useTabState } from "@/lib/hooks/useTabState";
import { AnimatePresence, motion } from "framer-motion";
import { BlogsHero } from "./BlogsHero";

import { projects } from "@/data/blogs";
import { certifications } from "@/data/certificationContent";
import { TabType } from "./TabSwitcher";
import { useMemo, useEffect } from "react";

export function BlogsTabs() {
    const { activeTab, setActiveTab, mounted } = useTabState();

    const hasBlog = projects.length > 0;
    const hasCerts = certifications.length > 0;

    const availableTabs: TabType[] = useMemo(() => [
        hasBlog ? 'blog' : null,
        hasCerts ? 'certifications' : null,
    ].filter((t): t is TabType => t !== null), [hasBlog, hasCerts]);

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

