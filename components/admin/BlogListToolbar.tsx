"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { formStyles } from "@/components/admin/shared/formStyles";

interface BlogListToolbarProps {
  searchQuery: string;
  filters: Record<string, string>;
  onSearch: (query: string) => void;
  onFilter: (key: string, value: string) => void;
}

export function BlogListToolbar({
  searchQuery,
  filters,
  onSearch,
  onFilter,
}: BlogListToolbarProps) {
  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full flex-1 sm:max-w-xs">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className={formStyles.searchInput}
        />
      </div>
      <div className="flex items-center gap-2">
        <select
          value={filters.type || ""}
          onChange={(e) => onFilter("type", e.target.value)}
          className={formStyles.select}
        >
          <option value="">All Types</option>
          <option value="blog">Blog</option>
          <option value="project">Project</option>
        </select>
        <select
          value={filters.status || ""}
          onChange={(e) => onFilter("status", e.target.value)}
          className={formStyles.select}
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>
      </div>
    </div>
  );
}
