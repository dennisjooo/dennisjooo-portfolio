import React from "react";
import Image from "next/image";
import { HoverImageFrame } from "@/components/shared/HoverImageFrame";

interface ProfileImageProps {
  imageUrl?: string;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  imageUrl = "/images/profile.webp",
}) => (
  <div
    className="animate-fade-in aspect-square w-full max-w-[300px] flex-shrink-0"
    style={{ animationDelay: "0.4s" }}
  >
    <HoverImageFrame
      rounded="2xl"
      className="h-full w-full shadow-lg"
      frameClassName="relative w-full h-full"
    >
      <Image
        src={imageUrl}
        alt="Profile picture"
        fill
        className="object-cover"
        priority
        sizes="300px"
        quality={70}
      />
    </HoverImageFrame>
  </div>
);
