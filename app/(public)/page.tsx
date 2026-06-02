import Hero from '@/components/landing/hero';
import About from '@/components/landing/about';
import WorkExperience from '@/components/landing/work-experience';
import FeaturedProjects from '@/components/landing/featured-projects';
import dynamic from 'next/dynamic';
import { HomeEffects } from './HomeEffects';
import { db, siteConfig, workExperiences, contacts, type SiteConfig } from '@/lib/db';
import { desc, asc } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { CACHE_CONFIG } from '@/lib/constants/cache';
import { getFeaturedProjects } from '@/lib/data/blogs';

export const revalidate = 60;

const SectionSkeleton = ({ height = "min-h-screen" }: { height?: string }) => (
    <div className={`${height} bg-background`} />
);

const Skills = dynamic(() => import('@/components/landing/skills'), {
    loading: () => <SectionSkeleton height="min-h-[50vh]" />
});
const Contacts = dynamic(() => import('@/components/landing/contacts'), {
    loading: () => <SectionSkeleton height="min-h-[50vh]" />
});

const BackToTop = dynamic(() => import('@/components/shared/BackToTop'));

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

const getContacts = unstable_cache(
    async () => {
        try {
            const contactItems = await db
                .select()
                .from(contacts)
                .orderBy(asc(contacts.order), desc(contacts.createdAt));

            return contactItems.map((contact) => ({
                href: contact.href,
                ariaLabel: contact.label,
                icon: contact.icon,
            }));
        } catch (error) {
            console.error('Failed to fetch contacts', error);
            return [];
        }
    },
    ['contacts'],
    { revalidate: CACHE_CONFIG.REVALIDATE, tags: ['contacts'] }
);

export default async function Home() {
    const [projects, config, workExperience, contactLinks] = await Promise.all([
        getFeaturedProjects(),
        getSiteConfig(),
        getWorkExperience(),
        getContacts()
    ]);

    const profileImageUrl = config?.profileImageUrl ?? undefined;
    const aboutContent = config ? {
        intro: config.aboutIntro ?? '',
        experience: config.aboutExperience ?? '',
        personal: config.aboutPersonal ?? '',
        outro: config.aboutOutro ?? '',
    } : undefined;

    return (
        <>
            <div id="home-hero" className="sticky top-0 h-screen w-full z-0">
                <Hero />
            </div>

            <div
                id="home-content"
                className="relative z-10 bg-white dark:bg-black shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
            >
                <About profileImageUrl={profileImageUrl} aboutContent={aboutContent} />
                <WorkExperience workExperience={workExperience} />
                <FeaturedProjects projects={projects} />
                <Skills />
                <Contacts contacts={contactLinks} />
            </div>

            <BackToTop />
            <HomeEffects />
        </>
    );
}
