const BLOG_BLOB_PREFIX = "blog";

export function blogBlobFolder(slug: string): string {
  return `${BLOG_BLOB_PREFIX}/${slug}`;
}

export function blogBlobObjectPath(slug: string, filename: string): string {
  return `${blogBlobFolder(slug)}/${filename}`;
}

export function blogBlobPathnamePrefix(slug: string): string {
  return `/${blogBlobFolder(slug)}/`;
}
