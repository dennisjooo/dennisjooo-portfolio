import { ContentCard } from "@/components/shared";
import { createUrlSlug } from "@/lib/utils/urlHelpers";
import {
  calculateReadTime,
  formatProjectDate,
} from "@/lib/utils/projectFormatting";
import type { Blog } from "@/lib/db";

interface FeaturedProjectsGridProps {
  projects: Blog[];
}

export const FeaturedProjectsGrid: React.FC<FeaturedProjectsGridProps> = ({
  projects,
}) => {
  return (
    <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
      {projects.map(
        ({ title, description, date, imageUrl, blogPost, slug }, index) => (
          <ContentCard
            key={`${title}_${date}`}
            title={title}
            description={description}
            slug={slug || createUrlSlug(title)}
            date={formatProjectDate(date, true)}
            imageUrl={imageUrl ?? undefined}
            index={index}
            readTime={`${calculateReadTime(blogPost)} min`}
            variant="standard"
          />
        ),
      )}
    </div>
  );
};
