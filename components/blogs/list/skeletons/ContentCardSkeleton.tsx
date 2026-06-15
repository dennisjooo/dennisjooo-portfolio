import { SkeletonBlock } from "./SkeletonBlock";

export function ContentCardSkeleton() {
  return (
    <article
      className="relative flex flex-col h-full rounded-xl border border-border bg-card overflow-hidden"
      aria-hidden="true"
    >
      <SkeletonBlock className="w-full aspect-[16/9] rounded-none" />
      <div className="flex flex-col gap-3 p-4 md:p-5 flex-1">
        <SkeletonBlock className="h-7 md:h-8 w-full" />
        <SkeletonBlock className="h-7 md:h-8 w-4/5" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-2/3" />
        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
          <SkeletonBlock className="h-3 w-28" />
          <SkeletonBlock className="h-4 w-4 rounded-full" />
        </div>
      </div>
    </article>
  );
}
