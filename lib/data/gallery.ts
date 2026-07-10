import "server-only";
import { unstable_cache } from "next/cache";
import { db, gallery, galleryDate, type GalleryExif } from "@/lib/db";
import { and, count, desc, ne } from "drizzle-orm";
import { CACHE_CONFIG } from "@/lib/constants/cache";
import { buildPagination } from "@/lib/api/apiHelpers";

export interface GalleryListItem {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  thumbUrl: string;
  fullUrl: string;
  width: number | null;
  height: number | null;
  exif: GalleryExif | null;
}

export interface GalleryResult {
  data: GalleryListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export const getGalleryImages = unstable_cache(
  async (page: number = 1, limit: number = 12): Promise<GalleryResult> => {
    try {
      const offset = (page - 1) * limit;

      const hasImages = and(ne(gallery.thumbUrl, ""), ne(gallery.fullUrl, ""));

      const [rows, totalResult] = await Promise.all([
        db
          .select({
            id: gallery.id,
            title: gallery.title,
            description: gallery.description,
            slug: gallery.slug,
            thumbUrl: gallery.thumbUrl,
            fullUrl: gallery.fullUrl,
            width: gallery.width,
            height: gallery.height,
            exif: gallery.exif,
          })
          .from(gallery)
          .where(hasImages)
          .orderBy(desc(galleryDate))
          .offset(offset)
          .limit(limit),
        db.select({ count: count() }).from(gallery).where(hasImages),
      ]);

      const total = totalResult[0]?.count ?? 0;

      return {
        data: rows,
        pagination: buildPagination(total, page, limit),
      };
    } catch (error) {
      console.error("Failed to fetch gallery images", error);
      return {
        data: [],
        pagination: buildPagination(0, page, limit),
      };
    }
  },
  ["gallery-images"],
  { revalidate: CACHE_CONFIG.REVALIDATE, tags: ["gallery"] },
);
