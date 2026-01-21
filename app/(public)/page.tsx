import Hero from '@/components/landing/hero';
import dynamic from 'next/dynamic';
import { HomeClient } from './HomeClient';
import { db, blogs, siteConfig, workExperiences, type SiteConfig } from '@/lib/db';
import { eq, desc, asc } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { CACHE_CONFIG } from '@/lib/constants/cache';

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

// Cached data fetching functions
const getFeaturedProjects = unstable_cache(
    async () => {
        try {
            // Only fetch the 3 most recent projects for featured section
            const projects = await db
                .select()
                .from(blogs)
                .where(eq(blogs.type, 'project'))
                .orderBy(desc(blogs.date))
                .limit(3);
            return projects;
        } catch (error) {
            console.error('Failed to fetch projects', error);
            return [];
        }
    },
    ['featured-projects'],
    { revalidate: CACHE_CONFIG.REVALIDATE, tags: ['projects'] }
);

const getSiteConfig = unstable_cache(
    async (): Promise<SiteConfig | null> => {
        try {
            const [config] = await db.select().from(siteConfig).limit(1);
            return config ?? null;
        } catch (error) {
            console.error('Failed to fetch site config', error);
            return null;
        }
    },
    ['site-config'],
    { revalidate: CACHE_CONFIG.REVALIDATE, tags: ['site-config'] }
);

const getWorkExperience = unstable_cache(
    async () => {
        try {
            const experiences = await db
                .select()
                .from(workExperiences)
                .orderBy(asc(workExperiences.order), desc(workExperiences.createdAt));
            // Ensure responsibilities is always an array and order is number | undefined
            return experiences.map(exp => ({
                ...exp,
                responsibilities: exp.responsibilities ?? [],
                order: exp.order ?? undefined
            }));
        } catch (error) {
            console.error('Failed to fetch work experience', error);
            return [];
        }
    },
    ['work-experience'],
    { revalidate: CACHE_CONFIG.REVALIDATE, tags: ['work-experience'] }
);

export default async function Home() {
    const [projects, config, workExperience] = await Promise.all([
        getFeaturedProjects(),
        getSiteConfig(),
        getWorkExperience()
    ]);

    const profileImageUrl = config?.profileImageUrl ?? undefined;
    const aboutContent = config ? {
        intro: config.aboutIntro ?? '',
        experience: config.aboutExperience ?? '',
        personal: config.aboutPersonal ?? '',
        outro: config.aboutOutro ?? '',
    } : undefined;

    return (
        <HomeClient
            heroContent={<Hero />}
            mainContent={
                <>
                    <About profileImageUrl={profileImageUrl} aboutContent={aboutContent} />
                    <WorkExperience workExperience={workExperience} />
                    <FeaturedProjects projects={projects} />
                    <Skills />
                    <Contacts />
                </>
            }
            backToTop={<BackToTop />}
        />
    );
}
