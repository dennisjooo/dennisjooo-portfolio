import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db, blogs, workExperiences } from "@/lib/db";
import { withCacheHeaders } from "@/lib/constants/cache";
import { visibleBlogsFilter } from "@/lib/db/blogFilters";
import {
  normalizeResponsibilities,
  workExperienceOrderBy,
} from "@/lib/db/siteQueries";
import { resolveBlogSlug } from "@/lib/utils/urlHelpers";
import {
  SEARCH_BODY_LIMIT,
  SEARCH_INDEX_BLOG_LIMIT,
  SEARCH_INDEX_WORK_LIMIT,
} from "@/lib/command-palette/searchLimits";

export async function GET() {
  try {
    const [projectRows, workRows] = await Promise.all([
      db
        .select({
          title: blogs.title,
          description: blogs.description,
          blogPost: blogs.blogPost,
          slug: blogs.slug,
          type: blogs.type,
          date: blogs.date,
        })
        .from(blogs)
        .where(visibleBlogsFilter())
        .orderBy(desc(blogs.date), desc(blogs.id))
        .limit(SEARCH_INDEX_BLOG_LIMIT),
      db
        .select({
          id: workExperiences.id,
          title: workExperiences.title,
          company: workExperiences.company,
          date: workExperiences.date,
          responsibilities: workExperiences.responsibilities,
        })
        .from(workExperiences)
        .orderBy(...workExperienceOrderBy())
        .limit(SEARCH_INDEX_WORK_LIMIT),
    ]);

    const projects = projectRows.map((project) => ({
      ...project,
      blogPost: project.blogPost.slice(0, SEARCH_BODY_LIMIT),
      slug: resolveBlogSlug(project.title, project.slug),
    }));

    const workExperience = workRows.map((work) => ({
      ...work,
      responsibilities: normalizeResponsibilities(work.responsibilities),
    }));

    return withCacheHeaders(
      NextResponse.json({
        success: true,
        data: {
          projects,
          workExperience,
        },
      }),
    );
  } catch (error) {
    console.error("Error generating search index:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate search index" },
      { status: 500 },
    );
  }
}
