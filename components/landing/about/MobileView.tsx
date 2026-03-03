import React from 'react';
import { ProfileImage } from './ProfileImage';
import { ProfileMetadata } from './ProfileMetadata';
import { ContentSection } from './contentSections';

interface MobileViewProps {
    contentSections: ContentSection[];
    profileImageUrl?: string;
}

export const MobileView: React.FC<MobileViewProps> = ({ contentSections, profileImageUrl }) => (
    <div className="md:hidden w-full h-full overflow-hidden touch-pan-y">
        <div className="mobile-scroll-container flex w-[500%] h-full transform-gpu backface-hidden">
            {/* Card 1: Profile */}
            <div className="w-screen h-full flex flex-col justify-center items-center px-8 gap-6">
                <span className="font-mono text-xs uppercase tracking-widest opacity-50 text-muted-foreground">
                    Swipe to Explore
                </span>
                <ProfileImage imageUrl={profileImageUrl} />
                <ProfileMetadata nameClassName="text-4xl" />
            </div>

            {/* Cards 2-5: Content */}
            {contentSections.map((section) => (
                <div key={section.id} className="w-screen h-full flex flex-col justify-center px-8 space-y-6">
                    <h2 className="text-5xl font-playfair italic font-bold leading-tight text-gradient-primary pb-2">
                        {section.title}
                    </h2>
                    <div className="w-12 h-px bg-current opacity-20 text-foreground" />
                    <p className="font-light text-muted-foreground leading-relaxed text-lg">
                        {section.body}
                    </p>
                </div>
            ))}
        </div>
    </div>
);
