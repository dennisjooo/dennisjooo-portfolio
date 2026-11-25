"use client";

import { CertificationCard } from "./CertificationCard";
import type { Certification } from "@/lib/db/schema";
import { usePaginatedList } from "@/lib/hooks/data/usePaginatedList";
import { PaginatedList } from "@/components/shared";
import { CertificationsListSkeleton } from "./skeletons";

import { PUBLIC_LIST_PAGE_SIZE } from "@/lib/constants/blogsList";

export default function CertificationsList() {
  const paginatedList = usePaginatedList<Certification>({
    endpoint: "/api/certifications",
    pageSize: PUBLIC_LIST_PAGE_SIZE,
  });

  if (paginatedList.loading) {
    return <CertificationsListSkeleton count={PUBLIC_LIST_PAGE_SIZE} />;
  }

  return (
    <PaginatedList
      {...paginatedList}
      emptyMessage="No certifications found"
      itemName="certification"
      gapClassName="gap-6 md:gap-8"
      loadingMoreSkeleton={<CertificationsListSkeleton count={3} />}
      keyExtractor={(cert) => cert.id}
      renderItem={(cert, index) => (
        <CertificationCard certification={cert} index={index} />
      )}
    />
  );
}
