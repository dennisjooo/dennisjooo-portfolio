'use client';

import { useEffect, useState, useCallback } from 'react';
import { CertificationCard, Certification } from './CertificationCard';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';

const PAGE_SIZE = 9;

interface PaginationState {
    page: number;
    hasMore: boolean;
    total: number;
}

export default function CertificationsList() {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        hasMore: true,
        total: 0,
    });

    const fetchCertifications = useCallback(async (page: number, reset = false) => {
        if (page === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const res = await fetch(`/api/certifications?page=${page}&limit=${PAGE_SIZE}`);
            const data = await res.json();
            
            if (data.success) {
                const newCerts = data.data || [];
                
                setCertifications(prev => reset ? newCerts : [...prev, ...newCerts]);
                setPagination({
                    page: data.pagination.page,
                    hasMore: data.pagination.hasMore,
                    total: data.pagination.total,
                });
            }
        } catch (error) {
            console.error("Failed to fetch certifications", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchCertifications(1, true);
    }, [fetchCertifications]);

    const loadMore = useCallback(() => {
        if (!loadingMore && pagination.hasMore) {
            fetchCertifications(pagination.page + 1);
        }
    }, [fetchCertifications, loadingMore, pagination.hasMore, pagination.page]);

    const sentinelRef = useInfiniteScroll({
        onLoadMore: loadMore,
        hasMore: pagination.hasMore,
        isLoading: loadingMore,
        rootMargin: '200px',
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
                        key={cert._id} 
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
