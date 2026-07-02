import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface DragGripHandleProps {
  onDragStart: (event: React.DragEvent) => void;
  className?: string;
}

export function DragGripHandle({
  onDragStart,
  className,
}: DragGripHandleProps) {
  return (
    <button
      type="button"
      draggable
      onDragStart={onDragStart}
      title="Drag to reorder"
      className={cn(
        "flex shrink-0 items-center justify-center self-stretch rounded-md px-1.5 py-2",
        "text-muted-foreground hover:bg-muted hover:text-foreground",
        "cursor-grab transition-colors active:cursor-grabbing",
        className,
      )}
    >
      <GripVertical className="h-4 w-4" />
    </button>
  );
}
