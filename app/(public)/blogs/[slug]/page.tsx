import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackToTop } from '@/components/shared';
import ProjectPageClient from './ProjectPageClient';
import { db, blogs } from '@/lib/db';
import { eq, or } from 'drizzle-orm';
import { createUrlSlug } from '@/lib/utils/urlHelpers';

type ProjectPageProps = {
    params: Promise<{ slug: string }>;
};

async function getProject(slug: string) {
    // Try to find by slug field first
    const [project] = await db
        .select()
        .from(blogs)
        .where(eq(blogs.slug, slug));

    if (project) {
        return project;
    }

    // Fallback: search all and match by derived slug from title
    const all = await db.select().from(blogs);
    const found = all.find(p => createUrlSlug(p.title) === slug || p.slug === slug);
    return found ?? null;
}

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
