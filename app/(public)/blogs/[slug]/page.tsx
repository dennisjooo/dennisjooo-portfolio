import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackToTop } from '@/components/shared';
import ProjectPageClient from './ProjectPageClient';
import ProjectContent from '@/components/blogs/article/ProjectContent';
import { db, blogs } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { createUrlSlug } from '@/lib/utils/urlHelpers';
import { unstable_cache } from 'next/cache';
import { CACHE_CONFIG } from '@/lib/constants/cache';
import { extractHeadings } from '@/lib/utils/markdownHelpers';
import { visibleBlogsFilter } from '@/lib/data/blogs';
import { auth } from '@clerk/nextjs/server';
import { PreviewBanner } from './PreviewBanner';

type ProjectPageProps = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ preview?: string }>;
};

const getProject = unstable_cache(
    async (slug: string) => {
        const [project] = await db
            .select()
            .from(blogs)
            .where(and(eq(blogs.slug, slug), visibleBlogsFilter()));

        if (project) {
            return project;
        }

        const allSlugs = await db
            .select({ id: blogs.id, title: blogs.title, slug: blogs.slug, status: blogs.status, publishAt: blogs.publishAt })
            .from(blogs)
            .where(visibleBlogsFilter());
        
        const match = allSlugs.find(p => createUrlSlug(p.title) === slug || p.slug === slug);
        
        if (match) {
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

async function getProjectForPreview(slug: string) {
    const [project] = await db
        .select()
        .from(blogs)
        .where(eq(blogs.slug, slug));

    if (project) return project;

    const allSlugs = await db
        .select({ id: blogs.id, title: blogs.title, slug: blogs.slug })
        .from(blogs);
    
    const match = allSlugs.find(p => createUrlSlug(p.title) === slug || p.slug === slug);
    
    if (match) {
        const [fullProject] = await db
            .select()
            .from(blogs)
            .where(eq(blogs.id, match.id));
        return fullProject ?? null;
    }
    
    return null;
}

export async function generateMetadata(
    { params, searchParams }: ProjectPageProps,
): Promise<Metadata> {
    const { slug } = await params;
    const { preview } = await searchParams;
    const isPreview = preview === 'true';

    const project = isPreview ? await getProjectForPreview(slug) : await getProject(slug);

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

export default async function Page({ params, searchParams }: ProjectPageProps) {
    const { slug } = await params;
    const { preview } = await searchParams;
    const isPreview = preview === 'true';

    let project;

    if (isPreview) {
        const { userId } = await auth();
        if (!userId) notFound();
        project = await getProjectForPreview(slug);
    } else {
        project = await getProject(slug);
    }

    if (!project) {
        notFound();
    }

    const headings = extractHeadings(project.blogPost);

    return (
        <>
            {isPreview && <PreviewBanner status={project.status} />}
            <ProjectPageClient project={project} headings={headings}>
                <ProjectContent content={project.blogPost} />
            </ProjectPageClient>
            <BackToTop />
        </>
    );
}
