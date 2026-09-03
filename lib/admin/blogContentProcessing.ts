import { buildUploadPayload } from "@/lib/utils/blobUpload";
import { createUrlSlug } from "@/lib/utils/urlHelpers";

export interface PendingImage {
  id: string;
  file: File;
  previewUrl: string;
}

export interface BlogContentContext {
  title?: string;
  slug?: string;
}

export function extractImages(content: string): string[] {
  const regex = /!\[.*?\]\((.*?)\)/g;
  const matches: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const cleanUrl = match[1]
      .replace(/#dim=\d*x\d*$/, "")
      .replace(/\s+=\d*x\d*$/, "");
    matches.push(cleanUrl);
  }
  return matches;
}

export async function processBlogContent(
  content: string,
  pendingImages: PendingImage[],
  context: BlogContentContext,
): Promise<string> {
  let processedContent = content;
  const uploadPromises: Promise<void>[] = [];

  const blobRegex = /!\[.*?\]\((blob:.*?)\)/g;
  let match;

  const matches: { fullMatch: string; url: string }[] = [];
  while ((match = blobRegex.exec(content)) !== null) {
    matches.push({ fullMatch: match[0], url: match[1] });
  }

  const uniqueUrls = Array.from(new Set(matches.map((m) => m.url)));

  for (const url of uniqueUrls) {
    const cleanBlobUrl = url
      .replace(/\s+=\d*x\d*$/, "")
      .replace(/#dim=\d*x\d*$/, "");
    const pendingImage = pendingImages.find(
      (img) => img.previewUrl === cleanBlobUrl,
    );
    if (pendingImage) {
      const uploadPromise = (async () => {
        try {
          const { contentHash, body } = await buildUploadPayload(
            pendingImage.file,
          );

          const filename = context.title
            ? `${context.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")}-${pendingImage.file.name}`
            : pendingImage.file.name;

          const slug = context.slug || createUrlSlug(context.title || "");
          const folder = slug ? `blog/${slug}` : undefined;
          const params = new URLSearchParams({ filename, contentHash });
          if (folder) params.set("folder", folder);

          const response = await fetch(`/api/upload?${params.toString()}`, {
            method: "POST",
            body,
          });
          if (!response.ok) throw new Error("Upload failed");
          const blob = await response.json();

          const dimInfo =
            url.match(/\s+=(\d*x\d*)$/) || url.match(/#dim=(\d*x\d*)$/);
          const uploadedUrl = dimInfo
            ? `${blob.url}#dim=${dimInfo[1]}`
            : blob.url;

          processedContent = processedContent.split(url).join(uploadedUrl);
        } catch (error) {
          console.error(
            "Failed to upload image:",
            pendingImage.file.name,
            error,
          );
        }
      })();
      uploadPromises.push(uploadPromise);
    }
  }

  await Promise.all(uploadPromises);
  return processedContent;
}

export async function deleteOrphanedImages(
  initialContent: string,
  initialImageUrl: string | null | undefined,
  finalContent: string,
  currentImageUrl: string | null | undefined,
): Promise<void> {
  const initialImages = extractImages(initialContent);
  if (initialImageUrl) initialImages.push(initialImageUrl);

  const currentImages = extractImages(finalContent);
  if (currentImageUrl) currentImages.push(currentImageUrl);

  const imagesToDelete = initialImages.filter(
    (url) => !currentImages.includes(url) && url.includes("vercel-storage.com"),
  );

  if (imagesToDelete.length > 0) {
    await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls: imagesToDelete }),
    });
  }
}
