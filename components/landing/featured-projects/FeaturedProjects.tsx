import type { BlogListItem } from "@/lib/types/blogList";
import { SectionHeader } from "@/components/shared/layout/SectionHeader";
import { SectionShell } from "@/components/shared/layout/SectionShell";
import { PostsBento } from "@/components/blogs/list/PostsBento";
import { createUrlSlug } from "@/lib/utils/urlHelpers";
import { formatProjectDate } from "@/lib/utils/projectFormatting";
import { ViewAllButton } from "./ViewAllButton";

interface FeaturedProjectsProps {
  projects: BlogListItem[];
}

const toCardProps = (project: BlogListItem) => ({
  title: project.title,
  description: project.description,
  slug: project.slug || createUrlSlug(project.title),
  date: formatProjectDate(project.date, true),
  imageUrl: project.imageUrl ?? undefined,
  type: project.type,
  readTime: `${project.readTimeMinutes} min`,
});

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <SectionShell id="projects" spacing="compact">
      <SectionHeader number="04." title="Blog" className="mb-12" />
      {projects.length > 0 && (
        <>
          <PostsBento posts={projects.map(toCardProps)} priority={false} />
          <ViewAllButton />
        </>
      )}
    </SectionShell>
  );
}
