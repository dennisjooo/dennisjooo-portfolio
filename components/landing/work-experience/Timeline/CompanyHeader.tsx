"use client";

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CompanyHeaderProps {
    companyName: string;
    logo: string;
    isActive?: boolean;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ companyName, logo, isActive = false }) => {
    return (
        <div className="flex flex-col md:items-end gap-4 md:gap-6 w-full transition-all duration-500">
            {/* Logo */}
            <div
                className={cn(
                    'relative w-12 h-12 md:w-16 md:h-16 overflow-hidden shrink-0 transition-all duration-500',
                    isActive
                        ? 'opacity-100 grayscale-0 scale-105'
                        : 'opacity-100 grayscale-0 md:opacity-40 md:grayscale md:scale-100'
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
            <h3 className="text-4xl md:text-6xl lg:text-7xl font-caslon italic text-foreground leading-[0.9] md:text-right tracking-tight">
                {companyName}
            </h3>
        </div>
    );
};
