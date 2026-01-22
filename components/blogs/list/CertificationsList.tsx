'use client';

import { CertificationCard, Certification } from './CertificationCard';
import { usePaginatedList } from '@/lib/hooks/usePaginatedList';

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
        return (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[...Array(PAGE_SIZE)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted/20 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    if (certifications.length === 0) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-20 text-center">
                <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
                    No certifications found
                </p>
            </div>
        );
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
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={`loading-${i}`} className="h-64 bg-muted/20 animate-pulse rounded-xl" />
                    ))}
                </div>
            )}

            {/* Sentinel element for infinite scroll */}
            <div ref={sentinelRef} className="h-4 w-full" aria-hidden="true" />

            {/* End of list indicator */}
            {!pagination.hasMore && certifications.length > 0 && (
                <div className="w-full flex justify-center py-8">
                    <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
                        Showing all {pagination.total} {pagination.total === 1 ? 'certification' : 'certifications'}
                    </p>
                </div>
            )}
        </div>
    );
}
