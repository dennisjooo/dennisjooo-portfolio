import dbConnect from "@/lib/mongodb";
import Certification from "@/models/Certification";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  await dbConnect();
  try {
    // Parse query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [certs, total] = await Promise.all([
        Certification.find({}).sort({ date: -1 }).skip(skip).limit(limit),
        Certification.countDocuments({})
    ]);

    return NextResponse.json({ 
        success: true, 
        data: certs,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch certifications" }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    const body = await request.json();
    const cert = await Certification.create(body);
    return NextResponse.json({ success: true, data: cert }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create certification" }, { status: 400 });
  }
}
