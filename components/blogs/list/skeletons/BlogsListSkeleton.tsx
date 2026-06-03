import { FeaturedCardSkeleton } from './FeaturedCardSkeleton';
import { ContentCardSkeleton } from './ContentCardSkeleton';

interface BlogsListSkeletonProps {
    gridCount?: number;
    showFeatured?: boolean;
}

export function BlogsListSkeleton({ gridCount = 6, showFeatured = true }: BlogsListSkeletonProps) {
    return (
        <div className="w-full" aria-busy="true" aria-label="Loading blogs">
            {showFeatured && <FeaturedCardSkeleton />}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {Array.from({ length: gridCount }).map((_, i) => (
                    <ContentCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
