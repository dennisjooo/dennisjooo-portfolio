interface ListSkeletonProps {
  count?: number;
  height?: string;
  cols?: string;
  gap?: string;
}

export function ListSkeleton({
  count = 9,
  height = "h-96",
  cols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  gap = "gap-8 md:gap-10",
}: ListSkeletonProps) {
  return (
    <div className={`grid ${cols} ${gap}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-muted/20 animate-pulse rounded-xl ${height}`}
        />
      ))}
    </div>
  );
}
