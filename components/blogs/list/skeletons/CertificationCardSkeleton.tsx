import { SkeletonBlock } from "./SkeletonBlock";

export function CertificationCardSkeleton() {
  return (
    <article
      className="relative flex h-full flex-col rounded-lg border border-border bg-card p-6"
      aria-hidden="true"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <SkeletonBlock className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-3 w-28" />
          </div>
        </div>
        <SkeletonBlock className="h-4 w-4 shrink-0 rounded-full" />
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <SkeletonBlock className="h-6 w-full" />
        <SkeletonBlock className="h-6 w-4/5" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-3/4" />
      </div>
      <div className="mt-4 border-t border-border pt-4">
        <SkeletonBlock className="h-4 w-36" />
      </div>
    </article>
  );
}
