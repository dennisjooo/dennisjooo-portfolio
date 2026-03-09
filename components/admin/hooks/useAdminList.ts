"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface UseAdminListOptions {
  endpoint: string;
  pageSize?: number;
  enableReorder?: boolean;
  reorderEndpoint?: string;
  deleteSuccessMessage?: string;
  itemName?: string;
}

interface PaginationData {
  page: number;
  totalPages: number;
  total: number;
}

interface DeleteDialogState {
  open: boolean;
  id: string | null;
  loading: boolean;
}

interface UseAdminListReturn<T> {
  items: T[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  searchQuery: string;
  filters: Record<string, string>;
  selectedIds: Set<string>;
  deleteDialog: DeleteDialogState;
  handlePageChange: (page: number) => void;
  handleSearch: (query: string) => void;
  handleFilter: (key: string, value: string) => void;
  handleDelete: (id: string) => void;
  confirmDelete: () => Promise<void>;
  cancelDelete: () => void;
  handleBulkDelete: () => void;
  confirmBulkDelete: () => Promise<void>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  clearSelection: () => void;
  handleReorder: (nextItems: T[]) => Promise<void>;
  refresh: (showLoading?: boolean) => Promise<void>;
}

export function useAdminList<T extends { id: string; order?: number | null }>({
  endpoint,
  pageSize = 10,
  enableReorder = false,
  reorderEndpoint,
  deleteSuccessMessage,
  itemName = 'item',
}: UseAdminListOptions): UseAdminListReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    id: null,
    loading: false,
  });
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);
  const currentPageRef = useRef(currentPage);
  const searchDebounceRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  const fetchItems = useCallback(
    async (page: number, showLoading = true, query?: string, currentFilters?: Record<string, string>) => {
      if (showLoading) setLoading(true);
      try {
        const params = new URLSearchParams();
        if (!enableReorder) {
          params.set('page', String(page));
          params.set('limit', String(pageSize));
        }
        const q = query ?? searchQuery;
        if (q) params.set('q', q);

        const activeFilters = currentFilters ?? filters;
        Object.entries(activeFilters).forEach(([key, value]) => {
          if (value) params.set(key, value);
        });

        const url = enableReorder && !params.toString()
          ? endpoint
          : `${endpoint}?${params.toString()}`;

        const res = await fetch(url, { cache: 'no-store' });

        if (!res.ok) {
          let errorMessage = `Failed to fetch ${itemName}s`;
          try {
            const errorData = await res.json();
            if (errorData.error) {
              errorMessage = errorData.error;
            }
          } catch {
            errorMessage = `Failed to fetch ${itemName}s: ${res.status} ${res.statusText}`;
          }
          toast.error(errorMessage);
          return;
        }

        const data = await res.json();

        if (data.success !== false && (data.data || Array.isArray(data))) {
          const fetchedItems = data.data || data;
          setItems(fetchedItems);

          if (data.pagination) {
            const pagination = data.pagination as PaginationData;
            setTotalPages(pagination.totalPages);
            setCurrentPage(pagination.page);
            setTotalItems(pagination.total ?? 0);
          } else {
            setCurrentPage(1);
            setTotalPages(1);
            setTotalItems(fetchedItems.length);
          }
        }
      } catch (error) {
        console.error(`Failed to fetch ${itemName}s:`, error);
        toast.error(`Failed to fetch ${itemName}s. Please try again.`);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [endpoint, pageSize, enableReorder, itemName, searchQuery, filters]
  );

  useEffect(() => {
    fetchItems(1);
  }, [fetchItems]);

  // Clear selection when items change
  useEffect(() => {
    setSelectedIds(new Set());
  }, [items]);

  const handlePageChange = useCallback(
    (page: number) => {
      fetchItems(page);
    },
    [fetchItems]
  );

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(() => {
        fetchItems(1, true, query);
      }, 300);
    },
    [fetchItems]
  );

  const handleFilter = useCallback(
    (key: string, value: string) => {
      setFilters(prev => {
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
    [fetchItems]
  );

  // Dialog-based delete
  const handleDelete = useCallback(
    (id: string) => {
      setBulkDeleteMode(false);
      setDeleteDialog({ open: true, id, loading: false });
    },
    []
  );

  const confirmDelete = useCallback(async () => {
    const { id } = deleteDialog;
    if (!id) return;

    const successMsg = deleteSuccessMessage || `${itemName.charAt(0).toUpperCase() + itemName.slice(1)} deleted successfully`;
    setDeleteDialog(prev => ({ ...prev, loading: true }));

    try {
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchItems(currentPageRef.current);
        toast.success(successMsg);
      } else {
        toast.error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Something went wrong');
    } finally {
      setDeleteDialog({ open: false, id: null, loading: false });
    }
  }, [deleteDialog, endpoint, fetchItems, deleteSuccessMessage, itemName]);

  const cancelDelete = useCallback(() => {
    setDeleteDialog({ open: false, id: null, loading: false });
    setBulkDeleteMode(false);
  }, []);

  // Bulk delete
  const handleBulkDelete = useCallback(() => {
    if (selectedIds.size === 0) return;
    setBulkDeleteMode(true);
    setDeleteDialog({ open: true, id: null, loading: false });
  }, [selectedIds]);

  const confirmBulkDelete = useCallback(async () => {
    if (selectedIds.size === 0) return;
    setDeleteDialog(prev => ({ ...prev, loading: true }));

    try {
      const deletePromises = Array.from(selectedIds).map(id =>
        fetch(`${endpoint}/${id}`, { method: 'DELETE' })
      );
      const results = await Promise.all(deletePromises);
      const successCount = results.filter(r => r.ok).length;

      if (successCount > 0) {
        toast.success(`${successCount} ${itemName}${successCount > 1 ? 's' : ''} deleted`);
        fetchItems(currentPageRef.current);
      }
      if (successCount < selectedIds.size) {
        toast.error(`${selectedIds.size - successCount} failed to delete`);
      }
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Something went wrong');
    } finally {
      setDeleteDialog({ open: false, id: null, loading: false });
      setBulkDeleteMode(false);
      setSelectedIds(new Set());
    }
  }, [selectedIds, endpoint, fetchItems, itemName]);

  // Selection handlers
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds(prev => {
      if (prev.size === items.length) return new Set();
      return new Set(items.map(item => item.id));
    });
  }, [items]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleReorder = useCallback(
    async (nextItems: T[]) => {
      if (!enableReorder || !reorderEndpoint) return;

      const payload = nextItems.map((item, index) => ({
        id: item.id,
        order: index,
      }));

      setItems(
        nextItems.map((item, index) => ({
          ...item,
          order: index,
        }))
      );

      try {
        const res = await fetch(reorderEndpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: payload }),
        });

        if (!res.ok) throw new Error('Failed to reorder');
        toast.success('Order updated');
        fetchItems(currentPage, false);
      } catch (error) {
        console.error(`Failed to reorder ${itemName}s:`, error);
        toast.error('Failed to update order');
        fetchItems(currentPage, false);
      }
    },
    [enableReorder, reorderEndpoint, currentPage, fetchItems, itemName]
  );

  const refresh = useCallback(
    async (showLoading = true) => {
      await fetchItems(currentPage, showLoading);
    },
    [fetchItems, currentPage]
  );

  return {
    items,
    loading,
    currentPage,
    totalPages,
    totalItems,
    searchQuery,
    filters,
    selectedIds,
    deleteDialog: bulkDeleteMode
      ? { ...deleteDialog, id: null }
      : deleteDialog,
    handlePageChange,
    handleSearch,
    handleFilter,
    handleDelete,
    confirmDelete: bulkDeleteMode ? confirmBulkDelete : confirmDelete,
    cancelDelete,
    handleBulkDelete,
    confirmBulkDelete,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    handleReorder,
    refresh,
  };
}
