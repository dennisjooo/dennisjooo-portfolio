import { db, blogs } from "@/lib/db";
import { eq } from "drizzle-orm";
import { createUrlSlug } from "@/lib/utils/urlHelpers";
import { errorResponse } from "@/lib/api/apiHelpers";

const BLOB_IMG_REGEX = /!\[.*?\]\((https:\/\/[^)]+vercel-storage\.com[^)]+)\)/g;

/**
 * Extracts all Vercel Blob URLs from a blog entry's imageUrl and markdown body.
 */
export function collectBlobUrls(imageUrl: string | null, blogPost: string | null): string[] {
  const urls: string[] = [];
  if (imageUrl?.includes("vercel-storage.com")) {
    urls.push(imageUrl);
  }
  let match;
  while ((match = BLOB_IMG_REGEX.exec(blogPost || "")) !== null) {
    urls.push(match[1]);
  }
  BLOB_IMG_REGEX.lastIndex = 0;
  return urls;
}

/**
 * Returns blob URLs from the preview that are NOT referenced by the original article.
 * Prevents preview cleanup from deleting images the original article still uses.
 */
export async function getPreviewExclusiveBlobUrls(
  previewImageUrl: string | null,
  previewBlogPost: string | null,
  previewSlug: string
): Promise<string[]> {
  const previewUrls = collectBlobUrls(previewImageUrl, previewBlogPost);
  if (previewUrls.length === 0) return [];

  const originalSlug = previewSlug.replace(/-preview$/, "");
  const [original] = await db
    .select({ imageUrl: blogs.imageUrl, blogPost: blogs.blogPost })
    .from(blogs)
    .where(eq(blogs.slug, originalSlug));

  if (!original) return previewUrls;

  const originalUrls = new Set(collectBlobUrls(original.imageUrl, original.blogPost));
  return previewUrls.filter((url) => !originalUrls.has(url));
}

interface BlogBody {
  status?: string;
  publishAt?: string | Date;
  slug?: string;
  title?: string;
  [key: string]: unknown;
}

interface PrepareOptions {
  defaultStatus?: string;
}

/**
 * Validates scheduled-post rules and normalises publishAt / slug.
 * Returns an error response if validation fails, or null on success (mutates body in-place).
 */
export function validateAndPrepareBlogBody(body: BlogBody, options?: PrepareOptions) {
  if (!body.status && options?.defaultStatus) {
    body.status = options.defaultStatus;
  }

  if (body.status === "scheduled") {
    if (!body.publishAt) {
      return errorResponse("publishAt is required for scheduled posts");
    }
    if (new Date(body.publishAt as string) <= new Date()) {
      return errorResponse("publishAt must be a future date");
    }
  }

  if (body.publishAt) {
    body.publishAt = new Date(body.publishAt as string);
  }

  if (!body.slug && body.title) {
    body.slug = createUrlSlug(body.title);
  }

  return null;
}
