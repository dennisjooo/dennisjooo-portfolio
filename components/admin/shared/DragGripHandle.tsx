import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface DragGripHandleProps {
  onDragStart: (event: React.DragEvent) => void;
  className?: string;
}

export function DragGripHandle({ onDragStart, className }: DragGripHandleProps) {
  return (
    <button
      type="button"
      draggable
      onDragStart={onDragStart}
      title="Drag to reorder"
      className={cn(
        "self-stretch flex items-center justify-center shrink-0 px-1.5 py-2 rounded-md",
        "text-muted-foreground hover:text-foreground hover:bg-muted",
        "cursor-grab active:cursor-grabbing transition-colors",
        className
      )}
    >
      <GripVertical className="w-4 h-4" />
    </button>
  );
}
