import { useState, useEffect } from "react";
import {
  moveItem,
  useDragReorder,
} from "@/components/admin/hooks/useDragReorder";

export function useAdminTableReorder<T>(
  data: T[],
  enableReorder: boolean,
  onReorder?: (rows: T[]) => void | Promise<void>,
) {
  const [localData, setLocalData] = useState<T[]>(data || []);
  const drag = useDragReorder("tr, [data-card]", enableReorder);

  useEffect(() => {
    setLocalData(data || []);
  }, [data]);

  const handleDrop = (index: number) => {
    const moved = drag.finishDrop(index);
    if (!moved) return;
    const next = moveItem(localData, moved.from, moved.to);
    setLocalData(next);
    onReorder?.(next);
  };

  return {
    localData,
    dragIndex: drag.dragIndex,
    dragOverIndex: drag.dragOverIndex,
    handleDragStart: drag.handleDragStart,
    handleDragOver: drag.handleDragOver,
    handleDrop,
  };
}
