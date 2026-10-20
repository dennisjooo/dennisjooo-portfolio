import { SkeletonBlock } from "./SkeletonBlock";

export function ContentCardSkeleton() {
  return (
    <div aria-hidden="true">
      <SkeletonBlock className="aspect-[16/10] w-full rounded-2xl" />
      <div className="mt-5 flex flex-col gap-2">
        <SkeletonBlock className="h-3 w-40" />
        <SkeletonBlock className="h-8 w-4/5" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-2/3" />
      </div>
    </div>
  );
}
