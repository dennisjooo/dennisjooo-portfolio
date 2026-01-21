import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import sharp from 'sharp';

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const originalFilename = searchParams.get('filename') || `profile-${Date.now()}.webp`;
  const contentHashParam = searchParams.get('contentHash');
  const normalizedHash = contentHashParam
    ? contentHashParam.toLowerCase().replace(/[^a-f0-9]/g, '').slice(0, 32)
    : null;

  if (!request.body) {
    return new NextResponse('No body', { status: 400 });
  }

  try {
    // Read the image data into a buffer
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert to WebP format with optimization
    const optimizedBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer();

    // Generate filename - force profile.webp for profile updates
    let webpFilename;
    if (originalFilename === 'profile.webp') {
      webpFilename = 'profile.webp';
    } else if (normalizedHash) {
      const baseName = originalFilename.replace(/\.[^.]+$/, '');
      webpFilename = `${baseName}-${normalizedHash}.webp`;
    } else {
      // Generate unique filename: basename-{timestamp}-{randomId}.webp
      const baseName = originalFilename.replace(/\.[^.]+$/, '');
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      webpFilename = `${baseName}-${uniqueId}.webp`;
    }

    const blob = await put(webpFilename, optimizedBuffer, {
      access: 'public',
      addRandomSuffix: webpFilename !== 'profile.webp' && !normalizedHash,
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { urls } = await request.json();
    if (!urls || !Array.isArray(urls)) {
      return new NextResponse('Invalid body', { status: 400 });
    }

    await del(urls);
    return new NextResponse('Deleted', { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
