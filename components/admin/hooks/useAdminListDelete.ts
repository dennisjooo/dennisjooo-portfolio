"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseAdminListDeleteOptions {
  endpoint: string;
  itemName: string;
  deleteSuccessMessage?: string;
  currentPageRef: React.RefObject<number>;
  fetchItems: (page: number, showLoading?: boolean) => Promise<void>;
}

export function useAdminListDelete({
  endpoint,
  itemName,
  deleteSuccessMessage,
  currentPageRef,
  fetchItems,
}: UseAdminListDeleteOptions) {
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null as string | null,
    loading: false,
  });
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);

  const handleDelete = useCallback((id: string) => {
    setBulkDeleteMode(false);
    setDeleteDialog({ open: true, id, loading: false });
  }, []);

  const confirmDelete = useCallback(async () => {
    const { id } = deleteDialog;
    if (!id) return;

    const successMsg =
      deleteSuccessMessage ||
      `${itemName.charAt(0).toUpperCase() + itemName.slice(1)} deleted successfully`;
    setDeleteDialog((prev) => ({ ...prev, loading: true }));

    try {
      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchItems(currentPageRef.current);
        toast.success(successMsg);
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Something went wrong");
    } finally {
      setDeleteDialog({ open: false, id: null, loading: false });
    }
  }, [
    deleteDialog,
    endpoint,
    fetchItems,
    deleteSuccessMessage,
    itemName,
    currentPageRef,
  ]);

  const cancelDelete = useCallback(() => {
    setDeleteDialog({ open: false, id: null, loading: false });
    setBulkDeleteMode(false);
  }, []);

  const handleBulkDelete = useCallback((selectedIds: Set<string>) => {
    if (selectedIds.size === 0) return;
    setBulkDeleteMode(true);
    setDeleteDialog({ open: true, id: null, loading: false });
  }, []);

  const confirmBulkDelete = useCallback(
    async (selectedIds: Set<string>, clearSelection: () => void) => {
      if (selectedIds.size === 0) return;
      setDeleteDialog((prev) => ({ ...prev, loading: true }));

      try {
        const deletePromises = Array.from(selectedIds).map((id) =>
          fetch(`${endpoint}/${id}`, { method: "DELETE" }),
        );
        const results = await Promise.all(deletePromises);
        const successCount = results.filter((r) => r.ok).length;

        if (successCount > 0) {
          toast.success(
            `${successCount} ${itemName}${successCount > 1 ? "s" : ""} deleted`,
          );
          fetchItems(currentPageRef.current);
        }
        if (successCount < selectedIds.size) {
          toast.error(`${selectedIds.size - successCount} failed to delete`);
        }
      } catch (error) {
        console.error("Bulk delete error:", error);
        toast.error("Something went wrong");
      } finally {
        setDeleteDialog({ open: false, id: null, loading: false });
        setBulkDeleteMode(false);
        clearSelection();
      }
    },
    [endpoint, fetchItems, itemName, currentPageRef],
  );

  return {
    deleteDialog,
    bulkDeleteMode,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleBulkDelete,
    confirmBulkDelete,
  };
}
