import { SkeletonBlock } from "./SkeletonBlock";

export function FeaturedCardSkeleton() {
  return (
    <div className="mb-12 w-full md:mb-16" aria-hidden="true">
      <article className="relative grid grid-cols-1 overflow-hidden rounded-xl border border-border bg-card md:grid-cols-5 md:gap-10 md:rounded-2xl md:p-6">
        <SkeletonBlock className="aspect-[16/9] w-full rounded-none md:col-span-3 md:aspect-auto md:min-h-[320px] md:rounded-xl" />
        <div className="flex flex-col justify-center gap-3 p-4 md:col-span-2 md:gap-4 md:p-0 md:py-4">
          <div className="hidden gap-2 md:flex">
            <SkeletonBlock className="h-6 w-16" />
            <SkeletonBlock className="h-6 w-24" />
            <SkeletonBlock className="h-6 w-14" />
          </div>
          <SkeletonBlock className="h-8 w-full md:h-10" />
          <SkeletonBlock className="h-8 w-4/5 md:h-10" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-3/4" />
          <div className="mt-2 hidden md:block">
            <SkeletonBlock className="h-4 w-28" />
          </div>
          <div className="mt-auto flex items-center justify-between border-t border-border pt-3 md:hidden">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-4 w-4 rounded-full" />
          </div>
        </div>
      </article>
    </div>
  );
}
