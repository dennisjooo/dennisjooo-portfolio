import { useState, useCallback } from 'react';

export function useExpandableList<T>(items: T[], initialCount: number) {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggle = useCallback(() => setIsExpanded(prev => !prev), []);
    const initialItems = items.slice(0, initialCount);
    const expandedItems = items.slice(initialCount);
    const hasMore = items.length > initialCount;

    return { isExpanded, toggle, initialItems, expandedItems, hasMore };
}
