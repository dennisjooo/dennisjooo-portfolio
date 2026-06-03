'use client';

import { CertificationCard } from './CertificationCard';
import type { Certification } from '@/lib/db';
import { usePaginatedList } from '@/lib/hooks/usePaginatedList';
import { PaginatedList } from '@/components/shared';
import { CertificationsListSkeleton } from './skeletons';

const PAGE_SIZE = 9;

export default function CertificationsList() {
    const paginatedList = usePaginatedList<Certification>({
        endpoint: '/api/certifications',
        pageSize: PAGE_SIZE
    });

    if (paginatedList.loading) {
        return <CertificationsListSkeleton count={PAGE_SIZE} />;
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
