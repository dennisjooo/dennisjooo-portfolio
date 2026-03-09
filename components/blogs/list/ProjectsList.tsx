import { Blog } from '@/lib/db';
import { createUrlSlug } from '@/lib/utils/urlHelpers';
import { formatProjectDate, calculateReadTime } from '@/lib/utils/projectFormatting';
import { ContentCard, PaginatedList } from '@/components/shared';
import { FeaturedCard } from './FeaturedCard';
import type { PaginationResult } from '@/lib/data/blogs';
import { usePaginatedList } from '@/lib/hooks/usePaginatedList';
import { useMemo } from 'react';

const PAGE_SIZE = 7;

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

    const featuredItem = paginatedList.items[0];
    const remainingItems = paginatedList.items.slice(1);

    return (
        <div className="w-full">
            {/* Featured first post */}
            {featuredItem && !paginatedList.loading && (
                <FeaturedCard
                    title={featuredItem.title}
                    description={featuredItem.description}
                    slug={featuredItem.slug || createUrlSlug(featuredItem.title)}
                    date={formatProjectDate(featuredItem.date, true)}
                    imageUrl={featuredItem.imageUrl ?? undefined}
                    type={featuredItem.type}
                    readTime={`${calculateReadTime(featuredItem.blogPost)} min`}
                />
            )}

            {/* Remaining posts in grid */}
            <PaginatedList
                {...paginatedList}
                items={paginatedList.loading ? paginatedList.items : remainingItems}
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
                        readTime={`${calculateReadTime(blogPost)} min`}
                        variant="standard"
                    />
                )}
            />
        </div>
    );
}
