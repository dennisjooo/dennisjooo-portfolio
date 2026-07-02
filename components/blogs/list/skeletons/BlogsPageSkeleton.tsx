import { SkeletonBlock } from "./SkeletonBlock";
import { BlogsListSkeleton } from "./BlogsListSkeleton";

export function BlogsPageSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section
        id="projects-and-certifications"
        className="flex flex-col py-8 md:py-12"
      >
        <div className="container mx-auto max-w-7xl px-6 pt-24 md:pt-20">
          <header className="mb-8 w-full md:mb-10" aria-hidden="true">
            <SkeletonBlock className="mb-4 h-3 w-44" />
            <SkeletonBlock className="mb-4 h-12 w-48 md:h-14 md:w-56" />
            <SkeletonBlock className="h-5 w-full max-w-xl" />
            <SkeletonBlock className="mt-2 h-5 w-4/5 max-w-md" />
          </header>

          <div
            className="mb-8 flex items-center gap-6 border-b border-border pb-4 md:gap-10"
            aria-hidden="true"
          >
            <div className="space-y-1">
              <SkeletonBlock className="h-3 w-6" />
              <SkeletonBlock className="h-7 w-20" />
            </div>
            <div className="space-y-1">
              <SkeletonBlock className="h-3 w-6" />
              <SkeletonBlock className="h-7 w-36" />
            </div>
            <div className="hidden flex-1 md:block" />
            <SkeletonBlock className="hidden h-3 w-24 md:block" />
          </div>

          <div className="mt-8 min-h-[50vh] w-full">
            <BlogsListSkeleton />
          </div>
        </div>
      </section>
    </div>
  );
}
