import type { GalleryExif } from "@/lib/db";
import { cn } from "@/lib/utils";

interface GalleryExifPillsProps {
  exif: GalleryExif | null | undefined;
  className?: string;
}

const EXIF_FIELDS: Array<{
  key: keyof GalleryExif;
  label: string;
}> = [
  { key: "camera", label: "Camera" },
  { key: "lens", label: "Lens" },
  { key: "focalLength", label: "Focal" },
  { key: "aperture", label: "Aperture" },
  { key: "shutter", label: "Shutter" },
  { key: "iso", label: "ISO" },
  { key: "dateTaken", label: "Taken" },
  { key: "location", label: "Location" },
];

function formatExifValue(key: keyof GalleryExif, value: string | number) {
  if (key === "dateTaken" && typeof value === "string") {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return String(value);
}

export function GalleryExifPills({ exif, className }: GalleryExifPillsProps) {
  if (!exif) return null;

  const pills = EXIF_FIELDS.flatMap(({ key, label }) => {
    const value = exif[key];
    if (value == null || value === "") return [];
    return [{ label, value: formatExifValue(key, value) }];
  });

  if (pills.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {pills.map((pill) => (
        <span
          key={pill.label}
          className="rounded-full border border-border/60 bg-background/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-sm"
        >
          <span className="text-muted-foreground/70">{pill.label}</span>{" "}
          {pill.value}
        </span>
      ))}
    </div>
  );
}
