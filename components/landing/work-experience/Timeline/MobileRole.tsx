"use client";

import React, { memo } from "react";
import { TimelineItemData } from "@/lib/types/workExperience";
import { RoleResponsibilitiesList } from "../RoleResponsibilitiesList";

interface MobileRoleProps {
  role: TimelineItemData;
  isLast: boolean;
}

export const MobileRole: React.FC<MobileRoleProps> = memo(
  ({ role, isLast }) => {
    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <h4 className="font-sans text-xl font-bold uppercase tracking-tight text-foreground">
            {role.title}
          </h4>
          <span className="inline-block rounded bg-foreground/5 px-2 py-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {role.date}
          </span>
        </div>

        <RoleResponsibilitiesList
          responsibilities={role.responsibilities}
          initialCount={2}
          itemKeyPrefix={`mobile-${role.title}`}
          variant="mobile"
          onToggleClick={(event) => event.stopPropagation()}
        />

        {!isLast && (
          <div className="pt-4">
            <div className="h-px w-12 bg-foreground/10" />
          </div>
        )}
      </div>
    );
  },
);

MobileRole.displayName = "MobileRole";
