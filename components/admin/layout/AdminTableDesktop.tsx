import { ReactNode } from "react";
import { DragGripHandle } from "@/components/admin/shared/DragGripHandle";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { Column } from "./AdminTable";

interface AdminTableDesktopProps<T extends { id?: string | number }> {
  localData: T[];
  columns: Column<T>[];
  enableReorder: boolean;
  enableSelect?: boolean;
  selectedIds?: Set<string>;
  dragIndex: number | null;
  dragOverIndex: number | null;
  sortBy?: string | null;
  sortOrder?: "asc" | "desc" | null;
  onToggleSelect?: (id: string) => void;
  onToggleSelectAll?: () => void;
  onSortChange?: (key: string) => void;
  onDragStart: (event: React.DragEvent, index: number) => void;
  onDragOver: (event: React.DragEvent, index: number) => void;
  onDrop: (index: number) => void;
  getCellValue: (row: T, col: Column<T>) => ReactNode;
}

export function AdminTableDesktop<T extends { id?: string | number }>({
  localData,
  columns,
  enableReorder,
  enableSelect,
  selectedIds,
  dragIndex,
  dragOverIndex,
  sortBy,
  sortOrder,
  onToggleSelect,
  onToggleSelectAll,
  onSortChange,
  onDragStart,
  onDragOver,
  onDrop,
  getCellValue,
}: AdminTableDesktopProps<T>) {
  return (
    <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border/50 bg-muted/10">
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
                  rowClass += "shadow-[inset_0_-2px_0_0_hsl(var(--primary))] ";
                } else {
                  rowClass += "shadow-[inset_0_2px_0_0_hsl(var(--primary))] ";
                }
              }

              return (
                <tr
                  key={row.id || rowIdx}
                  className={rowClass}
                  onDragOver={(event) => onDragOver(event, rowIdx)}
                  onDrop={() => onDrop(rowIdx)}
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
                        onDragStart={(e) => onDragStart(e, rowIdx)}
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
  );
}
