"use client";

import React from 'react';
import Image from 'next/image';

interface CompanyHeaderProps {
    companyName: string;
    logo: string;
}

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ companyName, logo }) => {
    return (
        <div className="flex flex-col md:items-end gap-4 md:gap-6 w-full transition-all duration-500">
            {/* Logo */}
            <div className="relative w-12 h-12 md:w-16 md:h-16 overflow-hidden shrink-0 opacity-100 grayscale-0 md:opacity-80 md:grayscale md:group-hover:grayscale-0 md:group-hover:opacity-100 transition-all duration-500">
                <Image
                    src={logo}
                    alt={companyName}
                    fill
                    className="object-contain object-left md:object-right"
                />
            </div>

            {/* Company Name */}
            <h3 className="text-4xl md:text-6xl lg:text-7xl font-playfair italic font-bold text-foreground leading-[0.9] md:text-right tracking-tight">
                {companyName}
            </h3>
        </div>
    );
};
