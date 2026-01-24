'use client';

import React, { useRef, useMemo } from 'react';
import { SectionHeaderAnimated } from '@/components/shared/SectionHeaderAnimated';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';
import { useAboutAnimations } from '@/lib/hooks/useAboutAnimations';
import { createContentSections, defaultAboutContent, AboutContent } from './contentSections';

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
        contentSections
    });

    // Pre-reserve scroll space to prevent CLS when GSAP creates pin-spacer
    // Mobile: 4000px scroll distance, Desktop: 3000px scroll distance
    // We use CSS with media queries in the className
    return (
        <section
            ref={sectionRef}
            id="about"
            className="relative bg-background text-foreground overflow-hidden min-h-[calc(100vh+4000px)] md:min-h-[calc(100vh+3000px)]"
        >
            <div
                ref={containerRef}
                className="h-screen w-full flex flex-col md:max-w-7xl mx-auto md:px-6 py-24 md:py-20"
            >
                {/* Header */}
                <div className="w-full px-6 md:px-0 mb-8">
                    <SectionHeaderAnimated
                        number="02."
                        title="About Me"
                    />
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
