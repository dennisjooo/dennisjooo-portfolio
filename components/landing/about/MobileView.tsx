'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUpVariants } from '@/lib/animations/variants';
import { ProfileImage } from './ProfileImage';

interface ContentSection {
    title: string;
    body: string;
    id: string;
}

interface MobileViewProps {
    contentSections: ContentSection[];
    profileImageUrl?: string;
}

export const MobileView: React.FC<MobileViewProps> = ({ contentSections, profileImageUrl }) => (
    <div className="md:hidden w-full h-full overflow-hidden touch-pan-y">
        <div className="mobile-scroll-container flex w-[500%] h-full transform-gpu backface-hidden">
            {/* Card 1: Profile */}
            <div className="w-screen h-full flex flex-col justify-center items-center px-8 relative">
                <span className="absolute top-32 font-mono text-xs uppercase tracking-widest opacity-50 text-muted-foreground">
                    Swipe to Explore
                </span>
                <ProfileImage imageUrl={profileImageUrl} />
                <motion.div
                    className="mt-8 text-center space-y-2"
                    variants={fadeInUpVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <p className="font-playfair italic text-4xl text-foreground">Dennis Jonathan</p>
                    <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        Developer & Problem Solver
                    </p>
                </motion.div>
            </div>

            {/* Cards 2-5: Content */}
            {contentSections.map((section) => (
                <div key={section.id} className="w-screen h-full flex flex-col justify-center px-8 space-y-6">
                    <h2 className="text-5xl font-playfair italic font-bold leading-tight text-gradient-primary pb-2">
                        {section.title}
                    </h2>
                    <div className="w-12 h-px bg-current opacity-20 text-foreground" />
                    <p className="font-light text-muted-foreground leading-relaxed text-lg">
                        {section.body}
                    </p>
                </div>
            ))}
        </div>
    </div>
);
