import type { Blog } from "@/lib/db";
import { SectionHeader } from "@/components/shared/layout/SectionHeader";
import { SectionShell } from "@/components/shared/layout/SectionShell";
import { PostsBento } from "@/components/blogs/list/PostsBento";
import { createUrlSlug } from "@/lib/utils/urlHelpers";
import {
  calculateReadTime,
  formatProjectDate,
} from "@/lib/utils/projectFormatting";
import { ViewAllButton } from "./ViewAllButton";

interface FeaturedProjectsProps {
  projects: Blog[];
}

const toCardProps = (project: Blog) => ({
  title: project.title,
  description: project.description,
  slug: project.slug || createUrlSlug(project.title),
  date: formatProjectDate(project.date, true),
  imageUrl: project.imageUrl ?? undefined,
  type: project.type,
  readTime: `${calculateReadTime(project.blogPost)} min`,
});

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <SectionShell id="projects" spacing="compact">
      <SectionHeader
        number="04."
        title="Blog"
        subtitle="Writing & Work"
        description="Some half-decent writing, some projects that mostly still work. All of it lives on the blog."
      />
      {projects.length > 0 && (
        <>
          <PostsBento posts={projects.map(toCardProps)} priority={false} />
          <ViewAllButton />
        </>
      )}
    </SectionShell>
  );
}
