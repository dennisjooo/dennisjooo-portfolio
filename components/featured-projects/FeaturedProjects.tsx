"use client";

import { useMemo } from 'react';
import { sortProjectsByDate } from '@/lib/utils/projectFormatting';
import { Blog } from '@/data/blogs/types';
import { FeaturedProjectsHeader } from './FeaturedProjectsHeader';
import { FeaturedProjectsGrid } from './FeaturedProjectsGrid';
import { ViewAllButton } from './ViewAllButton';

interface FeaturedProjectsProps {
    projects: Blog[];
}

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects }) => {
    const featuredProjects = useMemo(
        () => sortProjectsByDate(projects.filter(p => p.type === 'project')).slice(0, 3),
        [projects]
    );

    return (
        <section id="projects" className="py-24 flex items-center justify-center min-h-screen px-8">
            <div className="container max-w-7xl mx-auto flex-1 flex flex-col">
                <FeaturedProjectsHeader />
                <FeaturedProjectsGrid projects={featuredProjects} />
                <ViewAllButton />
            </div>
        </section>
    );
};

export default FeaturedProjects;
