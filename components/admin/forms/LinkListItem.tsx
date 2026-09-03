import { XMarkIcon } from "@heroicons/react/24/outline";
import { formStyles } from "@/components/admin/shared/formStyles";
import { AutoResizeTextarea } from "@/components/admin/shared/AutoResizeTextarea";
import { DragGripHandle } from "@/components/admin/shared/DragGripHandle";
import { cn } from "@/lib/utils";

interface Link {
  text: string;
  url: string;
}

interface LinkListItemProps {
  link: Link;
  index: number;
  showGrip: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  onUpdate: (link: Link) => void;
  onRemove: () => void;
  onDragStart: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}

export function LinkListItem({
  link,
  index,
  showGrip,
  isDragging,
  isDragOver,
  onUpdate,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: LinkListItemProps) {
  return (
    <div
      data-link-row
      className={cn(
        "flex items-stretch gap-2 rounded-md border border-border/50 bg-background p-2 transition-all duration-200",
        isDragging && "bg-muted/50 opacity-50",
        isDragOver && "ring-2 ring-primary",
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      {showGrip && <DragGripHandle onDragStart={onDragStart} />}
      <span className="w-6 shrink-0 self-center text-right font-mono text-sm text-muted-foreground">
        {index + 1}.
      </span>
      <div className="min-w-0 flex-1 space-y-2">
        <input
          type="text"
          placeholder="Label"
          value={link.text}
          onChange={(e) => onUpdate({ ...link, text: e.target.value })}
          className={cn(formStyles.input, "py-2 text-sm")}
        />
        <AutoResizeTextarea
          placeholder="https://..."
          value={link.url}
          onValueChange={(url) => onUpdate({ ...link, url })}
          className={cn(
            formStyles.input,
            "min-h-[2.5rem] py-2 font-mono text-sm",
          )}
        />
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 self-center p-2 text-muted-foreground transition-colors hover:text-destructive"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
