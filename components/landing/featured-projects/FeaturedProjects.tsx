import type { Blog } from "@/lib/db";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FeaturedProjectsGrid } from "./FeaturedProjectsGrid";
import { ViewAllButton } from "./ViewAllButton";

interface FeaturedProjectsProps {
  projects: Blog[];
}

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects }) => {
  return (
    <section
      id="projects"
      className="py-24 md:py-32 w-full bg-background text-foreground overflow-hidden"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <SectionHeader
          number="04."
          title="Featured Projects"
          animated={false}
          subtitle="Selected Work"
          description="Things I've built that mostly still work."
        />
        <FeaturedProjectsGrid projects={projects} />
        <ViewAllButton />
      </div>
    </section>
  );
};

export default FeaturedProjects;
