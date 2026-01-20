'use client';

import React, { useRef } from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';
import { useAboutAnimations } from '@/lib/hooks/useAboutAnimations';
import { contentSections } from './contentSections';

const About: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContentRef = useRef<HTMLDivElement>(null);

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
                    <SectionHeader
                        number="02."
                        title="About Me"
                    />
                </div>

                <div className="flex-1 w-full relative overflow-hidden flex flex-col md:flex-row">
                    <MobileView contentSections={contentSections} />
                    <DesktopView
                        contentSections={contentSections}
                        scrollContentRef={scrollContentRef}
                    />
                </div>
            </div>
        </section>
    );
};

export default About;
