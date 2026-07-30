"use client";

import React from "react";
import Image from "next/image";
import { CompanyGroup } from "@/lib/utils/workExperience";
import { TimelineRole } from "./TimelineRole";

interface MobileCompanyChapterProps {
  group: CompanyGroup;
  index: number;
}

function getDateRange(group: CompanyGroup): string {
  if (group.roles.length > 1) {
    return `${group.roles[group.roles.length - 1].date.split(" - ")[0]} - ${group.roles[0].date.split(" - ")[1] || "Now"}`;
  }
  return group.roles[0].date;
}

export const MobileCompanyChapter: React.FC<MobileCompanyChapterProps> = ({
  group,
  index,
}) => {
  const dateRange = getDateRange(group);

  return (
    <article className="relative scroll-mt-28">
      <div className="mb-8 flex items-start justify-between gap-4">
        <span className="font-caslon text-4xl italic text-foreground">
          {String(index + 1).padStart(2, "0")}.
        </span>

        <div className="relative h-10 w-10 shrink-0 overflow-hidden">
          <Image
            src={group.logo}
            alt={group.companyName}
            fill
            className="object-contain object-right"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-display font-caslon text-5xl italic leading-tight">
          {group.companyName}
        </h3>

        <div className="h-px w-12 bg-foreground/20" />

        <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {dateRange}
        </span>
      </div>

      <div className="mt-10 flex flex-col space-y-2">
        {group.roles.map((role, roleIndex) => (
          <TimelineRole
            key={role.id}
            role={role}
            index={roleIndex}
            variant="mobile"
          />
        ))}
      </div>
    </article>
  );
};
