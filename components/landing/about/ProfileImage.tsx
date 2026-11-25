import React from "react";
import Image from "next/image";
import { DEFAULT_PROFILE_IMAGE } from "@/lib/constants/site";

interface ProfileImageProps {
  imageUrl?: string;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  imageUrl = DEFAULT_PROFILE_IMAGE,
}) => (
  <div
    className="animate-fade-in aspect-square w-full max-w-[300px] flex-shrink-0"
    style={{ animationDelay: "0.4s" }}
  >
    <div className="relative h-full w-full overflow-hidden border border-border bg-muted">
      <Image
        src={imageUrl}
        alt="Profile picture"
        fill
        className="object-cover"
        priority
        sizes="300px"
        quality={70}
      />
    </div>
  </div>
);
