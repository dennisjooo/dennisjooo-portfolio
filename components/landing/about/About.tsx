"use client";

import React, { useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/shared/layout/SectionHeader";
import { sectionInnerClasses } from "@/components/shared/layout/SectionShell";
import { MobileView } from "./MobileView";
import { DesktopView } from "./DesktopView";
import { useAboutAnimations } from "@/lib/hooks/domain/useAboutAnimations";
import {
  resolveAboutContent,
  type AboutContent,
} from "@/lib/content/aboutContent";
import {
  aboutDesktopScrollDistance,
  aboutMobileScrollDistance,
} from "@/lib/constants/aboutScroll";

interface AboutProps {
  profileImageUrl?: string;
  aboutContent?: AboutContent;
}

const About: React.FC<AboutProps> = ({ profileImageUrl, aboutContent }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  const contentSections = useMemo(
    () => resolveAboutContent(aboutContent),
    [aboutContent],
  );

  const mobileScroll = aboutMobileScrollDistance(contentSections.length);
  const desktopScroll = aboutDesktopScrollDistance(contentSections.length);

  useAboutAnimations({
    sectionRef,
    containerRef,
    contentSections,
  });

  return (
    <section
      ref={sectionRef}
      id="about"
      style={
        {
          "--about-scroll-mobile": `${mobileScroll}px`,
          "--about-scroll-desktop": `${desktopScroll}px`,
        } as React.CSSProperties
      }
      className="relative min-h-[calc(100vh+var(--about-scroll-mobile))] overflow-hidden bg-background text-foreground md:min-h-[calc(100vh+var(--about-scroll-desktop))]"
    >
      <div
        ref={containerRef}
        className={cn(
          "flex h-screen w-full flex-col py-24 md:py-20",
          sectionInnerClasses,
        )}
      >
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
