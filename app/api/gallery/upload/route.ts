import { put } from "@vercel/blob";
import sharp from "sharp";
import {
  requireAuth,
  isAuthError,
  errorResponse,
  successResponse,
} from "@/lib/api/apiHelpers";
import { extractGalleryExif } from "@/lib/utils/galleryExif";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function POST(request: Request) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug || !SLUG_PATTERN.test(slug)) {
    return errorResponse("Valid slug is required", 400);
  }

  if (!request.body) {
    return errorResponse("No body", 400);
  }

  try {
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const exif = await extractGalleryExif(buffer);

    const [thumbBuffer, fullBuffer, fullMeta] = await Promise.all([
      sharp(buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer(),
      sharp(buffer)
        .resize({ width: 4096, withoutEnlargement: true })
        .webp({ quality: 95, effort: 6 })
        .toBuffer(),
      sharp(buffer)
        .resize({ width: 4096, withoutEnlargement: true })
        .metadata(),
    ]);

    let finalSlug = slug;
    let uploaded = false;
    let thumbBlob: { url: string } = { url: "" };
    let fullBlob: { url: string } = { url: "" };

    for (let attempt = 0; attempt < 5; attempt++) {
      const folder = `gallery/${finalSlug}`;
      try {
        [thumbBlob, fullBlob] = await Promise.all([
          put(`${folder}/thumb.webp`, thumbBuffer, {
            access: "public",
            addRandomSuffix: false,
          }),
          put(`${folder}/full.webp`, fullBuffer, {
            access: "public",
            addRandomSuffix: false,
          }),
        ]);
        uploaded = true;
        break;
      } catch (e) {
        const isConflict =
          e instanceof Error && e.message.includes("already exists");
        if (!isConflict || attempt === 4) throw e;
        finalSlug = `${slug}-${attempt + 2}`;
      }
    }

    if (!uploaded) {
      return errorResponse("Gallery upload failed", 500);
    }

    return successResponse({
      slug: finalSlug,
      thumbUrl: thumbBlob.url,
      fullUrl: fullBlob.url,
      width: fullMeta.width ?? null,
      height: fullMeta.height ?? null,
      exif,
    });
  } catch (error) {
    console.error("Gallery upload error:", error);
    return errorResponse("Gallery upload failed", 500);
  }
}
