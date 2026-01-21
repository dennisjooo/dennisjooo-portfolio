import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackToTop } from '@/components/shared';
import ProjectPageClient from './ProjectPageClient';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { createUrlSlug } from '@/lib/utils/urlHelpers';

type ProjectPageProps = {
    params: Promise<{ slug: string }>;
};

async function getProject(slug: string) {
    await dbConnect();
    // We can't rely on 'slug' field in DB completely if we were using dynamic generation before
    // But since I added 'slug' field to model, let's try to match by slug or derived slug
    // For safety, let's fetch all and match locally or fuzzy match, but strictly we should use the slug field
    
    // Try to find by slug field first
    let project = await Blog.findOne({ slug });
    
    if (!project) {
        // Fallback: search by title derived from slug? Hard to reverse.
        // Instead, let's iterate (inefficient but safe for small counts)
        // or just rely on slug field which we populated in seed
        const all = await Blog.find({});
        const found = all.find(p => createUrlSlug(p.title) === slug || p.slug === slug);
        project = found || null;
    }
    
    return project ? JSON.parse(JSON.stringify(project)) : null;
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

// Remove generateStaticParams for dynamic rendering
// or fetch all slugs if we want ISR
// export async function generateStaticParams() {
//     await dbConnect();
//     const projects = await Blog.find({}, { title: 1, slug: 1 });
//     return projects.map((project) => ({
//         slug: project.slug || createUrlSlug(project.title),
//     }));
// }

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
