import "server-only";
import { unstable_cache } from "next/cache";
import { db, certifications, type Certification } from "@/lib/db";
import { and, count, desc } from "drizzle-orm";
import { CACHE_CONFIG, CACHE_TAGS } from "@/lib/constants/cache";
import { PUBLIC_LIST_PAGE_SIZE } from "@/lib/constants/blogsList";
import { keysetWhere, sliceCursorPage } from "@/lib/api/cursor";
import type { PaginationResult } from "@/lib/types/pagination";

export interface CertificationsResult {
  data: Certification[];
  pagination: PaginationResult;
}

export const getCertifications = unstable_cache(
  async (
    cursor: string | null = null,
    limit: number = PUBLIC_LIST_PAGE_SIZE,
  ): Promise<CertificationsResult> => {
    try {
      const sortKey = "date";
      const dir = "desc" as const;
      const [rows, totalResult] = await Promise.all([
        db
          .select()
          .from(certifications)
          .where(
            and(
              keysetWhere(certifications.date, certifications.id, dir, cursor),
            ),
          )
          .orderBy(desc(certifications.date), desc(certifications.id))
          .limit(limit + 1),
        db.select({ count: count() }).from(certifications),
      ]);

      const page = sliceCursorPage(rows, limit, sortKey);

      return {
        data: page.rows,
        pagination: {
          total: totalResult[0]?.count ?? 0,
          limit,
          hasMore: page.hasMore,
          nextCursor: page.nextCursor,
        },
      };
    } catch (error) {
      console.error("Failed to fetch certifications", error);
      return {
        data: [],
        pagination: { total: 0, limit, hasMore: false, nextCursor: null },
      };
    }
  },
  ["certifications-list"],
  { revalidate: CACHE_CONFIG.REVALIDATE, tags: [CACHE_TAGS.certifications] },
);
