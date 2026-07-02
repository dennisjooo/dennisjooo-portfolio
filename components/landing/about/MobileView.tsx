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
    <div className="mobile-scroll-container backface-hidden flex h-full w-[500%] transform-gpu">
      {/* Card 1: Profile */}
      <div className="flex h-full w-screen flex-col items-center justify-center gap-6 px-8">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground opacity-50">
          Swipe to Explore
        </span>
        <ProfileImage imageUrl={profileImageUrl} />
        <ProfileMetadata nameClassName="text-4xl" />
      </div>

      {/* Cards 2-5: Content */}
      {contentSections.map((section) => (
        <div
          key={section.id}
          className="flex h-full w-screen flex-col justify-center space-y-6 px-8"
        >
          <h2 className="text-display pb-2 font-caslon text-5xl italic leading-tight">
            {section.title}
          </h2>
          <div className="h-px w-12 bg-current text-foreground opacity-20" />
          <p className="text-lg font-light leading-relaxed text-muted-foreground">
            {section.body}
          </p>
        </div>
      ))}
    </div>
  </div>
);
