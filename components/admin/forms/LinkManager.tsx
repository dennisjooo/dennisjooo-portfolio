import { useState } from "react";
import { LinkIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { formStyles } from "@/components/admin/shared/formStyles";
import { AutoResizeTextarea } from "@/components/admin/shared/AutoResizeTextarea";
import { DragGripHandle } from "@/components/admin/shared/DragGripHandle";
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
      <div className="mb-1 flex items-center justify-between">
        <label className={formStyles.label}>Related Links</label>
      </div>
      {links.length > 1 && (
        <p className="mb-3 text-xs text-muted-foreground">
          Drag the grip to reorder links.
        </p>
      )}
      <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4">
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
            className="rounded-lg bg-primary p-2 text-primary-foreground transition-opacity hover:opacity-90"
          >
            <LinkIcon className="h-5 w-5" />
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
                  "flex items-stretch gap-2 rounded-md border border-border/50 bg-background p-2 transition-all duration-200",
                  isDragging && "bg-muted/50 opacity-50",
                  isDragOver && "ring-2 ring-primary",
                )}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
              >
                {links.length > 1 && (
                  <DragGripHandle
                    onDragStart={(e) => handleDragStart(e, index)}
                  />
                )}
                <span className="w-6 shrink-0 self-center text-right font-mono text-sm text-muted-foreground">
                  {index + 1}.
                </span>
                <div className="min-w-0 flex-1 space-y-2">
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
                      "min-h-[2.5rem] py-2 font-mono text-sm",
                    )}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="shrink-0 self-center p-2 text-muted-foreground transition-colors hover:text-destructive"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            );
          })}
          {links.length === 0 && (
            <p className="py-2 text-center text-xs text-muted-foreground">
              No links added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
