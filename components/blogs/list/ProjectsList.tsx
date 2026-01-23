import { Blog } from '@/lib/db';
import { createUrlSlug } from '@/lib/utils/urlHelpers';
import { formatProjectDate } from '@/lib/utils/projectFormatting';
import { ContentCard, ListSkeleton, EmptyState, ListFooter } from '@/components/shared';
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
        return <ListSkeleton count={PAGE_SIZE} />;
    }

    const emptyMessage = type === 'all' ? 'No content found' : type === 'blog' ? 'No articles found' : 'No projects found';
    if (projects.length === 0) {
        return <EmptyState message={emptyMessage} />;
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
                <div className="mt-8 md:mt-10">
                    <ListSkeleton count={3} />
                </div>
            )}

            {/* Sentinel element for infinite scroll */}
            <div ref={sentinelRef} className="h-4 w-full" aria-hidden="true" />

            {/* End of list indicator */}
            {!pagination.hasMore && projects.length > 0 && (
                <ListFooter total={pagination.total} itemName="item" />
            )}
        </div>
    );
}
