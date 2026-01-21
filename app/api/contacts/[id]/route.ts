import { db, contacts } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const [contact] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id));
    if (!contact) {
      return NextResponse.json(
        { success: false, error: "Contact not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error("Failed to fetch contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contact" },
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
    const [contact] = await db
      .update(contacts)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(contacts.id, id))
      .returning();
    if (!contact) {
      return NextResponse.json(
        { success: false, error: "Contact not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error("Failed to update contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update contact" },
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
    const [deletedContact] = await db
      .delete(contacts)
      .where(eq(contacts.id, id))
      .returning();
    if (!deletedContact) {
      return NextResponse.json(
        { success: false, error: "Contact not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error("Failed to delete contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete contact" },
      { status: 400 }
    );
  }
}
