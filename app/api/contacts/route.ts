import { db, contacts } from "@/lib/db";
import { NextResponse } from "next/server";
import { asc, desc, count } from "drizzle-orm";
import {
  requireAuth,
  isAuthError,
  successResponse,
  errorResponse,
  parsePagination,
  buildPagination,
} from "@/lib/api/apiHelpers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = parsePagination(searchParams);

    const [contactResults, totalResult] = await Promise.all([
      db
        .select()
        .from(contacts)
        .orderBy(asc(contacts.order), desc(contacts.createdAt))
        .offset(offset)
        .limit(limit),
      db.select({ count: count() }).from(contacts),
    ]);

    const total = totalResult[0]?.count ?? 0;

    return NextResponse.json({
      success: true,
      data: contactResults,
      pagination: buildPagination(total, page, limit),
    });
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
    return errorResponse("Failed to fetch contacts");
  }
}

export async function POST(request: Request) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();
    const [contact] = await db.insert(contacts).values(body).returning();
    return successResponse(contact, 201);
  } catch (error) {
    console.error("Failed to create contact:", error);
    return errorResponse("Failed to create contact");
  }
}
