import { asc, desc } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import {
  blogs,
  certifications,
  contacts,
  siteConfig,
  workExperiences,
  type Blog,
} from "@/lib/db/schema";
import { visibleBlogsFilter } from "@/lib/db/blogFilters";
import type { SiteManifestData } from "./types";

type Db = NeonHttpDatabase<Record<string, never>>;

function partitionVisibleBlogs(
  allBlogs: Blog[],
): Pick<SiteManifestData, "projects" | "blogPosts"> {
  const projects = allBlogs.filter((blog) => blog.type === "project");
  const blogPosts = allBlogs.filter((blog) => blog.type === "blog");
  return { projects, blogPosts };
}

export async function fetchSiteData(db: Db): Promise<SiteManifestData> {
  const [configRows, workRows, visibleBlogs, certificationRows, contactRows] =
    await Promise.all([
      db.select().from(siteConfig).limit(1),
      db
        .select()
        .from(workExperiences)
        .orderBy(asc(workExperiences.order), desc(workExperiences.createdAt)),
      db
        .select()
        .from(blogs)
        .where(visibleBlogsFilter())
        .orderBy(desc(blogs.date)),
      db.select().from(certifications).orderBy(desc(certifications.date)),
      db
        .select()
        .from(contacts)
        .orderBy(asc(contacts.order), desc(contacts.createdAt)),
    ]);

  const { projects, blogPosts } = partitionVisibleBlogs(visibleBlogs);

  return {
    siteConfig: configRows[0] ?? null,
    workExperiences: workRows.map((entry) => ({
      ...entry,
      responsibilities: entry.responsibilities ?? [],
    })),
    projects,
    blogPosts,
    certifications: certificationRows,
    contacts: contactRows,
  };
}
