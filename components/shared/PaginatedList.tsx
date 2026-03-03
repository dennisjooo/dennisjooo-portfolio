'use client';

import { type ReactNode } from 'react';
import { ListSkeleton } from './ListSkeleton';
import { EmptyState } from './EmptyState';
import { ListFooter } from './ListFooter';

interface PaginatedListProps<T> {
    items: T[];
    loading: boolean;
    loadingMore: boolean;
    pagination: { hasMore: boolean; total: number };
    sentinelRef: (node: HTMLDivElement | null) => void;
    renderItem: (item: T, index: number) => ReactNode;
    keyExtractor: (item: T) => string;
    emptyMessage: string;
    itemName?: string;
    skeletonCount?: number;
    skeletonHeight?: string;
    gridClassName?: string;
    gapClassName?: string;
}

export function PaginatedList<T>({
    items,
    loading,
    loadingMore,
    pagination,
    sentinelRef,
    renderItem,
    keyExtractor,
    emptyMessage,
    itemName = 'item',
    skeletonCount = 9,
    skeletonHeight,
    gridClassName = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    gapClassName = 'gap-8 md:gap-10',
}: PaginatedListProps<T>) {
    if (loading) {
        return <ListSkeleton count={skeletonCount} height={skeletonHeight} gap={gapClassName} />;
    }

    if (items.length === 0) {
        return <EmptyState message={emptyMessage} />;
    }

    return (
        <div className="w-full">
            <div className={`grid ${gridClassName} ${gapClassName}`}>
                {items.map((item, index) => (
                    <div key={keyExtractor(item)}>{renderItem(item, index)}</div>
                ))}
            </div>

            {loadingMore && (
                <div className="mt-8 md:mt-10">
                    <ListSkeleton count={3} height={skeletonHeight} gap={gapClassName} />
                </div>
            )}

            <div ref={sentinelRef} className="h-4 w-full" aria-hidden="true" />

            {!pagination.hasMore && items.length > 0 && (
                <ListFooter total={pagination.total} itemName={itemName} />
            )}
        </div>
    );
}
