import React from "react";
import Image from "next/image";
import { HoverImageFrame } from "@/components/shared/HoverImageFrame";
import { NOISE_OVERLAY_LIGHT } from "@/lib/constants/noiseOverlay";

interface ProfileImageProps {
  imageUrl?: string;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  imageUrl = "/images/profile.webp",
}) => (
  <div
    className="animate-fade-in-up aspect-square w-full max-w-[300px] flex-shrink-0"
    style={{ animationDelay: "0.4s" }}
  >
    <HoverImageFrame
      rounded="2xl"
      className="h-full w-full shadow-lg"
      frameClassName="relative w-full h-full"
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: NOISE_OVERLAY_LIGHT }}
      />
      <Image
        src={imageUrl}
        alt="Profile picture"
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        priority
        sizes="300px"
        quality={70}
      />
      <div className="pointer-events-none absolute inset-0 z-10 bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/5" />
    </HoverImageFrame>
  </div>
);
