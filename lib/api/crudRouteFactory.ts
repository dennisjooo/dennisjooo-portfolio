import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import {
  requireAuth,
  isAuthError,
  successResponse,
  errorResponse,
} from "./apiHelpers";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * Creates standard GET/PUT/DELETE handlers for a simple CRUD resource.
 * The table must have `id` (uuid PK) and `updatedAt` (timestamp) columns.
 */
export function createCrudHandlers(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: any,
  entityName: string
) {
  async function GET(_request: Request, { params }: RouteParams) {
    const { id } = await params;

    try {
      const [item] = await db.select().from(table).where(eq(table.id, id));
      if (!item) {
        return errorResponse(`${entityName} not found`, 404);
      }
      return successResponse(item);
    } catch (error) {
      console.error(`Failed to fetch ${entityName}:`, error);
      return errorResponse(`Failed to fetch ${entityName}`);
    }
  }

  async function PUT(request: Request, { params }: RouteParams) {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;

    const { id } = await params;

    try {
      const body = await request.json();
      const [item] = await db
        .update(table)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(table.id, id))
        .returning();
      if (!item) {
        return errorResponse(`${entityName} not found`, 404);
      }
      return successResponse(item);
    } catch (error) {
      console.error(`Failed to update ${entityName}:`, error);
      return errorResponse(`Failed to update ${entityName}`);
    }
  }

  async function DELETE(_request: Request, { params }: RouteParams) {
    const authResult = await requireAuth();
    if (isAuthError(authResult)) return authResult;

    const { id } = await params;

    try {
      const result = (await db
        .delete(table)
        .where(eq(table.id, id))
        .returning()) as unknown[];
      if (!result[0]) {
        return errorResponse(`${entityName} not found`, 404);
      }
      return successResponse({});
    } catch (error) {
      console.error(`Failed to delete ${entityName}:`, error);
      return errorResponse(`Failed to delete ${entityName}`);
    }
  }

  return { GET, PUT, DELETE };
}
