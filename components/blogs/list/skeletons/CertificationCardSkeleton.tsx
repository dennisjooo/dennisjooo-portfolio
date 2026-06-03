import { SkeletonBlock } from './SkeletonBlock';

export function CertificationCardSkeleton() {
    return (
        <article
            className="relative flex flex-col h-full p-6 rounded-lg border border-border bg-card"
            aria-hidden="true"
        >
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <SkeletonBlock className="w-10 h-10 rounded-full shrink-0" />
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <SkeletonBlock className="h-3 w-20" />
                        <SkeletonBlock className="h-3 w-28" />
                    </div>
                </div>
                <SkeletonBlock className="h-4 w-4 rounded-full shrink-0" />
            </div>
            <div className="flex-1 flex flex-col gap-3">
                <SkeletonBlock className="h-6 w-full" />
                <SkeletonBlock className="h-6 w-4/5" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-3/4" />
            </div>
            <div className="mt-4 pt-4 border-t border-border">
                <SkeletonBlock className="h-4 w-36" />
            </div>
        </article>
    );
}
