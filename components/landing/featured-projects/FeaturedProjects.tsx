"use client";

import { useMemo } from 'react';
import { sortProjectsByDate } from '@/lib/utils/projectFormatting';
import { IBlog } from '@/models/Blog';
import { FeaturedProjectsHeader } from './FeaturedProjectsHeader';
import { FeaturedProjectsGrid } from './FeaturedProjectsGrid';
import { ViewAllButton } from './ViewAllButton';

interface FeaturedProjectsProps {
    projects: IBlog[];
}

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects }) => {
    const featuredProjects = useMemo(
        () => sortProjectsByDate(projects.filter(p => p.type === 'project')).slice(0, 3),
        [projects]
    );

    return (
        <section id="projects" className="py-24 md:py-32 w-full bg-background text-foreground overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                <FeaturedProjectsHeader />
                <FeaturedProjectsGrid projects={featuredProjects} />
                <ViewAllButton />
            </div>
        </section>
    );
};

export default FeaturedProjects;
