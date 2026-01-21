import { db, workExperiences } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { asc, desc } from "drizzle-orm";

export async function GET() {
  try {
    const experiences = await db
      .select()
      .from(workExperiences)
      .orderBy(asc(workExperiences.order), desc(workExperiences.createdAt));
    return NextResponse.json({
      success: true,
      data: experiences,
    });
  } catch (error) {
    console.error("Failed to fetch work experiences:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch work experiences" },
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

    // If no order specified, put at the end
    if (body.order === undefined) {
      const lastItems = await db
        .select({ order: workExperiences.order })
        .from(workExperiences)
        .orderBy(desc(workExperiences.order))
        .limit(1);
      body.order = lastItems.length > 0 ? (lastItems[0].order ?? 0) + 1 : 0;
    }

    const [experience] = await db
      .insert(workExperiences)
      .values(body)
      .returning();
    return NextResponse.json(
      { success: true, data: experience },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create work experience:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create work experience" },
      { status: 400 }
    );
  }
}
