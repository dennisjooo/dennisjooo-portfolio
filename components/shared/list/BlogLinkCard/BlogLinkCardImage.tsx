import Image from "next/image";
import { NOISE_OVERLAY_LIGHT } from "@/lib/constants/noiseOverlay";

export function BlogLinkCardImage({
  imageUrl,
  title,
  sizes,
  showNoise = true,
}: {
  imageUrl?: string;
  title: string;
  sizes: string;
  showNoise?: boolean;
}) {
  return (
    <>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes={sizes}
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-secondary to-muted" />
      )}
      {showNoise && (
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-20 mix-blend-overlay"
          style={{ backgroundImage: NOISE_OVERLAY_LIGHT }}
        />
      )}
      <div className="absolute inset-0 z-10 bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/5" />
    </>
  );
}
