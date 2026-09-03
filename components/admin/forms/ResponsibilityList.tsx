"use client";

import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formStyles } from "@/components/admin/shared/formStyles";
import { AutoResizeTextarea } from "@/components/admin/shared/AutoResizeTextarea";
import { DragGripHandle } from "@/components/admin/shared/DragGripHandle";
import { cn } from "@/lib/utils";
import { useResponsibilityReorder } from "./useResponsibilityReorder";

interface ResponsibilityListProps {
  responsibilities: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function ResponsibilityList({
  responsibilities,
  onAdd,
  onRemove,
  onUpdate,
  onReorder,
}: ResponsibilityListProps) {
  const {
    dragIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  } = useResponsibilityReorder(onReorder);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className={formStyles.label}>Responsibilities</label>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 text-xs text-accent transition-colors hover:text-accent/80"
        >
          <PlusIcon className="h-4 w-4" />
          Add Item
        </button>
      </div>
      {responsibilities.length > 1 && (
        <p className="mb-3 text-xs text-muted-foreground">
          Drag the grip to reorder items.
        </p>
      )}
      <div className="space-y-3">
        {responsibilities.map((resp, index) => {
          const isDragging = dragIndex === index;
          const isDragOver =
            dragOverIndex === index &&
            dragIndex !== null &&
            dragIndex !== index;

          return (
            <div
              key={index}
              data-responsibility-row
              className={cn(
                "flex items-stretch gap-2 rounded-lg transition-all duration-200",
                isDragging && "bg-muted/50 opacity-50",
                isDragOver && "ring-2 ring-primary",
              )}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
            >
              {responsibilities.length > 1 && (
                <DragGripHandle
                  onDragStart={(e) => handleDragStart(e, index)}
                />
              )}
              <span className="w-6 shrink-0 self-center text-right font-mono text-sm text-muted-foreground">
                {index + 1}.
              </span>
              <AutoResizeTextarea
                className={cn(formStyles.input, "min-h-[4.5rem]")}
                placeholder="Describe a responsibility or achievement..."
                value={resp}
                onValueChange={(value) => onUpdate(index, value)}
              />
              {responsibilities.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="shrink-0 self-center p-2 text-muted-foreground transition-colors hover:text-destructive"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
