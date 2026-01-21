import { db, contacts } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

interface ReorderItem {
  id: string;
  order: number;
}

export async function PUT(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const items: ReorderItem[] = Array.isArray(body.items) ? body.items : [];

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: "No items to reorder" },
        { status: 400 }
      );
    }

    await Promise.all(
      items.map((item) =>
        db
          .update(contacts)
          .set({ order: item.order, updatedAt: new Date() })
          .where(eq(contacts.id, item.id))
      )
    );

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error("Failed to reorder contacts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reorder contacts" },
      { status: 400 }
    );
  }
}
