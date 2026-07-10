import exifr from "exifr";
import type { GalleryExif } from "@/lib/db";

function formatShutter(exposureTime: number | undefined): string | undefined {
  if (!exposureTime) return undefined;
  if (exposureTime >= 1) return `${exposureTime}s`;
  const denominator = Math.round(1 / exposureTime);
  return `1/${denominator}s`;
}

function formatAperture(fNumber: number | undefined): string | undefined {
  if (!fNumber) return undefined;
  return `f/${fNumber}`;
}

function formatFocalLength(
  focalLength: number | undefined,
): string | undefined {
  if (!focalLength) return undefined;
  return `${Math.round(focalLength)}mm`;
}

function formatLocation(
  latitude: number | undefined,
  longitude: number | undefined,
): string | undefined {
  if (latitude == null || longitude == null) return undefined;
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

export async function extractGalleryExif(
  input: Buffer | Blob | File,
): Promise<GalleryExif | null> {
  try {
    const raw = await exifr.parse(input, {
      pick: [
        "Make",
        "Model",
        "LensModel",
        "FocalLength",
        "FNumber",
        "ExposureTime",
        "ISO",
        "DateTimeOriginal",
        "latitude",
        "longitude",
      ],
    });

    if (!raw) return null;

    const camera = [raw.Make, raw.Model].filter(Boolean).join(" ").trim();
    const exif: GalleryExif = {};

    if (camera) exif.camera = camera;
    if (raw.LensModel) exif.lens = String(raw.LensModel);
    if (raw.FocalLength) exif.focalLength = formatFocalLength(raw.FocalLength);
    if (raw.FNumber) exif.aperture = formatAperture(raw.FNumber);
    if (raw.ExposureTime) exif.shutter = formatShutter(raw.ExposureTime);
    if (raw.ISO) exif.iso = raw.ISO;
    if (raw.DateTimeOriginal) {
      exif.dateTaken = new Date(raw.DateTimeOriginal).toISOString();
    }
    const location = formatLocation(raw.latitude, raw.longitude);
    if (location) exif.location = location;

    return Object.keys(exif).length > 0 ? exif : null;
  } catch (error) {
    console.error("Failed to extract EXIF:", error);
    return null;
  }
}
