import { unstable_cache } from 'next/cache';
import { db, blogs, type Blog } from '@/lib/db';
import { eq, desc, count } from 'drizzle-orm';
import { CACHE_CONFIG } from '@/lib/constants/cache';

export interface PaginationResult {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
}

export interface BlogsResult {
    data: Blog[];
    pagination: PaginationResult;
}

/**
 * Get featured projects for home page (3 most recent projects)
 */
export const getFeaturedProjects = unstable_cache(
    async (): Promise<Blog[]> => {
        try {
            const projects = await db
                .select()
                .from(blogs)
                .where(eq(blogs.type, 'project'))
                .orderBy(desc(blogs.date))
                .limit(3);
            return projects;
        } catch (error) {
            console.error('Failed to fetch featured projects', error);
            return [];
        }
    },
    ['featured-projects'],
    { revalidate: CACHE_CONFIG.REVALIDATE, tags: ['projects', 'blogs'] }
);

/**
 * Get paginated blogs/projects for /blogs page
 * Mirrors the /api/blogs endpoint logic but runs server-side
 */
export const getBlogs = unstable_cache(
    async (
        page: number = 1,
        limit: number = 9,
        type?: 'blog' | 'project' | 'all'
    ): Promise<BlogsResult> => {
        try {
            const offset = (page - 1) * limit;
            const effectiveType = type === 'all' ? null : type;

            // Build queries with optional type filter
            const baseQuery = effectiveType
                ? db.select().from(blogs).where(eq(blogs.type, effectiveType))
                : db.select().from(blogs);

            const countQuery = effectiveType
                ? db.select({ count: count() }).from(blogs).where(eq(blogs.type, effectiveType))
                : db.select({ count: count() }).from(blogs);

            // Execute queries in parallel
            const [blogResults, totalResult] = await Promise.all([
                baseQuery.orderBy(desc(blogs.date)).offset(offset).limit(limit),
                countQuery,
            ]);

            const total = totalResult[0]?.count ?? 0;
            const totalPages = Math.ceil(total / limit);

            return {
                data: blogResults,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages,
                    hasMore: page < totalPages,
                },
            };
        } catch (error) {
            console.error('Failed to fetch blogs', error);
            return {
                data: [],
                pagination: {
                    total: 0,
                    page: 1,
                    limit,
                    totalPages: 0,
                    hasMore: false,
                },
            };
        }
    },
    ['blogs-list'],
    { revalidate: CACHE_CONFIG.REVALIDATE, tags: ['blogs', 'projects'] }
);
