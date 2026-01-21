import { db, certifications } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const [cert] = await db
      .select()
      .from(certifications)
      .where(eq(certifications.id, id));
    if (!cert) {
      return NextResponse.json(
        { success: false, error: "Certification not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: cert });
  } catch (error) {
    console.error("Failed to fetch certification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch certification" },
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
    const [cert] = await db
      .update(certifications)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(certifications.id, id))
      .returning();
    if (!cert) {
      return NextResponse.json(
        { success: false, error: "Certification not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: cert });
  } catch (error) {
    console.error("Failed to update certification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update certification" },
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
    const [deletedCert] = await db
      .delete(certifications)
      .where(eq(certifications.id, id))
      .returning();
    if (!deletedCert) {
      return NextResponse.json(
        { success: false, error: "Certification not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error("Failed to delete certification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete certification" },
      { status: 400 }
    );
  }
}
