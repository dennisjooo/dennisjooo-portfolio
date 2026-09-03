"use client";

import {
  type UseAdminListOptions,
  type UseAdminListReturn,
} from "./adminListTypes";
import { useAdminListFetch } from "./useAdminListFetch";
import { useAdminListDelete } from "./useAdminListDelete";
import { useAdminListSelection } from "./useAdminListSelection";

export type {
  UseAdminListOptions,
  UseAdminListReturn,
  DeleteDialogState,
  PaginationData,
} from "./adminListTypes";

export function useAdminList<T extends { id: string; order?: number | null }>({
  endpoint,
  pageSize = 10,
  enableReorder = false,
  reorderEndpoint,
  deleteSuccessMessage,
  itemName = "item",
}: UseAdminListOptions): UseAdminListReturn<T> {
  const fetchState = useAdminListFetch<T>({
    endpoint,
    pageSize,
    enableReorder,
    itemName,
  });

  const selection = useAdminListSelection(fetchState.items);

  const deleteState = useAdminListDelete({
    endpoint,
    itemName,
    deleteSuccessMessage,
    currentPageRef: fetchState.currentPageRef,
    fetchItems: fetchState.fetchItems,
  });

  return {
    items: fetchState.items,
    loading: fetchState.loading,
    currentPage: fetchState.currentPage,
    totalPages: fetchState.totalPages,
    totalItems: fetchState.totalItems,
    searchQuery: fetchState.searchQuery,
    filters: fetchState.filters,
    sortBy: fetchState.sortBy,
    sortOrder: fetchState.sortOrder,
    selectedIds: selection.selectedIds,
    deleteDialog: deleteState.bulkDeleteMode
      ? { ...deleteState.deleteDialog, id: null }
      : deleteState.deleteDialog,
    handlePageChange: fetchState.handlePageChange,
    handleSearch: fetchState.handleSearch,
    handleFilter: fetchState.handleFilter,
    handleSort: fetchState.handleSort,
    handleDelete: deleteState.handleDelete,
    confirmDelete: deleteState.bulkDeleteMode
      ? () =>
          deleteState.confirmBulkDelete(
            selection.selectedIds,
            selection.clearSelection,
          )
      : deleteState.confirmDelete,
    cancelDelete: deleteState.cancelDelete,
    handleBulkDelete: () => deleteState.handleBulkDelete(selection.selectedIds),
    confirmBulkDelete: () =>
      deleteState.confirmBulkDelete(
        selection.selectedIds,
        selection.clearSelection,
      ),
    toggleSelect: selection.toggleSelect,
    toggleSelectAll: selection.toggleSelectAll,
    clearSelection: selection.clearSelection,
    handleReorder: (nextItems) =>
      fetchState.handleReorder(nextItems, reorderEndpoint),
    refresh: fetchState.refresh,
  };
}
