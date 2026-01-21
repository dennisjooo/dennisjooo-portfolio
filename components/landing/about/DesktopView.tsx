'use client';

import React, { Ref } from 'react';
import { motion } from 'framer-motion';
import { fadeInUpVariants } from '@/lib/animations/variants';
import { ProfileImage } from './ProfileImage';

interface ContentSection {
    title: string;
    body: string;
    id: string;
}

interface DesktopViewProps {
    contentSections: ContentSection[];
    scrollContentRef: Ref<HTMLDivElement>;
    profileImageUrl?: string;
}

export const DesktopView: React.FC<DesktopViewProps> = ({ contentSections, scrollContentRef, profileImageUrl }) => (
    <div className="hidden md:flex w-full h-full">
        {/* Col 1: Sticky Image & Metadata (40%) */}
        <div className="w-[40%] h-full flex flex-col justify-center items-center p-12 relative z-10">
            {/* Decorative Line */}
            <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

            <div className="w-full max-w-md flex flex-col items-center">
                <ProfileImage imageUrl={profileImageUrl} />

                <motion.div
                    className="mt-8 text-center space-y-2"
                    variants={fadeInUpVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <p className="font-playfair italic text-3xl text-foreground">Dennis Jonathan</p>
                    <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        Developer & Problem Solver
                    </p>
                </motion.div>
            </div>
        </div>

        {/* Col 2: The 3D Scroll Container (60%) */}
        <motion.div
            ref={scrollContentRef}
            className="w-[60%] h-full flex items-center relative pl-16"
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            {contentSections.map((section) => (
                <div
                    key={section.id}
                    className="absolute inset-x-16 top-1/2 -translate-y-1/2 flex flex-col justify-center"
                >
                    {/* Title Wrapper */}
                    <div className="about-title will-change-transform backface-hidden origin-center mb-8">
                        <h2 className="text-7xl xl:text-8xl font-playfair italic font-bold text-gradient-primary leading-tight pb-4">
                            {section.title}
                        </h2>
                    </div>

                    {/* Body Wrapper */}
                    <div className="about-body origin-center max-w-xl">
                        <p className="text-xl xl:text-2xl font-light leading-relaxed text-muted-foreground">
                            {section.body}
                        </p>
                    </div>
                </div>
            ))}
        </motion.div>
    </div>
);
