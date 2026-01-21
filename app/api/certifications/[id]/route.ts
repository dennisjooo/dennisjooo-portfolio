import dbConnect from "@/lib/mongodb";
import Certification from "@/models/Certification";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Allow public access for GET by ID if needed, or protect it.
  // Generally specific ID fetch is for Admin editing or public details page.
  // Assuming public access is fine or checking auth if it's admin only.
  // For simplicity, let's allow public access as Certifications are public.
  
  await dbConnect();
  const { id } = await params;

  try {
    const cert = await Certification.findById(id);
    if (!cert) {
      return NextResponse.json({ success: false, error: "Certification not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: cert });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch certification" }, { status: 400 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { id } = await params;

  try {
    const body = await request.json();
    const cert = await Certification.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!cert) {
      return NextResponse.json({ success: false, error: "Certification not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: cert });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update certification" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { id } = await params;

  try {
    const deletedCert = await Certification.deleteOne({ _id: id });
    if (!deletedCert) {
      return NextResponse.json({ success: false, error: "Certification not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete certification" }, { status: 400 });
  }
}
