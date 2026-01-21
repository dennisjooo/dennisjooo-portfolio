import { db, workExperiences } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const [experience] = await db
      .select()
      .from(workExperiences)
      .where(eq(workExperiences.id, id));
    if (!experience) {
      return NextResponse.json(
        { success: false, error: "Work experience not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: experience });
  } catch (error) {
    console.error("Failed to fetch work experience:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch work experience" },
      { status: 400 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const [experience] = await db
      .update(workExperiences)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(workExperiences.id, id))
      .returning();
    if (!experience) {
      return NextResponse.json(
        { success: false, error: "Work experience not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: experience });
  } catch (error) {
    console.error("Failed to update work experience:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update work experience" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const [deleted] = await db
      .delete(workExperiences)
      .where(eq(workExperiences.id, id))
      .returning();
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Work experience not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error("Failed to delete work experience:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete work experience" },
      { status: 400 }
    );
  }
}
