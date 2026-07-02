import { SkeletonBlock } from "./SkeletonBlock";

export function ContentCardSkeleton() {
  return (
    <article
      className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card"
      aria-hidden="true"
    >
      <SkeletonBlock className="aspect-[16/9] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
        <SkeletonBlock className="h-7 w-full md:h-8" />
        <SkeletonBlock className="h-7 w-4/5 md:h-8" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-2/3" />
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <SkeletonBlock className="h-3 w-28" />
          <SkeletonBlock className="h-4 w-4 rounded-full" />
        </div>
      </div>
    </article>
  );
}
