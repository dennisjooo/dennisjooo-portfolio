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

    return (
        <section
            ref={sectionRef}
            id="about"
            className="min-h-screen relative bg-background text-foreground overflow-hidden"
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
