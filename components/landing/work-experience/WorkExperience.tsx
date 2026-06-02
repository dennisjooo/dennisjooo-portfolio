import type { TimelineItemData } from '@/lib/types/workExperience';
import { DesktopTimeline } from './Timeline/DesktopTimeline';
import { WorkExperienceMobileClient } from './WorkExperienceMobileClient';

export type { TimelineItemData };

const defaultWorkExperienceData: TimelineItemData[] = [];

interface WorkExperienceProps {
    workExperience?: TimelineItemData[];
}

export default function WorkExperience({ workExperience }: WorkExperienceProps) {
    const items = workExperience ?? defaultWorkExperienceData;

    return (
        <section
            id="work"
            className="py-24 md:py-32 w-full bg-background text-foreground"
        >
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="relative w-full flex justify-between items-end border-b border-border pb-4 mb-16">
                    <span className="font-playfair italic text-3xl md:text-4xl text-foreground">03.</span>
                    <span className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-70 text-muted-foreground">
                        Work Experience
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-accent" />
                </div>

                <DesktopTimeline items={items} />

                <WorkExperienceMobileClient items={items} />
            </div>
        </section>
    );
}
