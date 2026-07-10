"use client";

import { ReactNode, useEffect, useState } from "react";
import { DragGripHandle } from "@/components/admin/shared/DragGripHandle";
import { cn } from "@/lib/utils";
import { AdminTablePagination } from "./AdminTablePagination";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

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
  const [localData, setLocalData] = useState<T[]>(data || []);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    setLocalData(data || []);
  }, [data]);

  const handleDragStart = (event: React.DragEvent, index: number) => {
    if (!enableReorder) return;
    setDragIndex(index);

    const row = (event.target as HTMLElement).closest("tr, [data-card]");
    if (row && event.dataTransfer) {
      event.dataTransfer.setDragImage(row, 0, 0);
      event.dataTransfer.effectAllowed = "move";
    }
  };

  const handleDragOver = (event: React.DragEvent, index: number) => {
    if (!enableReorder || dragIndex === null) return;
    event.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (!enableReorder || dragIndex === null) return;
    if (dragIndex === index) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    const next = [...localData];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    setLocalData(next);
    setDragIndex(null);
    setDragOverIndex(null);
    onReorder?.(next);
  };

  const getCellValue = (row: T, col: Column<T>) => {
    if (col.cell) return col.cell(row);
    if (col.accessorKey) return String(row[col.accessorKey] ?? "");
    return "";
  };

  if (isLoading) {
    return (
      <div className="flex h-64 w-full animate-pulse items-center justify-center rounded-xl border border-border bg-card/30 backdrop-blur-sm">
        <div className="font-mono text-sm text-muted-foreground">
          Loading Data stream...
        </div>
      </div>
    );
  }

  if (!localData || localData.length === 0) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-xl border border-border bg-card/30 backdrop-blur-sm">
        <div className="font-mono text-sm text-muted-foreground">
          No records found in database.
        </div>
      </div>
    );
  }

  const primaryColumn = columns.find((col) => col.primary) || columns[0];
  const actionsColumn = columns.find(
    (col) => col.header.toLowerCase() === "actions",
  );
  const detailColumns = columns.filter(
    (col) => col !== primaryColumn && col !== actionsColumn,
  );

  return (
    <div className="w-full max-w-full space-y-4">
      {/* Mobile Card Layout */}
      <div className="space-y-3 md:hidden">
        {localData.map((row, rowIdx) => {
          const isDragging = dragIndex === rowIdx;
          const isDragOver =
            dragOverIndex === rowIdx &&
            dragIndex !== null &&
            dragIndex !== rowIdx;

          return (
            <div
              key={row.id || rowIdx}
              data-card
              className={cn(
                "flex items-stretch gap-2 rounded-xl border border-border bg-card/30 p-4 backdrop-blur-sm transition-all duration-200",
                isDragging && "bg-muted/50 opacity-50",
                isDragOver && "ring-2 ring-primary",
              )}
              onDragOver={(e) => handleDragOver(e, rowIdx)}
              onDrop={() => handleDrop(rowIdx)}
            >
              {enableReorder && (
                <DragGripHandle
                  onDragStart={(e) => handleDragStart(e, rowIdx)}
                />
              )}
              <div className="min-w-0 flex-1">
                {/* Card Header: Primary content + Actions */}
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {enableSelect && (
                      <input
                        type="checkbox"
                        checked={selectedIds?.has(String(row.id)) ?? false}
                        onChange={() => onToggleSelect?.(String(row.id))}
                        className="flex-shrink-0 self-center rounded border-border accent-primary"
                      />
                    )}
                    <div className="min-w-0 flex-1 font-sans text-sm text-foreground">
                      {getCellValue(row, primaryColumn)}
                    </div>
                  </div>
                  {actionsColumn && (
                    <div className="flex-shrink-0">
                      {getCellValue(row, actionsColumn)}
                    </div>
                  )}
                </div>

                {/* Card Details */}
                {detailColumns.length > 0 && (
                  <div className="space-y-2 border-t border-border/30 pt-3">
                    {detailColumns.map((col, colIdx) => (
                      <div
                        key={colIdx}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <span className="flex-shrink-0 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                          {col.header}
                        </span>
                        <div className="text-right font-sans text-foreground">
                          {getCellValue(row, col)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card/30 shadow-sm backdrop-blur-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                {enableSelect && (
                  <th className="w-[40px] px-4 py-4">
                    <input
                      type="checkbox"
                      checked={
                        localData.length > 0 &&
                        selectedIds?.size === localData.length
                      }
                      onChange={() => onToggleSelectAll?.()}
                      className="rounded border-border accent-primary"
                    />
                  </th>
                )}
                {enableReorder && (
                  <th className="px-4 py-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Order
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-4 font-mono text-xs uppercase tracking-widest text-muted-foreground ${col.className || ""} ${col.sortable ? "cursor-pointer hover:text-foreground" : ""}`}
                    onClick={() => {
                      if (col.sortable && col.accessorKey && onSortChange) {
                        onSortChange(col.accessorKey as string);
                      }
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.header}
                      {col.sortable && col.accessorKey && (
                        <span className="text-muted-foreground/50">
                          {sortBy === col.accessorKey ? (
                            sortOrder === "asc" ? (
                              <ArrowUp className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <ArrowDown className="h-3.5 w-3.5 text-primary" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {localData.map((row, rowIdx) => {
                const isDragging = dragIndex === rowIdx;
                const isDragOver =
                  dragOverIndex === rowIdx &&
                  dragIndex !== null &&
                  dragIndex !== rowIdx;

                let rowClass = "group transition-all duration-200 ";
                if (isDragging) {
                  rowClass += "opacity-50 bg-muted/50 ";
                } else {
                  rowClass += "hover:bg-muted/30 ";
                }

                if (isDragOver) {
                  if (dragIndex! < rowIdx) {
                    rowClass +=
                      "shadow-[inset_0_-2px_0_0_hsl(var(--primary))] ";
                  } else {
                    rowClass += "shadow-[inset_0_2px_0_0_hsl(var(--primary))] ";
                  }
                }

                return (
                  <tr
                    key={row.id || rowIdx}
                    className={rowClass}
                    onDragOver={(event) => handleDragOver(event, rowIdx)}
                    onDrop={() => handleDrop(rowIdx)}
                  >
                    {enableSelect && (
                      <td className="w-[40px] px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds?.has(String(row.id)) ?? false}
                          onChange={() => onToggleSelect?.(String(row.id))}
                          className="rounded border-border accent-primary"
                        />
                      </td>
                    )}
                    {enableReorder && (
                      <td className="w-11 p-0">
                        <DragGripHandle
                          onDragStart={(e) => handleDragStart(e, rowIdx)}
                          className="h-full min-h-[3.5rem] w-full rounded-none"
                        />
                      </td>
                    )}
                    {columns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className="px-6 py-4 font-sans text-sm text-foreground"
                      >
                        {getCellValue(row, col)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AdminTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
