import { Blog } from '@/lib/db';
import { createUrlSlug } from '@/lib/utils/urlHelpers';
import { formatProjectDate } from '@/lib/utils/projectFormatting';
import { ContentCard } from '@/components/shared';
import type { PaginationResult } from '@/lib/data/blogs';
import { usePaginatedList } from '@/lib/hooks/usePaginatedList';
import { useMemo } from 'react';

const PAGE_SIZE = 9;

interface ProjectsListProps {
    type?: 'project' | 'blog' | 'all';
    initialData?: Blog[];
    initialPagination?: PaginationResult;
}

export default function ProjectsList({
    type = 'project',
    initialData,
    initialPagination
}: ProjectsListProps) {
    const queryParams = useMemo(() => {
        const params: Record<string, string | number | boolean> = {};
        if (type !== 'all') {
            params.type = type;
        }
        return params;
    }, [type]);

    const {
        items: projects,
        loading,
        loadingMore,
        pagination,
        sentinelRef
    } = usePaginatedList<Blog>({
        endpoint: '/api/blogs',
        pageSize: PAGE_SIZE,
        initialData,
        initialPagination,
        queryParams
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
