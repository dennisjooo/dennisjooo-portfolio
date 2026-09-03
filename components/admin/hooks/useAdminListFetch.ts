"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { fetchAdminListItems } from "./fetchAdminListItems";

interface UseAdminListFetchOptions {
  endpoint: string;
  pageSize: number;
  enableReorder: boolean;
  itemName: string;
}

export function useAdminListFetch<T>({
  endpoint,
  pageSize,
  enableReorder,
  itemName,
}: UseAdminListFetchOptions) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const currentPageRef = useRef(currentPage);
  const searchDebounceRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  const fetchItems = useCallback(
    async (
      page: number,
      showLoading = true,
      query?: string,
      currentFilters?: Record<string, string>,
      currentSortBy?: string | null,
      currentSortOrder?: "asc" | "desc" | null,
    ) => {
      if (showLoading) setLoading(true);
      try {
        const result = await fetchAdminListItems<T>({
          endpoint,
          page,
          pageSize,
          enableReorder,
          itemName,
          searchQuery,
          filters,
          query,
          currentFilters,
          sortBy: currentSortBy !== undefined ? currentSortBy : sortBy,
          sortOrder:
            currentSortOrder !== undefined ? currentSortOrder : sortOrder,
        });

        if (result) {
          setItems(result.items);
          if (result.pagination) {
            setTotalPages(result.pagination.totalPages);
            setCurrentPage(result.pagination.page);
            setTotalItems(result.pagination.total ?? 0);
          } else {
            setCurrentPage(1);
            setTotalPages(1);
            setTotalItems(result.items.length);
          }
        }
      } catch (error) {
        console.error(`Failed to fetch ${itemName}s:`, error);
        toast.error(`Failed to fetch ${itemName}s. Please try again.`);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [
      endpoint,
      pageSize,
      enableReorder,
      itemName,
      searchQuery,
      filters,
      sortBy,
      sortOrder,
    ],
  );

  useEffect(() => {
    fetchItems(1);
  }, [fetchItems]);

  const handlePageChange = useCallback(
    (page: number) => {
      fetchItems(page);
    },
    [fetchItems],
  );

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(() => {
        fetchItems(1, true, query);
      }, 300);
    },
    [fetchItems],
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
    [fetchItems],
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
    [sortBy, sortOrder, fetchItems],
  );

  const refresh = useCallback(
    async (showLoading = true) => {
      await fetchItems(currentPage, showLoading);
    },
    [fetchItems, currentPage],
  );

  const handleReorder = useCallback(
    async (nextItems: T[], reorderEndpoint: string | undefined) => {
      if (!enableReorder || !reorderEndpoint) return;

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
    },
    [enableReorder, currentPage, fetchItems, itemName],
  );

  return {
    items,
    setItems,
    loading,
    currentPage,
    currentPageRef,
    totalPages,
    totalItems,
    searchQuery,
    filters,
    sortBy,
    sortOrder,
    fetchItems,
    handlePageChange,
    handleSearch,
    handleFilter,
    handleSort,
    refresh,
    handleReorder,
  };
}
