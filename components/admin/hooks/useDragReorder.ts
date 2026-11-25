"use client";

import { useState } from "react";

export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  if (moved === undefined) return items;
  next.splice(to, 0, moved);
  return next;
}

export function useDragReorder(rowSelector: string, enabled = true) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (event: React.DragEvent, index: number) => {
    if (!enabled) return;
    setDragIndex(index);
    const row = (event.target as HTMLElement).closest(rowSelector);
    if (row && event.dataTransfer) {
      event.dataTransfer.setDragImage(row, 0, 0);
      event.dataTransfer.effectAllowed = "move";
    }
  };

  const handleDragOver = (event: React.DragEvent, index: number) => {
    if (!enabled || dragIndex === null) return;
    event.preventDefault();
    setDragOverIndex(index);
  };

  const clearDrag = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const finishDrop = (index: number): { from: number; to: number } | null => {
    if (!enabled || dragIndex === null) return null;
    const from = dragIndex;
    clearDrag();
    if (from === index) return null;
    return { from, to: index };
  };

  return {
    dragIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd: clearDrag,
    finishDrop,
  };
}
