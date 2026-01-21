"use client";

import { Blog } from '@/lib/db';
import { FeaturedProjectsHeader } from './FeaturedProjectsHeader';
import { FeaturedProjectsGrid } from './FeaturedProjectsGrid';
import { ViewAllButton } from './ViewAllButton';

interface FeaturedProjectsProps {
    projects: Blog[];
}

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects }) => {
    // Projects are already sorted and limited from the server
    return (
        <section id="projects" className="py-24 md:py-32 w-full bg-background text-foreground overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                <FeaturedProjectsHeader />
                <FeaturedProjectsGrid projects={projects} />
                <ViewAllButton />
            </div>
        </section>
    );
};

export default FeaturedProjects;
