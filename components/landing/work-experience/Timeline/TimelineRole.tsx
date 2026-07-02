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
      className="relative ml-4 border-l border-foreground/10 py-4 pl-8 md:ml-0 md:border-none md:pl-0"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Dot for mobile timeline */}
      <div className="absolute -left-[5px] top-6 h-2.5 w-2.5 rounded-full border border-foreground/30 bg-background md:hidden" />

      {/* Role Header */}
      <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-baseline">
        <h4 className="text-display min-w-0 pb-1 font-sans text-3xl font-bold leading-none tracking-tight md:text-4xl">
          {role.title}
        </h4>
        <span className="w-fit shrink-0 whitespace-nowrap rounded bg-foreground/5 px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted-foreground md:text-sm">
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
