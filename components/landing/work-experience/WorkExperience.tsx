import type { TimelineItemData } from "@/lib/types/workExperience";
import { SectionHeader } from "@/components/shared/layout/SectionHeader";
import { SectionShell } from "@/components/shared/layout/SectionShell";
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
    <SectionShell id="work">
      <SectionHeader number="03." title="Work Experience" className="mb-16" />

      <DesktopTimeline items={items} />
      <WorkExperienceMobileClient items={items} />
    </SectionShell>
  );
}
