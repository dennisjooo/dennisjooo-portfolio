"use client";

import React, { useRef } from "react";
import { CompanyGroup } from "@/lib/utils/workExperience";
import { useScrollActiveZone } from "@/lib/hooks/scroll/useScrollActiveZone";
import { cn } from "@/lib/utils";
import { CompanyHeader } from "./CompanyHeader";
import { TimelineRole } from "./TimelineRole";

interface TimelineGroupProps {
  group: CompanyGroup;
  isLast: boolean;
}

export const TimelineGroup: React.FC<TimelineGroupProps> = ({
  group,
  isLast,
}) => {
  const groupRef = useRef<HTMLDivElement>(null);
  const isActive = useScrollActiveZone(groupRef);

  return (
    <div ref={groupRef} className={`relative w-full ${!isLast ? "mb-0" : ""}`}>
      {/* Desktop Layout: Grid */}
      <div className="hidden min-h-[50vh] md:grid md:grid-cols-12 md:gap-16">
        {/* Left Column: Sticky Header */}
        <div className="relative col-span-5">
          <div className="sticky top-32 flex flex-col items-end pb-20 will-change-transform">
            <CompanyHeader
              companyName={group.companyName}
              logo={group.logo}
              isActive={isActive}
            />

            {/* Decorative Dot */}
            <div
              className={cn(
                "absolute right-[-4.5rem] top-6 z-10 hidden h-4 w-4 rounded-full border-2 transition-all duration-500 lg:block",
                isActive
                  ? "scale-110 border-foreground bg-foreground shadow-[0_0_0_4px_hsl(var(--foreground)/0.15),0_0_16px_hsl(var(--foreground)/0.25)]"
                  : "scale-100 border-foreground/25 bg-background",
              )}
            />
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="col-span-7 border-l border-foreground/10 pb-32 pl-16 pt-8">
          <div className="flex flex-col space-y-20">
            {group.roles.map((role, i) => (
              <TimelineRole key={role.id} role={role} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
