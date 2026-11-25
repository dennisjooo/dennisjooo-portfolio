import { db, blogs } from "@/lib/db";
import { eq } from "drizzle-orm";
import { createUrlSlug } from "@/lib/utils/urlHelpers";
import { errorResponse } from "@/lib/api/apiHelpers";
import { extractBlobUrls } from "@/lib/utils/blobUrls";
import { stripPreviewSlug } from "@/lib/db/blogPreview";

export async function getPreviewExclusiveBlobUrls(
  previewImageUrl: string | null,
  previewBlogPost: string | null,
  previewSlug: string,
): Promise<string[]> {
  const previewUrls = extractBlobUrls(previewImageUrl, previewBlogPost);
  if (previewUrls.length === 0) return [];

  const originalSlug = stripPreviewSlug(previewSlug);
  const [original] = await db
    .select({ imageUrl: blogs.imageUrl, blogPost: blogs.blogPost })
    .from(blogs)
    .where(eq(blogs.slug, originalSlug));

  if (!original) return previewUrls;

  const originalUrls = new Set(
    extractBlobUrls(original.imageUrl, original.blogPost),
  );
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

export function validateAndPrepareBlogBody(
  body: BlogBody,
  options?: PrepareOptions,
) {
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
