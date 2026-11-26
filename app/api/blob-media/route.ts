import { NextResponse } from "next/server";
import { isPublicVercelBlobUrl } from "@/lib/utils/blobUrls";
import { isSvgImageSrc } from "@/lib/utils/imageSrc";

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");
  if (!url || !isPublicVercelBlobUrl(url) || !isSvgImageSrc(url)) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  const upstream = await fetch(url);
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "image/svg+xml";
  if (!contentType.includes("svg")) {
    return NextResponse.json({ error: "Not an SVG" }, { status: 400 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
