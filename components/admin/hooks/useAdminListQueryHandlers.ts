"use client";

import { useCallback } from "react";
import { toast } from "sonner";

interface UseAdminListQueryHandlersOptions {
  fetchItems: (
    page: number,
    showLoading?: boolean,
    query?: string,
    currentFilters?: Record<string, string>,
    currentSortBy?: string | null,
    currentSortOrder?: "asc" | "desc" | null,
  ) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setSortBy: (sortBy: string | null) => void;
  setSortOrder: (sortOrder: "asc" | "desc" | null) => void;
  sortBy: string | null;
  sortOrder: "asc" | "desc" | null;
  searchDebounceRef: React.RefObject<NodeJS.Timeout | undefined>;
}

export function useAdminListQueryHandlers({
  fetchItems,
  setSearchQuery,
  setFilters,
  setSortBy,
  setSortOrder,
  sortBy,
  sortOrder,
  searchDebounceRef,
}: UseAdminListQueryHandlersOptions) {
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(() => {
        fetchItems(1, true, query);
      }, 300);
    },
    [fetchItems, setSearchQuery, searchDebounceRef],
  );

  const handleFilter = useCallback(
    (key: string, value: string) => {
      setFilters((prev) => {
        const next = { ...prev };
        if (value) {
          next[key] = value;
        } else {
          delete next[key];
        }
        fetchItems(1, true, undefined, next);
        return next;
      });
    },
    [fetchItems, setFilters],
  );

  const handleSort = useCallback(
    (key: string) => {
      let nextSortOrder: "asc" | "desc" | null = "asc";

      if (sortBy === key) {
        if (sortOrder === "asc") nextSortOrder = "desc";
        else nextSortOrder = null;
      }

      const nextSortBy = nextSortOrder ? key : null;

      setSortBy(nextSortBy);
      setSortOrder(nextSortOrder);
      fetchItems(1, true, undefined, undefined, nextSortBy, nextSortOrder);
    },
    [sortBy, sortOrder, fetchItems, setSortBy, setSortOrder],
  );

  return { handleSearch, handleFilter, handleSort };
}

export async function reorderAdminListItems<T>(
  nextItems: T[],
  reorderEndpoint: string,
  setItems: React.Dispatch<React.SetStateAction<T[]>>,
  fetchItems: (page: number, showLoading?: boolean) => Promise<void>,
  currentPage: number,
  itemName: string,
) {
  const payload = nextItems.map((item, index) => ({
    id: (item as { id: string }).id,
    order: index,
  }));

  setItems(
    nextItems.map((item, index) => ({
      ...item,
      order: index,
    })) as T[],
  );

  try {
    const res = await fetch(reorderEndpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: payload }),
    });

    if (!res.ok) throw new Error("Failed to reorder");
    toast.success("Order updated");
    fetchItems(currentPage, false);
  } catch (error) {
    console.error(`Failed to reorder ${itemName}s:`, error);
    toast.error("Failed to update order");
    fetchItems(currentPage, false);
  }
}
