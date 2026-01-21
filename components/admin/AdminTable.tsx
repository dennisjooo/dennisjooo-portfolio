"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { GripVertical } from "lucide-react";

interface Column {
  header: string;
  accessorKey?: string;
  cell?: (row: any) => ReactNode;
  className?: string;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  enableReorder?: boolean;
  onReorder?: (rows: any[]) => void | Promise<void>;
}

export function AdminTable({
  columns,
  data,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  enableReorder = false,
  onReorder,
}: AdminTableProps) {
  const [localData, setLocalData] = useState<any[]>(data || []);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    setLocalData(data || []);
  }, [data]);

  const handleDragStart = (event: React.DragEvent, index: number) => {
    if (!enableReorder) return;
    setDragIndex(index);

    // Set ghost image to the row
    const row = (event.target as HTMLElement).closest("tr");
    if (row && event.dataTransfer) {
      // Set the drag image to the row, centered horizontally on the cursor if possible
      // or just at the click point.
      // 0,0 puts the top-left of the row at the cursor.
      // Let's try to center it vertically relative to the row height?
      // For now, standard behavior is fine.
      event.dataTransfer.setDragImage(row, 0, 0);
      event.dataTransfer.effectAllowed = "move";
    }
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLTableRowElement>,
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

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card/30 backdrop-blur-sm shadow-sm">
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

                // Visual indicator for drop target
                if (isDragOver) {
                  if (dragIndex! < rowIdx) {
                    // Dragging down - insert after (bottom indicator)
                    // Using shadow to avoid layout shift
                    rowClass += "shadow-[inset_0_-2px_0_0_hsl(var(--primary))] ";
                  } else {
                    // Dragging up - insert before (top indicator)
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
                        {col.cell
                          ? col.cell(row)
                          : col.accessorKey
                          ? row[col.accessorKey]
                          : ""}
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
