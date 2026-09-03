import { useState } from "react";

export function useResponsibilityReorder(
  reorder: (fromIndex: number, toIndex: number) => void,
) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (event: React.DragEvent, index: number) => {
    setDragIndex(index);
    const row = (event.target as HTMLElement).closest(
      "[data-responsibility-row]",
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
      reorder(dragIndex, index);
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
