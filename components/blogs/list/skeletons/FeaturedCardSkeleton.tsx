import { SkeletonBlock } from "./SkeletonBlock";

export function FeaturedCardSkeleton() {
  return (
    <div
      className="mb-12 flex w-full flex-col gap-5 md:mb-16 md:grid md:grid-cols-12 md:items-center md:gap-10"
      aria-hidden="true"
    >
      <SkeletonBlock className="aspect-[16/9] w-full rounded-2xl md:col-span-7 md:aspect-[16/10]" />
      <div className="flex flex-col gap-3 md:col-span-5 md:gap-4">
        <SkeletonBlock className="h-3 w-40" />
        <SkeletonBlock className="h-10 w-full md:h-12" />
        <SkeletonBlock className="h-10 w-3/5 md:h-12" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-28" />
      </div>
    </div>
  );
}
