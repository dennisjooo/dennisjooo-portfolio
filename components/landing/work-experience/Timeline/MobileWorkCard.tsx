"use client";

import React, { memo, forwardRef } from "react";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { CompanyGroup } from "@/lib/utils/workExperience";
import { MobileRole } from "./MobileRole";

interface MobileWorkCardProps {
  group: CompanyGroup;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export const MobileWorkCard = memo(
  forwardRef<HTMLDivElement, MobileWorkCardProps>(
    ({ group, index, isExpanded, onToggle }, ref) => {
      const dateRange =
        group.roles.length > 1
          ? `${group.roles[group.roles.length - 1].date.split(" - ")[0]} - ${group.roles[0].date.split(" - ")[1] || "Now"}`
          : group.roles[0].date;

      return (
        <div
          ref={ref}
          className="relative scroll-mt-28 p-px"
          style={{ zIndex: isExpanded ? 10 : 1 }}
        >
          <div
            className={`bg-gradient-accent absolute inset-0 rounded-2xl ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            className={`relative overflow-hidden rounded-[15px] bg-background ${
              isExpanded ? "shadow-xl" : "border border-foreground/5 shadow-lg"
            }`}
          >
            <button
              onClick={onToggle}
              className="relative z-10 flex w-full flex-col gap-5 p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  0{index + 1}.
                </span>

                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-150 ${
                    isExpanded
                      ? "rotate-180 bg-foreground/10"
                      : "rotate-0 bg-foreground/5"
                  }`}
                >
                  <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="relative h-16 w-16 shrink-0 overflow-hidden">
                <Image
                  src={group.logo}
                  alt={group.companyName}
                  fill
                  className={`object-contain object-left ${
                    isExpanded ? "opacity-100" : "opacity-60 grayscale"
                  }`}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-display pb-1 font-caslon text-3xl italic leading-tight">
                  {group.companyName}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {dateRange}
                  </span>
                  {!isExpanded && (
                    <>
                      <span className="text-muted-foreground/30">|</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {group.roles.length}{" "}
                        {group.roles.length === 1 ? "role" : "roles"}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {!isExpanded && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="h-px flex-1 bg-gradient-to-r from-foreground/10 to-transparent" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Tap to explore
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-foreground/10 to-transparent" />
                </div>
              )}
            </button>

            <div
              className="grid transition-[grid-template-rows] duration-150 ease-out"
              style={{
                gridTemplateRows: isExpanded ? "1fr" : "0fr",
              }}
            >
              <div className="overflow-hidden">
                <div className="relative z-10 space-y-4 px-6 pb-6">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

                  {group.roles.map((role, roleIndex) => (
                    <MobileRole
                      key={role.id}
                      role={role}
                      isLast={roleIndex === group.roles.length - 1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    },
  ),
);

MobileWorkCard.displayName = "MobileWorkCard";
