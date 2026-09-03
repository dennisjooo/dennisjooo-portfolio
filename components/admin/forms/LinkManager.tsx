import { useState } from "react";
import { formStyles } from "@/components/admin/shared/formStyles";
import { LinkInputRow } from "./LinkInputRow";
import { LinkListItem } from "./LinkListItem";
import { useLinkReorder } from "./useLinkReorder";

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
  const {
    dragIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  } = useLinkReorder(links, onReorder);

  const addLink = () => {
    if (linkInput.text && linkInput.url) {
      onAdd(linkInput);
      setLinkInput({ text: "", url: "" });
    }
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
        <LinkInputRow
          text={linkInput.text}
          url={linkInput.url}
          onTextChange={(text) => setLinkInput((prev) => ({ ...prev, text }))}
          onUrlChange={(url) => setLinkInput((prev) => ({ ...prev, url }))}
          onAdd={addLink}
        />

        <div className="space-y-3">
          {links.map((link, index) => (
            <LinkListItem
              key={index}
              link={link}
              index={index}
              showGrip={links.length > 1}
              isDragging={dragIndex === index}
              isDragOver={
                dragOverIndex === index &&
                dragIndex !== null &&
                dragIndex !== index
              }
              onUpdate={(updated) => onUpdate(index, updated)}
              onRemove={() => onRemove(index)}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
            />
          ))}
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
