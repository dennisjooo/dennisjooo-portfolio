import dbConnect from "@/lib/mongodb";
import Certification from "@/models/Certification";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  await dbConnect();
  try {
    const certs = await Certification.find({}).sort({ date: -1 }); // Sort by newest date
    return NextResponse.json({ success: true, data: certs });
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
