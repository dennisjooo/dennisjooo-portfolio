import { useState } from "react";
import { LinkIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { formStyles } from "./shared/formStyles";
import { AutoResizeTextarea } from "./shared/AutoResizeTextarea";
import { DragGripHandle } from "./shared/DragGripHandle";
import { cn } from "@/lib/utils";

interface Link {
  text: string;
  url: string;
}

interface LinkManagerProps {
  links: Link[];
  onAdd: (link: Link) => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, link: Link) => void;
  onReorder: (links: Link[]) => void;
}

export function LinkManager({
  links,
  onAdd,
  onRemove,
  onUpdate,
  onReorder,
}: LinkManagerProps) {
  const [linkInput, setLinkInput] = useState({ text: "", url: "" });
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const addLink = () => {
    if (linkInput.text && linkInput.url) {
      onAdd(linkInput);
      setLinkInput({ text: "", url: "" });
    }
  };

  const handleDragStart = (event: React.DragEvent, index: number) => {
    setDragIndex(index);
    const row = (event.target as HTMLElement).closest("[data-link-row]");
    if (row && event.dataTransfer) {
      event.dataTransfer.setDragImage(row, 0, 0);
      event.dataTransfer.effectAllowed = "move";
    }
  };

  const handleDragOver = (event: React.DragEvent, index: number) => {
    if (dragIndex === null) return;
    event.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null) return;
    if (dragIndex !== index) {
      const next = [...links];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      onReorder(next);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className={formStyles.label}>Related Links</label>
      </div>
      {links.length > 1 && (
        <p className="text-xs text-muted-foreground mb-3">
          Drag the grip to reorder links.
        </p>
      )}
      <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border/50">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Label (e.g. GitHub)"
            value={linkInput.text}
            onChange={(e) =>
              setLinkInput((prev) => ({ ...prev, text: e.target.value }))
            }
            className={cn(formStyles.input, "py-2 text-sm")}
          />
          <input
            type="text"
            placeholder="https://..."
            value={linkInput.url}
            onChange={(e) =>
              setLinkInput((prev) => ({ ...prev, url: e.target.value }))
            }
            className={cn(formStyles.input, "py-2 text-sm")}
          />
          <button
            type="button"
            onClick={addLink}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <LinkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {links.map((link, index) => {
            const isDragging = dragIndex === index;
            const isDragOver =
              dragOverIndex === index &&
              dragIndex !== null &&
              dragIndex !== index;

            return (
              <div
                key={index}
                data-link-row
                className={cn(
                  "flex items-stretch gap-2 p-2 bg-background rounded-md border border-border/50 transition-all duration-200",
                  isDragging && "opacity-50 bg-muted/50",
                  isDragOver && "ring-2 ring-primary"
                )}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
              >
                {links.length > 1 && (
                  <DragGripHandle onDragStart={(e) => handleDragStart(e, index)} />
                )}
                <span className="self-center text-muted-foreground font-mono text-sm w-6 text-right shrink-0">
                  {index + 1}.
                </span>
                <div className="flex-1 min-w-0 space-y-2">
                  <input
                    type="text"
                    placeholder="Label"
                    value={link.text}
                    onChange={(e) =>
                      onUpdate(index, { ...link, text: e.target.value })
                    }
                    className={cn(formStyles.input, "py-2 text-sm")}
                  />
                  <AutoResizeTextarea
                    placeholder="https://..."
                    value={link.url}
                    onValueChange={(url) => onUpdate(index, { ...link, url })}
                    className={cn(
                      formStyles.input,
                      "py-2 text-sm font-mono min-h-[2.5rem]"
                    )}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="self-center p-2 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            );
          })}
          {links.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              No links added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
