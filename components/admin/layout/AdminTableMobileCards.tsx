import { ReactNode } from "react";
import { DragGripHandle } from "@/components/admin/shared/DragGripHandle";
import { cn } from "@/lib/utils";
import type { Column } from "./AdminTable";

interface AdminTableMobileCardsProps<T extends { id?: string | number }> {
  localData: T[];
  columns: Column<T>[];
  enableReorder: boolean;
  enableSelect?: boolean;
  selectedIds?: Set<string>;
  dragIndex: number | null;
  dragOverIndex: number | null;
  onToggleSelect?: (id: string) => void;
  onDragStart: (event: React.DragEvent, index: number) => void;
  onDragOver: (event: React.DragEvent, index: number) => void;
  onDrop: (index: number) => void;
  getCellValue: (row: T, col: Column<T>) => ReactNode;
}

export function AdminTableMobileCards<T extends { id?: string | number }>({
  localData,
  columns,
  enableReorder,
  enableSelect,
  selectedIds,
  dragIndex,
  dragOverIndex,
  onToggleSelect,
  onDragStart,
  onDragOver,
  onDrop,
  getCellValue,
}: AdminTableMobileCardsProps<T>) {
  const primaryColumn = columns.find((col) => col.primary) || columns[0];
  const actionsColumn = columns.find(
    (col) => col.header.toLowerCase() === "actions",
  );
  const detailColumns = columns.filter(
    (col) => col !== primaryColumn && col !== actionsColumn,
  );

  return (
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
              "flex items-stretch gap-2 rounded-lg border border-border bg-card/30 p-4 transition-all duration-200",
              isDragging && "bg-muted/50 opacity-50",
              isDragOver && "ring-2 ring-primary",
            )}
            onDragOver={(e) => onDragOver(e, rowIdx)}
            onDrop={() => onDrop(rowIdx)}
          >
            {enableReorder && (
              <DragGripHandle onDragStart={(e) => onDragStart(e, rowIdx)} />
            )}
            <div className="min-w-0 flex-1">
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
  );
}
