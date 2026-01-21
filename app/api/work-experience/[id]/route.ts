import dbConnect from "@/lib/mongodb";
import WorkExperience from "@/models/WorkExperience";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  try {
    const experience = await WorkExperience.findById(id);
    if (!experience) {
      return NextResponse.json(
        { success: false, error: "Work experience not found" }, 
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: experience });
  } catch (error) {
    console.error('Failed to fetch work experience:', error);
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

  await dbConnect();
  const { id } = await params;

  try {
    const body = await request.json();
    const experience = await WorkExperience.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!experience) {
      return NextResponse.json(
        { success: false, error: "Work experience not found" }, 
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: experience });
  } catch (error) {
    console.error('Failed to update work experience:', error);
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

  await dbConnect();
  const { id } = await params;

  try {
    const deleted = await WorkExperience.deleteOne({ _id: id });
    if (!deleted.deletedCount) {
      return NextResponse.json(
        { success: false, error: "Work experience not found" }, 
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Failed to delete work experience:', error);
    return NextResponse.json(
      { success: false, error: "Failed to delete work experience" }, 
      { status: 400 }
    );
  }
}
