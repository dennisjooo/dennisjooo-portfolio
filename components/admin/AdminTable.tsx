"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { GripVertical } from "lucide-react";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
  primary?: boolean;
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

  const handleDragOver = (
    event: React.DragEvent,
    index: number
  ) => {
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
      <div className="w-full h-64 flex items-center justify-center rounded-xl border border-border bg-card/30 backdrop-blur-sm animate-pulse">
        <div className="font-mono text-sm text-muted-foreground">Loading Data stream...</div>
      </div>
    );
  }

  if (!localData || localData.length === 0) {
    return (
      <div className="w-full h-40 flex items-center justify-center rounded-xl border border-border bg-card/30 backdrop-blur-sm">
        <div className="font-mono text-sm text-muted-foreground">No records found in database.</div>
      </div>
    );
  }

  const primaryColumn = columns.find(col => col.primary) || columns[0];
  const actionsColumn = columns.find(col => col.header.toLowerCase() === "actions");
  const detailColumns = columns.filter(col => col !== primaryColumn && col !== actionsColumn);

  return (
    <div className="space-y-4 w-full max-w-full">
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {localData.map((row, rowIdx) => {
          const isDragging = dragIndex === rowIdx;
          const isDragOver = dragOverIndex === rowIdx && dragIndex !== null && dragIndex !== rowIdx;

          return (
            <div
              key={row.id || rowIdx}
              data-card
              className={`rounded-xl border border-border bg-card/30 backdrop-blur-sm p-4 transition-all duration-200 ${
                isDragging ? "opacity-50 bg-muted/50" : ""
              } ${isDragOver ? "ring-2 ring-primary" : ""}`}
              onDragOver={(e) => handleDragOver(e, rowIdx)}
              onDrop={() => handleDrop(rowIdx)}
            >
              {/* Card Header: Primary content + Actions */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {enableReorder && (
                    <button
                      type="button"
                      className="flex-shrink-0 inline-flex items-center justify-center p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-grab active:cursor-grabbing transition-colors"
                      draggable
                      onDragStart={(e) => handleDragStart(e, rowIdx)}
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-4 h-4" />
                    </button>
                  )}
                  <div className="flex-1 min-w-0 text-sm font-urbanist text-foreground">
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
                <div className="space-y-2 pt-3 border-t border-border/30">
                  {detailColumns.map((col, colIdx) => (
                    <div key={colIdx} className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex-shrink-0">
                        {col.header}
                      </span>
                      <div className="text-right font-urbanist text-foreground">
                        {getCellValue(row, col)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-card/30 backdrop-blur-sm shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                {enableReorder && (
                  <th className="px-4 py-4 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    Order
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-4 text-xs font-mono uppercase tracking-widest text-muted-foreground ${col.className || ''}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {localData.map((row, rowIdx) => {
                const isDragging = dragIndex === rowIdx;
                const isDragOver = dragOverIndex === rowIdx && dragIndex !== null && dragIndex !== rowIdx;
                
                let rowClass = "group transition-all duration-200 ";
                if (isDragging) {
                  rowClass += "opacity-50 bg-muted/50 ";
                } else {
                  rowClass += "hover:bg-muted/30 ";
                }

                if (isDragOver) {
                  if (dragIndex! < rowIdx) {
                    rowClass += "shadow-[inset_0_-2px_0_0_hsl(var(--primary))] ";
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
                    {enableReorder && (
                      <td className="px-4 py-4 text-sm font-urbanist text-foreground w-[50px]">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-grab active:cursor-grabbing transition-colors"
                          draggable
                          onDragStart={(e) => handleDragStart(e, rowIdx)}
                          title="Drag to reorder"
                        >
                          <GripVertical className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                    {columns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className="px-6 py-4 text-sm font-urbanist text-foreground"
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground font-mono">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-border bg-card/50 hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-border bg-card/50 hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
