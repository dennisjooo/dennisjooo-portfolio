import type { Blog } from "@/lib/db";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { SectionShell } from "@/components/shared/SectionShell";
import { FeaturedProjectsGrid } from "./FeaturedProjectsGrid";
import { ViewAllButton } from "./ViewAllButton";

interface FeaturedProjectsProps {
  projects: Blog[];
}

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects }) => {
  return (
    <SectionShell id="projects" overflowHidden>
      <SectionHeader
        number="04."
        title="Featured Projects"
        subtitle="Selected Work"
        description="Things I've built that mostly still work."
      />
      <FeaturedProjectsGrid projects={projects} />
      <ViewAllButton />
    </SectionShell>
  );
};

export default FeaturedProjects;
