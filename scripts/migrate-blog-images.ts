/**
 * Migration script to reorganize blog images in Vercel Blob storage
 * into the canonical blog/{slug}/{filename} structure.
 *
 * Handles images at the blob root (uploaded before a title was set)
 * and images under old slug paths.
 *
 * Usage:
 *   npx tsx scripts/migrate-blog-images.ts
 *   npx tsx scripts/migrate-blog-images.ts --dry-run
 *
 * Required environment variables (in .env.local):
 *   - DATABASE_URL: Your Neon PostgreSQL connection string
 *   - BLOB_READ_WRITE_TOKEN: Your Vercel Blob store token
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";
import { blogs } from "../lib/db/schema";
import {
  extractBlobUrls,
  extractBlobFilename,
  isUnderSlug,
  migrateAllBlogImages,
} from "../lib/utils/blobMigration";
import { createUrlSlug } from "../lib/utils/urlHelpers";

dotenv.config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error("BLOB_READ_WRITE_TOKEN is required");
}

const dryRun = process.argv.includes("--dry-run");

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

async function main() {
  if (dryRun) {
    console.log("=== DRY RUN (no changes will be made) ===\n");
  }

  console.log("Fetching all blogs...");
  const allBlogs = await db.select().from(blogs);
  console.log(`Found ${allBlogs.length} blogs\n`);

  let totalMigrated = 0;
  let totalSkipped = 0;

  for (const blog of allBlogs) {
    const slug = blog.slug || createUrlSlug(blog.title);

    if (!slug) {
      console.log(`Skipping "${blog.title}" -- no slug or title to derive one`);
      totalSkipped++;
      continue;
    }

    const allUrls = extractBlobUrls(blog.imageUrl, blog.blogPost);
    const urlsToMigrate = allUrls.filter((url) => !isUnderSlug(url, slug));

    if (urlsToMigrate.length === 0) {
      totalSkipped++;
      continue;
    }

    console.log(
      `Blog "${blog.title}" (slug: ${slug}): ${urlsToMigrate.length} image(s) to migrate`
    );

    for (const url of urlsToMigrate) {
      console.log(`  ${dryRun ? "WOULD MOVE" : "..."}: ${extractBlobFilename(url)}`);
    }

    if (dryRun) {
      totalMigrated += urlsToMigrate.length;
      continue;
    }

    try {
      const result = await migrateAllBlogImages(
        slug,
        blog.imageUrl,
        blog.blogPost
      );

      if (result.migrated > 0) {
        await db
          .update(blogs)
          .set({
            imageUrl: result.imageUrl,
            blogPost: result.blogPost,
            updatedAt: new Date(),
          })
          .where(eq(blogs.id, blog.id));

        console.log(`  DB updated (${result.migrated} image(s) moved)\n`);
        totalMigrated += result.migrated;
      }
    } catch (err) {
      console.error(`  FAIL for "${blog.title}":`, err);
    }
  }

  console.log("---");
  console.log(
    `Done${dryRun ? " (dry run)" : ""}. ` +
      `${totalMigrated} image(s) ${dryRun ? "would be" : ""} migrated, ` +
      `${totalSkipped} blog(s) skipped.`
  );
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
