import { createUrlSlug } from "@/lib/utils/urlHelpers";
import { errorResponse } from "@/lib/api/apiHelpers";

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
