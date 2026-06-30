import type { TimelineItemData } from "@/lib/types/workExperience";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { DesktopTimeline } from "./Timeline/DesktopTimeline";
import { WorkExperienceMobileClient } from "./WorkExperienceMobileClient";

export type { TimelineItemData };

const defaultWorkExperienceData: TimelineItemData[] = [];

interface WorkExperienceProps {
  workExperience?: TimelineItemData[];
}

export default function WorkExperience({
  workExperience,
}: WorkExperienceProps) {
  const items = workExperience ?? defaultWorkExperienceData;

  return (
    <section
      id="work"
      className="py-24 md:py-32 w-full bg-background text-foreground"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <SectionHeader
          number="03."
          title="Work Experience"
          animated={false}
          className="mb-16"
        />

        <DesktopTimeline items={items} />
        <WorkExperienceMobileClient items={items} />
      </div>
    </section>
  );
}
