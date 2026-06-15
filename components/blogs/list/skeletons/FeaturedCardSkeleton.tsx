import { SkeletonBlock } from "./SkeletonBlock";

export function FeaturedCardSkeleton() {
  return (
    <div className="w-full mb-12 md:mb-16" aria-hidden="true">
      <article className="relative grid grid-cols-1 md:grid-cols-5 md:gap-10 rounded-xl md:rounded-2xl border border-border bg-card md:p-6 overflow-hidden">
        <SkeletonBlock className="md:col-span-3 w-full aspect-[16/9] md:aspect-auto md:min-h-[320px] md:rounded-xl rounded-none" />
        <div className="md:col-span-2 flex flex-col justify-center gap-3 md:gap-4 p-4 md:p-0 md:py-4">
          <div className="hidden md:flex gap-2">
            <SkeletonBlock className="h-6 w-16" />
            <SkeletonBlock className="h-6 w-24" />
            <SkeletonBlock className="h-6 w-14" />
          </div>
          <SkeletonBlock className="h-8 md:h-10 w-full" />
          <SkeletonBlock className="h-8 md:h-10 w-4/5" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-3/4" />
          <div className="hidden md:block mt-2">
            <SkeletonBlock className="h-4 w-28" />
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border mt-auto md:hidden">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-4 w-4 rounded-full" />
          </div>
        </div>
      </article>
    </div>
  );
}
