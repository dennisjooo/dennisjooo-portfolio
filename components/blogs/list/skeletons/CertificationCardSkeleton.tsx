import { SkeletonBlock } from "./SkeletonBlock";

export function CertificationCardSkeleton() {
  return (
    <article
      className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3 md:px-5">
        <SkeletonBlock className="h-8 w-8 shrink-0 rounded-full" />
        <SkeletonBlock className="h-5 w-28 shrink-0 rounded" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
        <SkeletonBlock className="h-7 w-full md:h-8" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-3/4" />
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <SkeletonBlock className="h-3 w-12" />
          <SkeletonBlock className="h-4 w-4 shrink-0 rounded-full" />
        </div>
      </div>
    </article>
  );
}
