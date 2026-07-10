"use client";

import Image from "next/image";
import { PhotoView } from "react-photo-view";
import type { GalleryListItem } from "@/lib/data/gallery";
import { GalleryMetadataOverlay } from "./GalleryMetadataOverlay";

interface GalleryCardProps {
  image: GalleryListItem;
  index: number;
}

export function GalleryCard({ image, index }: GalleryCardProps) {
  const aspectRatio =
    image.width && image.height ? `${image.width} / ${image.height}` : "4 / 3";
  const displayTitle = image.title || "Untitled";

  if (!image.thumbUrl || !image.fullUrl) return null;

  return (
    <PhotoView
      src={image.fullUrl}
      overlay={<GalleryMetadataOverlay image={image} />}
    >
      <div
        className="group cursor-zoom-in break-inside-avoid overflow-hidden rounded-lg"
        style={{ animationDelay: `${Math.min(index * 60, 480)}ms` }}
      >
        <div className="relative w-full" style={{ aspectRatio }}>
          <Image
            src={image.thumbUrl}
            alt={displayTitle}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            unoptimized={image.thumbUrl.startsWith("http")}
          />
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
        </div>
      </div>
    </PhotoView>
  );
}
