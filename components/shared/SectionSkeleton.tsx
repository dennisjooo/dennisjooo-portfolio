interface SectionSkeletonProps {
  height?: string;
}

export function SectionSkeleton({
  height = "min-h-screen",
}: SectionSkeletonProps) {
  return <div className={`${height} bg-background`} />;
}
