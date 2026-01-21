import dbConnect from "@/lib/mongodb";
import WorkExperience from "@/models/WorkExperience";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  await dbConnect();
  try {
    const experiences = await WorkExperience.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ 
      success: true, 
      data: experiences 
    });
  } catch (error) {
    console.error('Failed to fetch work experiences:', error);
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

  await dbConnect();
  try {
    const body = await request.json();
    
    // If no order specified, put at the end
    if (body.order === undefined) {
      const lastItem = await WorkExperience.findOne({}).sort({ order: -1 });
      body.order = lastItem ? lastItem.order + 1 : 0;
    }
    
    const experience = await WorkExperience.create(body);
    return NextResponse.json(
      { success: true, data: experience }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create work experience:', error);
    return NextResponse.json(
      { success: false, error: "Failed to create work experience" }, 
      { status: 400 }
    );
  }
}
