import React, { Ref } from "react";
import { ProfileImage } from "./ProfileImage";
import { ProfileMetadata } from "./ProfileMetadata";
import { ContentSection } from "@/lib/content/aboutContent";

interface DesktopViewProps {
  contentSections: ContentSection[];
  scrollContentRef: Ref<HTMLDivElement>;
  profileImageUrl?: string;
}

export const DesktopView: React.FC<DesktopViewProps> = ({
  contentSections,
  scrollContentRef,
  profileImageUrl,
}) => (
  <div className="hidden h-full w-full md:flex">
    <div className="relative z-10 flex h-full w-[40%] flex-col items-center justify-center p-12">
      <div className="absolute bottom-1/4 right-0 top-1/4 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

      <div className="flex w-full max-w-md flex-col items-center">
        <ProfileImage imageUrl={profileImageUrl} />
        <ProfileMetadata className="mt-8" />
      </div>
    </div>

    <div
      ref={scrollContentRef}
      className="animate-fade-in-up relative flex h-full w-[60%] items-center pl-16"
      style={{ animationDelay: "0.4s" }}
    >
      {contentSections.map((section) => (
        <div
          key={section.id}
          className="absolute inset-x-16 top-1/2 flex -translate-y-1/2 flex-col justify-center"
        >
          <div className="about-title mb-8">
            <h2 className="text-display pb-4 font-caslon text-7xl italic leading-tight xl:text-8xl">
              {section.title}
            </h2>
          </div>

          <div className="about-body max-w-xl">
            <p className="text-xl font-light leading-relaxed text-muted-foreground xl:text-2xl">
              {section.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
