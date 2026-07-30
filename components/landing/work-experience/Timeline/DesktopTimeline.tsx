"use client";

import React, { useMemo } from "react";
import { TimelineItemData } from "@/lib/types/workExperience";
import { groupItemsByCompany } from "@/lib/utils/workExperience";
import { TimelineGroup } from "./TimelineGroup";
import {
  m,
  viewportSettings,
  timelineDesktopContainer,
  timelineDesktopItem,
  useInViewReveal,
  useMotionSafe,
} from "@/components/motion";

interface DesktopTimelineProps {
  items: TimelineItemData[];
}

export const DesktopTimeline: React.FC<DesktopTimelineProps> = ({ items }) => {
  const groupedItems = useMemo(() => groupItemsByCompany(items), [items]);
  const containerMotion = useInViewReveal(timelineDesktopContainer);
  const itemVariants = useMotionSafe(timelineDesktopItem);

  return (
    <m.div
      {...containerMotion}
      viewport={viewportSettings.once}
      className="relative hidden w-full flex-col md:flex"
    >
      {groupedItems.map((group, index) => (
        <m.div key={index} variants={itemVariants}>
          <TimelineGroup
            group={group}
            isLast={index === groupedItems.length - 1}
          />
        </m.div>
      ))}
    </m.div>
  );
};
