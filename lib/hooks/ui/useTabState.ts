import { useState, useEffect } from "react";
import { getSessionItem, setSessionItem } from "@/lib/utils/storage";
import { useMounted } from "@/lib/hooks/ui/useMounted";
import {
  BLOGS_LIST_TAB_STORAGE_KEY,
  type BlogsListTab,
} from "@/lib/constants/blogsList";

export function useTabState() {
  const [activeTab, setActiveTab] = useState<BlogsListTab>("blog");
  const mounted = useMounted();

  useEffect(() => {
    const storedTab = getSessionItem(
      BLOGS_LIST_TAB_STORAGE_KEY,
    ) as BlogsListTab | null;
    if (storedTab === "blog" || storedTab === "certifications") {
      setActiveTab(storedTab);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      setSessionItem(BLOGS_LIST_TAB_STORAGE_KEY, activeTab);
    }
  }, [activeTab, mounted]);

  return {
    activeTab,
    setActiveTab,
    mounted,
  };
}
