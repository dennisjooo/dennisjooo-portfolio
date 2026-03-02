import { unstable_cache } from 'next/cache';
import { db, blogs, type Blog } from '@/lib/db';
import { eq, desc, count, or, and, lte, type SQL } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
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
 * Reusable filter: only posts that are published or scheduled with publishAt in the past.
 */
export function visibleBlogsFilter(): SQL {
    return or(
        eq(blogs.status, 'published'),
        and(eq(blogs.status, 'scheduled'), lte(blogs.publishAt, sql`now()`))
    )!;
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
                .where(and(eq(blogs.type, 'project'), visibleBlogsFilter()))
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

            const whereClause = effectiveType
                ? and(eq(blogs.type, effectiveType), visibleBlogsFilter())
                : visibleBlogsFilter();

            const baseQuery = db.select().from(blogs).where(whereClause);
            const countQuery = db.select({ count: count() }).from(blogs).where(whereClause);

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
