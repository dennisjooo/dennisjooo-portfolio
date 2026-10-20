import { SkeletonBlock } from "./SkeletonBlock";

export function CertificationCardSkeleton() {
  return (
    <div
      className="flex h-full flex-col gap-3 border-t border-border pt-5"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between">
        <SkeletonBlock className="h-3 w-28" />
        <SkeletonBlock className="h-3 w-12" />
      </div>
      <SkeletonBlock className="h-7 w-full md:h-8" />
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-3/4" />
      <SkeletonBlock className="h-4 w-4 rounded-full" />
    </div>
  );
}
