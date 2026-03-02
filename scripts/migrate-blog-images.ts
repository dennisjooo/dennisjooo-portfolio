/**
 * Migration script to reorganize blog images in Vercel Blob storage
 * from blog/{id}/{filename} to blog/{slug}/{filename} structure.
 *
 * Usage:
 *   npx tsx scripts/migrate-blog-images.ts
 *
 * Required environment variables (in .env.local):
 *   - DATABASE_URL: Your Neon PostgreSQL connection string
 *   - BLOB_READ_WRITE_TOKEN: Your Vercel Blob store token
 */

import { copy, del } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";
import { blogs } from "../lib/db/schema";

dotenv.config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL;
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}
if (!BLOB_TOKEN) {
  throw new Error("BLOB_READ_WRITE_TOKEN is required");
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

const BLOB_URL_PATTERN = /https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[^\s)]+/g;

/** Simple slug generator matching createUrlSlug behavior */
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function extractBlobFilename(blobUrl: string): string {
  const url = new URL(blobUrl);
  const segments = url.pathname.split("/");
  return segments[segments.length - 1];
}

function isAlreadyMigrated(blobUrl: string, slug: string): boolean {
  const url = new URL(blobUrl);
  const prefix = `/blog/${slug}/`;
  if (!url.pathname.startsWith(prefix)) return false;
  // Ensure the file is directly under blog/{slug}/ (no subfolders)
  const rest = url.pathname.slice(prefix.length);
  return !rest.includes("/");
}

async function migrateBlobUrl(
  oldUrl: string,
  slug: string
): Promise<string> {
  const filename = extractBlobFilename(oldUrl);
  const newPath = `blog/${slug}/${filename}`;

  const newBlob = await copy(oldUrl, newPath, {
    access: "public",
    token: BLOB_TOKEN,
  });

  await del(oldUrl, { token: BLOB_TOKEN });

  return newBlob.url;
}

async function main() {
  console.log("Fetching all blogs...");
  const allBlogs = await db.select().from(blogs);
  console.log(`Found ${allBlogs.length} blogs\n`);

  let totalMigrated = 0;
  let totalSkipped = 0;

  for (const blog of allBlogs) {
    const slug = blog.slug || createSlug(blog.title);
    const urlMap = new Map<string, string>();
    const blobUrls = new Set<string>();

    if (blog.imageUrl?.includes("vercel-storage.com")) {
      blobUrls.add(blog.imageUrl);
    }

    const inlineMatches = (blog.blogPost || "").matchAll(BLOB_URL_PATTERN);
    for (const match of inlineMatches) {
      blobUrls.add(match[0]);
    }

    const urlsToMigrate = [...blobUrls].filter(
      (url) => !isAlreadyMigrated(url, slug)
    );

    if (urlsToMigrate.length === 0) {
      totalSkipped++;
      continue;
    }

    console.log(
      `Blog "${blog.title}" (slug: ${slug}): ${urlsToMigrate.length} image(s) to migrate`
    );

    for (const oldUrl of urlsToMigrate) {
      try {
        const newUrl = await migrateBlobUrl(oldUrl, slug);
        urlMap.set(oldUrl, newUrl);
        console.log(`  OK: ${extractBlobFilename(oldUrl)}`);
        totalMigrated++;
      } catch (err) {
        console.error(`  FAIL: ${oldUrl}`, err);
      }
    }

    if (urlMap.size === 0) continue;

    let updatedImageUrl = blog.imageUrl;
    let updatedBlogPost = blog.blogPost || "";

    for (const [oldUrl, newUrl] of urlMap) {
      if (updatedImageUrl === oldUrl) {
        updatedImageUrl = newUrl;
      }
      updatedBlogPost = updatedBlogPost.split(oldUrl).join(newUrl);
    }

    await db
      .update(blogs)
      .set({
        imageUrl: updatedImageUrl,
        blogPost: updatedBlogPost,
        updatedAt: new Date(),
      })
      .where(eq(blogs.id, blog.id));

    console.log(`  DB updated\n`);
  }

  console.log("---");
  console.log(
    `Done. Migrated ${totalMigrated} image(s), skipped ${totalSkipped} blog(s) with no images to move.`
  );
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
