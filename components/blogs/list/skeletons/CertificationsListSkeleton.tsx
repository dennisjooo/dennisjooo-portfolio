import { CertificationCardSkeleton } from './CertificationCardSkeleton';

interface CertificationsListSkeletonProps {
    count?: number;
}

export function CertificationsListSkeleton({ count = 9 }: CertificationsListSkeletonProps) {
    return (
        <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full"
            aria-busy="true"
            aria-label="Loading certifications"
        >
            {Array.from({ length: count }).map((_, i) => (
                <CertificationCardSkeleton key={i} />
            ))}
        </div>
    );
}
