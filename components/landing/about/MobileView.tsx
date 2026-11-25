import React from "react";
import { ProfileImage } from "./ProfileImage";
import { ProfileMetadata } from "./ProfileMetadata";
import { ContentSection } from "@/lib/content/aboutContent";

interface MobileViewProps {
  contentSections: ContentSection[];
  profileImageUrl?: string;
}

export const MobileView: React.FC<MobileViewProps> = ({
  contentSections,
  profileImageUrl,
}) => (
  <div className="h-full w-full touch-pan-y overflow-hidden md:hidden">
    <div
      className="mobile-scroll-container backface-hidden flex h-full transform-gpu"
      style={{ width: `${(contentSections.length + 1) * 100}%` }}
    >
      <div className="flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-6 px-8">
        <span className="font-mono text-xs text-muted-foreground opacity-50">
          Swipe to Explore
        </span>
        <ProfileImage imageUrl={profileImageUrl} />
        <ProfileMetadata nameClassName="text-4xl" />
      </div>

      {contentSections.map((section) => (
        <div
          key={section.id}
          className="flex h-full min-w-0 flex-1 flex-col justify-center space-y-6 px-8"
        >
          <h2 className="text-display pb-2 font-serif text-5xl font-semibold leading-none tracking-tight">
            {section.title}
          </h2>
          <div className="h-px w-full bg-border" />
          <p className="text-lg leading-relaxed text-muted-foreground">
            {section.body}
          </p>
        </div>
      ))}
    </div>
  </div>
);
