import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackToTop } from '@/components/shared';
import ProjectPageClient from './ProjectPageClient';
import { db, blogs } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { createUrlSlug } from '@/lib/utils/urlHelpers';
import { unstable_cache } from 'next/cache';
import { CACHE_CONFIG } from '@/lib/constants/cache';

type ProjectPageProps = {
    params: Promise<{ slug: string }>;
};

const getProject = unstable_cache(
    async (slug: string) => {
        // Try to find by slug field first
        const [project] = await db
            .select()
            .from(blogs)
            .where(eq(blogs.slug, slug));

        if (project) {
            return project;
        }

        // Fallback: fetch all titles/slugs only (not full content) to find match
        const allSlugs = await db
            .select({ id: blogs.id, title: blogs.title, slug: blogs.slug })
            .from(blogs);
        
        const match = allSlugs.find(p => createUrlSlug(p.title) === slug || p.slug === slug);
        
        if (match) {
            // Fetch the full blog by id
            const [fullProject] = await db
                .select()
                .from(blogs)
                .where(eq(blogs.id, match.id));
            return fullProject ?? null;
        }
        
        return null;
    },
    ['blog-by-slug'],
    { revalidate: CACHE_CONFIG.REVALIDATE, tags: ['blogs'] }
);

export async function generateMetadata(
    { params }: ProjectPageProps,
): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        return {
            title: "Project Not Found | Dennis' Portfolio",
        };
    }

    return {
        title: `${project.title} | Dennis' Portfolio`,
        description: project.description,
        openGraph: {
            title: `${project.title}`,
            description: project.description,
            type: 'article',
            url: `https://dennisjooo.github.io/projects/${slug}`,
        },
    };
}

export default async function Page({ params }: ProjectPageProps) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

    return (
        <>
            <ProjectPageClient project={project} />
            <BackToTop />
        </>
    );
}
