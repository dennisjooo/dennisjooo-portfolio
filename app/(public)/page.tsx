import Hero from '@/components/landing/hero';
import dynamic from 'next/dynamic';
import { HomeClient } from './HomeClient';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import SiteConfig from '@/models/SiteConfig';
import WorkExperienceModel from '@/models/WorkExperience';

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

async function getProjects() {
    try {
        await dbConnect();
        // Plain object serialization for client components
        const blogs = await Blog.find({ type: 'project' }).sort({ date: -1 }).lean();
        return JSON.parse(JSON.stringify(blogs));
    } catch (error) {
        console.error('Failed to fetch projects', error);
        return [];
    }
}

async function getSiteConfig() {
    try {
        await dbConnect();
        const config = await SiteConfig.findOne().lean();
        return config ? JSON.parse(JSON.stringify(config)) : {};
    } catch (error) {
        console.error('Failed to fetch site config', error);
        return {};
    }
}

async function getWorkExperience() {
    try {
        await dbConnect();
        const experiences = await WorkExperienceModel.find({}).sort({ order: 1, createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(experiences));
    } catch (error) {
        console.error('Failed to fetch work experience', error);
        return [];
    }
}

export default async function Home() {
    const [projects, siteConfig, workExperience] = await Promise.all([
        getProjects(),
        getSiteConfig(),
        getWorkExperience()
    ]);

    const profileImageUrl = siteConfig?.profileImageUrl;
    const aboutContent = siteConfig ? {
        intro: siteConfig.aboutIntro,
        experience: siteConfig.aboutExperience,
        personal: siteConfig.aboutPersonal,
        outro: siteConfig.aboutOutro,
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
