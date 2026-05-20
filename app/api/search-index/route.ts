import { NextResponse } from "next/server";
import { asc, desc } from "drizzle-orm";
import { db, blogs, workExperiences } from "@/lib/db";
import { withCacheHeaders } from "@/lib/constants/cache";
import { visibleBlogsFilter } from "@/lib/data/blogs";
import { createUrlSlug } from "@/lib/utils/urlHelpers";

const SEARCH_BODY_LIMIT = 1200;

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
        .orderBy(desc(blogs.date))
        .limit(50),
      db
        .select({
          id: workExperiences.id,
          title: workExperiences.title,
          company: workExperiences.company,
          date: workExperiences.date,
          responsibilities: workExperiences.responsibilities,
        })
        .from(workExperiences)
        .orderBy(asc(workExperiences.order), desc(workExperiences.createdAt))
        .limit(40),
    ]);

    const projects = projectRows.map((project) => {
      const slug = project.slug || createUrlSlug(project.title);
      return {
        ...project,
        blogPost: project.blogPost.slice(0, SEARCH_BODY_LIMIT),
        slug,
      };
    });

    const workExperience = workRows.map((work) => ({
      ...work,
      responsibilities: work.responsibilities ?? [],
    }));

    return withCacheHeaders(
      NextResponse.json({
        success: true,
        data: {
          projects,
          workExperience,
        },
      })
    );
  } catch (error) {
    console.error("Error generating search index:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate search index" },
      { status: 500 }
    );
  }
}
