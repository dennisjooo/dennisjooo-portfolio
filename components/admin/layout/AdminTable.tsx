"use client";

import { ReactNode } from "react";
import { AdminTablePagination } from "./AdminTablePagination";
import { AdminTableMobileCards } from "./AdminTableMobileCards";
import { AdminTableDesktop } from "./AdminTableDesktop";
import { useAdminTableReorder } from "./useAdminTableReorder";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
  primary?: boolean;
  sortable?: boolean;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  enableReorder?: boolean;
  onReorder?: (rows: T[]) => void | Promise<void>;
  enableSelect?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
  sortBy?: string | null;
  sortOrder?: "asc" | "desc" | null;
  onSortChange?: (key: string) => void;
}

export function AdminTable<T extends { id?: string | number }>({
  columns,
  data,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  enableReorder = false,
  onReorder,
  enableSelect,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  sortBy,
  sortOrder,
  onSortChange,
}: AdminTableProps<T>) {
  const {
    localData,
    dragIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
  } = useAdminTableReorder(data, enableReorder, onReorder);

  const getCellValue = (row: T, col: Column<T>) => {
    if (col.cell) return col.cell(row);
    if (col.accessorKey) return String(row[col.accessorKey] ?? "");
    return "";
  };

  if (isLoading) {
    return (
      <div className="flex h-64 w-full animate-pulse items-center justify-center rounded-lg border border-border bg-card/30">
        <div className="font-mono text-sm text-muted-foreground">
          Loading Data stream...
        </div>
      </div>
    );
  }

  if (!localData || localData.length === 0) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-lg border border-border bg-card/30">
        <div className="font-mono text-sm text-muted-foreground">
          No records found in database.
        </div>
      </div>
    );
  }

  const sharedProps = {
    localData,
    columns,
    enableReorder,
    enableSelect,
    selectedIds,
    dragIndex,
    dragOverIndex,
    onToggleSelect,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
    getCellValue,
  };

  return (
    <div className="w-full max-w-full space-y-4">
      <AdminTableMobileCards {...sharedProps} />
      <AdminTableDesktop
        {...sharedProps}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onToggleSelectAll={onToggleSelectAll}
        onSortChange={onSortChange}
      />
      <AdminTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
