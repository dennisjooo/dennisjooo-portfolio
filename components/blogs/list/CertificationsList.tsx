'use client';

import { CertificationCard, Certification } from './CertificationCard';
import { usePaginatedList } from '@/lib/hooks/usePaginatedList';
import { ListSkeleton, EmptyState, ListFooter } from '@/components/shared';

const PAGE_SIZE = 9;

export default function CertificationsList() {
    const {
        items: certifications,
        loading,
        loadingMore,
        pagination,
        sentinelRef
    } = usePaginatedList<Certification>({
        endpoint: '/api/certifications',
        pageSize: PAGE_SIZE
    });

    if (loading) {
        return <ListSkeleton count={PAGE_SIZE} height="h-64" gap="gap-6 md:gap-8" />;
    }

    if (certifications.length === 0) {
        return <EmptyState message="No certifications found" />;
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {certifications.map((cert, index) => (
                    <CertificationCard
                        key={cert.id}
                        certification={cert}
                        index={index}
                    />
                ))}
            </div>

            {/* Loading more indicator */}
            {loadingMore && (
                <div className="mt-6 md:mt-8">
                    <ListSkeleton count={3} height="h-64" gap="gap-6 md:gap-8" />
                </div>
            )}

            {/* Sentinel element for infinite scroll */}
            <div ref={sentinelRef} className="h-4 w-full" aria-hidden="true" />

            {/* End of list indicator */}
            {!pagination.hasMore && certifications.length > 0 && (
                <ListFooter total={pagination.total} itemName="certification" />
            )}
        </div>
    );
}
