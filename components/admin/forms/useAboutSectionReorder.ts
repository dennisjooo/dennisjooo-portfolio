import { useState } from "react";
import type { ContentSection } from "@/lib/content/aboutContent";

export function useAboutSectionReorder(
  sections: ContentSection[],
  onReorder: (sections: ContentSection[]) => void,
) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (event: React.DragEvent, index: number) => {
    setDragIndex(index);
    const row = (event.target as HTMLElement).closest(
      "[data-about-section-row]",
    );
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
      const next = [...sections];
      const [moved] = next.splice(dragIndex, 1);
      if (moved) next.splice(index, 0, moved);
      onReorder(next);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return {
    dragIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
}
