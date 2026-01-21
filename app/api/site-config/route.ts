import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteConfig from '@/models/SiteConfig';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  await dbConnect();
  let config = await SiteConfig.findOne();
  if (!config) {
    config = await SiteConfig.create({});
  }
  return NextResponse.json(config);
}

export async function PUT(request: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse('Unauthorized', { status: 401 });

  const body = await request.json();
  await dbConnect();
  
  // Upsert the singleton config
  const config = await SiteConfig.findOneAndUpdate({}, body, { 
    new: true, 
    upsert: true,
    setDefaultsOnInsert: true
  });
  
  return NextResponse.json(config);
}
