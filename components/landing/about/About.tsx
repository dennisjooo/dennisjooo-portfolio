"use client";

import React, { useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/shared/layout/SectionHeader";
import { sectionInnerClasses } from "@/components/shared/layout/SectionShell";
import { MobileView } from "./MobileView";
import { DesktopView } from "./DesktopView";
import { useAboutAnimations } from "@/lib/hooks/domain/useAboutAnimations";
import {
  createContentSections,
  defaultAboutContent,
  AboutContent,
} from "@/lib/content/aboutContent";

interface AboutProps {
  profileImageUrl?: string;
  aboutContent?: AboutContent;
}

const About: React.FC<AboutProps> = ({ profileImageUrl, aboutContent }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  const contentSections = useMemo(() => {
    return createContentSections(aboutContent || defaultAboutContent);
  }, [aboutContent]);

  useAboutAnimations({
    sectionRef,
    containerRef,
    contentSections,
  });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-[calc(100vh+1500px)] overflow-hidden bg-background text-foreground md:min-h-[calc(100vh+1200px)]"
    >
      <div
        ref={containerRef}
        className={cn(
          "flex h-screen w-full flex-col py-24 md:py-20",
          sectionInnerClasses,
        )}
      >
        {/* Header */}
        <div className="mb-8 w-full px-6 md:px-0">
          <SectionHeader number="02." title="About Me" animated={false} />
        </div>

        <div className="relative flex w-full flex-1 flex-col overflow-hidden md:flex-row">
          <MobileView
            contentSections={contentSections}
            profileImageUrl={profileImageUrl}
          />
          <DesktopView
            contentSections={contentSections}
            scrollContentRef={scrollContentRef}
            profileImageUrl={profileImageUrl}
          />
        </div>
      </div>
    </section>
  );
};

export default About;
