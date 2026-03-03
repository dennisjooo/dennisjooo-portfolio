import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import {
  requireAuth,
  isAuthError,
  successResponse,
  errorResponse,
} from "./apiHelpers";

interface ReorderItem {
  id: string;
  order: number;
}

/**
 * Creates a PUT handler for reordering items in a table.
 * The table must have `id` (uuid PK), `order` (integer), and `updatedAt` (timestamp) columns.
 */
export function createReorderHandler(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: any,
  entityName: string
) {
  async function PUT(request: Request) {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;

    try {
      const body = await request.json();
      const items: ReorderItem[] = Array.isArray(body.items) ? body.items : [];

      if (items.length === 0) {
        return errorResponse("No items to reorder");
      }

      await Promise.all(
        items.map((item) =>
          db
            .update(table)
            .set({ order: item.order, updatedAt: new Date() })
            .where(eq(table.id, item.id))
        )
      );

      return successResponse({});
    } catch (error) {
      console.error(`Failed to reorder ${entityName}:`, error);
      return errorResponse(`Failed to reorder ${entityName}`);
    }
  }

  return { PUT };
}
