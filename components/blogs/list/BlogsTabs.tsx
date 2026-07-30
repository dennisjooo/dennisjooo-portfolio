"use client";

import CertificationsList from "./CertificationsList";
import ProjectsList from "./ProjectsList";
import TabSwitcher from "./TabSwitcher";
import { tabContentVariants } from "@/components/motion";
import { useTabState } from "@/lib/hooks/ui/useTabState";
import { AnimatePresence, m } from "@/components/motion";
import { sectionInnerClasses } from "@/components/shared/layout/SectionShell";
import { BlogsHero } from "./BlogsHero";
import { TabType } from "./TabSwitcher";
import { useMemo, useEffect } from "react";
import type { BlogListItem, PaginationResult } from "@/lib/data/blogs";

interface BlogsTabsProps {
  initialProjects?: BlogListItem[];
  initialPagination?: PaginationResult;
}

export function BlogsTabs({
  initialProjects,
  initialPagination,
}: BlogsTabsProps) {
  const { activeTab, setActiveTab, mounted } = useTabState();

  const availableTabs: TabType[] = useMemo(
    () => ["blog", "certifications"],
    [],
  );

  useEffect(() => {
    if (
      mounted &&
      !availableTabs.includes(activeTab) &&
      availableTabs.length > 0
    ) {
      setActiveTab(availableTabs[0]);
    }
  }, [mounted, activeTab, availableTabs, setActiveTab]);

  return (
    <div
      className={`${sectionInnerClasses} pt-24 transition-opacity duration-300 md:pt-20 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Editorial Hero Section */}
      <BlogsHero activeTab={activeTab} />

      {/* Tab Navigation */}
      {availableTabs.length > 0 && (
        <TabSwitcher
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={availableTabs}
        />
      )}

      {/* Content Grid */}
      {availableTabs.length > 0 && (
        <div className="mt-8 min-h-[50vh] w-full">
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
