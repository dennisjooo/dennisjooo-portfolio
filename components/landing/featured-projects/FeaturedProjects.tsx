import type { Blog } from "@/lib/db";
import { SectionHeader } from "@/components/shared/layout/SectionHeader";
import { SectionShell } from "@/components/shared/layout/SectionShell";
import { ProjectBentoGrid } from "./bento/ProjectBentoGrid";
import { ViewAllButton } from "./ViewAllButton";

interface FeaturedProjectsProps {
  projects: Blog[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const hasProjects = projects.length > 0;

  return (
    <SectionShell id="projects">
      <SectionHeader
        number="04."
        title="Projects"
        subtitle="Selected Work"
        description="Things I've built that mostly still work."
      />
      <ProjectBentoGrid projects={projects} />
      {hasProjects && <ViewAllButton />}
    </SectionShell>
  );
}
