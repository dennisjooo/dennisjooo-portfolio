import React, { Ref } from 'react';
import { ProfileImage } from './ProfileImage';
import { ProfileMetadata } from './ProfileMetadata';
import { ContentSection } from './contentSections';

interface DesktopViewProps {
    contentSections: ContentSection[];
    scrollContentRef: Ref<HTMLDivElement>;
    profileImageUrl?: string;
}

export const DesktopView: React.FC<DesktopViewProps> = ({ contentSections, scrollContentRef, profileImageUrl }) => (
    <div className="hidden md:flex w-full h-full">
        <div className="w-[40%] h-full flex flex-col justify-center items-center p-12 relative z-10">
            <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

            <div className="w-full max-w-md flex flex-col items-center">
                <ProfileImage imageUrl={profileImageUrl} />
                <ProfileMetadata className="mt-8" />
            </div>
        </div>

        <div
            ref={scrollContentRef}
            className="w-[60%] h-full flex items-center relative pl-16 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
        >
            {contentSections.map((section) => (
                <div
                    key={section.id}
                    className="absolute inset-x-16 top-1/2 -translate-y-1/2 flex flex-col justify-center"
                >
                    <div className="about-title mb-8">
                        <h2 className="text-7xl xl:text-8xl font-playfair italic text-gradient-primary leading-tight pb-4">
                            {section.title}
                        </h2>
                    </div>

                    <div className="about-body max-w-xl">
                        <p className="text-xl xl:text-2xl font-light leading-relaxed text-muted-foreground">
                            {section.body}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
