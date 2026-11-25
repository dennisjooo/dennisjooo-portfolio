import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { fetchSiteData } from "@/lib/site-manifest/fetchSiteData";
import { buildSitemapEntries } from "@/lib/site-manifest/generate";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await fetchSiteData(db);
  return buildSitemapEntries(data);
}
