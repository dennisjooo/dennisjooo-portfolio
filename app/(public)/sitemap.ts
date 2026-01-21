import { MetadataRoute } from 'next';
import { db, blogs } from '@/lib/db';
import { createUrlSlug } from '@/lib/utils/urlHelpers';

export const dynamic = 'force-dynamic'; // Changed to force-dynamic since we fetch from DB

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://dennisjooo.github.io';

    let projectPages: MetadataRoute.Sitemap = [];

    try {
        const projects = await db
            .select({
                title: blogs.title,
                date: blogs.date,
                slug: blogs.slug,
            })
            .from(blogs);

        projectPages = projects.map((project) => ({
            url: `${baseUrl}/blogs/${project.slug || createUrlSlug(project.title)}`,
            lastModified: new Date(project.date),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));
    } catch (error) {
        console.error('Failed to generate sitemap', error);
    }

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/blogs`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/llms.txt`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ];

    return [...staticPages, ...projectPages];
}
