import { db, contacts } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { asc, desc, count } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

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
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contacts" },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const [contact] = await db.insert(contacts).values(body).returning();
    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch (error) {
    console.error("Failed to create contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create contact" },
      { status: 400 }
    );
  }
}
