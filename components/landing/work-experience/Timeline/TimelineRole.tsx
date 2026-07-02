"use client";

import React from "react";
import { TimelineItemData } from "@/lib/types/workExperience";
import { m } from "@/components/motion";
import { RoleResponsibilitiesList } from "../RoleResponsibilitiesList";

interface TimelineRoleProps {
  role: TimelineItemData;
  index: number;
}

export const TimelineRole: React.FC<TimelineRoleProps> = ({ role, index }) => {
  return (
    <m.div
      className="relative pl-8 md:pl-0 border-l border-foreground/10 md:border-none ml-4 md:ml-0 py-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Dot for mobile timeline */}
      <div className="absolute -left-[5px] top-6 w-2.5 h-2.5 rounded-full bg-background border border-foreground/30 md:hidden" />

      {/* Role Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-6 gap-3">
        <h4 className="min-w-0 text-3xl md:text-4xl font-sans font-bold leading-none text-display tracking-tight pb-1">
          {role.title}
        </h4>
        <span className="shrink-0 whitespace-nowrap font-mono text-xs md:text-sm tracking-widest uppercase text-muted-foreground bg-foreground/5 px-3 py-1 rounded w-fit">
          {role.date}
        </span>
      </div>

      <RoleResponsibilitiesList
        responsibilities={role.responsibilities}
        itemKeyPrefix={role.id ?? role.title}
      />
    </m.div>
  );
};
