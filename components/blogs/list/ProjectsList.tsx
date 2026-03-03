import { Blog } from '@/lib/db';
import { createUrlSlug } from '@/lib/utils/urlHelpers';
import { formatProjectDate } from '@/lib/utils/projectFormatting';
import { ContentCard, PaginatedList } from '@/components/shared';
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

    const paginatedList = usePaginatedList<Blog>({
        endpoint: '/api/blogs',
        pageSize: PAGE_SIZE,
        initialData,
        initialPagination,
        queryParams
    });

    const emptyMessage = type === 'all' ? 'No content found' : type === 'blog' ? 'No articles found' : 'No projects found';

    return (
        <PaginatedList
            {...paginatedList}
            emptyMessage={emptyMessage}
            skeletonCount={PAGE_SIZE}
            keyExtractor={(p) => `${p.title}_${p.date}`}
            renderItem={({ title, description, date, imageUrl, blogPost, type: itemType, slug }, index) => (
                <ContentCard
                    title={title}
                    description={description}
                    slug={slug || createUrlSlug(title)}
                    date={formatProjectDate(date, true)}
                    imageUrl={imageUrl ?? undefined}
                    index={index}
                    type={itemType}
                    readTime={`${Math.ceil(blogPost.split(/\s+/).length / 200)} min`}
                    variant="standard"
                />
            )}
        />
    );
}
