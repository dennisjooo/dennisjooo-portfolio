'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/shared/SectionHeader';

interface BlogsHeroProps {
    activeTab: 'blog' | 'certifications';
}

const tabCaptions: Record<'blog' | 'certifications', string> = {
    blog: "Projects, tutorials, and experiments I've been building and writing about.",
    certifications: "Professional certifications and credentials that validate my expertise."
};

export const BlogsHero = ({ activeTab }: BlogsHeroProps) => (
    <div className="w-full mb-10">
        {/* Standard Section Header */}
        <SectionHeader 
            number="" 
            title="Blog & Certifications" 
            className="mb-12"
        />

        {/* Artistic/Editorial Headline */}
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full pt-8 md:pt-12 select-none overflow-x-hidden"
        >
            <div className="flex flex-col items-end w-full">
                <motion.span 
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="font-playfair italic text-3xl md:text-5xl lg:text-6xl mr-2 md:mr-12 mb-[-2vw] md:mb-[-2.5vw] relative z-20 text-foreground"
                >
                    Explore
                </motion.span>
                <h1 className="font-urbanist font-black text-[14vw] md:text-[11vw] leading-[0.8] tracking-tighter text-background-layer z-10 select-none">
                    WRITINGS
                </h1>
            </div>

            {/* Caption */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="font-urbanist text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed max-w-xl mt-8 md:mt-12"
            >
                {tabCaptions[activeTab]}
            </motion.p>
        </motion.div>
    </div>
);
