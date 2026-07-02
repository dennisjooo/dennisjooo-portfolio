import { cn } from "@/lib/utils";
import type { Blog } from "@/lib/db";
import { ProjectCompactTile } from "./ProjectCompactTile";
import { ProjectFeaturedTile } from "./ProjectFeaturedTile";
import { toProjectTileProps } from "./utils";

interface ProjectBentoGridProps {
  projects: Blog[];
}

export function ProjectBentoGrid({ projects }: ProjectBentoGridProps) {
  if (projects.length === 0) {
    return null;
  }

  const [featured, ...compacts] = projects;
  const compactCount = compacts.length;

  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-6 md:gap-8",
        compactCount > 0 && "md:grid-cols-2 lg:grid-cols-12",
      )}
    >
      <ProjectFeaturedTile
        {...toProjectTileProps(featured, 1, 0)}
        className={cn(
          compactCount === 0 && "lg:col-span-12",
          compactCount > 0 && "md:col-span-2 lg:col-span-7 lg:row-span-2",
        )}
      />

      {compacts.map((project, index) => (
        <ProjectCompactTile
          key={`${project.title}_${project.date}`}
          {...toProjectTileProps(project, index + 2, index + 1)}
          className={cn(
            compactCount === 1 && "md:col-span-2 lg:col-span-5 lg:row-span-2",
            compactCount > 1 && "lg:col-span-5",
          )}
        />
      ))}
    </div>
  );
}
