'use client';

import { createUrlSlug } from '@/lib/utils/urlHelpers';
import { formatProjectDate } from '@/lib/utils/projectFormatting';
import { Blog } from '@/lib/db';
import { ContentCard } from '@/components/shared';

interface FeaturedProjectsGridProps {
    projects: Blog[];
}

export const FeaturedProjectsGrid: React.FC<FeaturedProjectsGridProps> = ({ projects }) => (
    <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {projects.map(({ title, description, date, imageUrl }, index) => (
            <div 
                key={`${title}_${date}`}
                className="w-full"
            >
                <ContentCard
                    title={title}
                    description={description}
                    slug={createUrlSlug(title)}
                    date={formatProjectDate(date, true)}
                    imageUrl={imageUrl ?? undefined}
                    index={index}
                    variant="featured"
                />
            </div>
        ))}
    </div>
);
