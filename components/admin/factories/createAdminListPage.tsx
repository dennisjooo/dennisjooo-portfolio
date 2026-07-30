"use client";

import type { ReactNode } from "react";
import { AdminListPageLayout } from "./AdminListPageLayout";
import { Column } from "@/components/admin/layout/AdminTable";
import { useAdminList } from "@/components/admin/hooks";
import type { UseAdminListReturn } from "@/components/admin/hooks/adminListTypes";

interface ListPageHeaderConfig {
  title: string;
  titleAccent: string;
  subtitle: string;
  actionHref: string;
  actionLabel: string;
}

interface ListPageDeleteDialogConfig {
  title: string;
  description: string;
}

interface AdminListPageConfig<T extends { id: string; order?: number | null }> {
  endpoint: string;
  pageSize?: number;
  enableReorder?: boolean;
  reorderEndpoint?: string;
  itemName: string;
  deleteSuccessMessage: string;
  header: ListPageHeaderConfig;
  deleteDialog: ListPageDeleteDialogConfig;
  createColumns: (handleDelete: (id: string) => void) => Column<T>[];
  disablePagination?: boolean;
  spacing?: "default" | "compact";
  enableSelect?: boolean;
  toolbar?: (ctx: UseAdminListReturn<T>) => ReactNode;
  bulkActions?: (ctx: UseAdminListReturn<T>) => ReactNode;
  getSubtitle?: (ctx: UseAdminListReturn<T>) => string;
  getDeleteDialog?: (ctx: UseAdminListReturn<T>) => {
    title: string;
    description: string;
  };
}

export function createAdminListPage<
  T extends { id: string; order?: number | null },
>(config: AdminListPageConfig<T>) {
  const {
    endpoint,
    pageSize,
    enableReorder = false,
    reorderEndpoint,
    itemName,
    deleteSuccessMessage,
    header,
    deleteDialog,
    createColumns,
    disablePagination = false,
    spacing = "default",
    enableSelect = false,
    toolbar,
    bulkActions,
    getSubtitle,
    getDeleteDialog,
  } = config;

  return function AdminListPage() {
    const listContext = useAdminList<T>({
      endpoint,
      pageSize,
      enableReorder,
      reorderEndpoint,
      itemName,
      deleteSuccessMessage,
    });

    const {
      items,
      loading,
      currentPage,
      totalPages,
      handlePageChange,
      handleDelete,
      handleReorder,
      deleteDialog: dialogState,
      confirmDelete,
      cancelDelete,
      sortBy,
      sortOrder,
      handleSort,
      selectedIds,
      toggleSelect,
      toggleSelectAll,
    } = listContext;

    const columns = createColumns(handleDelete);
    const dialogCopy = getDeleteDialog?.(listContext) ?? deleteDialog;

    return (
      <AdminListPageLayout
        header={header}
        subtitle={getSubtitle?.(listContext)}
        spacing={spacing}
        toolbar={toolbar?.(listContext)}
        bulkActions={bulkActions?.(listContext)}
        columns={columns}
        items={items}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        enableReorder={enableReorder}
        onReorder={enableReorder ? handleReorder : undefined}
        disablePagination={disablePagination}
        enableSelect={enableSelect}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSort}
        deleteDialog={{
          open: dialogState.open,
          title: dialogCopy.title,
          description: dialogCopy.description,
          loading: dialogState.loading,
          onConfirm: confirmDelete,
          onCancel: cancelDelete,
        }}
      />
    );
  };
}
