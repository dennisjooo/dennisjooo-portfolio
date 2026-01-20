import Hero from '@/components/landing/hero';
import { projects } from '@/data/blogs';
import dynamic from 'next/dynamic';
import { HomeClient } from './HomeClient';

// Skeleton for loading states
const SectionSkeleton = ({ height = "min-h-screen" }: { height?: string }) => (
    <div className={`${height} bg-background`} />
);

// Dynamic imports - prioritized by visibility order
// About comes right after Hero, so we load it with higher priority
const About = dynamic(() => import('@/components/landing/about'), {
    loading: () => <SectionSkeleton />
});

// Below-the-fold content - lower priority
const WorkExperience = dynamic(() => import('@/components/landing/work-experience'), {
    loading: () => <SectionSkeleton />
});
const FeaturedProjects = dynamic(() => import('@/components/landing/featured-projects'), {
    loading: () => <SectionSkeleton />
});
const Skills = dynamic(() => import('@/components/landing/skills'), {
    loading: () => <SectionSkeleton height="min-h-[50vh]" />
});
const Contacts = dynamic(() => import('@/components/landing/contacts'), {
    loading: () => <SectionSkeleton height="min-h-[50vh]" />
});

// Non-critical UI - lazy loaded
const BackToTop = dynamic(() => import('@/components/shared/BackToTop'));

export default function Home() {
    return (
        <HomeClient
            heroContent={<Hero />}
            mainContent={
                <>
                    <About />
                    <WorkExperience />
                    <FeaturedProjects projects={projects} />
                    <Skills />
                    <Contacts />
                </>
            }
            backToTop={<BackToTop />}
        />
    );
}
