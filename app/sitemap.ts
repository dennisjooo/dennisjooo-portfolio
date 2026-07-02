import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants/site";
import { getBlogs } from "@/lib/data/blogs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: blogs } = await getBlogs(1, 100, "all");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogs
    .filter((blog) => blog.slug)
    .map((blog) => ({
      url: `${SITE_URL}/blogs/${blog.slug}`,
      lastModified: new Date(blog.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...blogRoutes];
}
