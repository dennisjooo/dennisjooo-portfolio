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
      <div className="absolute inset-y-0 right-0 w-px bg-border" />

      <div className="flex w-full max-w-md flex-col items-center">
        <ProfileImage imageUrl={profileImageUrl} />
        <ProfileMetadata className="mt-6" />
      </div>
    </div>

    <div
      ref={scrollContentRef}
      className="animate-fade-in relative flex h-full w-[60%] items-center pl-16"
      style={{ animationDelay: "0.4s" }}
    >
      {contentSections.map((section) => (
        <div
          key={section.id}
          className="about-slide absolute inset-x-16 top-1/2 flex -translate-y-1/2 flex-col justify-center"
        >
          <div className="about-title mb-6">
            <h2 className="text-display pb-2 font-serif text-6xl font-semibold leading-none tracking-tight xl:text-7xl">
              {section.title}
            </h2>
          </div>

          <div className="about-body max-w-2xl">
            <p className="border-t border-border pt-6 text-lg leading-relaxed text-muted-foreground xl:text-xl">
              {section.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
