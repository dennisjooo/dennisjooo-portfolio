"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface UseAdminListOptions {
  endpoint: string;
  pageSize?: number;
  enableReorder?: boolean;
  reorderEndpoint?: string;
  deleteConfirmMessage?: string;
  deleteSuccessMessage?: string;
  itemName?: string;
}

interface PaginationData {
  page: number;
  totalPages: number;
}

interface UseAdminListReturn<T> {
  items: T[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  handleDelete: (id: string) => void;
  handleReorder: (nextItems: T[]) => Promise<void>;
  refresh: (showLoading?: boolean) => Promise<void>;
}

export function useAdminList<T extends { id: string; order?: number }>({
  endpoint,
  pageSize = 10,
  enableReorder = false,
  reorderEndpoint,
  deleteConfirmMessage,
  deleteSuccessMessage,
  itemName = 'item',
}: UseAdminListOptions): UseAdminListReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = useCallback(
    async (page: number, showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const url = enableReorder
          ? endpoint
          : `${endpoint}?page=${page}&limit=${pageSize}`;
        
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();

        if (data.success !== false && (data.data || Array.isArray(data))) {
          const fetchedItems = data.data || data;
          setItems(fetchedItems);

          if (data.pagination) {
            const pagination = data.pagination as PaginationData;
            setTotalPages(pagination.totalPages);
            setCurrentPage(pagination.page);
          } else {
            setCurrentPage(1);
            setTotalPages(1);
          }
        }
      } catch (error) {
        console.error(`Failed to fetch ${itemName}s:`, error);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [endpoint, pageSize, enableReorder, itemName]
  );

  useEffect(() => {
    fetchItems(1);
  }, [fetchItems]);

  const handlePageChange = useCallback(
    (page: number) => {
      fetchItems(page);
    },
    [fetchItems]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const message = deleteConfirmMessage || `Are you sure you want to delete this ${itemName}?`;
      const successMsg = deleteSuccessMessage || `${itemName.charAt(0).toUpperCase() + itemName.slice(1)} deleted successfully`;

      toast(message, {
        action: {
          label: "Delete",
          onClick: async () => {
            try {
              const res = await fetch(`${endpoint}/${id}`, {
                method: 'DELETE',
              });

              if (res.ok) {
                fetchItems(currentPage);
                toast.success(successMsg);
              } else {
                toast.error('Failed to delete');
              }
            } catch (error) {
              console.error('Error deleting:', error);
              toast.error('Something went wrong');
            }
          },
        },
      });
    },
    [endpoint, currentPage, fetchItems, deleteConfirmMessage, deleteSuccessMessage, itemName]
  );

  const handleReorder = useCallback(
    async (nextItems: T[]) => {
      if (!enableReorder || !reorderEndpoint) return;

      const payload = nextItems.map((item, index) => ({
        id: item.id,
        order: index,
      }));

      // Optimistically update the UI
      setItems(
        nextItems.map((item, index) => ({
          ...item,
          order: index,
        }))
      );

      try {
        const res = await fetch(reorderEndpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ items: payload }),
        });

        if (!res.ok) {
          throw new Error('Failed to reorder');
        }
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
    handlePageChange,
    handleDelete,
    handleReorder,
    refresh,
  };
}
