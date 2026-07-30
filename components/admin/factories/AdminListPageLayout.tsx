"use client";

import type { ReactNode } from "react";
import { AdminTable, Column } from "@/components/admin/layout/AdminTable";
import {
  AdminPageHeader,
  AdminReorderHint,
  ConfirmDialog,
} from "@/components/admin/shared";

interface ListPageHeaderConfig {
  title: string;
  titleAccent: string;
  subtitle: string;
  actionHref: string;
  actionLabel: string;
}

interface AdminListPageLayoutProps<
  T extends { id: string; order?: number | null },
> {
  header: ListPageHeaderConfig;
  subtitle?: string;
  spacing?: "default" | "compact";
  toolbar?: ReactNode;
  bulkActions?: ReactNode;
  columns: Column<T>[];
  items: T[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  enableReorder?: boolean;
  onReorder?: (items: T[]) => Promise<void>;
  disablePagination?: boolean;
  enableSelect?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
  sortBy?: string | null;
  sortOrder?: "asc" | "desc" | null;
  onSortChange?: (key: string) => void;
  deleteDialog: {
    open: boolean;
    title: string;
    description: string;
    loading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  };
}

export function AdminListPageLayout<
  T extends { id: string; order?: number | null },
>({
  header,
  subtitle,
  spacing = "default",
  toolbar,
  bulkActions,
  columns,
  items,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  enableReorder = false,
  onReorder,
  disablePagination = false,
  enableSelect = false,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  sortBy,
  sortOrder,
  onSortChange,
  deleteDialog,
}: AdminListPageLayoutProps<T>) {
  return (
    <div className={spacing === "compact" ? "space-y-6" : "space-y-8"}>
      <AdminPageHeader
        title={header.title}
        titleAccent={header.titleAccent}
        subtitle={subtitle ?? header.subtitle}
        actionHref={header.actionHref}
        actionLabel={header.actionLabel}
      />

      {toolbar}
      {bulkActions}

      <AdminTable
        columns={columns}
        data={items}
        isLoading={loading}
        currentPage={disablePagination ? 1 : currentPage}
        totalPages={disablePagination ? 1 : totalPages}
        onPageChange={disablePagination ? () => {} : onPageChange}
        enableReorder={enableReorder}
        onReorder={enableReorder ? onReorder : undefined}
        enableSelect={enableSelect}
        selectedIds={selectedIds}
        onToggleSelect={onToggleSelect}
        onToggleSelectAll={onToggleSelectAll}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={onSortChange}
      />

      {enableReorder && <AdminReorderHint />}

      <ConfirmDialog
        open={deleteDialog.open}
        title={deleteDialog.title}
        description={deleteDialog.description}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteDialog.loading}
        onConfirm={deleteDialog.onConfirm}
        onCancel={deleteDialog.onCancel}
      />
    </div>
  );
}
