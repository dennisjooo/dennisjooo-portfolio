"use client";

import React, { useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { sectionInnerClasses } from "@/components/shared/SectionShell";
import { MobileView } from "./MobileView";
import { DesktopView } from "./DesktopView";
import { useAboutAnimations } from "@/lib/hooks/useAboutAnimations";
import {
  createContentSections,
  defaultAboutContent,
  AboutContent,
} from "./contentSections";

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
      className="relative bg-background text-foreground overflow-hidden min-h-[calc(100vh+1500px)] md:min-h-[calc(100vh+1200px)]"
    >
      <div
        ref={containerRef}
        className={cn(
          "h-screen w-full flex flex-col py-24 md:py-20",
          sectionInnerClasses,
        )}
      >
        {/* Header */}
        <div className="w-full px-6 md:px-0 mb-8">
          <SectionHeader number="02." title="About Me" animated={false} />
        </div>

        <div className="flex-1 w-full relative overflow-hidden flex flex-col md:flex-row">
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
