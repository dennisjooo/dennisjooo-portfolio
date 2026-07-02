import { CertificationCardSkeleton } from "./CertificationCardSkeleton";

interface CertificationsListSkeletonProps {
  count?: number;
}

export function CertificationsListSkeleton({
  count = 9,
}: CertificationsListSkeletonProps) {
  return (
    <div
      className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading certifications"
    >
      {Array.from({ length: count }).map((_, i) => (
        <CertificationCardSkeleton key={i} />
      ))}
    </div>
  );
}
