import { useState, useEffect } from "react";

export function useAdminTableReorder<T>(
  data: T[],
  enableReorder: boolean,
  onReorder?: (rows: T[]) => void | Promise<void>,
) {
  const [localData, setLocalData] = useState<T[]>(data || []);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    setLocalData(data || []);
  }, [data]);

  const handleDragStart = (event: React.DragEvent, index: number) => {
    if (!enableReorder) return;
    setDragIndex(index);

    const row = (event.target as HTMLElement).closest("tr, [data-card]");
    if (row && event.dataTransfer) {
      event.dataTransfer.setDragImage(row, 0, 0);
      event.dataTransfer.effectAllowed = "move";
    }
  };

  const handleDragOver = (event: React.DragEvent, index: number) => {
    if (!enableReorder || dragIndex === null) return;
    event.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (!enableReorder || dragIndex === null) return;
    if (dragIndex === index) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    const next = [...localData];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    setLocalData(next);
    setDragIndex(null);
    setDragOverIndex(null);
    onReorder?.(next);
  };

  return {
    localData,
    dragIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
}
