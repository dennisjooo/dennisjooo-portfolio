"use client";

import React, { useMemo } from "react";
import { TimelineItemData } from "@/lib/types/workExperience";
import { groupItemsByCompany } from "@/lib/utils/workExperience";
import { MobileCompanyChapter } from "./MobileCompanyChapter";
import {
  m,
  viewportSettings,
  timelineMobileContainer,
  timelineMobileItem,
  useInViewReveal,
  useMotionSafe,
} from "@/components/motion";

interface MobileTimelineProps {
  items: TimelineItemData[];
}

export const MobileTimeline: React.FC<MobileTimelineProps> = ({ items }) => {
  const containerMotion = useInViewReveal(timelineMobileContainer);
  const itemVariants = useMotionSafe(timelineMobileItem);
  const groupedItems = useMemo(() => groupItemsByCompany(items), [items]);

  return (
    <m.div
      {...containerMotion}
      viewport={viewportSettings.once}
      className="relative space-y-20 md:hidden"
    >
      {groupedItems.map((group, index) => (
        <m.div key={`${group.companyName}-${index}`} variants={itemVariants}>
          <MobileCompanyChapter group={group} index={index} />
        </m.div>
      ))}
    </m.div>
  );
};
