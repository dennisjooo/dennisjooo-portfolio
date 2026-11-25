"use client";

import CertificationsList from "./CertificationsList";
import BlogsList from "./BlogsList";
import TabSwitcher from "./TabSwitcher";
import { tabContentVariants } from "@/components/motion";
import { useTabState } from "@/lib/hooks/ui/useTabState";
import { AnimatePresence, m } from "@/components/motion";
import { sectionInnerClasses } from "@/components/shared/layout/SectionShell";
import { BlogsHero } from "./BlogsHero";
import type { BlogListItem } from "@/lib/types/blogList";
import type { PaginationResult } from "@/lib/types/pagination";
import { BLOGS_LIST_TABS } from "@/lib/constants/blogsList";

interface BlogsTabsProps {
  initialProjects?: BlogListItem[];
  initialPagination?: PaginationResult;
}

export function BlogsTabs({
  initialProjects,
  initialPagination,
}: BlogsTabsProps) {
  const { activeTab, setActiveTab } = useTabState();

  return (
    <div className={`${sectionInnerClasses} pt-24 md:pt-20`}>
      <BlogsHero
        activeTab={activeTab}
        meta={
          initialPagination ? `${initialPagination.total} posts` : undefined
        }
      />

      <TabSwitcher
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={BLOGS_LIST_TABS}
      />

      <div className="mt-8 min-h-[50vh] w-full">
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "blog" ? (
            <m.div key="blog" {...tabContentVariants}>
              <BlogsList
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
      </div>
    </div>
  );
}
