"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CompanyHeaderProps {
  companyName: string;
  logo: string;
  isActive?: boolean;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  companyName,
  logo,
  isActive = false,
}) => {
  return (
    <div className="flex w-full flex-col gap-4 transition-all duration-500 md:items-end md:gap-6">
      {/* Logo */}
      <div
        className={cn(
          "relative h-12 w-12 shrink-0 overflow-hidden transition-all duration-500 md:h-16 md:w-16",
          isActive
            ? "scale-105 opacity-100 grayscale-0"
            : "opacity-100 grayscale-0 md:scale-100 md:opacity-40 md:grayscale",
        )}
      >
        <Image
          src={logo}
          alt={companyName}
          fill
          className="object-contain object-left md:object-right"
        />
      </div>

      {/* Company Name */}
      <h3 className="font-caslon text-4xl italic leading-[0.9] tracking-tight text-foreground md:text-right md:text-6xl lg:text-7xl">
        {companyName}
      </h3>
    </div>
  );
};
