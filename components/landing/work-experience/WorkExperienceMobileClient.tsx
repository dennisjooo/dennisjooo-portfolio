"use client";

import type { TimelineItemData } from '@/lib/types/workExperience';
import { MobileTimeline } from './Timeline/MobileTimeline';

interface WorkExperienceMobileClientProps {
    items: TimelineItemData[];
}

export function WorkExperienceMobileClient({ items }: WorkExperienceMobileClientProps) {
    return <MobileTimeline items={items} />;
}
