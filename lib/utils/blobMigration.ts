import { copy, del } from "@vercel/blob";
import { extractBlobUrls } from "@/lib/utils/blobUrls";

export function extractBlobFilename(blobUrl: string): string {
  const url = new URL(blobUrl);
  const segments = url.pathname.split("/");
  return segments[segments.length - 1];
}

export function isUnderSlug(blobUrl: string, slug: string): boolean {
  const url = new URL(blobUrl);
  const prefix = `/blog/${slug}/`;
  if (!url.pathname.startsWith(prefix)) return false;
  const rest = url.pathname.slice(prefix.length);
  return !rest.includes("/");
}

async function copyBlobToSlug(
  oldUrl: string,
  newSlug: string,
): Promise<string> {
  const filename = extractBlobFilename(oldUrl);
  const newPath = `blog/${newSlug}/${filename}`;

  const newBlob = await copy(oldUrl, newPath, {
    access: "public",
  });

  return newBlob.url;
}

export async function migrateAllBlogImages(
  newSlug: string,
  imageUrl: string | null,
  blogPost: string | null,
): Promise<{
  imageUrl: string | null;
  blogPost: string | null;
  migrated: number;
}> {
  const allUrls = extractBlobUrls(imageUrl, blogPost);
  const urlsToMigrate = allUrls.filter((url) => !isUnderSlug(url, newSlug));

  if (urlsToMigrate.length === 0) {
    return { imageUrl, blogPost, migrated: 0 };
  }

  const urlMap = new Map<string, string>();

  for (const oldUrl of urlsToMigrate) {
    const newUrl = await copyBlobToSlug(oldUrl, newSlug);
    urlMap.set(oldUrl, newUrl);
  }

  let updatedImageUrl = imageUrl;
  let updatedBlogPost = blogPost ?? "";

  for (const [oldUrl, newUrl] of urlMap) {
    if (updatedImageUrl === oldUrl) {
      updatedImageUrl = newUrl;
    }
    updatedBlogPost = updatedBlogPost.split(oldUrl).join(newUrl);
  }

  const oldUrls = [...urlMap.keys()];
  await del(oldUrls);

  return {
    imageUrl: updatedImageUrl,
    blogPost: blogPost === null ? null : updatedBlogPost,
    migrated: urlMap.size,
  };
}
