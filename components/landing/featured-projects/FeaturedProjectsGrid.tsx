'use client';

import { createUrlSlug } from '@/lib/utils/urlHelpers';
import { formatProjectDate } from '@/lib/utils/projectFormatting';
import { Blog } from '@/lib/db';
import { ContentCard } from '@/components/shared';
import { m, useReducedMotion, springConfigs, viewportSettings } from '@/components/motion';

interface FeaturedProjectsGridProps {
    projects: Blog[];
}

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: springConfigs.smooth,
    },
};

export const FeaturedProjectsGrid: React.FC<FeaturedProjectsGridProps> = ({ projects }) => {
    const prefersReducedMotion = useReducedMotion();

    return (
        <m.div
            variants={prefersReducedMotion ? undefined : containerVariants}
            initial={prefersReducedMotion ? undefined : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={viewportSettings.onceDeep}
            className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6"
        >
            {projects.map(({ title, description, date, imageUrl, slug }, index) => (
                <m.div
                    key={`${title}_${date}`}
                    variants={prefersReducedMotion ? undefined : itemVariants}
                    className="w-full"
                >
                    <ContentCard
                        title={title}
                        description={description}
                        slug={slug || createUrlSlug(title)}
                        date={formatProjectDate(date, true)}
                        imageUrl={imageUrl ?? undefined}
                        index={index}
                        variant="featured"
                    />
                </m.div>
            ))}
        </m.div>
    );
};
