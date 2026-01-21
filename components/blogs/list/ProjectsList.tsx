import { Blog } from '@/lib/db';
import { createUrlSlug } from '@/lib/utils/urlHelpers';
import { formatProjectDate } from '@/lib/utils/projectFormatting';
import { ContentCard } from '@/components/shared';
import { useEffect, useState, useCallback } from 'react';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';

const PAGE_SIZE = 9;

interface PaginationState {
    page: number;
    hasMore: boolean;
    total: number;
}

export default function ProjectsList({ type = 'project' }: { type?: 'project' | 'blog' | 'all' }) {
    const [projects, setProjects] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        hasMore: true,
        total: 0,
    });

    const fetchProjects = useCallback(async (page: number, reset = false) => {
        if (page === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const typeParam = type === 'all' ? '' : `&type=${type}`;
            const res = await fetch(`/api/blogs?page=${page}&limit=${PAGE_SIZE}${typeParam}`);
            const data = await res.json();
            
            const newProjects = data.data || [];
            
            setProjects(prev => reset ? newProjects : [...prev, ...newProjects]);
            setPagination({
                page: data.pagination.page,
                hasMore: data.pagination.hasMore,
                total: data.pagination.total,
            });
        } catch (error) {
            console.error('Failed to fetch projects', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [type]);

    // Initial fetch and refetch when type changes
    useEffect(() => {
        setProjects([]);
        setPagination({ page: 1, hasMore: true, total: 0 });
        fetchProjects(1, true);
    }, [fetchProjects]);

    const loadMore = useCallback(() => {
        if (!loadingMore && pagination.hasMore) {
            fetchProjects(pagination.page + 1);
        }
    }, [fetchProjects, loadingMore, pagination.hasMore, pagination.page]);

    const sentinelRef = useInfiniteScroll({
        onLoadMore: loadMore,
        hasMore: pagination.hasMore,
        isLoading: loadingMore,
        rootMargin: '200px',
    });

    if (loading) {
        return (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {[...Array(PAGE_SIZE)].map((_, i) => (
                    <div key={i} className="h-96 bg-muted/20 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-20 text-center">
                <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
                    No {type === 'all' ? 'content' : type === 'blog' ? 'articles' : 'projects'} found
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {projects.map(({ title, description, date, imageUrl, blogPost, type: itemType }, index) => (
                    <ContentCard
                        key={`${title}_${date}`}
                        title={title}
                        description={description}
                        slug={createUrlSlug(title)}
                        date={formatProjectDate(date, true)}
                        imageUrl={imageUrl ?? undefined}
                        index={index}
                        type={itemType}
                        readTime={`${Math.ceil(blogPost.split(/\s+/).length / 200)} min`}
                        variant="standard"
                    />
                ))}
            </div>

            {/* Loading more indicator */}
            {loadingMore && (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-8 md:mt-10">
                    {[...Array(3)].map((_, i) => (
                        <div key={`loading-${i}`} className="h-96 bg-muted/20 animate-pulse rounded-xl" />
                    ))}
                </div>
            )}

            {/* Sentinel element for infinite scroll */}
            <div ref={sentinelRef} className="h-4 w-full" aria-hidden="true" />

            {/* End of list indicator */}
            {!pagination.hasMore && projects.length > 0 && (
                <div className="w-full flex justify-center py-8">
                    <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">
                        Showing all {pagination.total} {pagination.total === 1 ? 'item' : 'items'}
                    </p>
                </div>
            )}
        </div>
    );
}
