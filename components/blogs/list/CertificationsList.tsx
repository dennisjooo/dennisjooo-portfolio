'use client';

import { CertificationCard } from './CertificationCard';
import type { Certification } from '@/lib/db';
import { usePaginatedList } from '@/lib/hooks/usePaginatedList';
import { PaginatedList } from '@/components/shared';

const PAGE_SIZE = 9;

export default function CertificationsList() {
    const paginatedList = usePaginatedList<Certification>({
        endpoint: '/api/certifications',
        pageSize: PAGE_SIZE
    });

    return (
        <PaginatedList
            {...paginatedList}
            emptyMessage="No certifications found"
            itemName="certification"
            skeletonCount={PAGE_SIZE}
            skeletonHeight="h-64"
            gapClassName="gap-6 md:gap-8"
            keyExtractor={(cert) => cert.id}
            renderItem={(cert, index) => (
                <CertificationCard certification={cert} index={index} />
            )}
        />
    );
}
